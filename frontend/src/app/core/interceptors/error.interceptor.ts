import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor funcional para manejo global de errores HTTP
 *
 * Mapea códigos de estado HTTP a mensajes de usuario comprensibles:
 * - 0: Sin conexión con el servidor
 * - 401: Sesión caducada
 * - 403: Sin permisos
 * - 404: Recurso no encontrado
 * - 5xx: Error interno del servidor
 *
 * FASE 5 - Tarea 6: Interceptores HTTP
 * Este interceptor procesa TODOS los errores HTTP de forma centralizada,
 * proporcionando mensajes claros y consistentes al usuario.
 *
 * @example
 * // Registrado en app.config.ts:
 * provideHttpClient(
 *   withInterceptors([authInterceptor, errorInterceptor, loggingInterceptor])
 * )
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (red, etc.)
        userMessage = `Error de conexión: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        switch (error.status) {
          case 0:
            userMessage = 'No hay conexión con el servidor. Verifica tu conexión a internet.';
            break;

          case 400:
            userMessage = 'Los datos enviados no son válidos. Verifica el formulario.';
            break;

          case 401:
            userMessage = 'Sesión caducada. Vuelve a iniciar sesión.';
            // Opcional: redirigir a login
            // inject(Router).navigate(['/login']);
            break;

          case 403:
            userMessage = 'No tienes permisos para realizar esta acción.';
            break;

          case 404:
            userMessage = 'El recurso solicitado no existe.';
            break;

          case 409:
            userMessage = 'Conflicto: el recurso ya existe o no se puede modificar.';
            break;

          case 422:
            userMessage = 'Los datos no se pudieron procesar. Verifica la información.';
            break;

          case 429:
            userMessage = 'Demasiadas peticiones. Por favor, espera un momento.';
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            userMessage = 'Error interno del servidor. Inténtalo más tarde.';
            break;

          default:
            if (error.status >= 500) {
              userMessage = 'Error interno del servidor. Inténtalo más tarde.';
            } else if (error.status >= 400) {
              userMessage = `Error en la petición (${error.status}). Contacta con soporte.`;
            }
        }
      }

      // Log detallado en consola para debugging
      console.error('❌ HTTP Error Interceptor:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: userMessage,
        originalError: error
      });

      // Propagar error con mensaje procesado
      return throwError(() => ({
        ...error,
        message: userMessage,
        userMessage // Campo adicional con mensaje para el usuario
      }));
    })
  );
};

