package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear una nueva FAQ
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFAQRequest {

    @NotBlank(message = "La pregunta es requerida")
    @Size(max = 500, message = "La pregunta no puede exceder 500 caracteres")
    private String question;

    @NotBlank(message = "La respuesta es requerida")
    private String answer;

    @NotBlank(message = "El tema es requerido")
    @Size(max = 100, message = "El tema no puede exceder 100 caracteres")
    private String topic;
}

