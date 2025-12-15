package exception;
}
    }
        return fieldValue;
    public Object getFieldValue() {

    }
        return fieldName;
    public String getFieldName() {

    }
        return resourceName;
    public String getResourceName() {

    }
        this.fieldValue = fieldValue;
        this.fieldName = fieldName;
        this.resourceName = resourceName;
        super(String.format("%s con %s '%s' ya existe", resourceName, fieldName, fieldValue));
    public DuplicateResourceException(String resourceName, String fieldName, Object fieldValue) {
     */
     * @param fieldValue valor del campo (ej: "juan")
     * @param fieldName nombre del campo (ej: "username")
     * @param resourceName nombre del recurso (ej: "User")
     * Constructor con detalles del recurso duplicado
    /**

    }
        super(message);
    public DuplicateResourceException(String message) {
     */
     * @param message mensaje de error
     * Constructor simple
    /**

    private Object fieldValue;
    private String fieldName;
    private String resourceName;

public class DuplicateResourceException extends RuntimeException {
 */
 * Mapea a código HTTP 409 Conflict
 * Excepción lanzada cuando se intenta crear un recurso duplicado
/**


