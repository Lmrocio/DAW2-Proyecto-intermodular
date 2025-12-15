package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear un nuevo simulador
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSimulatorRequest {

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    private String description;

    private String feedback;

    private Long lessonId;
}

