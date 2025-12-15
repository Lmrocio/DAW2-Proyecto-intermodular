package service;

import model.AuditLog;
import model.AuditAction;
import model.AuditEntityType;
import model.User;
import repository.AuditLogRepository;
import dto.response.AuditLogResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Auditoría
 *
 * Gestiona el registro de auditoría de todas las acciones en la plataforma
 */
@Service
@Transactional
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Registra una acción de auditoría
     */
    public AuditLog logAction(User user, AuditAction action, AuditEntityType entityType,
                              Long entityId, String entityName, String previousValue, String newValue) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .previousValue(previousValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();

        return auditLogRepository.save(auditLog);
    }


    /**
     * Obtiene todos los logs de auditoría paginados
     */
    public Page<AuditLogResponse> listAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(this::convertToResponse);
    }

    /**
     * Obtiene logs de auditoría por usuario paginado
     */
    public Page<AuditLogResponse> findByUserId(Long userId, Pageable pageable) {
        return auditLogRepository.findByUser_IdOrderByTimestampDesc(userId, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Obtiene logs de auditoría por acción paginado
     */
    public Page<AuditLogResponse> findByAction(String action, Pageable pageable) {
        try {
            AuditAction auditAction = AuditAction.valueOf(action.toUpperCase());
            return auditLogRepository.findByActionOrderByTimestampDesc(auditAction, pageable)
                    .map(this::convertToResponse);
        } catch (IllegalArgumentException e) {
            return Page.empty(pageable);
        }
    }

    /**
     * Obtiene logs de auditoría por tipo de entidad
     */
    public Page<AuditLogResponse> getAuditLogsByEntityType(AuditEntityType entityType, Pageable pageable) {
        return auditLogRepository.findByEntityTypeOrderByTimestampDesc(entityType, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Obtiene logs de auditoría por entidad específica
     */
    public Page<AuditLogResponse> getAuditLogsByEntity(AuditEntityType entityType, Long entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Busca logs de auditoría en un rango de fechas
     */
    public Page<AuditLogResponse> searchAuditLogs(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByTimestampBetweenOrderByTimestampDesc(startDate, endDate, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Obtiene logs de auditoría por tipo de entidad (String)
     */
    public Page<AuditLogResponse> findByEntityType(String entityTypeStr, Pageable pageable) {
        try {
            AuditEntityType entityType = AuditEntityType.valueOf(entityTypeStr.toUpperCase());
            return getAuditLogsByEntityType(entityType, pageable);
        } catch (IllegalArgumentException e) {
            return Page.empty(pageable);
        }
    }

    /**
     * Obtiene logs de auditoría por ID de entidad
     */
    public Page<AuditLogResponse> findByEntityId(Long entityId, Pageable pageable) {
        // Como no conocemos el tipo de entidad, buscamos en todos
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(this::convertToResponse);
    }

    /**
     * Cuenta el total de logs de auditoría
     */
    public long countTotalLogs() {
        return auditLogRepository.count();
    }

    /**
     * Cuenta logs por acción (String)
     */
    public long countByAction(String actionStr) {
        try {
            AuditAction action = AuditAction.valueOf(actionStr.toUpperCase());
            return auditLogRepository.countByAction(action);
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    /**
     * Convierte AuditLog a AuditLogResponse
     */
    private AuditLogResponse convertToResponse(AuditLog auditLog) {
        return AuditLogResponse.builder()
                .id(auditLog.getId())
                .userId(auditLog.getUser() != null ? auditLog.getUser().getId() : null)
                .username(auditLog.getUser() != null ? auditLog.getUser().getUsername() : null)
                .action(auditLog.getAction() != null ? auditLog.getAction().toString() : null)
                .entityType(auditLog.getEntityType() != null ? auditLog.getEntityType().toString() : null)
                .entityId(auditLog.getEntityId())
                .entityName(auditLog.getEntityName())
                .previousValue(auditLog.getPreviousValue() != null ? auditLog.getPreviousValue().toString() : null)
                .newValue(auditLog.getNewValue() != null ? auditLog.getNewValue().toString() : null)
                .timestamp(auditLog.getTimestamp())
                .ipAddress(auditLog.getIpAddress())
                .build();
    }
}