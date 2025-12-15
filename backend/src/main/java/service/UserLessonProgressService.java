package service;

import model.UserLessonProgress;
import model.User;
import model.Lesson;
import repository.UserLessonProgressRepository;
import repository.UserRepository;
import repository.LessonRepository;
import dto.response.ProgressResponse;
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
import java.util.stream.Collectors;

/**
 * Servicio de Progreso de Usuario-Lección
 *
 * Gestiona todas las operaciones relacionadas con el progreso del usuario:
 * - Marcar lecciones como completadas
 * - Gestionar favoritos
 * - Calcular progreso por categoría y global
 * - Rastrear accesos a lecciones
 */
@Service
@Transactional
public class UserLessonProgressService {

    private static final Logger logger = LoggerFactory.getLogger(UserLessonProgressService.class);

    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    /**
     * Obtener o crear progreso de usuario en una lección
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return progreso existente o nuevo
     */
    public UserLessonProgress getOrCreateProgress(Long userId, Long lessonId) {
        Optional<UserLessonProgress> existing = userLessonProgressRepository.findByUser_IdAndLesson_Id(userId, lessonId);

        if (existing.isPresent()) {
            UserLessonProgress progress = existing.get();
            // Incrementar contador de accesos
            progress.setAccessCount(progress.getAccessCount() + 1);
            return userLessonProgressRepository.save(progress);
        }

        // Crear nuevo progreso
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lección no encontrada"));

        UserLessonProgress newProgress = new UserLessonProgress();
        newProgress.setUser(user);
        newProgress.setLesson(lesson);
        newProgress.setIsCompleted(false);
        newProgress.setIsFavorite(false);
        newProgress.setAccessCount(1);

        return userLessonProgressRepository.save(newProgress);
    }

    /**
     * Marcar lección como completada
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return progreso actualizado
     */
    public UserLessonProgress markAsCompleted(Long userId, Long lessonId) {
        UserLessonProgress progress = getOrCreateProgress(userId, lessonId);

        progress.setIsCompleted(true);
        progress.setCompletedAt(LocalDateTime.now());

        logger.info("Lección marcada como completada: usuario {} - lección {}", userId, lessonId);
        return userLessonProgressRepository.save(progress);
    }

    /**
     * Desmarcar lección como completada
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return progreso actualizado
     */
    public UserLessonProgress markAsNotCompleted(Long userId, Long lessonId) {
        UserLessonProgress progress = getOrCreateProgress(userId, lessonId);

        progress.setIsCompleted(false);
        progress.setCompletedAt(null);

        logger.info("Lección desmarcada como completada: usuario {} - lección {}", userId, lessonId);
        return userLessonProgressRepository.save(progress);
    }

    /**
     * Agregar lección a favoritos
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return progreso actualizado
     */
    public UserLessonProgress addToFavorites(Long userId, Long lessonId) {
        UserLessonProgress progress = getOrCreateProgress(userId, lessonId);
        progress.setIsFavorite(true);
        logger.info("Lección agregada a favoritos: usuario {} - lección {}", userId, lessonId);
        return userLessonProgressRepository.save(progress);
    }

    /**
     * Remover lección de favoritos
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return progreso actualizado
     */
    public UserLessonProgress removeFromFavorites(Long userId, Long lessonId) {
        UserLessonProgress progress = getOrCreateProgress(userId, lessonId);
        progress.setIsFavorite(false);
        logger.info("Lección removida de favoritos: usuario {} - lección {}", userId, lessonId);
        return userLessonProgressRepository.save(progress);
    }

    /**
     * Obtener progreso de usuario en una lección
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Optional con el progreso si existe
     */
    public Optional<UserLessonProgress> getProgress(Long userId, Long lessonId) {
        return userLessonProgressRepository.findByUser_IdAndLesson_Id(userId, lessonId);
    }

    /**
     * Obtener todo el progreso de un usuario
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de progreso
     */
    public Page<UserLessonProgress> getUserProgress(Long userId, Pageable pageable) {
        return userLessonProgressRepository.findByUser_Id(userId, pageable);
    }

    /**
     * Obtener lecciones completadas por usuario
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de lecciones completadas
     */
    public Page<UserLessonProgress> getCompletedLessons(Long userId, Pageable pageable) {
        return userLessonProgressRepository.findCompletedLessonsByUser(userId, pageable);
    }

    /**
     * Obtener lecciones completadas recientemente
     * @param userId id del usuario
     * @param since fecha desde la que buscar
     * @return lista de lecciones completadas recientemente
     */
    public List<UserLessonProgress> getRecentlyCompletedLessons(Long userId, LocalDateTime since) {
        return userLessonProgressRepository.findRecentlyCompletedLessons(userId, since);
    }

    /**
     * Obtener lecciones completadas en última semana
     * @param userId id del usuario
     * @return lista de lecciones completadas en última semana
     */
    public List<UserLessonProgress> getThisWeekCompletedLessons(Long userId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        return getRecentlyCompletedLessons(userId, weekAgo);
    }

    /**
     * Obtener lecciones completadas en último mes
     * @param userId id del usuario
     * @return lista de lecciones completadas en último mes
     */
    public List<UserLessonProgress> getThisMonthCompletedLessons(Long userId) {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        return getRecentlyCompletedLessons(userId, monthAgo);
    }

    /**
     * Obtener lecciones favoritas
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de favoritos
     */
    public Page<UserLessonProgress> getFavoriteLessons(Long userId, Pageable pageable) {
        return userLessonProgressRepository.findFavoriteLessonsByUser(userId, pageable);
    }

