package controller;

import model.Simulator;
import service.SimulatorService;
import dto.request.CreateSimulatorRequest;
import dto.response.SimulatorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;

/**
 * Controlador de Simuladores
 *
 * Maneja CRUD de simuladores interactivos.
 * Público: GET (simuladores activos)
 * Admin: POST, PUT, DELETE (solo su contenido)
 */
@RestController
@RequestMapping("/api/simulators")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SimulatorController {

    @Autowired
    private SimulatorService simulatorService;

    /**
     * GET /api/v1/simulators
     * Listar simuladores activos
     *
     * @param page número de página
     * @param size tamaño de página
     * @return Página de simuladores (200 OK)
     */
    @GetMapping
    public ResponseEntity<Page<SimulatorResponse>> listSimulators(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sortObj = direction.equalsIgnoreCase("asc") ? Sort.by(sort).ascending() : Sort.by(sort).descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Simulator> simulators = simulatorService.listActiveSimulators(pageable);
        Page<SimulatorResponse> response = simulators.map(simulatorService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/simulators/search
     * Buscar simuladores por texto
     *
     * @param text texto a buscar en título o descripción
     * @param page número de página
     * @param size tamaño de página
     * @return Página de simuladores que coincidan
     */
    @GetMapping("/search")
    public ResponseEntity<Page<SimulatorResponse>> searchSimulators(
            @RequestParam String text,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sortObj = direction.equalsIgnoreCase("asc") ? Sort.by(sort).ascending() : Sort.by(sort).descending();
        Pageable pageable = PageRequest.of(page, size, sortObj);
        Page<Simulator> simulators = simulatorService.searchActiveSimulators(text, pageable);
        Page<SimulatorResponse> response = simulators.map(simulatorService::convertToResponse);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/simulators/{id}
     * Obtener simulador por ID
     *
     * @param id id del simulador
     * @return Simulador (200 OK) o error (404)
     */
    @GetMapping("/{id}")
    public ResponseEntity<SimulatorResponse> getSimulatorById(@PathVariable Long id) {
        Simulator simulator = simulatorService.findById(id);
        return ResponseEntity.ok(simulatorService.convertToResponse(simulator));
    }

    /**
     * POST /api/v1/simulators
     * Crear nuevo simulador (solo admin)
     *
     * @param createRequest datos del simulador
     * @param adminId id del admin que crea
     * @return Simulador creado (201 Created) o error (404)
     */
    @PostMapping
    public ResponseEntity<SimulatorResponse> createSimulator(
            @Valid @RequestBody CreateSimulatorRequest createRequest,
            @RequestParam Long adminId) {
        Simulator simulator = simulatorService.createSimulator(createRequest, adminId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(simulatorService.convertToResponse(simulator));
    }

    /**
     * PUT /api/v1/simulators/{id}
     * Actualizar simulador (solo admin creador)
     *
     * @param id id del simulador
     * @param updateRequest datos a actualizar
     * @param adminId id del admin
     * @return Simulador actualizado (200 OK) o error (403, 404)
     */
    @PutMapping("/{id}")
    public ResponseEntity<SimulatorResponse> updateSimulator(
            @PathVariable Long id,
            @Valid @RequestBody CreateSimulatorRequest updateRequest,
            @RequestParam Long adminId) {
        Simulator updated = simulatorService.updateSimulator(id, updateRequest.getTitle(),
                updateRequest.getDescription(),
                updateRequest.getFeedback(), adminId);
        return ResponseEntity.ok(simulatorService.convertToResponse(updated));
    }

    /**
     * POST /api/v1/simulators/{id}/activate
     * Activar simulador (solo admin creador)
     *
     * @param id id del simulador
     * @param adminId id del admin
     * @return Simulador activado (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/activate")
    public ResponseEntity<SimulatorResponse> activateSimulator(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        Simulator activated = simulatorService.activateSimulator(id, adminId);
        return ResponseEntity.ok(simulatorService.convertToResponse(activated));
    }

    /**
     * POST /api/v1/simulators/{id}/deactivate
     * Desactivar simulador (solo admin creador)
     *
     * @param id id del simulador
     * @param adminId id del admin
     * @return Simulador desactivado (200 OK) o error (403, 404)
     */
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<SimulatorResponse> deactivateSimulator(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        Simulator deactivated = simulatorService.deactivateSimulator(id, adminId);
        return ResponseEntity.ok(simulatorService.convertToResponse(deactivated));
    }

    /**
     * DELETE /api/v1/simulators/{id}
     * Eliminar simulador (solo admin creador)
     *
     * @param id id del simulador
     * @param adminId id del admin
     * @return 204 No Content o error (403, 404)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulator(
            @PathVariable Long id,
            @RequestParam Long adminId) {
        simulatorService.deleteSimulator(id, adminId);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/v1/simulators/{id}/interact
     * Registrar interacción del usuario con un simulador
     *
     * Cada vez que un usuario accede/utiliza un simulador, se registra la interacción.
     * Útil para rastrear qué simuladores son más usados y para futuros sistemas de recomendación.
     *
     * @param id id del simulador
     * @param userId id del usuario que interactúa
     * @return Información de la interacción registrada (200 OK) o error (404)
     */
    @PostMapping("/{id}/interact")
    public ResponseEntity<?> interactWithSimulator(
            @PathVariable Long id,
            @RequestParam Long userId) {
        try {
            Object interaction = simulatorService.recordInteraction(id, userId);
            return ResponseEntity.ok(interaction);
        } catch (Exception e) {
            return ResponseEntity.status(400)
                    .body(new HashMap<String, String>() {{
                        put("error", "No se pudo registrar la interacción con el simulador");
                        put("message", e.getMessage());
                    }});
        }
    }
}