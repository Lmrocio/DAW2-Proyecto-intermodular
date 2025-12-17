import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Componente FormTextarea reutilizable
 *
 * Similar a FormInput pero para campos de múltiples líneas
 * Soporta ControlValueAccessor para uso con Reactive Forms
 */
@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormTextarea),
      multi: true
    }
  ]
})
export class FormTextarea implements ControlValueAccessor {
  // Label del campo
  @Input() label: string = '';

  // Placeholder
  @Input() placeholder: string = '';

  // Número de filas visibles
  @Input() rows: number = 4;

  // Indica si el campo es requerido
  @Input() required: boolean = false;

  // Mensaje de error
  @Input() error?: string;

  // Texto de ayuda
  @Input() hint?: string;

  // Valor del textarea
  @Input() value: string = '';

  // Evento de cambio
  @Output() change = new EventEmitter<string>();

  // ID único para asociar label
  id = `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor methods
  onChange = (value: string) => {};
  onTouched = () => {};

  // Escribir valor (desde componente padre)
  writeValue(value: string): void {
    if (value) {
      this.value = value;
    }
  }

  // Registrar cambios
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Registrar cuando el campo es tocado
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Cambiar estado disabled
  setDisabledState?(isDisabled: boolean): void {
      //TODO
  }

  // Manejar cambios en el textarea
  onValueChange(newValue: string): void {
    this.value = newValue;
    this.onChange(newValue);
    this.change.emit(newValue);
  }
}

