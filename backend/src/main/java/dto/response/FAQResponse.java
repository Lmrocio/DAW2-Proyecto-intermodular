package dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FAQResponse {

    private Long id;
    private String question;
    private String answer;
    private String topic;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserResponse createdBy;
    private UserResponse updatedBy;
}

