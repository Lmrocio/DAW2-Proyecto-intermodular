package repository;

import model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA para la entidad FAQ
 */
@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {

    /**
     * Buscar FAQ por pregunta
     * @param question pregunta
     * @return Optional con la FAQ si existe
     */
    Optional<FAQ> findByQuestion(String question);

    /**
     * Buscar FAQs activas por tema
     * @param topic tema/categoría
     * @param pageable paginación
     * @return página de FAQs activas
     */
    Page<FAQ> findByTopicAndIsActiveTrueOrderByCreatedAtDesc(String topic, Pageable pageable);

    /**
     * Obtener todos los temas disponibles
     * @return lista de temas únicos
     */
    List<String> findDistinctTopicOrderByTopic();

    /**
     * Obtener FAQs creadas por un admin
     * @param createdById id del admin creador
     * @return lista de FAQs
     */
    List<FAQ> findByCreatedById(Long createdById);

    /**
     * Obtener FAQs creadas y editadas por un admin
     * @param createdById id del admin
     * @param pageable paginación
     * @return página de FAQs
     */
    Page<FAQ> findByCreatedByIdOrUpdatedByIdOrderByCreatedAtDesc(Long createdById, Long updatedById, Pageable pageable);

    /**
     * Buscar FAQs activas por página
     * @param pageable paginación
     * @return página de FAQs activas
     */
    Page<FAQ> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Buscar FAQs activas por texto (pregunta o respuesta)
     * Búsqueda case-insensitive
     * @param search texto a buscar
     * @param pageable paginación
     * @return página de FAQs que coincidan
     */
    @Query("SELECT f FROM FAQ f WHERE (LOWER(f.question) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(f.answer) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND f.isActive = true ORDER BY f.question ASC")
    Page<FAQ> searchActiveFAQ(@Param("search") String search, Pageable pageable);

    /**
     * Contar FAQs activas por tema
     * @param topic tema
     * @return número de FAQs activas
     */
    long countByTopicAndIsActiveTrue(String topic);

    /**
     * Contar FAQs creadas por un admin
     * @param createdById id del admin
     * @return número de FAQs creadas
     */
    long countByCreatedById(Long createdById);

    /**
     * Verificar si existe FAQ activa con esa pregunta
     * @param question pregunta
     * @return true si existe y está activa
     */
    boolean existsByQuestionAndIsActiveTrue(String question);
}

