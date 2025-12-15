package exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Respuesta de error estándar para la API
 * Estructura común para todos los errores devueltos por la API
 *
 * Ejemplo de respuesta:
 * {
 *   "code": "RESOURCE_NOT_FOUND",
 *   "message": "Lección con id 999 no encontrada",
 *   "httpStatus": 404,
 *   "timestamp": "2025-12-15T10:30:00",
 *   "path": "/api/lessons/999",
 *   "validationErrors": null,
 *   "details": null
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {

    private String code;                    // Código de error único (ej: RESOURCE_NOT_FOUND)
    private String message;                 // Mensaje descriptivo del error
    private int httpStatus;                 // Código HTTP (200, 404, 500, etc)
    private LocalDateTime timestamp;        // Timestamp del error
    private String path;                    // Ruta del endpoint que causó el error
    private Map<String, String> validationErrors;  // Errores de validación de campos
    private Map<String, Object> details;    // Detalles adicionales del error

    /**
     * Constructor para casos básicos sin validationErrors ni details
     */
    public ErrorResponse(String code, String message, int httpStatus,
                         LocalDateTime timestamp, String path) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
        this.timestamp = timestamp;
        this.path = path;
        this.validationErrors = null;
        this.details = null;
    }
}