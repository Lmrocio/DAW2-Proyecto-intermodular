import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

// Tipos estrictos y documentados
export type ButtonVariant = 'brutal' | 'outline' | 'ghost' | 'nav';
export type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'accent' | 'error' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Componente Button reutilizable - Refactorizado según Neo-Brutalismo
 *
 * CARACTERÍSTICAS:
 * - Polimorfismo: renderiza <button> o <a> según input 'link'
 * - Variantes: 'brutal' (sombra neo-brutalista), 'outline', 'ghost', 'nav'
 * - Colores: 'primary', 'secondary', 'tertiary', 'accent', 'error', 'success'
 * - Tamaños: 'sm' (40px), 'md' (48px), 'lg' (56px) - optimizados para personas mayores
 * - Iconos: integración con lucide-angular
 * - Accesibilidad: aria-label automático, :focus-visible mejorado, áreas táctiles generosas
 * - Signals: computed() para reactividad
 * - Sintaxis Angular 17+: @if, standalone
 *
 * @example
 * <app-button
 *   text="Guardar"
 *   variant="brutal"
 *   color="primary"
 *   size="lg"
 *   icon="save"
 *   (btnClick)="onSave()"
 * />
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class Button {
  // ==========================================================================
  // INPUTS - Tipado estricto y moderno
  // ==========================================================================

  /** Texto del botón */
  @Input() text: string = '';

  /** Si se proporciona, renderiza <a [routerLink]> en vez de <button> */
  @Input() link: string | any[] | null = null;

  /** Variante visual: brutal (sombra 4px), outline, ghost, nav */
  @Input() variant: ButtonVariant = 'brutal';

  /** Color semántico del botón */
  @Input() color: ButtonColor = 'primary';

  /** Tamaño: sm (40px), md (48px), lg (56px) */
  @Input() size: ButtonSize = 'md';

  /** Nombre del icono de Lucide (ej: 'arrow-left', 'user', 'play') */
  @Input() icon: string | null = null;

  /** Posición del icono respecto al texto */
  @Input() iconPosition: 'left' | 'right' = 'left';

  /** Estado deshabilitado */
  @Input() disabled: boolean = false;

  /** Ancho completo (100%) */
  @Input() fullWidth: boolean = false;

  /** Tipo de botón HTML (solo para <button>) */
  @Input() buttonType: ButtonType = 'button';

  /** Aria-label personalizado (automático si solo icono) */
  @Input() ariaLabel?: string;

  /** Clases CSS adicionales */
  @Input() extraClass?: string;

  // ==========================================================================
  // OUTPUTS
  // ==========================================================================

  /** Emitido cuando el usuario hace clic en el botón (no emite si disabled) */
  @Output() btnClick = new EventEmitter<void>();

  // ==========================================================================
  // SIGNALS - Estado reactivo (Angular 17+)
  // ==========================================================================

  /** Signal: determina si es solo icono (sin texto visible) */
  isIconOnly = computed(() => !this.text || this.text.trim() === '');

  /** Signal: clases CSS computadas dinámicamente */
  buttonClasses = computed(() => {
    const classes = ['button'];

    // Variante
    classes.push(`button--${this.variant}`);

    // Color
    classes.push(`button--${this.color}`);

    // Tamaño
    classes.push(`button--${this.size}`);

    // Estados
    if (this.disabled) classes.push('button--disabled');
    if (this.fullWidth) classes.push('button--full-width');
    if (this.isIconOnly()) classes.push('button--icon-only');

    // Extra
    if (this.extraClass) classes.push(this.extraClass);

    return classes.join(' ');
  });

  /** Signal: aria-label efectivo (automático si solo icono) */
  effectiveAriaLabel = computed(() => {
    if (this.ariaLabel) return this.ariaLabel;
    if (this.isIconOnly() && this.icon) {
      // Generar label automático desde nombre del icono
      return this.icon.replace(/-/g, ' ');
    }
    return undefined;
  });

  // ==========================================================================
  // MÉTODOS
  // ==========================================================================

  /**
   * Handler del click - solo emite si no está disabled
   */
  onClick(event?: Event): void {
    if (this.disabled) {
      event?.preventDefault();
      event?.stopPropagation();
      return;
    }
    this.btnClick.emit();
  }

  /**
   * Determina si debe renderizar como enlace
   */
  get isLink(): boolean {
    return this.link !== null && this.link !== undefined;
  }
}
