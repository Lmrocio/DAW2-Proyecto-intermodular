import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  nivelColor: string;
  imagen: string;
}

@Component({
  selector: 'app-lecciones-recomendadas',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './lecciones-recomendadas.html',
  styleUrl: './lecciones-recomendadas.scss',
})
export class LeccionesRecomendadas {
  readonly ArrowRight = ArrowRight;

  lecciones: Leccion[] = [
    {
      id: 1,
      titulo: 'Mi primer teléfono inteligente',
      descripcion: 'Aprende lo básico para usar tu smartphone desde cero. Llamadas, mensajes y más.',
      nivel: 'Nivel Inicial',
      nivelColor: 'green',
      imagen: 'assets/images/imagen-3.svg'
    },
    {
      id: 2,
      titulo: 'WhatsApp para principiantes',
      descripcion: 'Envía mensajes, fotos y videollamadas a tus seres queridos de forma sencilla.',
      nivel: 'Comunicación',
      nivelColor: 'blue',
      imagen: 'assets/images/imagen-4.svg'
    },
    {
      id: 3,
      titulo: 'Navega seguro por Internet',
      descripcion: 'Protege tus datos y aprende a identificar sitios seguros mientras navegas.',
      nivel: 'Seguridad',
      nivelColor: 'orange',
      imagen: 'assets/images/imagen-5.svg'
    }
  ];
}

