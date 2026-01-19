import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente Button reutilizable
 *
 * Variantes: primary | secondary | ghost | danger
 * Tamaños: sm | md (por defecto) | lg
 * Estilos: elevated (con sombra) | flat (sin sombra, por defecto)
 * Estados: normal, hover, focus, active, disabled
 *
 * Puede ser botón (<button>) o enlace (<a> con routerLink)
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Renombrado para evitar colisión con el atributo HTML 'style'
  @Input() btnStyle: 'elevated' | 'flat' = 'flat';

  @Input() disabled: boolean = false;

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  @Input() routerLink: string | any[] | null = null;

  @Output() click = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }

  getButtonClasses(): string {
    const classes = ['button'];

    classes.push(`button--${this.variant}`);

    classes.push(`button--${this.size}`);

    classes.push(`button--${this.btnStyle}`);

    if (this.disabled) {
      classes.push('button--disabled');
    }

    return classes.join(' ');
  }
}
