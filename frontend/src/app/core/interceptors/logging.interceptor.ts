import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

/**
 * Interceptor funcional para logging de peticiones y respuestas HTTP
 *
 * FASE 5 - Tarea 6: Interceptores HTTP
 * Registra en consola:
 * - Request: método, URL, body
 * - Response: status, tiempo transcurrido
 * - Errors: información detallada del error
 *
 * Solo activo en modo desarrollo (!environment.production)
 *
 * @example
 * // Registrado en app.config.ts:
 * provideHttpClient(
 *   withInterceptors([authInterceptor, errorInterceptor, loggingInterceptor])
 * )
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo loggear en desarrollo
  // TODO: Reemplazar con environment.production cuando esté disponible
  const isDevelopment = true; // !environment.production

  if (!isDevelopment) {
    return next(req);
  }

  const startTime = Date.now();
  const method = req.method;
  const url = req.urlWithParams;

  // Log de la petición
  console.log('🚀 HTTP Request:', {
    method,
    url,
    body: req.body,
    headers: req.headers.keys().map(key => ({ [key]: req.headers.get(key) }))
  });

  return next(req).pipe(
    tap({
      next: (event) => {
        // Solo loggear cuando recibimos la respuesta final
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - startTime;

          console.log('✅ HTTP Response:', {
            method,
            url,
            status: event.status,
            statusText: event.statusText,
            elapsed: `${elapsed}ms`,
            body: event.body
          });
        }
      },
      error: (error) => {
        const elapsed = Date.now() - startTime;

        console.error('❌ HTTP Error:', {
          method,
          url,
          status: error.status,
          statusText: error.statusText,
          elapsed: `${elapsed}ms`,
          message: error.message,
          error
        });
      }
    })
  );
};

