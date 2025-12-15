package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de simulador
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulatorResponse {

    private Long id;
    private String title;
    private String description;
    private String feedback;
    private Boolean isActive;
    private Long lessonId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse createdBy;
    private UserResponse updatedBy;
}

