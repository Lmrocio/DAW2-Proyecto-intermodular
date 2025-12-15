package exception;

/**
 * Excepción lanzada cuando un recurso no es encontrado
 * Mapea a código HTTP 404
 */
public class ResourceNotFoundException extends RuntimeException {

    private String resourceName;
    private String fieldName;
    private Object fieldValue;

    /**
     * Constructor simple
     * @param message mensaje de error
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor con detalles del recurso
     * @param resourceName nombre del recurso (ej: "User")
     * @param fieldName nombre del campo (ej: "id")
     * @param fieldValue valor del campo (ej: 123)
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s: '%s'", resourceName, fieldName, fieldValue));
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

