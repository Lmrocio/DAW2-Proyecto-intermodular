// ============================================================================
// COMPONENTE: TOOLTIP
// ============================================================================
// Tooltip accesible con posicionamiento automático
// Implementa eventos de mouse y focus según ClienteFase1

import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
})
export class Tooltip implements OnDestroy {
  // ========================================================================
  // INPUTS
  // ========================================================================

  /** Texto del tooltip */
  @Input() text: string = '';

  /** Posición del tooltip */
  @Input() position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  /** Tiempo de delay antes de mostrar (ms) */
  @Input() delay: number = 200;

  /** Si el tooltip está deshabilitado */
  @Input() disabled: boolean = false;

  // ========================================================================
  // VIEWCHILD - Acceso al DOM
  // ========================================================================

  @ViewChild('tooltipTrigger', { static: false }) triggerElement!: ElementRef;
  @ViewChild('tooltipContent', { static: false }) tooltipContent!: ElementRef;

  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Estado de visibilidad del tooltip */
  showTooltip: boolean = false;

  /** Temporizador para el delay */
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  /** ID único para accesibilidad */
  tooltipId: string = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  // ========================================================================
  // MÉTODOS DE EVENTOS - Implementación de ClienteFase1
  // ========================================================================

  /**
   * Muestra el tooltip al pasar el mouse
   * Implementa eventos mouseenter según ClienteFase1
   */
  onMouseEnter(): void {
    if (this.disabled) return;

    this.clearTimeout();
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.delay);
  }

  /**
   * Oculta el tooltip al salir el mouse
   * Implementa eventos mouseleave según ClienteFase1
   */
  onMouseLeave(): void {
    this.clearTimeout();
    this.hide();
  }

  /**
   * Muestra el tooltip al recibir foco
   * Implementa eventos focus según ClienteFase1
   */
  onFocus(): void {
    if (this.disabled) return;
    this.show();
  }

  /**
   * Oculta el tooltip al perder foco
   * Implementa eventos blur según ClienteFase1
   */
  onBlur(): void {
    this.hide();
  }

  /**
   * Oculta el tooltip al presionar ESC
   */
  @HostListener('keydown.escape')
  onEscapePress(): void {
    this.hide();
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Muestra el tooltip usando Renderer2
   */
  show(): void {
    if (this.disabled || !this.text) return;
    this.showTooltip = true;

    // Aplicar clase con Renderer2
    if (this.tooltipContent) {
      this.renderer.addClass(this.tooltipContent.nativeElement, 'tooltip__content--visible');
    }
  }

  /**
   * Oculta el tooltip
   */
  hide(): void {
    this.showTooltip = false;

    if (this.tooltipContent) {
      this.renderer.removeClass(this.tooltipContent.nativeElement, 'tooltip__content--visible');
    }
  }

  /**
   * Alterna la visibilidad del tooltip
   */
  toggle(): void {
    if (this.showTooltip) {
      this.hide();
    } else {
      this.show();
    }
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /**
   * Limpia el temporizador de delay
   */
  private clearTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
  }

  // ========================================================================
  // GETTERS
  // ========================================================================

  /**
   * Genera las clases CSS del tooltip según su posición
   */
  get tooltipClasses(): string {
    const classes = ['tooltip__content'];
    classes.push(`tooltip__content--${this.position}`);

    if (this.showTooltip) {
      classes.push('tooltip__content--visible');
    }

    return classes.join(' ');
  }
}

