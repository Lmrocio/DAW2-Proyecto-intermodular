package controller;

import model.Step;
import service.StepService;
import dto.request.CreateStepRequest;
import dto.response.StepResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de Pasos
 *
 * Maneja CRUD de pasos dentro de lecciones.
 * Público: GET
 * Admin: POST, PUT, DELETE (solo en sus lecciones)
 */
@RestController
@RequestMapping("/api/lessons/{lessonId}/steps")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StepController {

    @Autowired
    private StepService stepService;

    /**
     * GET /api/v1/lessons/{lessonId}/steps
     * Obtener todos los pasos de una lección ordenados
     *
     * @param lessonId id de la lección
     * @return Lista de pasos ordenados secuencialmente (200 OK) o error (404)
     */
    @GetMapping
    public ResponseEntity<List<StepResponse>> getStepsByLesson(@PathVariable Long lessonId) {
        List<Step> steps = stepService.getStepsByLesson(lessonId);
        List<StepResponse> response = steps.stream()
            .map(stepService::convertToResponse)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/lessons/{lessonId}/steps/{stepNumber}
     * Obtener paso específico por número de orden
     *
     * @param lessonId id de la lección
     * @param stepNumber número del paso (1, 2, 3, ...)
     * @return Paso solicitado (200 OK) o error (404)
     */
    @GetMapping("/{stepNumber}")
    public ResponseEntity<StepResponse> getStepByNumber(
            @PathVariable Long lessonId,
            @PathVariable Integer stepNumber) {
        Step step = stepService.findStepByLessonAndNumber(lessonId, stepNumber)
            .orElseThrow(() -> new IllegalArgumentException("Paso no encontrado"));
        return ResponseEntity.ok(stepService.convertToResponse(step));
    }

    /**
     * POST /api/v1/lessons/{lessonId}/steps
     * Crear nuevo paso en una lección (solo admin creador)
     *
     * @param lessonId id de la lección
     * @param createRequest datos del paso
     * @param adminId id del admin que crea
     * @return Paso creado (201 Created) o error (403, 404)
     */
    @PostMapping
    public ResponseEntity<StepResponse> createStep(
            @PathVariable Long lessonId,
            @Valid @RequestBody CreateStepRequest createRequest,
            @RequestParam Long adminId) {
        Step step = stepService.createStep(lessonId, createRequest, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(stepService.convertToResponse(step));
    }

    /**
     * PUT /api/v1/lessons/{lessonId}/steps/{stepId}
     * Actualizar paso (solo admin creador de la lección)
     *
     * @param lessonId id de la lección
     * @param stepId id del paso
     * @param updateRequest datos a actualizar
     * @param adminId id del admin
     * @return Paso actualizado (200 OK) o error (403, 404)
     */
    @PutMapping("/{stepId}")
    public ResponseEntity<StepResponse> updateStep(
            @PathVariable Long lessonId,
            @PathVariable Long stepId,
            @Valid @RequestBody CreateStepRequest updateRequest,
            @RequestParam Long adminId) {
        Step updated = stepService.updateStep(stepId, updateRequest.getTitle(),
                                              updateRequest.getContent(),
                                              updateRequest.getImageUrl(),
                                              updateRequest.getVideoUrl(), adminId);
        return ResponseEntity.ok(stepService.convertToResponse(updated));
    }

    /**
     * PUT /api/v1/lessons/{lessonId}/steps/{stepId}/reorder
     * Reordenar paso dentro de la lección
     *
     * @param lessonId id de la lección
     * @param stepId id del paso
     * @param newOrder nuevo número de orden
     * @param adminId id del admin
     * @return 200 OK o error (403, 404)
     */
    @PutMapping("/{stepId}/reorder")
    public ResponseEntity<String> reorderStep(
            @PathVariable Long lessonId,
            @PathVariable Long stepId,
            @RequestParam Integer newOrder,
            @RequestParam Long adminId) {
        stepService.reorderStep(lessonId, stepId, newOrder, adminId);
        return ResponseEntity.ok("Paso reordenado exitosamente");
    }

    /**
     * DELETE /api/v1/lessons/{lessonId}/steps/{stepId}
     * Eliminar paso (solo admin creador)
     * Reordena automáticamente los pasos siguientes
     *
     * @param lessonId id de la lección
     * @param stepId id del paso
     * @param adminId id del admin
     * @return 204 No Content o error (403, 404)
     */
    @DeleteMapping("/{stepId}")
    public ResponseEntity<Void> deleteStep(
            @PathVariable Long lessonId,
            @PathVariable Long stepId,
            @RequestParam Long adminId) {
        stepService.deleteStep(stepId, adminId);
        return ResponseEntity.noContent().build();
    }
}

