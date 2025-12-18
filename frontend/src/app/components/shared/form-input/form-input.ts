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

  /** ID único del input (generado una sola vez) */
  inputId: string;

  /** ID único para el mensaje de error (generado una sola vez) */
  errorId: string;

  /** ID único para el texto de ayuda (generado una sola vez) */
  helpId: string;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor() {
    // Generar IDs únicos UNA SOLA VEZ para evitar ExpressionChangedAfterItHasBeenCheckedError
    const uniqueId = Math.random().toString(36).substr(2, 9);
    this.inputId = `input-${uniqueId}`;
    this.errorId = `error-${uniqueId}`;
    this.helpId = `help-${uniqueId}`;
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


