import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../button/button';
import { SimulatorCardComponent } from '../simulator-card/simulator-card.component';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, SimulatorCardComponent],
  templateUrl: './feature-section.html',
  styleUrl: './feature-section.scss'
})
export class FeatureSectionComponent {
  @Input() variant: 'lecciones' | 'simuladores' = 'lecciones';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() features: string[] = [];
  @Input() cards: Array<{icon: string, label: string}> = [];
  @Input() buttonText: string = '';
  @Input() routerLink: string = '';

  @Output() buttonClick = new EventEmitter<void>();
  @Output() cardClick = new EventEmitter<string>();

  // Características por defecto para la variante 'lecciones'
  private defaultLeccionesFeatures: string[] = [
    'Explicaciones claras con ejemplos visuales',
    'Ejercicios prácticos paso a paso'
  ];

  onButtonClick() {
    this.buttonClick.emit();
  }

  onCardClick(label: string) {
    this.cardClick.emit(label);
  }

  get isLecciones() {
    return this.variant === 'lecciones';
  }

  get isSimuladores() {
    return this.variant === 'simuladores';
  }

  get colorClass() {
    return this.variant === 'lecciones' ? 'orange' : 'blue';
  }

  // Mapeo para nueva API de app-button
  get buttonColor(): 'primary' | 'secondary' | 'accent' {
    return this.variant === 'lecciones' ? 'secondary' : 'accent';
  }

  get buttonVariant(): 'brutal' | 'outline' | 'ghost' | 'nav' {
    return 'brutal';
  }

  // Lista combinada de características (sin duplicados). Si es 'lecciones', concatena
  // las features pasadas por input con las por defecto.
  get combinedFeatures(): string[] {
    if (!this.isLecciones) {
      return this.features || [];
    }

    const provided = this.features || [];
    // Unir manteniendo orden: primero los proporcionados, luego los por defecto que no estén ya
    const set = new Set<string>(provided.map(f => f.trim()).filter(f => f));
    for (const def of this.defaultLeccionesFeatures) {
      if (!set.has(def)) {
        set.add(def);
      }
    }

    return Array.from(set);
  }
}
