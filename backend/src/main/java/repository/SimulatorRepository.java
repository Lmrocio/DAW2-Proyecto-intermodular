package repository;

import model.Simulator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA para la entidad Simulator
 */
@Repository
public interface SimulatorRepository extends JpaRepository<Simulator, Long> {

    /**
     * Buscar simuladores por creador
     * @param createdById id del creador (admin)
     * @return lista de simuladores creados por el admin
     */
    List<Simulator> findByCreatedById(Long createdById);

    /**
     * Buscar simuladores activos
     * @param pageable paginación
     * @return página de simuladores activos
     */
    Page<Simulator> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Buscar simuladores activos por creador
     * @param createdById id del creador
     * @return lista de simuladores activos del admin
     */
    List<Simulator> findByCreatedByIdAndIsActiveTrue(Long createdById);

    /**
     * Contar simuladores activos
     * @return número de simuladores activos
     */
    long countByIsActiveTrue();

    /**
     * Buscar simuladores vinculados a una lección
     * @param lessonId id de la lección
     * @return lista de simuladores
     */
    List<Simulator> findByLesson_Id(Long lessonId);

    /**
     * Verificar si existe simulador activo con ese ID
     * @param id id del simulador
     * @return true si existe y está activo
     */
    boolean existsByIdAndIsActiveTrue(Long id);

    /**
     * Buscar simuladores activos por texto (título o descripción)
     * Búsqueda case-insensitive
     * @param search texto a buscar
     * @param pageable paginación
     * @return página de simuladores que coincidan
     */
    @Query("SELECT s FROM Simulator s WHERE (LOWER(s.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND s.isActive = true ORDER BY s.title ASC")
    Page<Simulator> searchActiveSimulators(@Param("search") String search, Pageable pageable);
}

