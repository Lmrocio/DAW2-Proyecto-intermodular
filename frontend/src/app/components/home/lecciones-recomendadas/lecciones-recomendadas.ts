import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../shared/button/button';

interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  categoriaColor: 'yellow' | 'orange' | 'blue';
  icono: string;
  iconoFondo: 'yellow' | 'orange' | 'blue';
}

@Component({
  selector: 'app-lecciones-recomendadas',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './lecciones-recomendadas.html',
  styleUrl: './lecciones-recomendadas.scss',
})
export class LeccionesRecomendadas {

  lecciones: Leccion[] = [
    {
      id: 1,
      titulo: 'Mi primer móvil',
      descripcion: 'Encendido, botones principales y cómo ver tus mensajes de forma clara.',
      categoria: 'Básico',
      categoriaColor: 'yellow',
      icono: 'smartphone',
      iconoFondo: 'orange'
    },
    {
      id: 2,
      titulo: 'WhatsApp y fotos',
      descripcion: 'Cómo enviar audios, fotos y hacer videollamadas familiares con facilidad.',
      categoria: 'Comunicación',
      categoriaColor: 'orange',
      icono: 'chat',
      iconoFondo: 'yellow'
    },
    {
      id: 3,
      titulo: 'Internet Seguro',
      descripcion: 'Evita engaños y navega con total tranquilidad hoy mismo por la red.',
      categoria: 'Seguridad',
      categoriaColor: 'blue',
      icono: 'lock',
      iconoFondo: 'blue'
    }
  ];
}

