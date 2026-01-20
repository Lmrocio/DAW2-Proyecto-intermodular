// ============================================================================
// COMPONENTE: TOOLTIP
// ============================================================================
// Tooltip accesible con posicionamiento automático
// Implementa eventos de mouse y focus según ClienteFase1
// IMPLEMENTA: @HostListener('window:resize') (Requisito 2.4)
// IMPLEMENTA: focusin/focusout events (Requisito 2.2 y 3.5)

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

  /** Tiempo de delay antes de ocultar (ms) - Configurable según Requisito 3.5 */
  @Input() hideDelay: number = 100;

  /** Si el tooltip está deshabilitado */
  @Input() disabled: boolean = false;

  /** Variant para estilos tipo burbuja: 'bubble' usa dimensiones y punta */
  @Input() bubble: boolean = false;

  /** Tipo semántico para burbujas (success/error/info/warning) */
  @Input() variant: 'success' | 'error' | 'info' | 'warning' | null = null;

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

  /** Temporizador para el delay de mostrar */
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  /** Temporizador para el delay de ocultar */
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  /** ID único para accesibilidad */
  tooltipId: string = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  /** Posición actual calculada dinámicamente */
  private currentPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnDestroy(): void {
    this.clearTimeouts();
  }

  // ========================================================================
  // HOST LISTENERS - Eventos globales
  // ========================================================================

  /**
   * Oculta el tooltip al presionar ESC
   */
  @HostListener('keydown.escape')
  onEscapePress(): void {
    this.hide();
  }

  /**
   * Reposiciona el tooltip cuando cambia el tamaño de la ventana
   * IMPLEMENTA: @HostListener('window:resize') según Requisito 2.4
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.showTooltip) return;

    // Recalcular posición cuando la ventana cambia de tamaño
    this.calculateDynamicPosition();

    console.log(`💬 Tooltip: window:resize detectado - reposicionando tooltip`);
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

    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      this.show();
    }, this.delay);
  }

  /**
   * Oculta el tooltip al salir el mouse
   * Implementa eventos mouseleave según ClienteFase1
   * IMPLEMENTA: hideDelay configurable según Requisito 3.5
   */
  onMouseLeave(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  }

  /**
   * Muestra el tooltip al recibir foco
   * IMPLEMENTA: eventos focusin según Requisito 2.2 y 3.5
   */
  onFocusIn(): void {
    if (this.disabled) return;
    this.clearTimeouts();
    this.show();
    console.log('💬 Tooltip: focusin - mostrando tooltip');
  }

  /**
   * Oculta el tooltip al perder foco
   * IMPLEMENTA: eventos focusout según Requisito 2.2 y 3.5
   */
  onFocusOut(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelay);
    console.log('💬 Tooltip: focusout - ocultando tooltip');
  }

  /**
   * Alias para compatibilidad - Muestra el tooltip al recibir foco
   * Implementa eventos focus según ClienteFase1
   */
  onFocus(): void {
    this.onFocusIn();
  }

  /**
   * Alias para compatibilidad - Oculta el tooltip al perder foco
   * Implementa eventos blur según ClienteFase1
   */
  onBlur(): void {
    this.onFocusOut();
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Muestra el tooltip usando Renderer2
   * IMPLEMENTA: Posicionamiento dinámico según Requisito 3.5
   */
  show(): void {
    if (this.disabled || !this.text) return;

    // Calcular posición dinámica antes de mostrar
    this.calculateDynamicPosition();

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
   * Limpia todos los temporizadores
   */
  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Calcula la posición dinámica del tooltip basándose en el espacio disponible
   * IMPLEMENTA: Posicionamiento dinámico (top/bottom/left/right) según Requisito 3.5
   */
  private calculateDynamicPosition(): void {
    if (!this.triggerElement || !this.tooltipContent) {
      this.currentPosition = this.position;
      return;
    }

    const triggerRect = this.triggerElement.nativeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Espacio disponible en cada dirección
    const spaceTop = triggerRect.top;
    const spaceBottom = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    // Decidir posición óptima
    let newPosition = this.position;

    switch (this.position) {
      case 'top':
        if (spaceTop < 60 && spaceBottom > spaceTop) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (spaceBottom < 60 && spaceTop > spaceBottom) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (spaceLeft < 100 && spaceRight > spaceLeft) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (spaceRight < 100 && spaceLeft > spaceRight) {
          newPosition = 'left';
        }
        break;
    }

    this.currentPosition = newPosition;

    // Actualizar clases CSS si la posición cambió
    if (this.tooltipContent) {
      // Remover clases de posición anteriores
      ['top', 'bottom', 'left', 'right'].forEach(pos => {
        this.renderer.removeClass(this.tooltipContent.nativeElement, `tooltip__content--${pos}`);
      });
      // Añadir nueva clase de posición
      this.renderer.addClass(this.tooltipContent.nativeElement, `tooltip__content--${this.currentPosition}`);
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
    classes.push(`tooltip__content--${this.currentPosition || this.position}`);

    if (this.showTooltip) {
      classes.push('tooltip__content--visible');
    }

    if (this.bubble) {
      classes.push('tooltip__content--bubble');
      if (this.variant) {
        classes.push(`tooltip--${this.variant}`);
      }
    }

    return classes.join(' ');
  }
}

