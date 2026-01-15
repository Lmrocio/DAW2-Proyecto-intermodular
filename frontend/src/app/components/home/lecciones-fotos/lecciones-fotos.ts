import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Check, ArrowRight, BookOpen } from 'lucide-angular';

@Component({
  selector: 'app-lecciones-fotos',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './lecciones-fotos.html',
  styleUrl: './lecciones-fotos.scss',
})
export class LeccionesFotos {
  readonly Check = Check;
  readonly ArrowRight = ArrowRight;
  readonly BookOpen = BookOpen;

  benefits = [
    'Aprende a tu ritmo, sin presión',
    'Más de 50 temas explicados con sencillez'
  ];
}

