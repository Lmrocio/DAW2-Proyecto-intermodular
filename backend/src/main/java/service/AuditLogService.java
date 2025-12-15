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
                .entityName(entityName)
                .previousValue(previousValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();

        return auditLogRepository.save(auditLog);
    }


    /**
     * Obtiene todos los logs de auditoría paginados
     */
    public Page<AuditLog> listAllLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable);
    }

    /**
     * Obtiene logs de auditoría por usuario paginado
     */
    public Page<AuditLog> findByUserId(Long userId, Pageable pageable) {
        return auditLogRepository.findByUser_IdOrderByTimestampDesc(userId, pageable);
    }

    /**
     * Obtiene logs de auditoría por acción paginado
     */
    public Page<AuditLog> findByAction(String action, Pageable pageable) {
        try {
            AuditAction auditAction = AuditAction.valueOf(action.toUpperCase());
            return auditLogRepository.findByActionOrderByTimestampDesc(auditAction, pageable);
        } catch (IllegalArgumentException e) {
            return Page.empty(pageable);
        }
    }

    /**
     * Obtiene logs de auditoría por tipo de entidad
     */
    public Page<AuditLogResponse> getAuditLogsByEntityType(AuditEntityType entityType, Pageable pageable) {
        return auditLogRepository.findByEntityType(entityType, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Obtiene logs de auditoría por entidad específica
     */
    public Page<AuditLogResponse> getAuditLogsByEntity(AuditEntityType entityType, Long entityId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable)
                .map(this::convertToResponse);
    }

    /**
     * Busca logs de auditoría en un rango de fechas
     */
    public Page<AuditLogResponse> searchAuditLogs(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByTimestampBetween(startDate, endDate, pageable)
                .map(this::convertToResponse);
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
                .previousValue(auditLog.getPreviousValue())
                .newValue(auditLog.getNewValue())
                .timestamp(auditLog.getTimestamp())
                .ipAddress(auditLog.getIpAddress())
                .build();
    }
}
