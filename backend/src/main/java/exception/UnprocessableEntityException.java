package exception;

/**
 * Excepción para errores de validación de negocio (422 UNPROCESSABLE_ENTITY)
 * Se lanza cuando los datos son válidos sintácticamente pero fallan reglas de negocio
 *
 * Ejemplos:
 * - Intentar publicar una lección sin pasos
 * - Intentar desactivar la única categoría
 * - Valores inconsistentes o conflictivos
 */
public class UnprocessableEntityException extends RuntimeException {

    private final String errorCode;
    private final Object failedValue;

    public UnprocessableEntityException(String message) {
        this(message, "BUSINESS_RULE_VIOLATION", null);
    }

    public UnprocessableEntityException(String message, String errorCode) {
        this(message, errorCode, null);
    }

    public UnprocessableEntityException(String message, String errorCode, Object failedValue) {
        super(message);
        this.errorCode = errorCode;
        this.failedValue = failedValue;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public Object getFailedValue() {
        return failedValue;
    }
}

