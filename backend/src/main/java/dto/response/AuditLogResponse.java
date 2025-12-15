package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de log de auditoría
 *
 * Registra todas las acciones realizadas en la plataforma
 * (creación, actualización, eliminación de contenido)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogResponse {

    private Long id;
    private Long userId;
    private String username;
    private String action;
    private String entityType;
    private Long entityId;
    private String entityName;
    private String previousValue;
    private String newValue;
    private LocalDateTime timestamp;
    private String ipAddress;
}

