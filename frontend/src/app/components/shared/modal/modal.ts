// ============================================================================
// COMPONENTE: MODAL
// ============================================================================
// Modal reutilizable con apertura/cierre, backdrop y cierre con ESC
// Implementa manipulación del DOM y gestión de eventos según ClienteFase1

import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal implements AfterViewInit, OnDestroy {
  // ========================================================================
  // INPUTS
  // ========================================================================

  /** Controla si el modal está abierto */
  @Input() isOpen: boolean = false;

  /** Título del modal */
  @Input() title: string = '';

  /** Tamaño del modal: sm, md, lg */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Si se puede cerrar haciendo click en el backdrop */
  @Input() closeOnBackdrop: boolean = true;

  /** Si se puede cerrar con la tecla ESC */
  @Input() closeOnEsc: boolean = true;

  // ========================================================================
  // OUTPUTS
  // ========================================================================

  /** Evento emitido cuando se cierra el modal */
  @Output() closed = new EventEmitter<void>();

  /** Evento emitido cuando se abre el modal */
  @Output() opened = new EventEmitter<void>();

  // ========================================================================
  // VIEWCHILD - Acceso al DOM
  // ========================================================================

  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
  @ViewChild('modalContent', { static: false }) modalContent!: ElementRef;

  // ========================================================================
  // PROPIEDADES PRIVADAS
  // ========================================================================

  private previousActiveElement: HTMLElement | null = null;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private renderer: Renderer2) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngAfterViewInit(): void {
    // El modal se inicializa después de que la vista esté lista
  }

  ngOnDestroy(): void {
    // Restaurar el scroll del body si el modal se destruye mientras está abierto
    this.enableBodyScroll();
  }

  // ========================================================================
  // HOST LISTENERS - Gestión de eventos globales
  // ========================================================================

  /**
   * Cierra el modal al presionar ESC
   * Implementa el requisito de ClienteFase1: cierre con tecla ESC
   */
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.close();
    }
  }

  /**
   * Detecta clicks fuera del modal para cerrar
   * Implementa propagación de eventos según ClienteFase1
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Solo procesar si el modal está abierto y se permite cerrar con backdrop
    if (!this.isOpen || !this.closeOnBackdrop) return;

    // Verificar si el click fue en el backdrop (fuera del contenido del modal)
    if (this.modalContainer && this.modalContent) {
      const clickedInside = this.modalContent.nativeElement.contains(event.target);
      if (!clickedInside) {
        // El click fue en el backdrop
        this.close();
      }
    }
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Abre el modal
   * Utiliza Renderer2 para manipulación segura del DOM
   */
  open(): void {
    // Guardar el elemento activo actual para restaurar el foco después
    this.previousActiveElement = document.activeElement as HTMLElement;

    this.isOpen = true;
    this.disableBodyScroll();
    this.opened.emit();

    // Aplicar animación de entrada usando Renderer2
    setTimeout(() => {
      if (this.modalContainer) {
        this.renderer.addClass(this.modalContainer.nativeElement, 'modal--visible');
      }
    }, 10);
  }

  /**
   * Cierra el modal
   * Restaura el estado del DOM
   */
  close(): void {
    // Animación de salida
    if (this.modalContainer) {
      this.renderer.removeClass(this.modalContainer.nativeElement, 'modal--visible');
    }

    // Esperar a que termine la animación
    setTimeout(() => {
      this.isOpen = false;
      this.enableBodyScroll();
      this.closed.emit();

      // Restaurar el foco al elemento anterior (accesibilidad)
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
    }, 200);
  }

  /**
   * Alterna el estado del modal
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // ========================================================================
  // MÉTODOS DE EVENTOS - Prevenir propagación
  // ========================================================================

  /**
   * Detiene la propagación del click dentro del contenido del modal
   * Evita que el click en el contenido cierre el modal
   */
  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  /**
   * Maneja el click en el backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop) {
      event.preventDefault();
      this.close();
    }
  }

  // ========================================================================
  // MÉTODOS PRIVADOS - Manipulación del DOM con Renderer2
  // ========================================================================

  /**
   * Deshabilita el scroll del body cuando el modal está abierto
   */
  private disableBodyScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  /**
   * Habilita el scroll del body cuando el modal se cierra
   */
  private enableBodyScroll(): void {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  // ========================================================================
  // GETTERS para clases CSS
  // ========================================================================

  /**
   * Genera las clases CSS del modal según su configuración
   */
  get modalClasses(): string {
    const classes = ['modal'];

    if (this.isOpen) {
      classes.push('modal--open');
    }

    classes.push(`modal--${this.size}`);

    return classes.join(' ');
  }
}

