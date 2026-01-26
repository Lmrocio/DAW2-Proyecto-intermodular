import { Component } from '@angular/core';
import { OptimizacionRendimientoDemo } from '../../components/shared/optimizacion-rendimiento-demo/optimizacion-rendimiento-demo';

/**
 * Página de Demostración - Optimización de Rendimiento (FASE 6 - Tarea 3)
 *
 * Página dedicada a demostrar las optimizaciones de rendimiento
 * implementadas en la Tarea 3 de FASE 6.
 */
@Component({
  selector: 'app-demo-optimizacion',
  standalone: true,
  imports: [OptimizacionRendimientoDemo],
  template: `
    <div class="demo-page">
      <app-optimizacion-rendimiento-demo></app-optimizacion-rendimiento-demo>
    </div>
  `,
  styles: [`
    .demo-page {
      min-height: 100vh;
      background: linear-gradient(to bottom, #f3f4f6, #ffffff);
      padding: 2rem 0;
    }
  `]
})
export class DemoOptimizacion {}
