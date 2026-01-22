import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Simulador, SimuladorService } from '../services/simulador.service';

/**
 * Resolver para precargar datos de simulador antes de activar ruta
 * Similar a leccionResolver pero para simuladores
 */
export const simuladorResolver: ResolveFn<Simulador | null> = (route) => {
  const simuladorService = inject(SimuladorService);
  const router = inject(Router);

  // Obtener ID desde parámetros de ruta
  const id = route.paramMap.get('id');

  if (!id) {
    console.error('❌ simuladorResolver: No se proporcionó ID');
    router.navigate(['/simuladores'], {
      state: { error: 'No se especificó el ID del simulador' }
    });
    return of(null);
  }

  console.log(`🔄 simuladorResolver: Resolviendo simulador ${id}...`);

  // Llamar al servicio y manejar errores
  return simuladorService.getSimuladorById(id).pipe(
    catchError(err => {
      console.error(`❌ simuladorResolver: Error al cargar simulador ${id}:`, err);

      // Redirigir a lista de simuladores con mensaje de error en state
      router.navigate(['/simuladores'], {
        state: {
          error: `No se pudo cargar el simulador con ID ${id}. Puede que no exista o haya un error de conexión.`
        }
      });

      // Retornar null para que la navegación no falle completamente
      return of(null);
    })
  );
};
