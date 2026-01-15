import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-certificados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-certificados.html',
  styleUrl: './user-certificados.scss'
})
export class UserCertificados {
  certificados = signal([
    {
      id: 1,
      curso: 'Curso Básico de Seguridad Vial',
      fecha: '10/01/2024',
      estado: 'completado'
    },
    {
      id: 2,
      curso: 'Señalización Avanzada',
      fecha: '-',
      estado: 'en-progreso'
    }
  ]);
}

