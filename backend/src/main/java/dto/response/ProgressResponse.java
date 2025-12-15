package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de progreso del usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressResponse {

    private Long id;
    private Long userId;
    private Long lessonId;
    private String lessonTitle;
    private Boolean isCompleted;
    private Boolean isFavorite;
    private LocalDateTime completedAt;
    private Integer accessCount;
}

