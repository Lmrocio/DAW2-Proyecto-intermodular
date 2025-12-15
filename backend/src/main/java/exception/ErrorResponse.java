package exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Respuesta de error estándar para la API
 * Estructura común para todos los errores devueltos por la API
 */
public class ErrorResponse {

    private String code;                    // Código de error único (ej: RESOURCE_NOT_FOUND)
    private String message;                 // Mensaje descriptivo del error
    private int httpStatus;                 // Código HTTP (200, 404, 500, etc)
    private LocalDateTime timestamp;        // Timestamp del error
    private String path;                    // Ruta del endpoint que causó el error
    private Map<String, String> validationErrors;  // Errores de validación de campos
    private Map<String, Object> details;    // Detalles adicionales del error

    /**
     * Constructor básico
     */
    public ErrorResponse(String code, String message, int httpStatus,
                         LocalDateTime timestamp, String path) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
        this.timestamp = timestamp;
        this.path = path;
    }

    // Getters y Setters

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getHttpStatus() {
        return httpStatus;
    }

    public void setHttpStatus(int httpStatus) {
        this.httpStatus = httpStatus;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Map<String, String> getValidationErrors() {
        return validationErrors;
    }

    public void setValidationErrors(Map<String, String> validationErrors) {
        this.validationErrors = validationErrors;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "code='" + code + '\'' +
                ", message='" + message + '\'' +
                ", httpStatus=" + httpStatus +
                ", timestamp=" + timestamp +
                ", path='" + path + '\'' +
                '}';
    }
}