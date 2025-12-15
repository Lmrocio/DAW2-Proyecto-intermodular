package service;

import model.Lesson;
import model.Category;
import model.User;
import model.Step;
import repository.LessonRepository;
import repository.CategoryRepository;
import repository.UserRepository;
import repository.StepRepository;
import dto.request.CreateLessonRequest;
import dto.response.LessonResponse;
import dto.response.StepResponse;
import dto.response.UserResponse;
import exception.ResourceNotFoundException;
import exception.ForbiddenException;
import exception.UnprocessableEntityException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio de Lecciones
 *
 * Gestiona todas las operaciones relacionadas con lecciones:
 * - Crear, actualizar, eliminar lecciones
 * - Búsqueda y filtrado de lecciones
 * - Gestión de pasos
 * - Publicación de lecciones
 * - Validaciones y permisos
 */
@Service
@Transactional
public class LessonService {

    private static final Logger logger = LoggerFactory.getLogger(LessonService.class);

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private UserService userService;

    /**
     * Crear nueva lección
     * @param createLessonRequest datos de la lección
     * @param adminId id del admin que crea
     * @return lección creada
     */
    public Lesson createLesson(CreateLessonRequest createLessonRequest, Long adminId) {
        // Validar categoría existe
        Category category = categoryRepository.findById(createLessonRequest.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        // Validar usuario admin existe
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Administrador no encontrado"));

        // Obtener siguiente número de orden en la categoría
        Integer maxOrder = lessonRepository.getMaxLessonOrderByCategory(createLessonRequest.getCategoryId());
        Integer newOrder = (maxOrder != null ? maxOrder : 0) + 1;

        Lesson lesson = new Lesson();
        lesson.setTitle(createLessonRequest.getTitle());
        lesson.setDescription(createLessonRequest.getDescription());
        lesson.setCategory(category);
        lesson.setLessonOrder(newOrder);
        lesson.setCreatedBy(admin);
        lesson.setUpdatedBy(admin);
        lesson.setIsPublished(false);

        // Asociar simulador si se proporciona
        if (createLessonRequest.getRelatedSimulatorId() != null) {
            // Validación de simulador será hecha en SimulatorService
        }

        return lessonRepository.save(lesson);
    }

    /**
     * Obtener lección por ID
     * @param lessonId id de la lección
     * @return lección si existe
     * @throws ResourceNotFoundException si no existe
     */
    public Lesson findById(Long lessonId) {
        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson", "id", lessonId));
    }

    /**
     * Listar lecciones por categoría
     * @param categoryId id de la categoría
     * @param pageable paginación
     * @return página de lecciones publicadas
     */
    public Page<Lesson> getLessonsByCategory(Long categoryId, Pageable pageable) {
        return lessonRepository.findPublishedLessonsByCategory(categoryId, pageable);
    }

    /**
     * Listar todas las lecciones publicadas
     * @param pageable paginación
     * @return página de lecciones publicadas
     */
    public Page<Lesson> getAllPublishedLessons(Pageable pageable) {
        return lessonRepository.findByIsPublishedTrue(pageable);
    }

    /**
     * Buscar lecciones por texto
     * @param searchText texto a buscar
     * @param pageable paginación
     * @return página de lecciones que coincidan
     */
    public Page<Lesson> searchLessons(String searchText, Pageable pageable) {
        return lessonRepository.searchLessonsByText(searchText, pageable);
    }

    /**
     * Obtener lecciones trending/más accedidas
     * @param pageable paginación
     * @return página de lecciones ordenadas por popularidad
     */
    public Page<Lesson> getTrendingLessons(Pageable pageable) {
        return lessonRepository.findMostAccessedLessons(pageable);
    }

    /**
     * Obtener lecciones con simulador asociado
     * @param pageable paginación
     * @return página de lecciones con práctica
     */
    public Page<Lesson> getLessonsWithSimulator(Pageable pageable) {
        return lessonRepository.findLessonsWithSimulator(pageable);
    }

    /**
     * Listar lecciones creadas por un admin
     * @param adminId id del admin
     * @return lista de lecciones creadas por el admin
     */
    public List<Lesson> getLessonsByCreator(Long adminId) {
        return lessonRepository.findByCreatedById(adminId);
    }

    /**
     * Actualizar lección
     * Solo el admin que la creó puede editarla
     * @param lessonId id de la lección
     * @param title nuevo título
     * @param description nueva descripción
     * @param adminId id del admin que edita
     * @return lección actualizada
     * @throws ResourceNotFoundException si la lección no existe
     * @throws ForbiddenException si el admin no es el creador
     */
    public Lesson updateLesson(Long lessonId, String title, String description, Long adminId) {
        Lesson lesson = findById(lessonId);  // Lanza ResourceNotFoundException si no existe

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de editar lección ajena: usuario {} intentó editar lección de {}",
                    adminId, lesson.getCreatedBy().getId());
            throw new ForbiddenException("editar lección", "no eres el creador");
        }

        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setUpdatedBy(userRepository.findById(adminId).orElseThrow());

