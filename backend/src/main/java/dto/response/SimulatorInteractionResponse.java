package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de interacción con simulador
 *
 * Registra el historial de accesos y uso de simuladores por parte del usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulatorInteractionResponse {

    private Long id;
    private Long userId;
    private String username;
    private Long simulatorId;
    private String simulatorTitle;
    private LocalDateTime accessedAt;
    private Integer accessCount;
    private LocalDateTime firstAccessDate;
    private LocalDateTime lastAccessDate;
}

