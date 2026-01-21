// ============================================================================
// COMPONENTE: TOAST - ClienteFase2
// ============================================================================
// Notificaciones que se cierran AUTOMÁTICAMENTE después de X segundos
// IMPLEMENTA: Creación y eliminación de elementos DOM con Renderer2 (Requisito 1.3)
// Usa: renderer.createElement, renderer.appendChild, renderer.removeChild

import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../../services/toast.service';

/**
 * Interfaz para elementos de toast creados dinámicamente
 */
interface ToastElement {
  id: number;
  element: HTMLElement;
  timeout: ReturnType<typeof setTimeout> | null;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit, OnDestroy {

  /** Toast actual a mostrar (para compatibilidad con template) */
  currentToast: ToastMessage | null = null;

  /** Estado de cierre para animación */
  isClosing = false;

  /** Timeout para auto-cerrar */
  private autoCloseTimeout: any = null;

  /** Suscripción al servicio */
  private subscription?: Subscription;

  /** Indica si estamos en el navegador */
  private isBrowser: boolean;

  /** Contenedor de toasts creado dinámicamente */
  private toastContainer: HTMLElement | null = null;

  /** Lista de toasts activos creados con Renderer2 */
  private activeToasts: ToastElement[] = [];

  constructor(
    private toastService: ToastService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    console.log('🔔 Toast Component: ngOnInit - Suscribiéndose al servicio');

    // Crear contenedor de toasts usando Renderer2 (Requisito 1.3)
    this.createToastContainer();

    this.subscription = this.toastService.toast$.subscribe(toast => {
      console.log('🔔 Toast Component: Recibido del servicio:', toast);

      // Si hay un toast anterior, cancelar su timeout
      this.cancelAutoClose();

      if (toast) {
        // Crear toast dinámicamente con Renderer2 (Requisito 1.3)
        this.createToastElement(toast);

        // Mantener compatibilidad con template
        this.isClosing = false;
        this.currentToast = toast;

        // Configurar auto-cierre - SIEMPRE se cierra solo
        const duration = toast.duration > 0 ? toast.duration : 3000;
        console.log(`🔔 Toast Component: Mostrando toast, se cerrará en ${duration}ms`);

        this.autoCloseTimeout = setTimeout(() => {
          console.log('🔔 Toast Component: AUTO-CERRANDO AHORA');
          this.close();
        }, duration);
      } else {
        console.log('🔔 Toast Component: Toast es null, ocultando');
        this.currentToast = null;
        this.isClosing = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelAutoClose();
    this.subscription?.unsubscribe();

    // Limpiar todos los toasts creados dinámicamente (Requisito 1.3 - limpieza en ngOnDestroy)
    this.cleanupAllToasts();

    // Eliminar contenedor de toasts
    this.removeToastContainer();
  }

  /**
   * Crea el contenedor de toasts dinámicamente usando Renderer2
   * IMPLEMENTA: renderer.createElement y renderer.appendChild (Requisito 1.3)
   */
  private createToastContainer(): void {
    if (!this.isBrowser) return;

    // Crear elemento div para el contenedor usando Renderer2
    this.toastContainer = this.renderer.createElement('div');

    // Configurar atributos y clases
    this.renderer.addClass(this.toastContainer, 'toast-container');
    this.renderer.addClass(this.toastContainer, 'toast-container--dynamic');
    this.renderer.setAttribute(this.toastContainer, 'aria-live', 'polite');
    this.renderer.setAttribute(this.toastContainer, 'aria-atomic', 'true');

    // Aplicar estilos de posicionamiento
    this.renderer.setStyle(this.toastContainer, 'position', 'fixed');
    this.renderer.setStyle(this.toastContainer, 'top', '1rem');
    this.renderer.setStyle(this.toastContainer, 'right', '1rem');
    this.renderer.setStyle(this.toastContainer, 'zIndex', '9999');
    this.renderer.setStyle(this.toastContainer, 'display', 'flex');
    this.renderer.setStyle(this.toastContainer, 'flexDirection', 'column');
    this.renderer.setStyle(this.toastContainer, 'gap', '0.5rem');

    // Añadir al body usando Renderer2.appendChild
    this.renderer.appendChild(document.body, this.toastContainer);

    console.log('🔔 Toast: Contenedor creado con Renderer2.createElement y appendChild');
  }

  /**
   * Elimina el contenedor de toasts usando Renderer2
   * IMPLEMENTA: renderer.removeChild (Requisito 1.3)
   */
  private removeToastContainer(): void {
    if (!this.isBrowser || !this.toastContainer) return;

    // Eliminar del DOM usando Renderer2.removeChild
    this.renderer.removeChild(document.body, this.toastContainer);
    this.toastContainer = null;

    console.log('🔔 Toast: Contenedor eliminado con Renderer2.removeChild');
  }

  /**
   * Crea un elemento de toast dinámicamente usando Renderer2
   * IMPLEMENTA: renderer.createElement, appendChild, setStyle, addClass (Requisito 1.3)
   */
  private createToastElement(toast: ToastMessage): void {
    if (!this.isBrowser || !this.toastContainer) return;

    // Crear elemento principal del toast
    const toastEl = this.renderer.createElement('div');
    this.renderer.addClass(toastEl, 'toast');
    this.renderer.addClass(toastEl, 'toast--dynamic');
    this.renderer.addClass(toastEl, `toast--${toast.type}`);
    this.renderer.setAttribute(toastEl, 'role', 'alert');
    this.renderer.setAttribute(toastEl, 'data-toast-id', String(toast.id));

    // Crear icono
    const iconEl = this.renderer.createElement('span');
    this.renderer.addClass(iconEl, 'toast__icon');
    this.renderer.setAttribute(iconEl, 'aria-hidden', 'true');
    // Usar Material Symbols dentro del iconEl
    const iconInner = this.renderer.createElement('span');
    this.renderer.addClass(iconInner, 'material-symbols-outlined');
    const iconName = this.getIconForType(toast.type);
    const iconInnerText = this.renderer.createText(iconName);
    this.renderer.appendChild(iconInner, iconInnerText);
    this.renderer.appendChild(iconEl, iconInner);

    // Crear mensaje
    const messageEl = this.renderer.createElement('span');
    this.renderer.addClass(messageEl, 'toast__message');
    const messageText = this.renderer.createText(toast.message);
    this.renderer.appendChild(messageEl, messageText);

    // Crear botón de cerrar
    const closeBtn = this.renderer.createElement('button');
    this.renderer.addClass(closeBtn, 'toast__close');
    this.renderer.setAttribute(closeBtn, 'type', 'button');
    this.renderer.setAttribute(closeBtn, 'aria-label', 'Cerrar notificación');
    const closeBtnText = this.renderer.createText('×');
    this.renderer.appendChild(closeBtn, closeBtnText);

    // Añadir event listener al botón de cerrar
    this.renderer.listen(closeBtn, 'click', () => {
      this.removeToastElement(toast.id);
    });

    // Ensamblar el toast
    this.renderer.appendChild(toastEl, iconEl);
    this.renderer.appendChild(toastEl, messageEl);
    this.renderer.appendChild(toastEl, closeBtn);

    // Añadir al contenedor
    this.renderer.appendChild(this.toastContainer, toastEl);

    // Crear timeout para auto-cierre
    const duration = toast.duration > 0 ? toast.duration : 3000;
    const timeout = setTimeout(() => {
      this.removeToastElement(toast.id);
    }, duration);

    // Guardar referencia para limpieza posterior
    this.activeToasts.push({
      id: toast.id,
      element: toastEl,
      timeout
    });

    console.log(`🔔 Toast: Elemento creado dinámicamente con Renderer2 (ID: ${toast.id})`);
  }

  /**
   * Elimina un toast específico usando Renderer2
   * IMPLEMENTA: renderer.removeChild (Requisito 1.3)
   */
  private removeToastElement(toastId: number): void {
    if (!this.isBrowser || !this.toastContainer) return;

    const toastIndex = this.activeToasts.findIndex(t => t.id === toastId);
    if (toastIndex === -1) return;

    const toastData = this.activeToasts[toastIndex];

    // Cancelar timeout si existe
    if (toastData.timeout) {
      clearTimeout(toastData.timeout);
    }

    // Añadir clase de animación de salida
    this.renderer.addClass(toastData.element, 'toast--closing');

    // Eliminar del DOM después de la animación
    setTimeout(() => {
      if (this.toastContainer && toastData.element.parentNode === this.toastContainer) {
        this.renderer.removeChild(this.toastContainer, toastData.element);
        console.log(`🔔 Toast: Elemento eliminado con Renderer2.removeChild (ID: ${toastId})`);
      }
    }, 300);

    // Eliminar de la lista de activos
    this.activeToasts.splice(toastIndex, 1);
  }

  /**
   * Limpia todos los toasts activos
   * IMPLEMENTA: Limpieza correcta en ngOnDestroy (Requisito 1.3)
   */
  private cleanupAllToasts(): void {
    this.activeToasts.forEach(toast => {
      if (toast.timeout) {
        clearTimeout(toast.timeout);
      }
      if (this.toastContainer && toast.element.parentNode === this.toastContainer) {
        this.renderer.removeChild(this.toastContainer, toast.element);
      }
    });
    this.activeToasts = [];
    console.log('🔔 Toast: Todos los toasts limpiados en ngOnDestroy');
  }

  /**
   * Obtiene el icono según el tipo de toast
   */
  private getIconForType(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'close',
      info: 'campaign',
      warning: 'priority_high'
    };
    return icons[type] || 'info';
  }

  /** Cierra el toast con animación */
  close(): void {
    console.log('🔔 Toast Component: close() llamado - iniciando animación de cierre');
    this.isClosing = true;

    // Después de la animación, quitar el toast
    setTimeout(() => {
      console.log('🔔 Toast Component: Animación completada - ocultando toast');
      this.currentToast = null;
      this.isClosing = false;
    }, 300);

    this.cancelAutoClose();
  }

  /** Cancela el timeout de auto-cierre */
  private cancelAutoClose(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  /** Obtiene el icono según el tipo */
  getIcon(): string {
    if (!this.currentToast) return 'info';
    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'close',
      info: 'campaign',
      warning: 'priority_high'
    };
    return icons[this.currentToast.type] || 'info';
  }
}

