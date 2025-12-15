package controller;

import model.Lesson;
import service.LessonService;
import dto.request.CreateLessonRequest;
import dto.response.LessonResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de Lecciones
 *
 * Maneja CRUD de lecciones y gestión de pasos.
 * Público: GET (lecciones publicadas)
 * Admin: POST, PUT, DELETE (solo su contenido)
 */
@RestController
@RequestMapping("/api/v1/lessons")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LessonController {

    @Autowired
    private LessonService lessonService;

    /**
     * GET /api/v1/lessons
     * Listar todas las lecciones publicadas
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones (200 OK)
     */
    @GetMapping
    public ResponseEntity<Page<LessonResponse>> listLessons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.getAllPublishedLessons(pageable);
        Page<LessonResponse> response = lessons.map(lessonService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/trending
     * Obtener lecciones trending (más accedidas)
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones ordenadas por popularidad
     */
    @GetMapping("/trending")
    public ResponseEntity<Page<LessonResponse>> getTrendingLessons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.getTrendingLessons(pageable);
        Page<LessonResponse> response = lessons.map(lessonService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/with-simulator
     * Obtener lecciones con simulador asociado
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones con simulador
     */
    @GetMapping("/with-simulator")
    public ResponseEntity<Page<LessonResponse>> getLessonsWithSimulator(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.getLessonsWithSimulator(pageable);
        Page<LessonResponse> response = lessons.map(lessonService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/search
     * Buscar lecciones por texto
     *
     * @param text texto a buscar en título o descripción
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones que coincidan
     */
    @GetMapping("/search")
    public ResponseEntity<Page<LessonResponse>> searchLessons(
            @RequestParam String text,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.searchLessons(text, pageable);
        Page<LessonResponse> response = lessons.map(lessonService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/category/{categoryId}
     * Obtener lecciones por categoría
     *
     * @param categoryId id de la categoría
     * @param page número de página
     * @param size tamaño de página
     * @return Página de lecciones de la categoría
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<LessonResponse>> getLessonsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.getLessonsByCategory(categoryId, pageable);
        Page<LessonResponse> response = lessons.map(lessonService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/{id}
     * Obtener lección por ID
     *
     * @param id id de la lección
     * @return Lección con todos los pasos (200 OK) o error (404)
     */
    @GetMapping("/{id}")
    public ResponseEntity<LessonResponse> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id);
        return ResponseEntity.ok(lessonService.convertToResponse(lesson));
    }

    /**
     * POST /api/v1/lessons
     * Crear nueva lección (solo admin)
     *
     * @param createRequest datos de la lección
     * @param adminId id del admin que crea (futuro: desde token JWT)
     * @return Lección creada (201 Created) o error (404)
     */
    @PostMapping
    public ResponseEntity<LessonResponse> createLesson(
            @Valid @RequestBody CreateLessonRequest createRequest,
            @RequestParam Long adminId) {
        Lesson lesson = lessonService.createLesson(createRequest, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(lessonService.convertToResponse(lesson));
    }

    /**
     * PUT /api/v1/lessons/{id}
     * Actualizar lección (solo admin creador)
     *
     * @param id id de la lección
     * @param updateRequest datos a actualizar
     * @param adminId id del admin que edita
     * @return Lección actualizada (200 OK) o error (403, 404)
     */
    @PutMapping("/{id}")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long id,
            @Valid @RequestBody CreateLessonRequest updateRequest,
            @RequestParam Long adminId) {
        Lesson updated = lessonService.updateLesson(id, updateRequest.getTitle(),
                                                     updateRequest.getDescription(), adminId);
        return ResponseEntity.ok(lessonService.convertToResponse(updated));
    }

    /**
     * POST /api/v1/lessons/{id}/publish
     * Publicar lección (solo admin creador)
     * Requiere que tenga al menos un paso
     *
     * @param id id de la lección
     * @param adminId id del admin
     * @return Lección publicada (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<LessonResponse> publishLesson(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        Lesson published = lessonService.publishLesson(id, adminId);
        return ResponseEntity.ok(lessonService.convertToResponse(published));
    }

    /**
     * POST /api/v1/lessons/{id}/unpublish
     * Despublicar lección (solo admin creador)
     *
     * @param id id de la lección
     * @param adminId id del admin
     * @return Lección despublicada (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<LessonResponse> unpublishLesson(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        Lesson unpublished = lessonService.unpublishLesson(id, adminId);
        return ResponseEntity.ok(lessonService.convertToResponse(unpublished));
    }

    /**
     * DELETE /api/v1/lessons/{id}
     * Eliminar lección (solo admin creador)
     * Cascada: elimina también los pasos asociados
     *
     * @param id id de la lección
     * @param adminId id del admin
     * @return 204 No Content o error (403, 404)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        lessonService.deleteLesson(id, adminId);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/v1/lessons/{id}/count
     * Obtener información de estadísticas de una lección
     *
     * @param id id de la lección
     * @return Datos de la lección con contador de pasos
     */
    @GetMapping("/{id}/count")
    public ResponseEntity<Map<String, Object>> getLessonCount(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("lessonId", lesson.getId());
        response.put("title", lesson.getTitle());
        response.put("stepCount", lesson.getSteps().size());
        response.put("published", lesson.getIsPublished());
        return ResponseEntity.ok(response);
    }
}

