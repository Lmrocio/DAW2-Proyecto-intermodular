package repository;

import model.Step;
import model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad Step
 */
@Repository
public interface StepRepository extends JpaRepository<Step, Long> {

    /**
     * Obtener todos los pasos de una lección ordenados secuencialmente
     * @param lesson lección
     * @return lista de pasos ordenados por stepOrder
     */
    List<Step> findByLessonOrderByStepOrder(Lesson lesson);

    /**
     * Obtener pasos de una lección ordenados por número
     * @param lessonId id de la lección
     * @return lista de pasos ordenados por stepOrder (ASC)
     */
    @Query("SELECT s FROM Step s WHERE s.lesson.id = :lessonId ORDER BY s.stepOrder ASC")
    List<Step> findStepsByLessonOrderedByNumber(@Param("lessonId") Long lessonId);

    /**
     * Obtener todos los pasos de una lección por ID
     * @param lessonId id de la lección
     * @return lista de pasos ordenados por stepOrder
     */
    List<Step> findByLesson_IdOrderByStepOrder(Long lessonId);

    /**
     * Obtener paso específico por su número
     * @param lessonId id de la lección
     * @param stepOrder número del paso
     * @return Optional con el paso si existe
     */
    @Query("SELECT s FROM Step s WHERE s.lesson.id = :lessonId AND s.stepOrder = :stepOrder")
    Optional<Step> findStepByLessonAndNumber(@Param("lessonId") Long lessonId, @Param("stepOrder") Integer stepOrder);

    /**
     * Contar pasos en una lección
     * @param lessonId id de la lección
     * @return número de pasos
     */
    long countByLesson_Id(Long lessonId);

    /**
     * Buscar paso por lección y orden
     * @param lessonId id de la lección
     * @param stepOrder orden del paso
     * @return Optional con el paso si existe
     */
    Optional<Step> findByLesson_IdAndStepOrder(Long lessonId, Integer stepOrder);

    /**
     * Obtener siguiente orden de paso en una lección
     * @param lessonId id de la lección
     * @return máximo stepOrder en la lección
     */
    @Query("SELECT COALESCE(MAX(s.stepOrder), 0) FROM Step s WHERE s.lesson.id = :lessonId")
    Integer getMaxStepOrderByLesson(@Param("lessonId") Long lessonId);

    /**
     * Eliminar todos los pasos de una lección
     * @param lessonId id de la lección
     */
    void deleteByLesson_Id(Long lessonId);
}

