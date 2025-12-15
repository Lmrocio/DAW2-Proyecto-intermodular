package controller;

import model.UserLessonProgress;
import service.UserLessonProgressService;
import dto.response.ProgressResponse;
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
 * Controlador de Historial y Favoritos del Usuario
 *
 * Maneja operaciones de historial de lecciones, favoritos y accesibilidad.
 * Requiere autenticación del usuario.
 *
 * Endpoints base: /api/users/{id}/... y /api/users/{id}/accessibility-settings
 */
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserLessonProgressController {

    @Autowired
    private UserLessonProgressService progressService;

    // ============================================================================
    // HISTORIAL DE LECCIONES
    // ============================================================================

    /**
     * GET /api/users/{userId}/history
     * Obtener historial completo de lecciones del usuario
     *
     * @param userId id del usuario
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página de lecciones del historial (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/history")
    public ResponseEntity<Page<ProgressResponse>> getUserHistory(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserLessonProgress> progress = progressService.getUserProgress(userId, pageable);
        Page<ProgressResponse> response = progress.map(progressService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/users/{userId}/history/{lessonId}
     * Marcar una lección como completada (agregar al historial)
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK) o error (404)
     */
    @PostMapping("/api/users/{userId}/history/{lessonId}")
    public ResponseEntity<ProgressResponse> addToHistory(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.markAsCompleted(userId, lessonId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(progressService.convertToResponse(progress));
    }

    /**
     * DELETE /api/users/{userId}/history/{lessonId}
     * Eliminar una lección del historial (desmarcar como completada)
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return 204 No Content o error (404)
     */
    @DeleteMapping("/api/users/{userId}/history/{lessonId}")
    public ResponseEntity<Void> removeFromHistory(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        progressService.markAsNotCompleted(userId, lessonId);
        return ResponseEntity.noContent().build();
    }

    // ============================================================================
    // PROGRESO GLOBAL Y POR CATEGORÍA
    // ============================================================================

    /**
     * GET /api/users/{userId}/progress
     * Obtener progreso global del usuario
     *
     * Retorna el porcentaje de lecciones completadas sobre el total de lecciones
     * disponibles en la plataforma
     *
     * @param userId id del usuario
     * @return Objeto con progreso global en porcentaje (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/progress")
    public ResponseEntity<Map<String, Object>> getGlobalProgress(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        double globalProgress = progressService.calculateGlobalProgress(userId);
        long completedCount = progressService.countCompletedLessons(userId);
        long totalPublished = progressService.countTotalPublishedLessons();

        response.put("userId", userId);
        response.put("globalProgress", String.format("%.2f%%", globalProgress));
        response.put("completedLessons", completedCount);
        response.put("totalPublishedLessons", totalPublished);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/users/{userId}/progress/categories
     * Obtener progreso desglosado por categoría
     *
     * @param userId id del usuario
     * @return Mapa con progreso de cada categoría (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/progress/categories")
    public ResponseEntity<Map<String, Object>> getCategoryProgress(@PathVariable Long userId) {
        Map<String, Object> response = progressService.calculateProgressByCategory(userId);
        response.put("userId", userId);
        return ResponseEntity.ok(response);
    }

    // ============================================================================
    // FAVORITOS
    // ============================================================================

    /**
     * GET /api/users/{userId}/favorites
     * Obtener todas las lecciones marcadas como favoritas
     *
     * @param userId id del usuario
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página de lecciones favoritas (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/favorites")
    public ResponseEntity<Page<ProgressResponse>> getFavoriteLessons(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserLessonProgress> favorites = progressService.getFavoriteLessons(userId, pageable);
        Page<ProgressResponse> response = favorites.map(progressService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/users/{userId}/favorites/{lessonId}
     * Agregar una lección a favoritos
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK) o error (404)
     */
    @PostMapping("/api/users/{userId}/favorites/{lessonId}")
    public ResponseEntity<ProgressResponse> addToFavorites(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.addToFavorites(userId, lessonId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(progressService.convertToResponse(progress));
    }

    /**
     * DELETE /api/users/{userId}/favorites/{lessonId}
     * Remover una lección de favoritos
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return 204 No Content o error (404)
     */
    @DeleteMapping("/api/users/{userId}/favorites/{lessonId}")
    public ResponseEntity<Void> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        progressService.removeFromFavorites(userId, lessonId);
        return ResponseEntity.noContent().build();
    }

    // ============================================================================
    // PREFERENCIAS DE ACCESIBILIDAD
    // ============================================================================

    /**
     * GET /api/users/{userId}/accessibility-settings
     * Obtener preferencias de accesibilidad del usuario
     *
     * @param userId id del usuario
     * @return Objeto con preferencias de accesibilidad (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/accessibility-settings")
    public ResponseEntity<Map<String, Object>> getAccessibilitySettings(@PathVariable Long userId) {
        Map<String, Object> settings = progressService.getAccessibilitySettings(userId);
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/users/{userId}/accessibility-settings
     * Actualizar preferencias de accesibilidad del usuario
     *
     * Preferencias soportadas:
     * - fontSize: "small" | "normal" | "large" | "extra-large"
     * - contrastMode: true | false (modo alto contraste)
     * - fontFamily: "sans-serif" | "serif" | "monospace"
     * - lineHeight: "normal" | "relaxed" | "very-relaxed"
     * - colorMode: "light" | "dark" | "sepia"
     * - reduceMotion: true | false
     *
     * @param userId id del usuario
     * @param settings mapa con las preferencias a actualizar
     * @return Preferencias actualizadas (200 OK) o error (404)
     */
    @PutMapping("/api/users/{userId}/accessibility-settings")
    public ResponseEntity<Map<String, Object>> updateAccessibilitySettings(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> settings) {
        Map<String, Object> updated = progressService.updateAccessibilitySettings(userId, settings);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/users/{userId}/accessibility-settings/reset
     * Resetear preferencias de accesibilidad a valores por defecto
     *
     * @param userId id del usuario
     * @return Preferencias reseteadas (200 OK) o error (404)
     */
    @PostMapping("/api/users/{userId}/accessibility-settings/reset")
    public ResponseEntity<Map<String, Object>> resetAccessibilitySettings(@PathVariable Long userId) {
        Map<String, Object> reset = progressService.resetAccessibilitySettings(userId);
        return ResponseEntity.ok(reset);
    }

    // ============================================================================
    // HISTORIAL DE INTERACCIÓN CON SIMULADORES
    // ============================================================================

    /**
     * GET /api/users/{userId}/simulator-interactions
     * Obtener historial de simuladores usados por el usuario
     *
     * @param userId id del usuario
     * @param page número de página (default: 0)
     * @param size tamaño de página (default: 20)
     * @return Página con historial de simuladores (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/simulator-interactions")
    public ResponseEntity<Page<Map<String, Object>>> getSimulatorInteractions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Map<String, Object>> interactions = progressService.getSimulatorInteractions(userId, pageable);
        return ResponseEntity.ok(interactions);
    }

    /**
     * GET /api/users/{userId}/simulator-interactions/summary
     * Obtener resumen de uso de simuladores
     *
     * @param userId id del usuario
     * @return Resumen de simuladores usados (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/simulator-interactions/summary")
    public ResponseEntity<Map<String, Object>> getSimulatorInteractionSummary(@PathVariable Long userId) {
        Map<String, Object> summary = progressService.getSimulatorInteractionSummary(userId);
        return ResponseEntity.ok(summary);
    }

    // ============================================================================
    // RESUMEN DE USUARIO
    // ============================================================================

    /**
     * GET /api/users/{userId}/summary
     * Obtener resumen completo del progreso y actividad del usuario
     *
     * Incluye:
     * - Progreso global
     * - Número de favoritos
     * - Número de lecciones completadas
     * - Simuladores usados
     * - Fecha de creación de cuenta
     *
     * @param userId id del usuario
     * @return Resumen del usuario (200 OK) o error (404)
     */
    @GetMapping("/api/users/{userId}/summary")
    public ResponseEntity<Map<String, Object>> getUserSummary(@PathVariable Long userId) {
        Map<String, Object> summary = new HashMap<>();

        long completedCount = progressService.countCompletedLessons(userId);
        long favoriteCount = progressService.countFavoriteLessons(userId);
        double globalProgress = progressService.calculateGlobalProgress(userId);
        long totalPublished = progressService.countTotalPublishedLessons();

        summary.put("userId", userId);
        summary.put("completedLessons", completedCount);
        summary.put("favoriteLessons", favoriteCount);
        summary.put("globalProgress", String.format("%.2f%%", globalProgress));
        summary.put("totalPublishedLessons", totalPublished);

        return ResponseEntity.ok(summary);
    }
}

