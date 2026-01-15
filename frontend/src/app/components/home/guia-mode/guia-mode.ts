import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, Circle } from 'lucide-angular';

@Component({
  selector: 'app-guia-mode',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './guia-mode.html',
  styleUrl: './guia-mode.scss',
})
export class GuiaMode {
  readonly Sparkles = Sparkles;
  readonly Circle = Circle;

  activateGuiaMode(): void {
    console.log('Activando modo guía');
    // TODO: Implementar activación del modo guía
  }
}

