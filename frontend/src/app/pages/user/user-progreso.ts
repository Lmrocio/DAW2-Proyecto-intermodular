import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-progreso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-progreso.html',
  styleUrl: './user-progreso.scss'
})
export class UserProgreso {
  lecciones = signal([
    { id: 1, titulo: 'Introducción a la Seguridad Vial', progreso: 100 },
    { id: 2, titulo: 'Señales de Tráfico', progreso: 75 },
    { id: 3, titulo: 'Normas de Circulación', progreso: 30 },
    { id: 4, titulo: 'Conducción Defensiva', progreso: 0 }
  ]);

  get progresoTotal() {
    const total = this.lecciones().reduce((sum, l) => sum + l.progreso, 0);
    return Math.round(total / this.lecciones().length);
  }
}

