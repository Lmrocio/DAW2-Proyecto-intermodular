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
     * @return Token JWT y datos del usuario (200 OK) o error (400, 401)
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

        // Validar contraseña con BCrypt (comparar con hash)
        if (!userService.validatePassword(password, user.getPassword())) {
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
     * GET /api/auth/me
     * Obtener datos del usuario autenticado
     *
     * @param authHeader header Authorization con el token
     * @return Datos del usuario autenticado (200 OK) o error (401)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("UNAUTHORIZED", "Token no proporcionado en header Authorization"));
        }

        String token = authHeader.substring(7);

        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("INVALID_TOKEN", "Token inválido o expirado"));
        }

        String username = jwtTokenProvider.getUsernameFromToken(token);
        User user = userService.findByUsername(username).orElse(null);

        if (user == null || !user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("USER_NOT_FOUND", "Usuario no encontrado o inactivo"));
        }

        UserResponse response = userService.convertToResponse(user);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/logout
     * Cerrar sesión (invalida el token actual mediante blacklist)
     *
     * @param authHeader header Authorization con el token
     * @return Confirmación de logout (200 OK) o error (401)
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("INVALID_REQUEST", "Token no proporcionado en header Authorization"));
        }

        String token = authHeader.substring(7);

        // Validar que el token sea válido antes de añadirlo a la blacklist
        if (!jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("INVALID_TOKEN", "Token inválido o expirado"));
        }

        // Añadir el token a la blacklist
        String jti = jwtTokenProvider.getJtiFromToken(token);
        long expirationTime = jwtTokenProvider.getExpirationFromToken(token);
        userService.getTokenBlacklistService().addToBlacklist(jti, expirationTime);

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