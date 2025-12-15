package repository;

import model.AuditLog;
import model.AuditAction;
import model.AuditEntityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para la entidad AuditLog
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /**
     * Obtener todos los logs paginados ordenados por fecha descendente
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findAllByOrderByTimestampDesc(Pageable pageable);

    /**
     * Obtener logs de auditoría de un usuario
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByUser_IdOrderByTimestampDesc(Long userId, Pageable pageable);

    /**
     * Obtener logs por acción
     * @param action acción realizada
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByActionOrderByTimestampDesc(AuditAction action, Pageable pageable);

    /**
     * Obtener logs por tipo de entidad
     * @param entityType tipo de entidad afectada
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByEntityTypeOrderByTimestampDesc(AuditEntityType entityType, Pageable pageable);

    /**
     * Obtener logs de una entidad específica
     * @param entityType tipo de entidad
     * @param entityId id de la entidad
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(AuditEntityType entityType, Long entityId, Pageable pageable);

    /**
     * Obtener logs por rango de fechas
     * @param fromDate fecha inicio
     * @param toDate fecha fin
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    /**
     * Obtener logs de un usuario en un rango de fechas
     * @param userId id del usuario
     * @param fromDate fecha inicio
     * @param toDate fecha fin
     * @param pageable paginación
     * @return página de logs
     */
    Page<AuditLog> findByUser_IdAndTimestampBetweenOrderByTimestampDesc(Long userId, LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);

    /**
     * Contar cambios realizados por un usuario
     * @param userId id del usuario
     * @return número de cambios
     */
    long countByUser_Id(Long userId);

    /**
     * Contar cambios por acción
     * @param action acción
     * @return número de cambios
     */
    long countByAction(AuditAction action);

    /**
     * Obtener último cambio de una entidad
     * @param entityType tipo de entidad
     * @param entityId id de la entidad
     * @return último log de esa entidad
     */
    @Query(value = "SELECT * FROM audit_log WHERE entity_type = :entityType AND entity_id = :entityId ORDER BY timestamp DESC LIMIT 1",
           nativeQuery = true)
    AuditLog findLastChangeOfEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);

    /**
     * Obtener logs por usuario y acción
     * @param userId id del usuario
     * @param action acción
     * @return lista de logs
     */
    List<AuditLog> findByUser_IdAndActionOrderByTimestampDesc(Long userId, AuditAction action);

    /**
     * Verificar si hay auditoría de una entidad
     * @param entityType tipo de entidad
     * @param entityId id de la entidad
     * @return true si existe auditoría
     */
    boolean existsByEntityTypeAndEntityId(AuditEntityType entityType, Long entityId);
}

