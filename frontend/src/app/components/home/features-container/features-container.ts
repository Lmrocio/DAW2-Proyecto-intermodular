import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FeatureSectionComponent } from '../../shared/feature-section/feature-section';

@Component({
  selector: 'app-features-container',
  standalone: true,
  imports: [CommonModule, FeatureSectionComponent],
  templateUrl: './features-container.html',
  styleUrl: './features-container.scss'
})
export class FeaturesContainerComponent {
  constructor(private router: Router) {}

  simulatorCards = [
    {
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>`,
      label: 'Seguro'
    },
    {
      icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
      </svg>`,
      label: 'Infinito'
    }
  ];

  onVerLecciones() {
    this.router.navigate(['/lecciones']);
  }

  onIrSimuladores() {
    this.router.navigate(['/simuladores']);
  }
}
