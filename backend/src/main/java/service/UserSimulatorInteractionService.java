package service;

import model.UserSimulatorInteraction;
import model.User;
import model.Simulator;
import repository.UserSimulatorInteractionRepository;
import repository.UserRepository;
import repository.SimulatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Interacciones Usuario-Simulador
 *
 * Gestiona todas las operaciones relacionadas con el historial de simuladores:
 * - Registrar acceso a simuladores
 * - Rastrear intentos en simuladores
 * - Obtener historial de simuladores usados
 * - Estadísticas de simuladores
 */
@Service
@Transactional
public class UserSimulatorInteractionService {

    private static final Logger logger = LoggerFactory.getLogger(UserSimulatorInteractionService.class);

    @Autowired
    private UserSimulatorInteractionRepository userSimulatorInteractionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimulatorRepository simulatorRepository;

    /**
     * Registrar acceso a un simulador
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return interacción registrada
     */
    public UserSimulatorInteraction recordInteraction(Long userId, Long simulatorId) {
        logger.info("Registrando acceso a simulador: usuario {} - simulador {}", userId, simulatorId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Simulator simulator = simulatorRepository.findById(simulatorId)
                .orElseThrow(() -> new IllegalArgumentException("Simulador no encontrado"));

        Optional<UserSimulatorInteraction> existing = userSimulatorInteractionRepository
            .findByUser_IdAndSimulator_Id(userId, simulatorId);

        UserSimulatorInteraction interaction;

        if (existing.isPresent()) {
            // Actualizar interacción existente
            interaction = existing.get();
            interaction.setAccessedAt(LocalDateTime.now());
            interaction.setAccessCount(interaction.getAccessCount() + 1);
            logger.info("Acceso actualizado - intento {}", interaction.getAccessCount());
        } else {
            // Crear nueva interacción
            interaction = new UserSimulatorInteraction();
            interaction.setUser(user);
            interaction.setSimulator(simulator);
            interaction.setAccessedAt(LocalDateTime.now());
            interaction.setAccessCount(1);
            logger.info("Nuevo acceso registrado");
        }

        return userSimulatorInteractionRepository.save(interaction);
    }

    /**
     * Obtener historial de simuladores usados por un usuario
     * @param userId id del usuario
     * @param pageable paginación
     * @return página de simuladores usados ordenados por fecha
     */
    public Page<UserSimulatorInteraction> getUserSimulatorHistory(Long userId, Pageable pageable) {
        return userSimulatorInteractionRepository.findByUser_IdOrderByAccessedAtDesc(userId, pageable);
    }

    /**
     * Obtener todos los simuladores usados por un usuario
     * @param userId id del usuario
     * @return lista de simuladores usados
     */
    public List<UserSimulatorInteraction> getAllUserSimulators(Long userId) {
        return userSimulatorInteractionRepository.findByUser_Id(userId);
    }

    /**
     * Obtener información de interacción usuario-simulador
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return Optional con la interacción si existe
     */
    public Optional<UserSimulatorInteraction> getInteraction(Long userId, Long simulatorId) {
        return userSimulatorInteractionRepository.findByUser_IdAndSimulator_Id(userId, simulatorId);
    }

    /**
     * Contar intentos en un simulador por usuario
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return número de intentos
     */
    public long countAttemptsInSimulator(Long userId, Long simulatorId) {
        return userSimulatorInteractionRepository.countByUser_IdAndSimulator_Id(userId, simulatorId);
    }

    /**
     * Obtener simuladores usados recientemente
     * @param userId id del usuario
     * @param since fecha desde la que buscar
     * @return lista de simuladores usados recientemente
     */
    public List<UserSimulatorInteraction> getRecentSimulators(Long userId, LocalDateTime since) {
        return userSimulatorInteractionRepository.findByUser_IdAndAccessedAtAfter(userId, since);
    }

    /**
     * Obtener simuladores usados en última semana
     * @param userId id del usuario
     * @return lista de simuladores usados en última semana
     */
    public List<UserSimulatorInteraction> getThisWeekSimulators(Long userId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        return getRecentSimulators(userId, weekAgo);
    }

    /**
     * Obtener simuladores usados en último mes
     * @param userId id del usuario
     * @return lista de simuladores usados en último mes
     */
    public List<UserSimulatorInteraction> getThisMonthSimulators(Long userId) {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        return getRecentSimulators(userId, monthAgo);
    }

    /**
     * Obtener todos los usuarios que usaron un simulador
     * @param simulatorId id del simulador
     * @return lista de usuarios que usaron el simulador
     */
    public List<UserSimulatorInteraction> getUsersForSimulator(Long simulatorId) {
        return userSimulatorInteractionRepository.findBySimulator_Id(simulatorId);
    }

    /**
     * Contar usuarios únicos que usaron un simulador
     * @param simulatorId id del simulador
     * @return número de usuarios únicos
     */
    public long countUsersForSimulator(Long simulatorId) {
        return userSimulatorInteractionRepository.countDistinctUsersBySimulator(simulatorId);
    }

    /**
     * Verificar si usuario ha usado un simulador
     * @param userId id del usuario
     * @param simulatorId id del simulador
     * @return true si ha usado
     */
    public boolean hasUserUsedSimulator(Long userId, Long simulatorId) {
        return userSimulatorInteractionRepository.existsByUser_IdAndSimulator_Id(userId, simulatorId);
    }

    /**
     * Eliminar historial de simulador para un usuario
     * @param userId id del usuario
     */
    public void deleteUserSimulatorHistory(Long userId) {
        userSimulatorInteractionRepository.deleteByUser_Id(userId);
    }

    /**
     * Obtener número total de intentos en simuladores por usuario
     * @param userId id del usuario
     * @return número total de intentos
     */
    public long getTotalSimulatorAttempts(Long userId) {
        return getAllUserSimulators(userId).stream()
            .mapToLong(UserSimulatorInteraction::getAccessCount)
            .sum();
    }

    /**
     * Obtener promedio de intentos por simulador
     * @param userId id del usuario
     * @return promedio de intentos
     */
    public double getAverageAttemptsPerSimulator(Long userId) {
        List<UserSimulatorInteraction> interactions = getAllUserSimulators(userId);
        if (interactions.isEmpty()) {
            return 0.0;
        }
        long totalAttempts = interactions.stream()
            .mapToLong(UserSimulatorInteraction::getAccessCount)
            .sum();
        return (double) totalAttempts / interactions.size();
    }

    /**
     * Obtener simulador más usado por un usuario
     * @param userId id del usuario
     * @return Optional con el simulador más usado
     */
    public Optional<Simulator> getMostUsedSimulator(Long userId) {
        return getAllUserSimulators(userId).stream()
            .max((i1, i2) -> Integer.compare(i1.getAccessCount(), i2.getAccessCount()))
            .map(UserSimulatorInteraction::getSimulator);
    }
}

