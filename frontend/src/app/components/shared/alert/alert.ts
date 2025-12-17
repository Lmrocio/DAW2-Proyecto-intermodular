import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Alert reutilizable
 *
 * Variantes: success | error | warning | info
 * Puede cerrarse con botón X
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Mensaje o título
  @Input() message: string = '';

  // Descripción adicional (opcional)
  @Input() description?: string;

  // Mostrar botón de cerrar
  @Input() closeable: boolean = true;

  // Mostrar/ocultar la alerta
  @Input() visible: boolean = true;

  // Evento cuando se cierra
  @Output() close = new EventEmitter<void>();

  // Método para cerrar
  onClose(): void {
    this.visible = false;
    this.close.emit();
  }

  // Obtener icono según tipo
  getIcon(): string {
    switch (this.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  getAlertClasses(): string {
    const classes = ['alert'];
    classes.push(`alert--${this.type}`);
    return classes.join(' ');
  }
}

