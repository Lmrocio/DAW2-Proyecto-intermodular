import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Clock, Star } from 'lucide-angular';

export interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  duracion: string;
  imagen: string;
  valoracion?: number;
  completado?: boolean;
}

@Component({
  selector: 'app-leccion-card',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './leccion-card.html',
  styleUrl: './leccion-card.scss',
})
export class LeccionCard {
  readonly Clock = Clock;
  readonly Star = Star;

  @Input() leccion!: Leccion;

  get nivelColor(): string {
    const colors: { [key: string]: string } = {
      'Principiante': 'green',
      'Intermedio': 'blue',
      'Avanzado': 'orange'
    };
    return colors[this.leccion.nivel] || 'green';
  }
}

