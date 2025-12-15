package controller;

import model.AuditLog;
import model.User;
import service.AuditLogService;
import service.UserService;
import dto.response.UserResponse;
import dto.response.AuditLogResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador Administrativo
 *
 * Maneja operaciones administrativas: gestión de usuarios, logs de auditoría, estadísticas.
 * Requiere autenticación y rol de ADMIN.
 *
 * Endpoints base: /api/admin/...
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuditLogService auditLogService;

    // ============================================================================
    // GESTIÓN DE USUARIOS
    // ============================================================================

    /**
     * GET /api/admin/users
     * Listar todos los usuarios registrados (activos e inactivos)
     *
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página de usuarios con información básica (200 OK)
     */
    @GetMapping("/users")
    public ResponseEntity<Page<UserResponse>> listAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.listAllUsers(pageable);
        Page<UserResponse> response = users.map(userService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/users/search
     * Buscar usuarios por username o email
     *
     * @param search texto a buscar
     * @param page número de página
     * @param size tamaño de página
     * @return Página de usuarios que coincidan (200 OK)
     */
    @GetMapping("/users/search")
    public ResponseEntity<Page<UserResponse>> searchUsers(
            @RequestParam String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.searchAllUsers(search, pageable);
        Page<UserResponse> response = users.map(userService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/users/{id}
     * Obtener detalles completos de un usuario específico
     *
     * @param id id del usuario
     * @return Usuario con información detallada (200 OK) o error (404)
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserDetails(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(userService.convertToResponse(user));
    }

    /**
     * GET /api/admin/users/{id}/statistics
     * Obtener estadísticas de un usuario específico
     *
     * @param id id del usuario
     * @return Estadísticas del usuario: lecciones completadas, favoritos, progreso, etc. (200 OK)
     */
    @GetMapping("/users/{id}/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable Long id) {
        User user = userService.findById(id);
        Map<String, Object> stats = new HashMap<>();

        stats.put("userId", user.getId());
        stats.put("username", user.getUsername());
        stats.put("email", user.getEmail());
        stats.put("role", user.getRole());
        stats.put("isActive", user.getIsActive());
        stats.put("createdAt", user.getCreatedAt());
        stats.put("updatedAt", user.getUpdatedAt());

        // Aquí se añadirían estadísticas de progreso si el servicio lo soporta
        // stats.put("completedLessons", ...);
        // stats.put("favoritesCount", ...);
        // stats.put("globalProgress", ...);

        return ResponseEntity.ok(stats);
    }

    /**
     * PUT /api/admin/users/{id}/status
     * Cambiar estado de un usuario (activar/desactivar)
     *
     * @param id id del usuario
     * @param statusRequest con campo "isActive" (true/false)
     * @return Usuario actualizado (200 OK) o error (404)
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserResponse> changeUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusRequest) {
        Boolean isActive = statusRequest.get("isActive");

        if (isActive == null) {
            return ResponseEntity.badRequest().build();
        }

        User user = userService.findById(id);

        if (isActive) {
            user = userService.reactivateUser(id);
        } else {
            userService.deactivateUser(id);
            user = userService.findById(id);
        }

        return ResponseEntity.ok(userService.convertToResponse(user));
    }

    /**
     * GET /api/admin/users/count/total
     * Obtener total de usuarios registrados
     *
     * @return Número total de usuarios (200 OK)
     */
    @GetMapping("/users/count/total")
    public ResponseEntity<Map<String, Long>> countTotalUsers() {
        long total = userService.countTotalUsers();
        Map<String, Long> response = new HashMap<>();
        response.put("totalUsers", total);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/users/count/active
     * Obtener total de usuarios activos
     *
     * @return Número de usuarios activos (200 OK)
     */
    @GetMapping("/users/count/active")
    public ResponseEntity<Map<String, Long>> countActiveUsers() {
        long active = userService.countActiveUsers();
        Map<String, Long> response = new HashMap<>();
        response.put("activeUsers", active);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/admin/users/count/by-role
     * Obtener conteo de usuarios por rol
     *
     * @return Objeto con conteo de ADMIN y USER (200 OK)
     */
    @GetMapping("/users/count/by-role")
    public ResponseEntity<Map<String, Long>> countUsersByRole() {
        long adminCount = userService.countUsersByRole("ADMIN");
        long userCount = userService.countUsersByRole("USER");

        Map<String, Long> response = new HashMap<>();
        response.put("adminCount", adminCount);
        response.put("userCount", userCount);
        response.put("totalCount", adminCount + userCount);

        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // AUDITORÍA Y LOGS
    // ============================================================================

    /**
     * GET /api/admin/audit-logs
     * Obtener todos los logs de auditoría del sistema
     *
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página de logs de auditoría (200 OK)
     */
    @GetMapping("/audit-logs")
    public ResponseEntity<Page<AuditLogResponse>> listAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogResponse> logs = auditLogService.listAllLogs(pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/admin/audit-logs/search
     * Buscar logs de auditoría por filtros
     *
     * @param filter tipo de filtro (usuario, acción, entidad, etc.)
     * @param value valor a buscar
     * @param page número de página
     * @param size tamaño de página
     * @return Página de logs filtrados (200 OK)
     */
    @GetMapping("/audit-logs/search")
    public ResponseEntity<Page<AuditLogResponse>> searchAuditLogs(
            @RequestParam String filter,
            @RequestParam String value,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogResponse> logs;

        switch (filter.toLowerCase()) {
            case "user":
            case "userid":
                try {
                    Long userId = Long.parseLong(value);
                    logs = auditLogService.findByUserId(userId, pageable);
                } catch (NumberFormatException e) {
                    logs = Page.empty(pageable);
                }
                break;

            case "action":
                logs = auditLogService.findByAction(value, pageable);
                break;

            case "entitytype":
                logs = auditLogService.findByEntityType(value, pageable);
                break;

            case "entityid":
                try {
                    Long entityId = Long.parseLong(value);
                    logs = auditLogService.findByEntityId(entityId, pageable);
                } catch (NumberFormatException e) {
                    logs = Page.empty(pageable);
                }
                break;

            default:
                logs = Page.empty(pageable);
        }

        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/admin/audit-logs/user/{userId}
     * Obtener logs de auditoría de un usuario específico
     *
     * @param userId id del usuario
     * @param page número de página
     * @param size tamaño de página
     * @return Página de logs del usuario (200 OK)
     */
    @GetMapping("/audit-logs/user/{userId}")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogResponse> logs = auditLogService.findByUserId(userId, pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/admin/audit-logs/action/{action}
     * Obtener logs filtrados por tipo de acción
     *
     * @param action tipo de acción (CREATE, UPDATE, DELETE, DISABLE_ACCOUNT)
     * @param page número de página
     * @param size tamaño de página
     * @return Página de logs de la acción (200 OK)
     */
    @GetMapping("/audit-logs/action/{action}")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByAction(
            @PathVariable String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogResponse> logs = auditLogService.findByAction(action, pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/admin/audit-logs/entity/{entityType}
     * Obtener logs filtrados por tipo de entidad
     *
     * @param entityType tipo de entidad (LESSON, SIMULATOR, FAQ, USER, CATEGORY)
     * @param page número de página
     * @param size tamaño de página
     * @return Página de logs de la entidad (200 OK)
     */
    @GetMapping("/audit-logs/entity/{entityType}")
    public ResponseEntity<Page<AuditLogResponse>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogResponse> logs = auditLogService.findByEntityType(entityType, pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * GET /api/admin/audit-logs/count
     * Obtener estadísticas de los logs de auditoría
     *
     * @return Conteo de logs por acción y entidad (200 OK)
     */
    @GetMapping("/audit-logs/count")
    public ResponseEntity<Map<String, Object>> getAuditLogStatistics() {
        long totalLogs = auditLogService.countTotalLogs();
        long createCount = auditLogService.countByAction("CREATE");
        long updateCount = auditLogService.countByAction("UPDATE");
        long deleteCount = auditLogService.countByAction("DELETE");
        long disableCount = auditLogService.countByAction("DISABLE_ACCOUNT");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogs", totalLogs);
        stats.put("createCount", createCount);
        stats.put("updateCount", updateCount);
        stats.put("deleteCount", deleteCount);
        stats.put("disableAccountCount", disableCount);

        return ResponseEntity.ok(stats);
    }

    // ============================================================================
    // UTILIDADES
    // ============================================================================

    /**
     * Convertir un AuditLog a un Map para la respuesta
     */
    private Map<String, Object> convertAuditLogToMap(AuditLog log) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", log.getId());
        map.put("userId", log.getUser() != null ? log.getUser().getId() : null);
        map.put("userName", log.getUser() != null ? log.getUser().getUsername() : null);
        map.put("action", log.getAction());
        map.put("entityType", log.getEntityType());
        map.put("entityId", log.getEntityId());
        map.put("previousValue", log.getPreviousValue());
        map.put("newValue", log.getNewValue());
        map.put("timestamp", log.getTimestamp());
        map.put("ipAddress", log.getIpAddress());
        return map;
    }

    /**
     * GET /api/admin/dashboard/summary
     * Obtener resumen del dashboard administrativo
     *
     * @return Resumen con estadísticas principales (200 OK)
     */
    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();

        // Estadísticas de usuarios
        long totalUsers = userService.countTotalUsers();
        long activeUsers = userService.countActiveUsers();
        long adminCount = userService.countUsersByRole("ADMIN");

        summary.put("totalUsers", totalUsers);
        summary.put("activeUsers", activeUsers);
        summary.put("inactiveUsers", totalUsers - activeUsers);
        summary.put("adminCount", adminCount);

        // Estadísticas de auditoría
        long totalLogs = auditLogService.countTotalLogs();
        summary.put("totalAuditLogs", totalLogs);
        summary.put("createOperations", auditLogService.countByAction("CREATE"));
        summary.put("updateOperations", auditLogService.countByAction("UPDATE"));
        summary.put("deleteOperations", auditLogService.countByAction("DELETE"));

        return ResponseEntity.ok(summary);
    }
}