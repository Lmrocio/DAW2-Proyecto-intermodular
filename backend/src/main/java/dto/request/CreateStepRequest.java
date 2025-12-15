package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear un nuevo paso en una lección
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStepRequest {

    @NotNull(message = "El orden es requerido")
    private Integer stepOrder;

    @NotBlank(message = "El título es requerido")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String title;

    @NotBlank(message = "El contenido es requerido")
    private String content;

    private String imageUrl;

    private String videoUrl;
}

