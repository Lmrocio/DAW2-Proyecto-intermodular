package repository;

import model.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad UserLessonProgress
 */
@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    /**
     * Buscar progreso de usuario en una lección
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return Optional con el progreso si existe
     */
    Optional<UserLessonProgress> findByUser_IdAndLesson_Id(Long userId, Long lessonId);

    /**
     * Obtener todo el progreso de un usuario
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de progreso
     */
    Page<UserLessonProgress> findByUser_Id(Long userId, Pageable pageable);

    /**
     * Obtener lecciones completadas por un usuario
     * @param userId id del usuario
     * @return lista de progreso de lecciones completadas
     */
    List<UserLessonProgress> findByUser_IdAndIsCompletedTrue(Long userId);

    /**
     * Obtener lecciones completadas por usuario con paginación
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de lecciones completadas
     */
    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.user.id = :userId AND ulp.isCompleted = true ORDER BY ulp.completedAt DESC")
    Page<UserLessonProgress> findCompletedLessonsByUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * Obtener lecciones completadas por usuario de una categoría
     * @param userId id del usuario
     * @param categoryId id de la categoría
     * @return lista de lecciones completadas en esa categoría
     */
    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.user.id = :userId " +
           "AND ulp.lesson.category.id = :categoryId AND ulp.isCompleted = true")
    List<UserLessonProgress> findCompletedLessonsByCategoryAndUser(@Param("userId") Long userId, @Param("categoryId") Long categoryId);

    /**
     * Obtener lecciones favoritas de un usuario
     * @param userId id del usuario
     * @return lista de progreso de lecciones favoritas
     */
    List<UserLessonProgress> findByUser_IdAndIsFavoriteTrue(Long userId);

    /**
     * Obtener lecciones favoritas con paginación
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de favoritos
     */
    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.user.id = :userId AND ulp.isFavorite = true ORDER BY ulp.lesson.title ASC")
    Page<UserLessonProgress> findFavoriteLessonsByUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * Contar lecciones completadas por usuario
     * @param userId id del usuario
     * @return número de lecciones completadas
     */
    long countByUser_IdAndIsCompletedTrue(Long userId);

    /**
     * Contar lecciones completadas por usuario en una categoría
     * @param userId id del usuario
     * @param categoryId id de la categoría
     * @return número de lecciones completadas en la categoría
     */
    @Query("SELECT COUNT(ulp) FROM UserLessonProgress ulp WHERE ulp.user.id = :userId " +
           "AND ulp.lesson.category.id = :categoryId AND ulp.isCompleted = true")
    long countCompletedInCategory(@Param("userId") Long userId, @Param("categoryId") Long categoryId);

    /**
     * Contar total de lecciones en una categoría
     * @param categoryId id de la categoría
     * @return número total de lecciones en la categoría
     */
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.category.id = :categoryId AND l.isPublished = true")
    long countTotalInCategory(@Param("categoryId") Long categoryId);


    /**
     * Contar total de lecciones publicadas
     * @return número total de lecciones publicadas
     */
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.isPublished = true")
    long countTotalPublishedLessons();

    /**
     * Verificar si usuario tiene progreso en una lección
     * @param userId id del usuario
     * @param lessonId id de la lección
     * @return true si existe progreso
     */
    boolean existsByUser_IdAndLesson_Id(Long userId, Long lessonId);

    /**
     * Obtener usuarios que completaron una lección específica
     * @param lessonId id de la lección
     * @return lista de usuarios que completaron la lección
     */
    @Query("SELECT ulp.user FROM UserLessonProgress ulp WHERE ulp.lesson.id = :lessonId AND ulp.isCompleted = true")
    List<model.User> findUsersThatCompletedLesson(@Param("lessonId") Long lessonId);

    /**
     * Contar cuántos usuarios completaron una lección
     * @param lessonId id de la lección
     * @return número de usuarios que completaron
     */
    @Query("SELECT COUNT(DISTINCT ulp.user.id) FROM UserLessonProgress ulp WHERE ulp.lesson.id = :lessonId AND ulp.isCompleted = true")
    long countUsersThatCompletedLesson(@Param("lessonId") Long lessonId);

    /**
     * Obtener usuarios que completaron una lección con paginación
     * @param lessonId id de la lección
     * @param pageable paginación
     * @return página de usuarios que completaron
     */
    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.lesson.id = :lessonId AND ulp.isCompleted = true ORDER BY ulp.completedAt DESC")
    Page<UserLessonProgress> findUsersWhoCompletedLesson(@Param("lessonId") Long lessonId, Pageable pageable);

    /**
     * Obtener lecciones completadas recientemente por usuario
     * Útil para mostrar "actividad reciente" en dashboard
     * @param userId id del usuario
     * @param since fecha desde la que buscar (ej: hace 7 días)
     * @return lista de lecciones completadas recientemente
     */
    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.user.id = :userId AND ulp.isCompleted = true " +
           "AND ulp.completedAt >= :since ORDER BY ulp.completedAt DESC")
    List<UserLessonProgress> findRecentlyCompletedLessons(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    /**
     * Eliminar progreso de un usuario
     * @param userId id del usuario
     */
    void deleteByUser_Id(Long userId);
}

