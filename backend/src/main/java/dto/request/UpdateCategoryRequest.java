package dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar una categoría existente
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCategoryRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;

    private String description;
}