        Lesson updated = lessonRepository.save(lesson);
        logger.info("Lección actualizada: {}", lessonId);
        return updated;
    }

    /**
     * Publicar lección
     * @param lessonId id de la lección
     * @param adminId id del admin que publica
     * @return lección publicada
     * @throws ResourceNotFoundException si la lección no existe
     * @throws ForbiddenException si no es el creador o no tiene pasos
     */
    public Lesson publishLesson(Long lessonId, Long adminId) {
        Lesson lesson = findById(lessonId);

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de publicar lección ajena: usuario {}", adminId);
            throw new ForbiddenException("publicar lección", "no eres el creador");
        }

        // Validar que tenga al menos un paso (validación de negocio - 422)
        long stepCount = stepRepository.countByLesson_Id(lessonId);
        if (stepCount == 0) {
            logger.warn("Intento de publicar lección sin pasos: {}", lessonId);
            throw new UnprocessableEntityException(
                    "No se puede publicar una lección sin pasos. La lección debe tener al menos 1 paso.",
                    "NO_STEPS_IN_LESSON",
                    lessonId
            );
        }

        lesson.setIsPublished(true);
        lesson.setUpdatedBy(userRepository.findById(adminId).orElseThrow());

        Lesson published = lessonRepository.save(lesson);
        logger.info("Lección publicada: {}", lessonId);
        return published;
    }

    /**
     * Despublicar lección
     * @param lessonId id de la lección
     * @param adminId id del admin
     * @return lección despublicada
     * @throws ResourceNotFoundException si la lección no existe
     * @throws ForbiddenException si no es el creador
     */
    public Lesson unpublishLesson(Long lessonId, Long adminId) {
        Lesson lesson = findById(lessonId);

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            throw new ForbiddenException("despublicar lección", "no eres el creador");
        }

        lesson.setIsPublished(false);
        Lesson unpublished = lessonRepository.save(lesson);
        logger.info("Lección despublicada: {}", lessonId);
        return unpublished;
    }

    /**
     * Eliminar lección
     * Solo el admin que la creó puede eliminarla
     * Elimina también los pasos asociados
     * @param lessonId id de la lección
     * @param adminId id del admin que elimina
     * @throws ResourceNotFoundException si la lección no existe
     * @throws ForbiddenException si no es el creador
     */
    public void deleteLesson(Long lessonId, Long adminId) {
        Lesson lesson = findById(lessonId);

        // Validar que el admin sea el creador
        if (!lesson.getCreatedBy().getId().equals(adminId)) {
            logger.warn("Intento de eliminar lección ajena: usuario {}", adminId);
            throw new ForbiddenException("eliminar lección", "no eres el creador");
        }

        // Eliminar pasos asociados (cascada)
        stepRepository.deleteByLesson_Id(lessonId);

        // Eliminar lección
        lessonRepository.deleteById(lessonId);
        logger.info("Lección eliminada: {}", lessonId);
    }

    /**
     * Contar lecciones en una categoría
     * @param categoryId id de la categoría
     * @return número de lecciones
     */
    public long countLessonsInCategory(Long categoryId) {
        return lessonRepository.countByCategory_Id(categoryId);
    }

    /**
     * Obtener siguiente número de orden en una categoría
     * @param categoryId id de la categoría
     * @return siguiente número de orden
     */
    public Integer getNextLessonOrder(Long categoryId) {
        Integer maxOrder = lessonRepository.getMaxLessonOrderByCategory(categoryId);
        return (maxOrder != null ? maxOrder : 0) + 1;
    }

    /**
     * Verificar si una lección existe
     * @param lessonId id de la lección
     * @return true si existe
     */
    public boolean lessonExists(Long lessonId) {
        return lessonRepository.existsById(lessonId);
    }

    /**
     * Convertir entidad Lesson a DTO LessonResponse
     * @param lesson entidad Lesson
     * @return DTO LessonResponse
     */
    public LessonResponse convertToResponse(Lesson lesson) {
        // Convertir pasos a StepResponse
        List<StepResponse> stepsResponse = lesson.getSteps().stream()
                .sorted((s1, s2) -> Integer.compare(s1.getStepOrder(), s2.getStepOrder()))
                .map(this::convertStepToResponse)
                .collect(Collectors.toList());

        return LessonResponse.builder()
                .id(lesson.getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .categoryId(lesson.getCategory().getId())
                .categoryName(lesson.getCategory().getName())
                .lessonOrder(lesson.getLessonOrder())
                .isPublished(lesson.getIsPublished())
                .relatedSimulatorId(lesson.getRelatedSimulator() != null ? lesson.getRelatedSimulator().getId() : null)
                .createdAt(lesson.getCreatedAt())
                .updatedAt(lesson.getUpdatedAt())
                .createdBy(userService.convertToResponse(lesson.getCreatedBy()))
                .updatedBy(userService.convertToResponse(lesson.getUpdatedBy()))
                .steps(stepsResponse)
                .build();
    }

    /**
     * Convertir entidad Step a DTO StepResponse
     * @param step entidad Step
     * @return DTO StepResponse
     */
    private StepResponse convertStepToResponse(Step step) {
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