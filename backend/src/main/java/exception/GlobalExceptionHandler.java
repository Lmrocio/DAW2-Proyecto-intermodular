package exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Manejador global de excepciones
 * Intercepta excepciones y devuelve respuestas HTTP apropiadas con códigos estándar
 *
 * Códigos HTTP manejados:
 * - 400 Bad Request: Errores de validación de entrada
 * - 401 Unauthorized: Token inválido o expirado
 * - 403 Forbidden: Sin permisos para acceder al recurso
 * - 404 Not Found: Recurso no encontrado
 * - 409 Conflict: Recurso duplicado
 * - 422 Unprocessable Entity: Validación de negocio fallida
 * - 500 Internal Server Error: Error no manejado en el servidor
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Maneja ResourceNotFoundException → 404 Not Found
     * Se lanza cuando se intenta acceder a un recurso que no existe
     *
     * Ejemplo: GET /api/lessons/999 (lección no existe)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
            ResourceNotFoundException ex, WebRequest request) {

        logger.warn("Recurso no encontrado: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "RESOURCE_NOT_FOUND",
                ex.getMessage(),
                404,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * Maneja DuplicateResourceException → 409 Conflict
     * Se lanza cuando se intenta crear un recurso que ya existe (duplicado)
     *
     * Ejemplo: Registrar usuario con username que ya existe
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
            DuplicateResourceException ex, WebRequest request) {

        logger.warn("Recurso duplicado: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "DUPLICATE_RESOURCE",
                ex.getMessage(),
                409,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    /**
     * Maneja ForbiddenException → 403 Forbidden
     * Se lanza cuando el usuario no tiene permisos para realizar la acción
     *
     * Ejemplo: USER intenta editar lección creada por otro ADMIN
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbiddenException(
            ForbiddenException ex, WebRequest request) {

        logger.warn("Acceso prohibido: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "FORBIDDEN",
                ex.getMessage(),
                403,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    /**
     * Maneja UnauthorizedException → 401 Unauthorized
     * Se lanza cuando el token es inválido, expirado o no está presente
     *
     * Ejemplo: Token JWT expirado o malformado
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedException(
            UnauthorizedException ex, WebRequest request) {

        logger.warn("No autorizado: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "UNAUTHORIZED",
                ex.getMessage(),
                401,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Maneja UnprocessableEntityException → 422 Unprocessable Entity
     * Se lanza cuando la validación de negocio falla
     * Los datos son válidos sintácticamente pero violan reglas de negocio
     *
     * Ejemplos:
     * - Intentar publicar lección sin pasos
     * - Intentar marcar lección como completada si no está publicada
     * - Valores inconsistentes o conflictivos
     */
    @ExceptionHandler(UnprocessableEntityException.class)
    public ResponseEntity<ErrorResponse> handleUnprocessableEntityException(
            UnprocessableEntityException ex, WebRequest request) {

        logger.warn("Entidad no procesable: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage(),
                422,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        // Si hay un valor que causó el error, adjuntarlo a la respuesta
        if (ex.getFailedValue() != null) {
            Map<String, Object> details = new HashMap<>();
            details.put("failedValue", ex.getFailedValue());
            errorResponse.setDetails(details);
        }

        return new ResponseEntity<>(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    /**
     * Maneja validación de DTOs → 400 Bad Request
     * Se lanza cuando los parámetros de entrada no cumplen validaciones @Valid
     *
     * Ejemplo: Email inválido en POST /api/auth/register
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex, WebRequest request) {

        logger.warn("Error en validación de datos: {}", ex.getMessage());

        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        ErrorResponse errorResponse = new ErrorResponse(
                "VALIDATION_ERROR",
                "Error en validación de datos de entrada",
                400,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );
        errorResponse.setValidationErrors(fieldErrors);

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja IllegalArgumentException → 400 Bad Request
     * Se lanza cuando se proporcionan argumentos inválidos
     *
     * Ejemplo: Parámetro de página negativo
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {

        logger.warn("Argumento ilegal: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "BAD_REQUEST",
                ex.getMessage(),
                400,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    /**
     * Maneja excepciones genéricas → 500 Internal Server Error
     * Se lanza para cualquier excepción no manejada explícitamente
     *
     * Incluye:
     * - NullPointerException
     * - DatabaseException
     * - Errores inesperados del servidor
     *
     * Acción: Se registra el error completo en logs para debugging
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(
            Exception ex, WebRequest request) {

        logger.error("Error interno del servidor no manejado", ex);

        ErrorResponse errorResponse = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "Error interno del servidor. Por favor, contacte al soporte.",
                500,
                LocalDateTime.now(),
                request.getDescription(false).replace("uri=", "")
        );

        // En desarrollo, incluir el mensaje de error; en producción, solo código
        if (isDevEnvironment()) {
            Map<String, Object> details = new HashMap<>();
            details.put("exception", ex.getClass().getSimpleName());
            details.put("message", ex.getMessage());
            errorResponse.setDetails(details);
        }

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Detecta si estamos en ambiente de desarrollo
     * En desarrollo, proporcionar más detalles de errores
     */
    private boolean isDevEnvironment() {
        String env = System.getProperty("spring.profiles.active");
        return env != null && (env.contains("dev") || env.contains("local"));
    }
}