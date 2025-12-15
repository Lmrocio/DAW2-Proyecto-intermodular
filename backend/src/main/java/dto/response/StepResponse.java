package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de paso
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StepResponse {

    private Long id;
    private Integer stepOrder;
    private String title;
    private String content;
    private String imageUrl;
    private String videoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

