package repository;

import model.UserSimulatorInteraction;
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
 * Repositorio JPA para la entidad UserSimulatorInteraction
 */
@Repository
public interface UserSimulatorInteractionRepository extends JpaRepository<UserSimulatorInteraction, Long> {

    /**
     * Obtener historial de interacciones de un usuario con simuladores
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de interacciones
     */
    Page<UserSimulatorInteraction> findByUser_IdOrderByAccessedAtDesc(Long userId, Pageable pageable);

    /**
     * Obtener interacción específica usuario-simulador
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return Optional con la interacción si existe
     */
    Optional<UserSimulatorInteraction> findByUser_IdAndSimulator_Id(Long userId, Long simulatorId);

    /**
     * Contar intentos en un simulador por usuario
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return número de accesos/intentos
     */
    long countByUser_IdAndSimulator_Id(Long userId, Long simulatorId);

    /**
     * Obtener simuladores accedidos por un usuario
     * @param userId id del usuario
     * @return lista de simuladores accedidos
     */
    List<UserSimulatorInteraction> findByUser_Id(Long userId);

    /**
     * Obtener accesos a un simulador por todos los usuarios
     * @param simulatorId id del simulador
     * @return lista de interacciones con el simulador
     */
    List<UserSimulatorInteraction> findBySimulator_Id(Long simulatorId);

    /**
     * Contar usuarios únicos que han accedido a un simulador
     * @param simulatorId id del simulador
     * @return número de usuarios que han accedido
     */
    @Query("SELECT COUNT(DISTINCT usi.user.id) FROM UserSimulatorInteraction usi WHERE usi.simulator.id = :simulatorId")
    long countDistinctUsersBySimulator(@Param("simulatorId") Long simulatorId);

    /**
     * Obtener interacciones recientes (últimos X días)
     * @param userId id del usuario
     * @param since fecha desde la que contar
     * @return lista de interacciones recientes
     */
    List<UserSimulatorInteraction> findByUser_IdAndAccessedAtAfter(Long userId, LocalDateTime since);

    /**
     * Verificar si usuario ha accedido a simulador
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return true si ha accedido
     */
    boolean existsByUser_IdAndSimulator_Id(Long userId, Long simulatorId);

    /**
     * Eliminar interacciones de un usuario
     * @param userId id del usuario
     */
    void deleteByUser_Id(Long userId);
}

