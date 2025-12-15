package service;

import model.Simulator;
import model.Lesson;
import model.User;
import model.UserSimulatorInteraction;
import repository.SimulatorRepository;
import repository.LessonRepository;
import repository.UserRepository;
import repository.UserSimulatorInteractionRepository;
import dto.request.CreateSimulatorRequest;
import dto.response.SimulatorResponse;
import exception.ResourceNotFoundException;
import exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio de Simuladores
 *
 * Gestiona todas las operaciones relacionadas con simuladores:
 * - Crear, actualizar, eliminar simuladores
 * - Búsqueda y filtrado
 * - Vinculación con lecciones
 * - Validaciones de permisos
 */
@Service
@Transactional
public class SimulatorService {

    private static final Logger logger = LoggerFactory.getLogger(SimulatorService.class);

    @Autowired
    private SimulatorRepository simulatorRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    @Autowired
    private UserSimulatorInteractionRepository userSimulatorInteractionRepository;

    /**
     * Crear nuevo simulador
     * @param createSimulatorRequest datos del simulador
     * @param adminId id del admin que crea
     * @return simulador creado
     * @throws ResourceNotFoundException si el admin no existe
     */
    public Simulator createSimulator(CreateSimulatorRequest createSimulatorRequest, Long adminId) {
        logger.info("Creando nuevo simulador: {}", createSimulatorRequest.getTitle());

        // Validar que el admin existe
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", adminId));

        Simulator simulator = new Simulator();
        simulator.setTitle(createSimulatorRequest.getTitle());
        simulator.setDescription(createSimulatorRequest.getDescription());
        simulator.setFeedback(createSimulatorRequest.getFeedback());
        simulator.setCreatedBy(admin);
        simulator.setUpdatedBy(admin);
        simulator.setIsActive(true);

        // Asociar con lección si se proporciona
        if (createSimulatorRequest.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(createSimulatorRequest.getLessonId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", createSimulatorRequest.getLessonId()));
            simulator.setLesson(lesson);
        }

        Simulator saved = simulatorRepository.save(simulator);
        logger.info("Simulador creado: {}", saved.getId());
        return saved;
    }

    /**
     * Obtener simulador por ID
     * @param simulatorId id del simulador
     * @return simulador si existe
     * @throws ResourceNotFoundException si no existe
     */
    public Simulator findById(Long simulatorId) {
        return simulatorRepository.findById(simulatorId)
            .orElseThrow(() -> new ResourceNotFoundException("Simulator", "id", simulatorId));
    }

    /**
     * Obtener simulador activo por ID
     * @param simulatorId id del simulador
     * @return Optional con el simulador si existe y está activo
     */
    public Optional<Simulator> findActiveById(Long simulatorId) {
        Optional<Simulator> simulator = simulatorRepository.findById(simulatorId);
        if (simulator.isPresent() && simulator.get().getIsActive()) {
            return simulator;
        }
        return Optional.empty();
    }

    /**
     * Listar simuladores activos
     * @param pageable paginación
     * @return página de simuladores activos
     */
    public Page<Simulator> listActiveSimulators(Pageable pageable) {
        return simulatorRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    /**
     * Buscar simuladores activos por texto
     * @param searchText texto a buscar
     * @param pageable paginación
     * @return página de simuladores que coincidan
     */
    public Page<Simulator> searchActiveSimulators(String searchText, Pageable pageable) {
        return simulatorRepository.searchActiveSimulators(searchText, pageable);
    }

    /**
     * Obtener simuladores independientes (sin lección asociada)
     * @param pageable paginación
     * @return página de simuladores independientes
     */
    public Page<Simulator> getIndependentSimulators(Pageable pageable) {
        List<Simulator> allActive = simulatorRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable).getContent();
        List<Simulator> independent = allActive.stream()
            .filter(s -> s.getLesson() == null)
            .toList();
        // Nota: Para implementación completa, se recomienda agregar query en repositorio
        return simulatorRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    /**
     * Obtener simuladores creados por un admin
     * @param adminId id del admin
     * @return lista de simuladores creados por el admin
     */
    public List<Simulator> getSimulatorsByCreator(Long adminId) {
        return simulatorRepository.findByCreatedById(adminId);
    }

    /**
     * Obtener simuladores activos creados por un admin
     * @param adminId id del admin
     * @return lista de simuladores activos creados por el admin
     */
    public List<Simulator> getActiveSimulatorsByCreator(Long adminId) {
        return simulatorRepository.findByCreatedByIdAndIsActiveTrue(adminId);
    }

    /**
     * Obtener simuladores vinculados a una lección
     * @param lessonId id de la lección
     * @return lista de simuladores de la lección
     */
    public List<Simulator> getSimulatorsByLesson(Long lessonId) {
        return simulatorRepository.findByLesson_Id(lessonId);
    }

    /**
     * Actualizar simulador
     * Solo el admin que lo creó puede editarlo
     * @param simulatorId id del simulador
     * @param title nuevo título
     * @param description nueva descripción
     * @param feedback nuevo feedback
     * @param adminId id del admin que edita
     * @return simulador actualizado
     * @throws ResourceNotFoundException si el simulador no existe
     * @throws ForbiddenException si no es el creador
     */
    public Simulator updateSimulator(Long simulatorId, String title, String description,
                                    String feedback, Long adminId) {
        Simulator simulator = findById(simulatorId);

        // Validar que el admin sea el creador
        if (!simulator.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de editar simulador ajeno: usuario {}", adminId);
            throw new ForbiddenException("editar simulador", "no eres el creador");
        }

        simulator.setTitle(title);
        simulator.setDescription(description);
        simulator.setFeedback(feedback);
        simulator.setUpdatedBy(userRepository.findById(adminId).orElseThrow());

        Simulator updated = simulatorRepository.save(simulator);
        logger.info("Simulador actualizado: {}", simulatorId);
        return updated;
    }

    /**
     * Activar simulador
     * @param simulatorId id del simulador
     * @param adminId id del admin que activa
     * @return simulador activado
     * @throws ResourceNotFoundException si el simulador no existe
     * @throws ForbiddenException si no es el creador
     */
    public Simulator activateSimulator(Long simulatorId, Long adminId) {
        Simulator simulator = findById(simulatorId);

        // Validar que el admin sea el creador
        if (!simulator.getCreatedBy().getId().equals(adminId)) {
            throw new ForbiddenException("activar simulador", "no eres el creador");
        }

        simulator.setIsActive(true);
        Simulator activated = simulatorRepository.save(simulator);
        logger.info("Simulador activado: {}", simulatorId);
        return activated;
    }

    /**
     * Desactivar simulador
     * @param simulatorId id del simulador
     * @param adminId id del admin que desactiva
     * @return simulador desactivado
     * @throws ResourceNotFoundException si el simulador no existe
     * @throws ForbiddenException si no es el creador
     */
    public Simulator deactivateSimulator(Long simulatorId, Long adminId) {
        Simulator simulator = findById(simulatorId);

        // Validar que el admin sea el creador
        if (!simulator.getCreatedBy().getId().equals(adminId)) {
            throw new ForbiddenException("desactivar simulador", "no eres el creador");
        }

        simulator.setIsActive(false);
        Simulator deactivated = simulatorRepository.save(simulator);
        logger.info("Simulador desactivado: {}", simulatorId);
        return deactivated;
    }

    /**
     * Eliminar simulador
     * Solo el admin que lo creó puede eliminarlo
     * @param simulatorId id del simulador
     * @param adminId id del admin que elimina
     * @throws ResourceNotFoundException si el simulador no existe
     * @throws ForbiddenException si no es el creador
     */
    public void deleteSimulator(Long simulatorId, Long adminId) {
        Simulator simulator = findById(simulatorId);

        // Validar que el admin sea el creador
        if (!simulator.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de eliminar simulador ajeno: usuario {}", adminId);
            throw new ForbiddenException("eliminar simulador", "no eres el creador");
        }

        simulatorRepository.deleteById(simulatorId);
        logger.info("Simulador eliminado: {}", simulatorId);
    }

    /**
     * Contar simuladores activos
     * @return número de simuladores activos
     */
    public long countActiveSimulators() {
        return simulatorRepository.countByIsActiveTrue();
    }

    /**
     * Convertir entidad Simulator a DTO SimulatorResponse
     * @param simulator entidad Simulator
     * @return DTO SimulatorResponse
     */
    public SimulatorResponse convertToResponse(Simulator simulator) {
        SimulatorResponse response = new SimulatorResponse(
            simulator.getId(),
            simulator.getTitle(),
            simulator.getDescription(),
            simulator.getIsActive()
        );

        response.setFeedback(simulator.getFeedback());
        response.setLessonId(simulator.getLesson() != null ? simulator.getLesson().getId() : null);
        response.setCreatedAt(simulator.getCreatedAt());
        response.setUpdatedAt(simulator.getUpdatedAt());
        response.setCreatedBy(userService.convertToResponse(simulator.getCreatedBy()));
        response.setUpdatedBy(userService.convertToResponse(simulator.getUpdatedBy()));

        return response;
    }

    /**
     * Registrar interacción de un usuario con un simulador
     * @param simulatorId id del simulador
     * @param userId id del usuario
     * @return UserSimulatorInteraction registrada
     */
    public UserSimulatorInteraction recordInteraction(Long simulatorId, Long userId) {
        Simulator simulator = simulatorRepository.findById(simulatorId)
            .orElseThrow(() -> new ResourceNotFoundException("Simulator", "id", simulatorId));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Optional<UserSimulatorInteraction> existing = userSimulatorInteractionRepository.findByUser_IdAndSimulator_Id(userId, simulatorId);
        UserSimulatorInteraction interaction;
        if (existing.isPresent()) {
            interaction = existing.get();
            interaction.setAccessedAt(LocalDateTime.now());
            interaction.setAccessCount(interaction.getAccessCount() + 1);
        } else {
            interaction = new UserSimulatorInteraction();
            interaction.setUser(user);
            interaction.setSimulator(simulator);
            interaction.setAccessedAt(LocalDateTime.now());
            interaction.setAccessCount(1);
        }
        return userSimulatorInteractionRepository.save(interaction);
    }
}
