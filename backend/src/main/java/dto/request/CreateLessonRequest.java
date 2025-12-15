package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva lección
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLessonRequest {

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    @NotBlank(message = "La descripción es requerida")
    private String description;

    @NotNull(message = "La categoría es requerida")
    private Long categoryId;

    @NotNull(message = "El orden es requerido")
    private Integer lessonOrder;

    private Long relatedSimulatorId;
}

