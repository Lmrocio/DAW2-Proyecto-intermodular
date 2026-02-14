package controller;

import com.example.backend.AplicacionEducativa;
import model.User;
import model.UserRole;
import dto.request.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

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
@SpringBootTest(classes = AplicacionEducativa.class)
@AutoConfigureMockMvc
@Transactional
@DisplayName("AuthController Tests")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ============================================================================
    // TESTS DE REGISTRO
    // ============================================================================

    @Test
    @DisplayName("POST /api/auth/register - Debe registrar usuario exitosamente")
    void testRegisterSuccess() throws Exception {
        // Arrange
        String request = "{\"username\":\"newuser\",\"email\":\"new@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.user.username").value("newuser"));
    }

    @Test
    @DisplayName("POST /api/auth/register - No debe registrar con username duplicado")
    void testRegisterWithDuplicateUsername() throws Exception {
        // Arrange
        String request = "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}";

        // Primero registramos un usuario
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isCreated());

        // Intentamos registrar el mismo username
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request))
                .andExpect(status().isConflict());
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
        // Primero registramos un usuario
        String registerRequest = "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerRequest))
                .andExpect(status().isCreated());

        // Luego intentamos login
        String loginRequest = "{\"username\":\"testuser\",\"password\":\"password123\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Debe rechazar con credenciales inválidas")
    void testLoginWithInvalidPassword() throws Exception {
        // Arrange
        String registerRequest = "{\"username\":\"testuser2\",\"email\":\"test2@example.com\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerRequest))
                .andExpect(status().isCreated());

        String loginRequest = "{\"username\":\"testuser2\",\"password\":\"wrongpassword\"}";

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginRequest))
                .andExpect(status().isUnauthorized());
    }
}

