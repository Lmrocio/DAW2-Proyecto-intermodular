package dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para registro de nuevo usuario
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "El nombre de usuario es requerido")
    @Size(min = 3, max = 100, message = "El usuario debe tener entre 3 y 100 caracteres")
    private String username;

    @NotBlank(message = "El email es requerido")
    @Email(message = "El email debe ser válido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, max = 255, message = "La contraseña debe tener entre 6 y 255 caracteres")
    private String password;

    @NotBlank(message = "Debe confirmar la contraseña")
    private String confirmPassword;
}

