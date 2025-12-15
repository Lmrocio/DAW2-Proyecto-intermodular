package controller;

import model.User;
import service.UserService;
import security.JwtTokenProvider;
import dto.request.RegisterRequest;
import exception.DuplicateResourceException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para AuthController
 *
 * Cubre:
 * - Registro de usuarios
 * - Login
 * - Validación de tokens
 * - Renovación de tokens
 */
@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("AuthController Tests")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser.setRole(User.UserRole.USER);
        testUser.setIsActive(true);
    }

    // ============================================================================
    // TESTS DE REGISTRO
    // ============================================================================

    @Test
    @DisplayName("POST /api/auth/register - Debe registrar usuario exitosamente")
    void testRegisterSuccess() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        User newUser = new User();
        newUser.setId(1L);
        newUser.setUsername("newuser");
        newUser.setEmail("new@example.com");
        newUser.setRole(User.UserRole.USER);
        newUser.setIsActive(true);

        when(userService.registerUser(any(RegisterRequest.class))).thenReturn(newUser);
        when(jwtTokenProvider.generateToken(newUser)).thenReturn("token123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.username").value("newuser"));
    }

    @Test
    @DisplayName("POST /api/auth/register - No debe registrar con username duplicado")
    void testRegisterWithDuplicateUsername() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existing");
        request.setEmail("new@example.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        when(userService.registerUser(any(RegisterRequest.class)))
                .thenThrow(new DuplicateResourceException("User", "username", "existing"));

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("DUPLICATE_RESOURCE"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Debe validar campos requeridos")
    void testRegisterWithMissingFields() throws Exception {
        // Arrange
        String invalidRequest = "{}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidRequest))
                .andExpect(status().isBadRequest());
    }

    // ============================================================================
    // TESTS DE LOGIN
    // ============================================================================

    @Test
    @DisplayName("POST /api/auth/login - Debe login exitosamente")
    void testLoginSuccess() throws Exception {
        // Arrange
        String loginRequest = "{\"username\":\"testuser\",\"password\":\"password123\"}";

        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userService.validatePassword("password123", testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateToken(testUser)).thenReturn("token123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Debe rechazar credenciales inválidas")
    void testLoginWithInvalidCredentials() throws Exception {
        // Arrange
        String loginRequest = "{\"username\":\"testuser\",\"password\":\"wrongpassword\"}";

        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(userService.validatePassword("wrongpassword", testUser.getPassword())).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Debe rechazar usuario no encontrado")
    void testLoginWithNonExistentUser() throws Exception {
        // Arrange
        String loginRequest = "{\"username\":\"nonexistent\",\"password\":\"password123\"}";

        when(userService.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/login - Debe rechazar usuario inactivo")
    void testLoginWithInactiveUser() throws Exception {
        // Arrange
        String loginRequest = "{\"username\":\"testuser\",\"password\":\"password123\"}";

        User inactiveUser = new User();
        inactiveUser.setUsername("testuser");
        inactiveUser.setPassword("password123");
        inactiveUser.setIsActive(false);

        when(userService.findByUsername("testuser")).thenReturn(Optional.of(inactiveUser));

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized());
    }

    // ============================================================================
    // TESTS DE VALIDACIÓN DE TOKEN
    // ============================================================================

    @Test
    @DisplayName("GET /api/auth/validate - Debe validar token válido")
    void testValidateTokenSuccess() throws Exception {
        // Arrange
        when(jwtTokenProvider.validateToken("token123")).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken("token123")).thenReturn("testuser");
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        // Act & Assert
        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer token123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    @DisplayName("GET /api/auth/validate - Debe rechazar token inválido")
    void testValidateTokenInvalid() throws Exception {
        // Arrange
        when(jwtTokenProvider.validateToken("invalidtoken")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get("/api/auth/validate")
                .header("Authorization", "Bearer invalidtoken"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
    }

    @Test
    @DisplayName("GET /api/auth/validate - Debe rechazar sin token")
    void testValidateTokenMissing() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/auth/validate"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
    }

    // ============================================================================
    // TESTS DE RENOVACIÓN DE TOKEN
    // ============================================================================

    @Test
    @DisplayName("POST /api/auth/refresh - Debe renovar token válido")
    void testRefreshTokenSuccess() throws Exception {
        // Arrange
        String refreshRequest = "{\"token\":\"oldtoken123\"}";

        when(jwtTokenProvider.validateToken("oldtoken123")).thenReturn(true);
        when(jwtTokenProvider.getUsernameFromToken("oldtoken123")).thenReturn("testuser");
        when(userService.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateToken(testUser)).thenReturn("newtoken123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refreshRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("newtoken123"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/auth/refresh - Debe rechazar token expirado")
    void testRefreshTokenExpired() throws Exception {
        // Arrange
        String refreshRequest = "{\"token\":\"expiredtoken\"}";

        when(jwtTokenProvider.validateToken("expiredtoken")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(refreshRequest))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
    }

    // ============================================================================
    // TESTS DE LOGOUT
    // ============================================================================

    @Test
    @DisplayName("POST /api/auth/logout - Debe hacer logout exitosamente")
    void testLogoutSuccess() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer token123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logout exitoso"));
    }
}

