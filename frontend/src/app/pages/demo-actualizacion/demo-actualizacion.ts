import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualizacionDinamicaDemo } from '../../components/shared/actualizacion-dinamica-demo/actualizacion-dinamica-demo';

/**
 * Página de Demostración - Actualización Dinámica (FASE 6)
 *
 * Página dedicada a demostrar las funcionalidades de actualización
 * dinámica sin recargas implementadas en la Tarea 1 de FASE 6.
 */
@Component({
  selector: 'app-demo-actualizacion',
  standalone: true,
  imports: [CommonModule, ActualizacionDinamicaDemo],
  template: `
    <div class="demo-page">
      <ng-container *ngComponentOutlet="demoComponent"></ng-container>
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
export class DemoActualizacion {
  demoComponent = ActualizacionDinamicaDemo;
}

