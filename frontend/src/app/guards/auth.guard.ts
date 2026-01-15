import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren autenticación
 * según FASE_4.md - Tarea 4
 *
 * Si el usuario no está autenticado, redirige a /login
 * conservando la URL original en queryParam 'returnUrl'
 *
 * Uso en app.routes.ts:
 * { path: 'usuario', canActivate: [authGuard], component: ... }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si el usuario está autenticado
  if (authService.isLoggedIn) {
    return true; // Permitir acceso
  }

  // Usuario no autenticado: redirigir a login con returnUrl
  console.warn(`🔒 Acceso denegado a ${state.url}. Redirigiendo a login...`);

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: state.url // Guardar URL original para volver después del login
    }
  });
};

/**
 * Guard para verificar roles específicos (opcional, ejemplo avanzado)
 *
 * Uso:
 * { path: 'admin', canActivate: [roleGuard('admin')], component: ... }
 */
export function roleGuard(requiredRole: string): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn) {
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    if (!authService.hasRole(requiredRole)) {
      console.error(`❌ Acceso denegado: se requiere rol "${requiredRole}"`);
      return router.createUrlTree(['/']); // Redirigir a home
    }

    return true;
  };
}

