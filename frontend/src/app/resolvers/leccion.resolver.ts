import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Leccion, LeccionService } from '../services/leccion.service';

/**
 * Interfaz para resultado del resolver
 * Incluye manejo de estados: loading, error, data
 */
export interface LeccionResolved {
  loading: boolean;
  error?: string;
  data?: Leccion | null;
}

/**
 * Resolver para precargar datos de lección antes de activar ruta
 * según FASE_4.md - Tarea 5
 */
export const leccionResolver: ResolveFn<Leccion | null> = (route) => {
  const leccionService = inject(LeccionService);
  const router = inject(Router);

  // Obtener ID desde parámetros de ruta
  const id = route.paramMap.get('id');

  if (!id) {
    console.error('❌ leccionResolver: No se proporcionó ID');
    router.navigate(['/lecciones'], {
      state: { error: 'No se especificó el ID de la lección' }
    });
    return of(null);
  }

  console.log(`🔄 leccionResolver: Resolviendo lección ${id}...`);

  // Llamar al servicio y manejar errores
  return leccionService.getLeccionById(id).pipe(
    catchError(err => {
      console.error(`❌ leccionResolver: Error al cargar lección ${id}:`, err);

      // Redirigir a lista de lecciones con mensaje de error en state
      router.navigate(['/lecciones'], {
        state: {
          error: `No se pudo cargar la lección con ID ${id}. Puede que no exista o haya un error de conexión.`
        }
      });

      // Retornar null para que la navegación no falle completamente
      return of(null);
    })
  );
};