    /**
     * Obtener lecciones completadas en una categoría
     * @param userId id del usuario
     * @param categoryId id de la categoría
     * @return lista de lecciones completadas en la categoría
     */
    public List<UserLessonProgress> getCompletedLessonsByCategory(Long userId, Long categoryId) {
        return userLessonProgressRepository.findCompletedLessonsByCategoryAndUser(userId, categoryId);
    }

    /**
     * Calcular progreso por categoría
     * @param userId id del usuario
     * @param categoryId id de la categoría
     * @return porcentaje de progreso (0-100)
     */
    public double calculateCategoryProgress(Long userId, Long categoryId) {
        long completed = userLessonProgressRepository.countCompletedInCategory(userId, categoryId);
        long total = userLessonProgressRepository.countTotalInCategory(categoryId);

        if (total == 0) {
            return 0.0;
        }

        return (completed * 100.0) / total;
    }

    /**
     * Calcular progreso global
     * @param userId id del usuario
     * @return porcentaje de progreso global (0-100)
     */
    public double calculateGlobalProgress(Long userId) {
        long completed = userLessonProgressRepository.countByUser_IdAndIsCompletedTrue(userId);
        long total = lessonRepository.countByIsPublishedTrue();

        if (total == 0) {
            return 0.0;
        }

        return (completed * 100.0) / total;
    }

    /**
     * Contar total de lecciones publicadas en la plataforma
     * @return número de lecciones publicadas
     */
    public long countTotalPublishedLessons() {
        return lessonRepository.countByIsPublishedTrue();
    }

    /**
     * Contar lecciones completadas por usuario
     * @param userId id del usuario
     * @return número de lecciones completadas
     */
    public long countCompletedLessons(Long userId) {
        return userLessonProgressRepository.countByUser_IdAndIsCompletedTrue(userId);
    }

    /**
     * Contar lecciones favoritas por usuario
     * @param userId id del usuario
     * @return número de lecciones favoritas
     */
    public long countFavoriteLessons(Long userId) {
        return userLessonProgressRepository.findByUser_IdAndIsFavoriteTrue(userId).size();
    }

    /**
     * Obtener usuarios que completaron una lección
     * @param lessonId id de la lección
     * @return lista de usuarios que completaron
     */
    public List<User> getUsersThatCompletedLesson(Long lessonId) {
        return userLessonProgressRepository.findUsersThatCompletedLesson(lessonId);
    }

    /**
     * Contar usuarios que completaron una lección
     * @param lessonId id de la lección
     * @return número de usuarios que completaron
     */
    public long countUsersThatCompletedLesson(Long lessonId) {
        return userLessonProgressRepository.countUsersThatCompletedLesson(lessonId);
    }

    /**
     * Eliminar todo el progreso de un usuario
     * @param userId id del usuario
     */
    public void deleteUserProgress(Long userId) {
        userLessonProgressRepository.deleteByUser_Id(userId);
    }

    /**
     * Calcular progreso por categoría para un usuario
     * @param userId id del usuario
     * @return mapa con progreso por categoría
     */
    public Map<String, Object> calculateProgressByCategory(Long userId) {
        // Este método debería implementarse consultando las lecciones completadas por categoría
        // Por ahora retornamos un mapa vacío como placeholder
        return new java.util.HashMap<>();
    }

    /**
     * Obtener configuración de accesibilidad del usuario
     * @param userId id del usuario
     * @return mapa con configuración de accesibilidad
     */
    public Map<String, Object> getAccessibilitySettings(Long userId) {
        // Este método debería implementarse cuando se añada la entidad de configuración
        // Por ahora retornamos configuración por defecto
        Map<String, Object> settings = new java.util.HashMap<>();
        settings.put("fontSize", "medium");
        settings.put("contrast", "normal");
        return settings;
    }

    /**
     * Actualizar configuración de accesibilidad del usuario
     * @param userId id del usuario
     * @param settings configuración nueva
     * @return configuración actualizada
     */
    public Map<String, Object> updateAccessibilitySettings(Long userId, Map<String, Object> settings) {
        // Este método debería implementarse cuando se añada la entidad de configuración
        // Por ahora retornamos los settings que se pasaron
        return settings;
    }

    /**
     * Resetear configuración de accesibilidad del usuario
     * @param userId id del usuario
     * @return configuración por defecto
     */
    public Map<String, Object> resetAccessibilitySettings(Long userId) {
        Map<String, Object> settings = new java.util.HashMap<>();
        settings.put("fontSize", "medium");
        settings.put("contrast", "normal");
        return settings;
    }

    /**
     * Obtener interacciones del usuario con simuladores
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de interacciones
     */
    public Page<Map<String, Object>> getSimulatorInteractions(Long userId, Pageable pageable) {
        // Este método debería implementarse consultando UserSimulatorInteraction
        // Por ahora retornamos página vacía
        return Page.empty(pageable);
    }

    /**
     * Obtener resumen de interacciones con simuladores
     * @param userId id del usuario
     * @return resumen de interacciones
     */
    public Map<String, Object> getSimulatorInteractionSummary(Long userId) {
        // Este método debería implementarse consultando UserSimulatorInteraction
        Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("totalInteractions", 0);
        summary.put("uniqueSimulators", 0);
        return summary;
    }

    /**
     * Convertir entidad UserLessonProgress a DTO ProgressResponse
     * @param progress entidad UserLessonProgress
     * @return DTO ProgressResponse
     */
    public ProgressResponse convertToResponse(UserLessonProgress progress) {
        return ProgressResponse.builder()
                .id(progress.getId())
                .userId(progress.getUser().getId())
                .lessonId(progress.getLesson().getId())
                .lessonTitle(progress.getLesson().getTitle())
                .isCompleted(progress.getIsCompleted())
                .isFavorite(progress.getIsFavorite())
                .completedAt(progress.getCompletedAt())
                .accessCount(progress.getAccessCount())
                .build();
    }
}