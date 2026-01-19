import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../button/button';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
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
}
