import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor funcional para añadir headers comunes a todas las peticiones HTTP
 *
 * Headers añadidos:
 * - Content-Type: application/json
 * - X-App-Client: Angular-DWEC (identificador de la aplicación)
 * - Authorization: Bearer <token> (si existe token en localStorage)
 *
 * FASE 5 - Tarea 6: Mejorado para NO añadir token a rutas públicas
 * Rutas excluidas: /login, /register, /public, /auth
 *
 * @example
 * // Registrado en app.config.ts:
 * provideHttpClient(
 *   withInterceptors([authInterceptor, errorInterceptor, loggingInterceptor])
 * )
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Lista de rutas que NO deben incluir el token de autenticación
  const publicRoutes = ['/login', '/register', '/public', '/auth'];

  // Verificar si la URL actual es una ruta pública
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // Inicializar headers comunes (siempre se añaden)
  let headers = req.headers
    .set('Content-Type', 'application/json')
    .set('X-App-Client', 'Angular-DWEC');

  // Solo añadir Authorization header si:
  // 1. Existe un token en localStorage
  // 2. NO es una ruta pública
  if (!isPublicRoute) {
    const token = localStorage.getItem('token');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  }

  // Clonar la petición con los nuevos headers
  const cloned = req.clone({ headers });

  // Continuar con la petición modificada
  return next(cloned);
};

