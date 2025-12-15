package controller;

import model.User;
import service.UserService;
import dto.response.UserResponse;
import exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Usuarios
 *
 * Maneja operaciones CRUD de usuarios.
 * Requiere autenticación (futuro: @PreAuthorize).
 */
@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * GET /api/v1/users/{id}
     * Obtener usuario por ID
     *
     * @param id id del usuario
     * @return Usuario (200 OK) o error (404)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(userService.convertToResponse(user));
    }

    /**
     * GET /api/v1/users
     * Listar usuarios activos (solo admin)
     *
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página de usuarios (200 OK)
     */
    @GetMapping
    public ResponseEntity<Page<UserResponse>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.listActiveUsers(pageable);
        Page<UserResponse> response = users.map(userService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/users/search
     * Buscar usuarios por username
     *
     * @param search texto a buscar
     * @param page número de página
     * @param size tamaño de página
     * @return Página de usuarios que coincidan (200 OK)
     */
    @GetMapping("/search")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.searchActiveUsers(search, pageable);
        Page<UserResponse> response = users.map(userService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * PUT /api/v1/users/{id}
     * Actualizar perfil de usuario
     *
     * @param id id del usuario
     * @param updateRequest datos a actualizar
     * @return Usuario actualizado (200 OK) o error (404)
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> updateRequest) {
        String email = updateRequest.get("email");
        String newPassword = updateRequest.get("newPassword");

        User updatedUser = userService.updateUserProfile(id, email, newPassword);
        return ResponseEntity.ok(userService.convertToResponse(updatedUser));
    }

    /**
     * DELETE /api/v1/users/{id}
     * Desactivar cuenta de usuario (soft delete)
     *
     * @param id id del usuario
     * @return 204 No Content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable Long id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/v1/users/{id}/reactivate
     * Reactivar cuenta de usuario (solo admin)
     *
     * @param id id del usuario
     * @return Usuario reactivado (200 OK)
     */
    @PostMapping("/{id}/reactivate")
    public ResponseEntity<UserResponse> reactivateUser(@PathVariable Long id) {
        User reactivated = userService.reactivateUser(id);
        return ResponseEntity.ok(userService.convertToResponse(reactivated));
    }

    /**
     * GET /api/v1/users/count/active
     * Contar usuarios activos
     *
     * @return Número de usuarios activos
     */
    @GetMapping("/count/active")
    public ResponseEntity<Map<String, Long>> countActiveUsers() {
        long count = userService.countActiveUsers();
        Map<String, Long> response = new HashMap<>();
        response.put("activeUsers", count);
        return ResponseEntity.ok(response);
    }
}

