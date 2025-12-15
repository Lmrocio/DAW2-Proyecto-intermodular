package exception;

/**
 * Excepción lanzada cuando se intenta crear un recurso duplicado
 * Mapea a código HTTP 409 Conflict
 */
public class DuplicateResourceException extends RuntimeException {

    private String resourceName;
    private String fieldName;
    private Object fieldValue;

    /**
     * Constructor simple
     * @param message mensaje de error
     */
    public DuplicateResourceException(String message) {
        super(message);
    }

    /**
     * Constructor con detalles del recurso duplicado
     * @param resourceName nombre del recurso (ej: "User")
     * @param fieldName nombre del campo (ej: "username")
     * @param fieldValue valor del campo (ej: "juan")
     */
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s con %s '%s' ya existe", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}


