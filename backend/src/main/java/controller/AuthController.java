package controller;

import model.User;
import service.UserService;
import dto.request.RegisterRequest;
import dto.response.UserResponse;
import exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Autenticación
 *
 * Maneja registro e inicio de sesión de usuarios.
 * Endpoints públicos (sin autenticación requerida).
 */
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * POST /api/v1/auth/register
     * Registrar nuevo usuario
     *
     * @param registerRequest datos del usuario
     * @return Usuario creado (201 Created) o error (400, 409)
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.convertToResponse(user));
        } catch (DuplicateResourceException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(createErrorResponse("DUPLICATE_RESOURCE", e.getMessage()));
        }
    }

    /**
     * POST /api/v1/auth/login
     * Iniciar sesión (futuro: devolver JWT)
     *
     * @param loginRequest username y password
     * @return Token JWT (200 OK) o error (401)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Búsqueda de usuario
        User user = userService.findByUsername(username)
            .orElse(null);

        if (user == null || !user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("INVALID_CREDENTIALS", "Usuario o contraseña inválidos"));
        }

        // Aquí iría validación de contraseña y generación de JWT
        // Por ahora, devolvemos el usuario como prueba
        Map<String, Object> response = new HashMap<>();
        response.put("user", userService.convertToResponse(user));
        response.put("message", "Login exitoso (JWT será implementado)");

        return ResponseEntity.ok(response);
    }

    /**
     * Crear respuesta de error
     */
    private Map<String, String> createErrorResponse(String code, String message) {
        Map<String, String> response = new HashMap<>();
        response.put("code", code);
        response.put("message", message);
        return response;
    }
}

