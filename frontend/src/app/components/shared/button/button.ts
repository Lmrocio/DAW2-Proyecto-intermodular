import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Button reutilizable
 *
 * Variantes: primary | secondary | ghost | danger
 * Tamaños: sm | md (por defecto) | lg
 * Estados: normal, hover, focus, active, disabled
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss'
})
export class Button {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Input() disabled: boolean = false;

  @Input() type: 'button' | 'submit' | 'reset' = 'button';

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

    if (this.disabled) {
      classes.push('button--disabled');
    }

    return classes.join(' ');
  }
}

