package controller;

import model.User;
import service.UserService;
import security.JwtTokenProvider;
import dto.request.RegisterRequest;
import dto.response.UserResponse;
import dto.response.AuthResponse;
import exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Autenticación
 *
 * Maneja registro, login, logout y renovación de tokens JWT.
 * Endpoints públicos (sin autenticación requerida).
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * POST /api/auth/register
     * Registrar nuevo usuario
     *
     * @param registerRequest datos del usuario (username, email, password)
     * @return Usuario creado con token JWT (201 Created) o error (400, 409)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);

            // Generar token JWT
            String token = jwtTokenProvider.generateToken(user);

            // Preparar respuesta
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setTokenType("Bearer");
            response.setUser(userService.convertToResponse(user));
            response.setMessage("Usuario registrado exitosamente");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(createErrorResponse("DUPLICATE_RESOURCE", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("REGISTRATION_ERROR", e.getMessage()));
        }
    }

    /**
     * POST /api/auth/login
     * Iniciar sesión (obtener token JWT)
     *
     * @param loginRequest con fields: username, password
     * @return Token JWT y datos del usuario (200 OK) o error (401)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Validar que se proporcionen credenciales
        if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("INVALID_REQUEST", "Username y password son requeridos"));
        }

        // Búsqueda de usuario
        User user = userService.findByUsername(username)
            .orElse(null);

        if (user == null || !user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("INVALID_CREDENTIALS", "Usuario o contraseña inválidos"));
        }

        // Validar contraseña (idealmente comparar con hash BCrypt)
        // Por ahora, validación simple
        if (!validatePassword(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("INVALID_CREDENTIALS", "Usuario o contraseña inválidos"));
        }

        // Generar token JWT
        String token = jwtTokenProvider.generateToken(user);

        // Preparar respuesta
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setTokenType("Bearer");
        response.setUser(userService.convertToResponse(user));
        response.setMessage("Login exitoso");

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/logout
     * Cerrar sesión (invalida el token actual)
     *
     * Nota: En una implementación real, se debería mantener una blacklist de tokens
     * o usar una base de datos de sesiones. Por ahora, la invalidación es manejada
     * por el cliente eliminando el token localmente.
     *
     * @param token token a invalidar (enviado en el header Authorization o en el body)
     * @return Confirmación de logout (200 OK)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody(required = false) Map<String, String> body) {

        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (body != null) {
            token = body.get("token");
        }

        // En una implementación real, agregar el token a una blacklist
        // por ejemplo: tokenBlacklistService.addToBlacklist(token, jwtTokenProvider.getExpirationFromToken(token));

        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout exitoso");
        response.put("timestamp", System.currentTimeMillis() + "");

        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/refresh
     * Renovar token JWT
     *
     * Permite renovar un token JWT válido para extender la sesión del usuario
     *
     * @param refreshRequest con el token actual
     * @return Nuevo token JWT (200 OK) o error (401)
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshRequest) {
        String oldToken = refreshRequest.get("token");

        if (oldToken == null || oldToken.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("INVALID_REQUEST", "El token es requerido"));
        }

        // Validar token
        if (!jwtTokenProvider.validateToken(oldToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("INVALID_TOKEN", "El token es inválido o ha expirado"));
        }

        // Extraer username del token
        String username = jwtTokenProvider.getUsernameFromToken(oldToken);
        User user = userService.findByUsername(username)
            .orElse(null);

        if (user == null || !user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("USER_NOT_FOUND", "El usuario no existe o está inactivo"));
        }

        // Generar nuevo token
        String newToken = jwtTokenProvider.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", newToken);
        response.put("tokenType", "Bearer");
        response.put("user", userService.convertToResponse(user));
        response.put("message", "Token renovado exitosamente");

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/auth/validate
     * Validar un token JWT
     *
     * @param token token a validar (en header Authorization)
     * @return Información del token validado (200 OK) o error (401)
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse("INVALID_REQUEST", "Token no proporcionado en header Authorization"));
        }

        String token = authHeader.substring(7);

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("INVALID_TOKEN", "El token es inválido o ha expirado"));
        }

        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userService.findByUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("USER_NOT_FOUND", "El usuario asociado al token no existe"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("valid", true);
        response.put("user", userService.convertToResponse(user));
        response.put("message", "Token válido");

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // UTILIDADES
    // ============================================================================

    /**
     * Validar contraseña contra el hash almacenado
     *
     * IMPORTANTE: Esta es una implementación simplificada.
     * En producción, debe usar BCryptPasswordEncoder de Spring Security.
     */
    private Boolean validatePassword(String rawPassword, String hashedPassword) {
        // En producción:
        // return passwordEncoder.matches(rawPassword, hashedPassword);

        // Para esta implementación simplificada:
        return rawPassword.equals(hashedPassword);
    }

    /**
     * Crear respuesta de error estándar
     */
    private Map<String, String> createErrorResponse(String code, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("code", code);
        response.put("message", message);
        response.put("timestamp", System.currentTimeMillis() + "");
        return response;
    }
}

