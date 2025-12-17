import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * Componente FormSelect reutilizable
 *
 * Dropdown con opciones asociadas
 * Soporta ControlValueAccessor para uso con Reactive Forms
 */
@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelect),
      multi: true
    }
  ]
})
export class FormSelect implements ControlValueAccessor {
  // Label del campo
  @Input() label: string = '';

  // Opciones del select
  @Input() options: SelectOption[] = [];

  // Texto por defecto (placeholder)
  @Input() placeholder: string = 'Selecciona una opción';

  // Indica si el campo es requerido
  @Input() required: boolean = false;

  // Mensaje de error
  @Input() error?: string;

  // Texto de ayuda
  @Input() hint?: string;

  // Valor seleccionado
  @Input() value: string | number = '';

  // Evento de cambio
  @Output() change = new EventEmitter<string | number>();

  // ID único para asociar label
  id = `select-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor methods
  onChange = (value: string | number) => {};
  onTouched = () => {};

  // Escribir valor (desde componente padre)
  writeValue(value: string | number): void {
    if (value !== undefined && value !== null) {
      this.value = value;
    }
  }

  // Registrar cambios
  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  // Registrar cuando el campo es tocado
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Cambiar estado disabled
  setDisabledState?(isDisabled: boolean): void {
    // TODO
  }

  // Manejar cambios en el select
  onValueChange(newValue: string | number): void {
    this.value = newValue;
    this.onChange(newValue);
    this.change.emit(newValue);
  }
}

