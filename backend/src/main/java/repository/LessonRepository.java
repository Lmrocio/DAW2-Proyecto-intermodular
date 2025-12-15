package repository;

import model.Lesson;
import model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad Lesson
 */
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

    /**
     * Buscar lecciones por categoría
     * @param category categoría
     * @return lista de lecciones en esa categoría
     */
    List<Lesson> findByCategory(Category category);

    /**
     * Buscar lecciones publicadas por categoría ordenadas por orden
     * @param categoryId id de la categoría
     * @param pageable paginación
     * @return página de lecciones publicadas ordenadas
     */
    @Query("SELECT l FROM Lesson l WHERE l.category.id = :categoryId AND l.isPublished = true ORDER BY l.lessonOrder ASC")
    Page<Lesson> findPublishedLessonsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Buscar lecciones por categoría sin filtro de publicación
     * @param categoryId id de la categoría
     * @param pageable paginación
     * @return página de lecciones
     */
    @Query("SELECT l FROM Lesson l WHERE l.category.id = :categoryId ORDER BY l.lessonOrder ASC")
    Page<Lesson> findLessonsByCategory(@Param("categoryId") Long categoryId, Pageable pageable);

    /**
     * Buscar lecciones por texto (en título o descripción)
     * @param searchText texto a buscar
     * @param pageable paginación
     * @return página de lecciones que coincidan
     */
    @Query("SELECT l FROM Lesson l WHERE (LOWER(l.title) LIKE LOWER(CONCAT('%', :searchText, '%')) " +
            "OR LOWER(l.description) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
            "AND l.isPublished = true ORDER BY l.title ASC")
    Page<Lesson> searchLessonsByText(@Param("searchText") String searchText, Pageable pageable);

    /**
     * Buscar lecciones publicadas por categoría
     * @param category categoría
     * @param pageable paginación
     * @return página de lecciones publicadas
     */
    Page<Lesson> findByCategoryAndIsPublishedTrue(Category category, Pageable pageable);

    /**
     * Buscar lecciones por creador
     * @param createdById id del creador (admin)
     * @return lista de lecciones creadas por el admin
     */
    List<Lesson> findByCreatedById(Long createdById);

    /**
     * Buscar lecciones publicadas
     * @param pageable paginación
     * @return página de lecciones publicadas
     */
    Page<Lesson> findByIsPublishedTrue(Pageable pageable);

    /**
     * Contar lecciones por categoría
     * @param categoryId id de la categoría
     * @return número de lecciones en la categoría
     */
    long countByCategory_Id(Long categoryId);

    /**
     * Contar lecciones publicadas por categoría
     * @param categoryId id de la categoría
     * @return número de lecciones publicadas en la categoría
     */
    long countByCategory_IdAndIsPublishedTrue(Long categoryId);

    /**
     * Contar todas las lecciones publicadas en la plataforma
     * @return número de lecciones publicadas
     */
    long countByIsPublishedTrue();

    /**
     * Obtener siguiente orden en una categoría
     * @param categoryId id de la categoría
     * @return máximo lessonOrder en la categoría
     */
    @Query("SELECT COALESCE(MAX(l.lessonOrder), 0) FROM Lesson l WHERE l.category.id = :categoryId")
    Integer getMaxLessonOrderByCategory(@Param("categoryId") Long categoryId);

    /**
     * Buscar lección por categoría y orden
     * @param categoryId id de la categoría
     * @param lessonOrder orden de la lección
     * @return Optional con la lección si existe
     */
    Optional<Lesson> findByCategory_IdAndLessonOrder(Long categoryId, Integer lessonOrder);

    /**
     * Obtener lecciones más accedidas/populares (trending)
     * Ordena por número de usuarios que las han accedido
     * @param pageable paginación
     * @return página de lecciones ordenadas por popularidad
     */
    @Query("SELECT l FROM Lesson l WHERE l.isPublished = true " +
            "ORDER BY (SELECT COUNT(ulp) FROM UserLessonProgress ulp WHERE ulp.lesson.id = l.id) DESC")
    Page<Lesson> findMostAccessedLessons(Pageable pageable);

    /**
     * Obtener lecciones que tienen simulador asociado
     * Útil para filtrar lecciones con práctica/ejercicio
     * @param pageable paginación
     * @return página de lecciones publicadas con simulador
     */
    @Query("SELECT l FROM Lesson l WHERE l.relatedSimulator IS NOT NULL AND l.isPublished = true ORDER BY l.createdAt DESC")
    Page<Lesson> findLessonsWithSimulator(Pageable pageable);
}