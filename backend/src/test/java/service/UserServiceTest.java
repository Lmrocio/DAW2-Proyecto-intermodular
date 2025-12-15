package service;

import model.User;
import repository.UserRepository;
import dto.request.RegisterRequest;
import exception.DuplicateResourceException;
import exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Tests unitarios para UserService
 *
 * Cubre:
 * - Registro de usuarios
 * - Búsqueda de usuarios
 * - Validaciones
 * - Manejo de excepciones
 */
@DisplayName("UserService Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ============================================================================
    // TESTS DE REGISTRO
    // ============================================================================

    @Test
    @DisplayName("Debe registrar un usuario válido correctamente")
    void testRegisterUserSuccess() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        User expectedUser = new User();
        expectedUser.setId(1L);
        expectedUser.setUsername("testuser");
        expectedUser.setEmail("test@example.com");
        expectedUser.setPassword("hashedPassword");
        expectedUser.setRole(User.UserRole.USER);
        expectedUser.setIsActive(true);

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenReturn(expectedUser);

        // Act
        User result = userService.registerUser(request);

        // Assert
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertTrue(result.getIsActive());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("No debe registrar usuario si username ya existe")
    void testRegisterUserWithDuplicateUsername() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existing");
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> userService.registerUser(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("No debe registrar usuario si email ya existe")
    void testRegisterUserWithDuplicateEmail() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> userService.registerUser(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("No debe registrar usuario si las contraseñas no coinciden")
    void testRegisterUserWithMismatchedPasswords() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password456");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> userService.registerUser(request));
        verify(userRepository, never()).save(any(User.class));
    }

    // ============================================================================
    // TESTS DE BÚSQUEDA
    // ============================================================================

    @Test
    @DisplayName("Debe encontrar usuario por username")
    void testFindByUsernameSuccess() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.findByUsername("testuser");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    @DisplayName("Debe retornar vacío si usuario no existe por username")
    void testFindByUsernameNotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act
        Optional<User> result = userService.findByUsername("nonexistent");

        // Assert
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Debe encontrar usuario por email")
    void testFindByEmailSuccess() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.findByEmail("test@example.com");

        // Assert
        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }

    @Test
    @DisplayName("Debe lanzar excepción si usuario no encontrado por ID")
    void testFindByIdNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> userService.findById(999L));
    }

    // ============================================================================
    // TESTS DE VALIDACIÓN DE CONTRASEÑA
    // ============================================================================

    @Test
    @DisplayName("Debe validar contraseña correcta")
    void testValidatePasswordCorrect() {
        // Arrange
        String rawPassword = "password123";
        String hashedPassword = "$2a$10$hashedPassword";

        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(true);

        // Act
        boolean result = userService.validatePassword(rawPassword, hashedPassword);

        // Assert
        assertTrue(result);
    }

    @Test
    @DisplayName("Debe rechazar contraseña incorrecta")
    void testValidatePasswordIncorrect() {
        // Arrange
        String rawPassword = "wrongpassword";
        String hashedPassword = "$2a$10$hashedPassword";

        when(passwordEncoder.matches(rawPassword, hashedPassword)).thenReturn(false);

        // Act
        boolean result = userService.validatePassword(rawPassword, hashedPassword);

        // Assert
        assertFalse(result);
    }

    // ============================================================================
    // TESTS DE ACTUALIZACIÓN DE PERFIL
    // ============================================================================

    @Test
    @DisplayName("Debe actualizar email del usuario")
    void testUpdateUserProfileSuccess() {
        // Arrange
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("old@example.com");

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setEmail("new@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        // Act
        User result = userService.updateUserProfile(1L, "new@example.com", null);

        // Assert
        assertEquals("new@example.com", result.getEmail());
    }

    // ============================================================================
    // TESTS DE DESACTIVACIÓN
    // ============================================================================

    @Test
    @DisplayName("Debe desactivar usuario correctamente")
    void testDeactivateUserSuccess() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setIsActive(true);

        User deactivatedUser = new User();
        deactivatedUser.setId(1L);
        deactivatedUser.setIsActive(false);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(deactivatedUser);

        // Act
        User result = userService.deactivateUser(1L);

        // Assert
        assertFalse(result.getIsActive());
    }

    @Test
    @DisplayName("Debe reactivar usuario correctamente")
    void testReactivateUserSuccess() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setIsActive(false);

        User reactivatedUser = new User();
        reactivatedUser.setId(1L);
        reactivatedUser.setIsActive(true);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(reactivatedUser);

        // Act
        User result = userService.reactivateUser(1L);

        // Assert
        assertTrue(result.getIsActive());
    }
}

