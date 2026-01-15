import { CanDeactivateFn } from '@angular/router';
import { FormGroup } from '@angular/forms';

/**
 * Interfaz para componentes que tienen formularios
 * Los componentes que implementen esta interfaz pueden usar pendingChangesGuard
 */
export interface FormComponent {
  form: FormGroup;
}

/**
 * Guard para prevenir salida de formularios con cambios sin guardar
 * según FASE_4.md - Tarea 4
 *
 * Muestra confirmación si el formulario tiene cambios (dirty)
 *
 * Uso en app.routes.ts:
 * {
 *   path: 'perfil/editar',
 *   component: ProfileFormComponent,
 *   canDeactivate: [pendingChangesGuard]
 * }
 *
 * El componente debe:
 * 1. Implementar la interfaz FormComponent
 * 2. Tener una propiedad 'form' de tipo FormGroup
 */
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Si el formulario no tiene cambios, permitir salida
  if (!component.form || !component.form.dirty) {
    return true;
  }

  // Formulario con cambios: solicitar confirmación
  const confirmMessage =
    '⚠️ Hay cambios sin guardar en el formulario.\n\n' +
    '¿Estás seguro de que quieres salir?\n' +
    'Los cambios se perderán.';

  return confirm(confirmMessage);
};

/**
 * Variante más avanzada: permite definir mensaje personalizado por componente
 */
export interface FormComponentWithMessage extends FormComponent {
  canDeactivateMessage?: string;
}

export const pendingChangesGuardWithMessage: CanDeactivateFn<FormComponentWithMessage> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (!component.form || !component.form.dirty) {
    return true;
  }

  const message = component.canDeactivateMessage ||
    'Hay cambios sin guardar. ¿Seguro que quieres salir?';

  return confirm(message);
};

