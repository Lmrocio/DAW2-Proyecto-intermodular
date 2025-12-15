package controller;

import model.UserLessonProgress;
import service.UserLessonProgressService;
import dto.response.ProgressResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador de Progreso del Usuario
 *
 * Maneja el rastreo de progreso, favoritos y estadísticas.
 * Requiere autenticación del usuario.
 */
@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProgressController {

    @Autowired
    private UserLessonProgressService progressService;

    /**
     * GET /api/v1/progress/user/{userId}
     * Obtener todo el progreso del usuario
     *
     * @param userId id del usuario
     * @param page número de página
     * @param size tamaño de página
     * @return Página de progreso (200 OK) o error (404)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<ProgressResponse>> getUserProgress(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserLessonProgress> progress = progressService.getUserProgress(userId, pageable);
        Page<ProgressResponse> response = progress.map(progressService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/progress/user/{userId}/completed
     * Obtener lecciones completadas por el usuario
     *
     * @param userId id del usuario
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones completadas
     */
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<Page<ProgressResponse>> getCompletedLessons(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserLessonProgress> progress = progressService.getCompletedLessons(userId, pageable);
        Page<ProgressResponse> response = progress.map(progressService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/progress/user/{userId}/favorites
     * Obtener lecciones favoritas del usuario
     *
     * @param userId id del usuario
     * @param page número de página
     * @param size tamaño de página
     * @return Página de favoritos
     */
    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<Page<ProgressResponse>> getFavoriteLessons(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserLessonProgress> progress = progressService.getFavoriteLessons(userId, pageable);
        Page<ProgressResponse> response = progress.map(progressService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/progress/user/{userId}/recent
     * Obtener lecciones completadas recientemente
     *
     * @param userId id del usuario
     * @param days número de días atrás (default: 7)
     * @return Lista de lecciones completadas recientemente
     */
    @GetMapping("/user/{userId}/recent")
    public ResponseEntity<List<ProgressResponse>> getRecentlyCompleted(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<UserLessonProgress> progress = progressService.getRecentlyCompletedLessons(userId, since);
        List<ProgressResponse> response = progress.stream()
                .map(progressService::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/v1/progress/user/{userId}/lessons/{lessonId}/complete
     * Marcar lección como completada
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK)
     */
    @PostMapping("/user/{userId}/lessons/{lessonId}/complete")
    public ResponseEntity<ProgressResponse> markAsCompleted(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.markAsCompleted(userId, lessonId);
        return ResponseEntity.ok(progressService.convertToResponse(progress));
    }

    /**
     * DELETE /api/v1/progress/user/{userId}/lessons/{lessonId}/complete
     * Desmarcar lección como completada
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK)
     */
    @DeleteMapping("/user/{userId}/lessons/{lessonId}/complete")
    public ResponseEntity<ProgressResponse> markAsNotCompleted(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.markAsNotCompleted(userId, lessonId);
        return ResponseEntity.ok(progressService.convertToResponse(progress));
    }

    /**
     * POST /api/v1/progress/user/{userId}/lessons/{lessonId}/favorite
     * Agregar lección a favoritos
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK)
     */
    @PostMapping("/user/{userId}/lessons/{lessonId}/favorite")
    public ResponseEntity<ProgressResponse> addToFavorites(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.addToFavorites(userId, lessonId);
        return ResponseEntity.ok(progressService.convertToResponse(progress));
    }

    /**
     * DELETE /api/v1/progress/user/{userId}/lessons/{lessonId}/favorite
     * Remover lección de favoritos
     *
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Progreso actualizado (200 OK)
     */
    @DeleteMapping("/user/{userId}/lessons/{lessonId}/favorite")
    public ResponseEntity<ProgressResponse> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable Long lessonId) {
        UserLessonProgress progress = progressService.removeFromFavorites(userId, lessonId);
        return ResponseEntity.ok(progressService.convertToResponse(progress));
    }

    /**
     * GET /api/v1/progress/user/{userId}/statistics
     * Obtener estadísticas de progreso del usuario
     *
     * @param userId id del usuario
     * @return Estadísticas (progreso por categoría, global, etc.)
     */
    @GetMapping("/user/{userId}/statistics")
    public ResponseEntity<Map<String, Object>> getUserStatistics(@PathVariable Long userId) {
        Map<String, Object> stats = new HashMap<>();

        long completedCount = progressService.countCompletedLessons(userId);
        long favoriteCount = progressService.countFavoriteLessons(userId);
        double globalProgress = progressService.calculateGlobalProgress(userId);

        stats.put("userId", userId);
        stats.put("completedLessons", completedCount);
        stats.put("favoriteLessons", favoriteCount);
        stats.put("globalProgress", String.format("%.2f%%", globalProgress));
        stats.put("totalPublishedLessons", progressService.countTotalPublishedLessons());

        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/v1/progress/category/{categoryId}/user/{userId}
     * Obtener progreso en una categoría específica
     *
     * @param userId id del usuario
     * @param categoryId id de la categoría
     * @return Estadísticas de la categoría
     */
    @GetMapping("/category/{categoryId}/user/{userId}")
    public ResponseEntity<Map<String, Object>> getCategoryProgress(
            @PathVariable Long userId,
            @PathVariable Long categoryId) {
        Map<String, Object> stats = new HashMap<>();

        double categoryProgress = progressService.calculateCategoryProgress(userId, categoryId);

        stats.put("categoryId", categoryId);
        stats.put("userId", userId);
        stats.put("progress", String.format("%.2f%%", categoryProgress));

        return ResponseEntity.ok(stats);
    }
}