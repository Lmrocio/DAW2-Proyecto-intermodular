package controller;

import model.FAQ;
import service.FAQService;
import dto.request.CreateFAQRequest;
import dto.response.FAQResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador de Preguntas Frecuentes (FAQ)
 *
 * Maneja CRUD de FAQs.
 * Público: GET
 * Admin: POST, PUT, DELETE (solo su contenido)
 */
@RestController
@RequestMapping("/api/faq")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FAQController {

    @Autowired
    private FAQService faqService;

    /**
     * GET /api/v1/faq
     * Listar todas las FAQs activas
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de FAQs (200 OK)
     */
    @GetMapping
    public ResponseEntity<Page<FAQResponse>> listFAQs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FAQ> faqs = faqService.listActiveFAQs(pageable);
        Page<FAQResponse> response = faqs.map(faqService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/faq/topics
     * Obtener todos los temas disponibles
     *
     * @return Lista de temas únicos
     */
    @GetMapping("/topics")
    public ResponseEntity<List<String>> getAllTopics() {
        List<String> topics = faqService.getAllTopics();
        return ResponseEntity.ok(topics);
    }

    /**
     * GET /api/v1/faq/topic/{topic}
     * Obtener FAQs por tema
     *
     * @param topic tema a filtrar
     * @param page número de página
     * @param size tamaño de página
     * @return Página de FAQs del tema
     */
    @GetMapping("/topic/{topic}")
    public ResponseEntity<Page<FAQResponse>> getFAQsByTopic(
            @PathVariable String topic,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FAQ> faqs = faqService.getFAQsByTopic(topic, pageable);
        Page<FAQResponse> response = faqs.map(faqService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/faq/{id}
     * Obtener FAQ por ID
     *
     * @param id id de la FAQ
     * @return FAQ (200 OK) o error (404)
     */
    @GetMapping("/{id}")
    public ResponseEntity<FAQResponse> getFAQById(@PathVariable Long id) {
        FAQ faq = faqService.findById(id);
        return ResponseEntity.ok(faqService.convertToResponse(faq));
    }

    /**
     * POST /api/v1/faq
     * Crear nueva FAQ (solo admin)
     *
     * @param createRequest datos de la FAQ
     * @param adminId id del admin que crea
     * @return FAQ creada (201 Created) o error (404)
     */
    @PostMapping
    public ResponseEntity<FAQResponse> createFAQ(
            @Valid @RequestBody CreateFAQRequest createRequest,
            @RequestParam Long adminId) {
        FAQ faq = faqService.createFAQ(createRequest, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(faqService.convertToResponse(faq));
    }

    /**
     * PUT /api/v1/faq/{id}
     * Actualizar FAQ (solo admin creador)
     *
     * @param id id de la FAQ
     * @param updateRequest datos a actualizar
     * @param adminId id del admin
     * @return FAQ actualizada (200 OK) o error (403, 404)
     */
    @PutMapping("/{id}")
    public ResponseEntity<FAQResponse> updateFAQ(
            @PathVariable Long id,
            @Valid @RequestBody CreateFAQRequest updateRequest,
            @RequestParam Long adminId) {
        FAQ updated = faqService.updateFAQ(id, updateRequest.getQuestion(),
                                           updateRequest.getAnswer(),
                                           updateRequest.getTopic(), adminId);
        return ResponseEntity.ok(faqService.convertToResponse(updated));
    }

    /**
     * POST /api/v1/faq/{id}/activate
     * Activar FAQ (solo admin creador)
     *
     * @param id id de la FAQ
     * @param adminId id del admin
     * @return FAQ activada (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<FAQResponse> activateFAQ(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        FAQ activated = faqService.activateFAQ(id, adminId);
        return ResponseEntity.ok(faqService.convertToResponse(activated));
    }

    /**
     * POST /api/v1/faq/{id}/deactivate
     * Desactivar FAQ (solo admin creador)
     *
     * @param id id de la FAQ
     * @param adminId id del admin
     * @return FAQ desactivada (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<FAQResponse> deactivateFAQ(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        FAQ deactivated = faqService.deactivateFAQ(id, adminId);
        return ResponseEntity.ok(faqService.convertToResponse(deactivated));
    }

    /**
     * DELETE /api/v1/faq/{id}
     * Eliminar FAQ (solo admin creador)
     *
     * @param id id de la FAQ
     * @param adminId id del admin
     * @return 204 No Content o error (403, 404)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFAQ(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        faqService.deleteFAQ(id, adminId);
        return ResponseEntity.noContent().build();
    }
}

