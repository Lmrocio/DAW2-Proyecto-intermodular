import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  // ========================================================================
  // PROPIEDADES @Input - Configuración del componente
  // ========================================================================

  /** Etiqueta (label) del campo */
  @Input() label: string = '';

  /** Tipo de input (text, email, password, tel, etc.) */
  @Input() inputType: string = 'text';

  /** Atributo 'name' del input */
  @Input() inputName: string = '';

  /** Placeholder del input */
  @Input() placeholder: string = '';

  /** Indica si el campo es requerido */
  @Input() required: boolean = false;

  /** Valor actual del input */
  @Input() value: string = '';

  /** Mensaje de error a mostrar */
  @Input() errorMessage: string = '';

  /** Indica si hay error en el campo */
  @Input() hasError: boolean = false;

  /** Texto de ayuda/hint para el usuario */
  @Input() helpText: string = '';

  // ========================================================================
  // PROPIEDADES @Output - Eventos emitidos por el componente
  // ========================================================================

  /** Emite el valor del input cuando cambia */
  @Output() valueChange = new EventEmitter<string>();

  // ========================================================================
  // PROPIEDADES INTERNAS
  // ========================================================================

  /** ID único del input (para vincular label) */
  get inputId(): string {
    return `input-${this.inputName}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /** ID único para el mensaje de error */
  get errorId(): string {
    return `error-${this.inputName}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /** ID único para el texto de ayuda */
  get helpId(): string {
    return `help-${this.inputName}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ========================================================================
  // MÉTODOS
  // ========================================================================

  /**
   * Maneja los cambios en el input
   * Emite el nuevo valor al componente padre
   */
  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.valueChange.emit(this.value);
  }
}


