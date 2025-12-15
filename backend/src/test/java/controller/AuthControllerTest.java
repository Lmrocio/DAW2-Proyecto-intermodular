package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.LoginRequest;
import dto.request.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests para AuthController
 *
 * Cubre:
 * - Registro de usuarios
 * - Login con credenciales
 * - Logout
 * - Obtener usuario autenticado
 * - Validaciones de entrada
 * - Códigos HTTP esperados
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@DisplayName("AuthController Tests")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ============================================
    // TESTS: POST /api/auth/register
    // ============================================

    @Test
    @DisplayName("POST /api/auth/register - Registro exitoso (201 Created)")
    public void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@test.com");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.username", is("newuser")))
                .andExpect(jsonPath("$.user.email", is("newuser@test.com")))
                .andExpect(jsonPath("$.user.role", is("USER")))
                .andExpect(jsonPath("$.message", is("Usuario registrado exitosamente")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validación fallida: contraseñas no coinciden (400 Bad Request)")
    public void testRegisterPasswordMismatch() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@test.com");
        request.setPassword("password123");
        request.setConfirmPassword("differentpassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")))
                .andExpect(jsonPath("$.validationErrors", notNullValue()));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validación fallida: email inválido (400 Bad Request)")
    public void testRegisterInvalidEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("invalid-email");
        request.setPassword("password123");
        request.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Username duplicado (409 Conflict)")
    public void testRegisterDuplicateUsername() throws Exception {
        // Primer registro
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("duplicate");
        request1.setEmail("user1@test.com");
        request1.setPassword("password123");
        request1.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Intento de registro con mismo username
        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("duplicate");
        request2.setEmail("user2@test.com");
        request2.setPassword("password123");
        request2.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", is("DUPLICATE_RESOURCE")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Email duplicado (409 Conflict)")
    public void testRegisterDuplicateEmail() throws Exception {
        // Primer registro
        RegisterRequest request1 = new RegisterRequest();
        request1.setUsername("user1");
        request1.setEmail("duplicate@test.com");
        request1.setPassword("password123");
        request1.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        // Intento de registro con mismo email
        RegisterRequest request2 = new RegisterRequest();
        request2.setUsername("user2");
        request2.setEmail("duplicate@test.com");
        request2.setPassword("password123");
        request2.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code", is("DUPLICATE_RESOURCE")));
    }

    @Test
    @DisplayName("POST /api/auth/register - Campos faltantes (400 Bad Request)")
    public void testRegisterMissingFields() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername(""); // Vacío
        // email y password no establecidos

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));
    }

    // ============================================
    // TESTS: POST /api/auth/login
    // ============================================

    @Test
    @DisplayName("POST /api/auth/login - Login exitoso (200 OK)")
    public void testLoginSuccess() throws Exception {
        // Registrar usuario primero
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("loginuser");
        registerRequest.setEmail("loginuser@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Intentar login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("loginuser");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.tokenType", is("Bearer")))
                .andExpect(jsonPath("$.user.username", is("loginuser")))
                .andExpect(jsonPath("$.message", is("Login exitoso")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Credenciales inválidas (401 Unauthorized)")
    public void testLoginInvalidCredentials() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Contraseña incorrecta (401 Unauthorized)")
    public void testLoginWrongPassword() throws Exception {
        // Registrar usuario
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("testuser");
        registerRequest.setEmail("testuser@test.com");
        registerRequest.setPassword("correctpassword");
        registerRequest.setConfirmPassword("correctpassword");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        // Intentar login con contraseña incorrecta
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code", is("UNAUTHORIZED")));
    }

    @Test
    @DisplayName("POST /api/auth/login - Campos faltantes (400 Bad Request)")
    public void testLoginMissingFields() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        // password no establecido

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code", is("VALIDATION_ERROR")));
    }

    // ============================================
    // TESTS: GET /api/auth/me
    // ============================================

    @Test
    @DisplayName("GET /api/auth/me - Sin token (401 Unauthorized)")
    public void testGetMeUnauthorized() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me - Token inválido (401 Unauthorized)")
    public void testGetMeInvalidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer invalid_token_here"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/me - Token válido (200 OK)")
    public void testGetMeSuccess() throws Exception {
        // Registrar y obtener token
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("meuser");
        registerRequest.setEmail("meuser@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");

        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extraer token (en un test real, usar JsonPath)
        String token = objectMapper.readTree(response).get("token").asText();

        // Usar token para GET /me
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("meuser")))
                .andExpect(jsonPath("$.email", is("meuser@test.com")))
                .andExpect(jsonPath("$.password", nullValue())); // No debe devolver contraseña
    }

    // ============================================
    // TESTS: POST /api/auth/logout
    // ============================================

    @Test
    @DisplayName("POST /api/auth/logout - Sin token (400 Bad Request)")
    public void testLogoutNoToken() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/logout - Token inválido (401 Unauthorized)")
    public void testLogoutInvalidToken() throws Exception {
        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/logout - Logout exitoso (200 OK)")
    public void testLogoutSuccess() throws Exception {
        // Registrar usuario y obtener token
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("logoutuser");
        registerRequest.setEmail("logoutuser@test.com");
        registerRequest.setPassword("password123");
        registerRequest.setConfirmPassword("password123");

        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        // Hacer logout
        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Logout exitoso")));

        // Verificar que el token ya no funciona
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized());
    }
}

