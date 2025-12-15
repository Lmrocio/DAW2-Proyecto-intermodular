package exception;

/**
 * Excepción lanzada cuando un usuario no está autenticado
 * Mapea a código HTTP 401 Unauthorized
 */
public class UnauthorizedException extends RuntimeException {

    private String reason;

    /**
     * Constructor simple
     * @param message mensaje de error
     */
    public UnauthorizedException(String message) {
        super(message);
        this.reason = message;
    }

    /**
     * Constructor con razón personalizada
     * @param message mensaje de error
     * @param reason razón por la que no está autenticado
     */
    public UnauthorizedException(String message, String reason) {
        super("No autenticado: " + message);
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }
}

