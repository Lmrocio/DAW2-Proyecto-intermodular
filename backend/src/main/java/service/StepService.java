package service;

import model.Step;
import model.Lesson;
import model.User;
import repository.StepRepository;
import repository.LessonRepository;
import repository.UserRepository;
import dto.request.CreateStepRequest;
import dto.response.StepResponse;
import exception.ResourceNotFoundException;
import exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de Pasos
 *
 * Gestiona todas las operaciones relacionadas con pasos:
 * - Crear, actualizar, eliminar pasos
 * - Ordenamiento secuencial de pasos
 * - Validaciones de pertenencia a lección
 * - Conversión a DTOs
 */
@Service
@Transactional
public class StepService {

    private static final Logger logger = LoggerFactory.getLogger(StepService.class);

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Crear nuevo paso en una lección
     * @param lessonId id de la lección
     * @param createStepRequest datos del paso
     * @param adminId id del admin que crea
     * @return paso creado
     * @throws ResourceNotFoundException si la lección no existe
     * @throws ForbiddenException si el admin no es el creador
     */
    public Step createStep(Long lessonId, CreateStepRequest createStepRequest, Long adminId) {
        logger.info("Creando paso en lección: {}", lessonId);

        // Validar que la lección existe
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));

        // Validar que el admin sea el creador de la lección
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de agregar paso a lección ajena: usuario {}", adminId);
            throw new ForbiddenException("agregar pasos", "no eres el creador de la lección");
        }

        // Obtener siguiente número de orden
        Integer maxOrder = stepRepository.getMaxStepOrderByLesson(lessonId);
        Integer newOrder = (maxOrder != null ? maxOrder : 0) + 1;

        Step step = new Step();
        step.setStepOrder(newOrder);
        step.setTitle(createStepRequest.getTitle());
        step.setContent(createStepRequest.getContent());
        step.setImageUrl(createStepRequest.getImageUrl());
        step.setVideoUrl(createStepRequest.getVideoUrl());
        step.setLesson(lesson);

        Step saved = stepRepository.save(step);
        logger.info("Paso creado: {}", saved.getId());
        return saved;
    }

    /**
     * Obtener paso por ID
     * @param stepId id del paso
     * @return paso si existe
     * @throws ResourceNotFoundException si no existe
     */
    public Step findById(Long stepId) {
        return stepRepository.findById(stepId)
                .orElseThrow(() -> new ResourceNotFoundException("Step", "id", stepId));
    }

    /**
     * Obtener paso específico por lección y número
     * @param lessonId id de la lección
     * @param stepOrder número del paso
     * @return Optional con el paso si existe
     */
    public Optional<Step> findStepByLessonAndNumber(Long lessonId, Integer stepOrder) {
        return stepRepository.findStepByLessonAndNumber(lessonId, stepOrder);
    }

    /**
     * Obtener todos los pasos de una lección ordenados
     * @param lessonId id de la lección
     * @return lista de pasos ordenados secuencialmente
     */
    public List<Step> getStepsByLesson(Long lessonId) {
        return stepRepository.findStepsByLessonOrderedByNumber(lessonId);
    }

    /**
     * Obtener pasos de una lección con multimedia
     * @param lessonId id de la lección
     * @return lista de pasos que tienen imagen o video
     */
    public List<Step> getStepsWithMedia(Long lessonId) {
        return getStepsByLesson(lessonId).stream()
                .filter(s -> s.getImageUrl() != null || s.getVideoUrl() != null)
                .collect(Collectors.toList());
    }

    /**
     * Actualizar paso
     * Solo el admin que creó la lección puede editarla
     * @param stepId id del paso
     * @param title nuevo título
     * @param content nuevo contenido
     * @param imageUrl nueva URL de imagen
     * @param videoUrl nueva URL de video
     * @param adminId id del admin que edita
     * @return paso actualizado
     * @throws ResourceNotFoundException si el paso no existe
     * @throws ForbiddenException si admin no es creador de la lección
     */
    public Step updateStep(Long stepId, String title, String content,
                           String imageUrl, String videoUrl, Long adminId) {
        Step step = findById(stepId);

        Lesson lesson = step.getLesson();

        // Validar que el admin sea el creador de la lección
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de editar paso de lección ajena: usuario {}", adminId);
            throw new ForbiddenException("editar pasos", "no eres el creador de la lección");
        }

        step.setTitle(title);
        step.setContent(content);
        step.setImageUrl(imageUrl);
        step.setVideoUrl(videoUrl);

        Step updated = stepRepository.save(step);
        logger.info("Paso actualizado: {}", stepId);
        return updated;
    }

    /**
     * Reordenar pasos dentro de una lección
     * @param lessonId id de la lección
     * @param stepId id del paso a mover
     * @param newOrder nuevo número de orden
     * @param adminId id del admin que reordena
     */
    public void reorderStep(Long lessonId, Long stepId, Integer newOrder, Long adminId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lección no encontrada"));

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            throw new IllegalArgumentException("No tienes permiso para reordenar pasos de esta lección");
        }

        Step step = stepRepository.findById(stepId)
                .orElseThrow(() -> new IllegalArgumentException("Paso no encontrado"));

        // Validar que el paso pertenece a la lección
        if (!step.getLesson().getId().equals(lessonId)) {
            throw new IllegalArgumentException("El paso no pertenece a esta lección");
        }

        // Obtener máximo orden
        Integer maxOrder = stepRepository.getMaxStepOrderByLesson(lessonId);
        if (newOrder > maxOrder) {
            throw new IllegalArgumentException("El nuevo orden es inválido");
        }

        List<Step> allSteps = stepRepository.findStepsByLessonOrderedByNumber(lessonId);

        // Reordenar todos los pasos
        int currentOrder = step.getStepOrder();

        if (newOrder < currentOrder) {
            // Mover hacia arriba
            for (Step s : allSteps) {
                if (s.getStepOrder() >= newOrder && s.getStepOrder() < currentOrder) {
                    s.setStepOrder(s.getStepOrder() + 1);
                    stepRepository.save(s);
                }
            }
        } else if (newOrder > currentOrder) {
            // Mover hacia abajo
            for (Step s : allSteps) {
                if (s.getStepOrder() <= newOrder && s.getStepOrder() > currentOrder) {
                    s.setStepOrder(s.getStepOrder() - 1);
                    stepRepository.save(s);
                }
            }
        }

        step.setStepOrder(newOrder);
        stepRepository.save(step);
    }

    /**
     * Eliminar paso
     * Solo el admin que creó la lección puede eliminarlo
     * @param stepId id del paso
     * @param adminId id del admin que elimina
     * @throws ResourceNotFoundException si el paso no existe
     * @throws ForbiddenException si admin no es creador de la lección
     */
    public void deleteStep(Long stepId, Long adminId) {
        Step step = findById(stepId);

        Lesson lesson = step.getLesson();

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de eliminar paso de lección ajena: usuario {}", adminId);
            throw new ForbiddenException("eliminar pasos", "no eres el creador de la lección");
        }

        // Reordenar los pasos siguientes
        Integer currentOrder = step.getStepOrder();
        List<Step> subsequentSteps = stepRepository.findStepsByLessonOrderedByNumber(lesson.getId()).stream()
                .filter(s -> s.getStepOrder() > currentOrder)
                .collect(Collectors.toList());

        for (Step s : subsequentSteps) {
            s.setStepOrder(s.getStepOrder() - 1);
            stepRepository.save(s);
        }

        stepRepository.deleteById(stepId);
        logger.info("Paso eliminado: {}", stepId);
    }

    /**
     * Contar pasos en una lección
     * @param lessonId id de la lección
     * @return número de pasos
     */
    public long countStepsByLesson(Long lessonId) {
        return stepRepository.countByLesson_Id(lessonId);
    }

    /**
     * Obtener siguiente número de orden para un paso
     * @param lessonId id de la lección
     * @return siguiente número de orden
     */
    public Integer getNextStepOrder(Long lessonId) {
        Integer maxOrder = stepRepository.getMaxStepOrderByLesson(lessonId);
        return (maxOrder != null ? maxOrder : 0) + 1;
    }

    /**
     * Convertir entidad Step a DTO StepResponse
     * @param step entidad Step
     * @return DTO StepResponse
     */
    public StepResponse convertToResponse(Step step) {
        return StepResponse.builder()
                .id(step.getId())
                .stepOrder(step.getStepOrder())
                .title(step.getTitle())
                .content(step.getContent())
                .imageUrl(step.getImageUrl())
                .videoUrl(step.getVideoUrl())
                .createdAt(step.getCreatedAt())
                .updatedAt(step.getUpdatedAt())
                .build();
    }
}