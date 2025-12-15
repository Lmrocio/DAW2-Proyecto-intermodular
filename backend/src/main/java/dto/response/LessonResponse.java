package dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de lección
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {

    private Long id;
    private String title;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Integer lessonOrder;
    private Boolean isPublished;
    private Long relatedSimulatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse createdBy;
    private UserResponse updatedBy;
    private List<StepResponse> steps;
}

