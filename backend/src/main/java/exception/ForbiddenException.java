package exception;

/**
 * Excepción lanzada cuando un usuario no tiene autorización
 * Mapea a código HTTP 403 Forbidden
 */
public class ForbiddenException extends RuntimeException {

    private String action;
    private String reason;

    /**
     * Constructor simple
     * @param message mensaje de error
     */
    public ForbiddenException(String message) {
        super(message);
    }

    /**
     * Constructor con detalles
     * @param action acción intentada (ej: "editar lección")
     * @param reason razón por la que se deniega (ej: "no eres el creador")
     */
    public ForbiddenException(String action, String reason) {
        super(String.format("No tienes permiso para %s: %s", action, reason));
        this.action = action;
        this.reason = reason;
    }

    public String getAction() {
        return action;
    }

    public String getReason() {
        return reason;
    }
}

