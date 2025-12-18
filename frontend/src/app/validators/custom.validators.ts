// ============================================================================
// VALIDADORES PERSONALIZADOS - ClienteFase3
// ============================================================================
// Validadores síncronos para formularios reactivos

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// ============================================================================
// VALIDADOR: CONTRASEÑA FUERTE
// ============================================================================
/**
 * Valida que la contraseña tenga:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const errors: ValidationErrors = {};

    if (value.length < 8) {
      errors['minLength'] = { required: 8, actual: value.length };
    }
    if (!/[A-Z]/.test(value)) {
      errors['noUppercase'] = true;
    }
    if (!/[a-z]/.test(value)) {
      errors['noLowercase'] = true;
    }
    if (!/\d/.test(value)) {
      errors['noNumber'] = true;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors['noSpecial'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  };
}

// ============================================================================
// VALIDADOR: CONFIRMACIÓN DE CONTRASEÑA
// ============================================================================
/**
 * Valida que dos campos de contraseña coincidan (cross-field validation)
 */
export function passwordMatch(passwordField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField);
    const confirm = group.get(confirmField);

    if (!password || !confirm) return null;
    if (!confirm.value) return null;

    return password.value === confirm.value ? null : { passwordMismatch: true };
  };
}

// ============================================================================
// VALIDADOR: NIF ESPAÑOL
// ============================================================================
/**
 * Valida el formato y letra de control del NIF español
 * Formato: 8 dígitos + letra (ej: 12345678Z)
 */
export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toUpperCase().trim();
    if (!value) return null;

    // Letras válidas para el NIF según el algoritmo oficial
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    // Formato básico: 8 dígitos + 1 letra
    const nifRegex = /^[0-9]{8}[A-Z]$/;
    if (!nifRegex.test(value)) {
      return { invalidNif: { message: 'Formato incorrecto: 8 dígitos + 1 letra (ej: 12345678Z)' } };
    }

    // Validar letra de control
    const number = parseInt(value.substring(0, 8), 10);
    const letterProvided = value.charAt(8);
    const expectedLetter = validLetters.charAt(number % 23);

    if (letterProvided !== expectedLetter) {
      return {
        invalidNif: {
          message: `Letra incorrecta. Para ${value.substring(0, 8)} debería ser "${expectedLetter}"`
        }
      };
    }

    return null;
  };
}

// ============================================================================
// VALIDADOR: TELÉFONO ESPAÑOL
// ============================================================================
/**
 * Valida teléfono móvil español (empieza por 6 o 7, 9 dígitos total)
 */
export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const cleanValue = value.replace(/\s/g, ''); // Quitar espacios
    const telefonoRegex = /^[67]\d{8}$/;

    return telefonoRegex.test(cleanValue)
      ? null
      : { invalidTelefono: { message: 'Debe empezar por 6 o 7 y tener 9 dígitos' } };
  };
}

// ============================================================================
// VALIDADOR: CÓDIGO POSTAL ESPAÑOL
// ============================================================================
/**
 * Valida código postal español (5 dígitos, 01-52)
 */
export function codigoPostalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const cpRegex = /^\d{5}$/;
    if (!cpRegex.test(value)) {
      return { invalidCP: { message: 'Debe tener 5 dígitos' } };
    }

    // Validar que la provincia sea válida (01-52)
    const provincia = parseInt(value.substring(0, 2), 10);
    if (provincia < 1 || provincia > 52) {
      return { invalidCP: { message: 'Provincia inválida (01-52)' } };
    }

    return null;
  };
}

// ============================================================================
// VALIDADOR: EMAIL FORMATO
// ============================================================================
/**
 * Validador de email más estricto que el de Angular
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : { invalidEmail: true };
  };
}

// ============================================================================
// VALIDADOR: AL MENOS UNO REQUERIDO (Cross-field)
// ============================================================================
/**
 * Valida que al menos uno de los campos especificados tenga valor
 */
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => {
      const control = group.get(field);
      return control && control.value && control.value.trim() !== '';
    });

    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}

// ============================================================================
// VALIDADOR: RANGO DE FECHAS
// ============================================================================
/**
 * Valida que la fecha de fin sea posterior a la fecha de inicio
 */
export function dateRange(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField);
    const end = group.get(endField);

    if (!start?.value || !end?.value) return null;

    const startDate = new Date(start.value);
    const endDate = new Date(end.value);

    return endDate > startDate ? null : { invalidDateRange: true };
  };
}

// ============================================================================
// VALIDADOR: EDAD MÍNIMA
// ============================================================================
/**
 * Valida que la fecha de nacimiento corresponda a una edad mínima
 */
export function minAge(minYears: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= minYears ? null : { minAge: { required: minYears, actual: age } };
  };
}

