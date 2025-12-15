package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar una lección existente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLessonRequest {

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    @NotBlank(message = "La descripción es requerida")
    private String description;

    private Integer lessonOrder;

    private Boolean isPublished;

    private Long relatedSimulatorId;
}

