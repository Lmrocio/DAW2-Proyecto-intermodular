package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar un simulador existente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateSimulatorRequest {

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    private String description;

    private String feedback;

    private Boolean isActive;

    private Long lessonId;
}

