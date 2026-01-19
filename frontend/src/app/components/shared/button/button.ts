import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente Button reutilizable - Rediseñado
 *
 * Type: primary (con sombra) | secondary (sin sombra)
 * Variant: blue | orange | yellow | white | google | start | custom
 * Size: small | medium | large
 * Icon: left-arrow | right-arrow | google | user | null
 * Estados: normal, hover, active, disabled
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
  @Input() text: string = '';

  @Input() type: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Input() variant: 'blue' | 'orange' | 'yellow' | 'white' | 'google' | 'start' | 'previous' | 'next' | 'custom' = 'custom';

  @Input() disabled: boolean = false;

  @Input() fullWidth: boolean = false;

  @Input() icon?: 'left-arrow' | 'right-arrow' | 'google' | 'user' | null = null;

  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() label?: string;

  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() buttonType: 'button' | 'submit' | 'reset' = 'button';

  @Input() routerLink: string | any[] | null = null;

  @Output() btnClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.btnClick.emit();
    }
  }

  getButtonClasses(): string {
    const classes = ['button'];

    classes.push(`button--${this.type}`);
    classes.push(`button--${this.variant}`);
    classes.push(`button--${this.size}`);

    if (this.disabled) {
      classes.push('button--disabled');
    }

    if (this.fullWidth) {
      classes.push('button--full-width');
    }

    return classes.join(' ');
  }
}
