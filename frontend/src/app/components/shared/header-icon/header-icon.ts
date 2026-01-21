import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de iconos SVG reutilizables para el header
 * Centraliza los iconos para evitar duplicación de código
 */
@Component({
  selector: 'app-header-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Icono de Perfil -->
    <svg *ngIf="icon === 'profile'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="10" r="3"></circle>
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
    </svg>

    <!-- Icono de Modo Guía -->
    <svg *ngIf="icon === 'guide'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>

    <!-- Icono de Luna (Modo Oscuro) -->
    <svg *ngIf="icon === 'moon'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>

    <!-- Icono de Sol (Modo Claro) -->
    <svg *ngIf="icon === 'sun'" [attr.width]="size" [attr.height]="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class HeaderIcon {
  @Input() icon: 'profile' | 'guide' | 'moon' | 'sun' = 'profile';
  @Input() size: number = 24;
}

