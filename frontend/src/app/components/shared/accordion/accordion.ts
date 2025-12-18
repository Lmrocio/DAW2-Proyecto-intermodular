// ============================================================================
// COMPONENTE: ACCORDION
// ============================================================================
// Acordeón accesible con animaciones y navegación por teclado
// Implementa gestión de eventos según ClienteFase1

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para un item del acordeón
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion implements AfterViewInit {
  // ========================================================================
  // INPUTS
  // ========================================================================

  /** Lista de items del acordeón */
  @Input() items: AccordionItem[] = [];

  /** Permite múltiples items abiertos simultáneamente */
  @Input() allowMultiple: boolean = false;

  /** IDs de los items abiertos inicialmente */
  @Input() expandedIds: string[] = [];

  // ========================================================================
  // OUTPUTS
  // ========================================================================

  /** Evento emitido cuando cambia el estado de un item */
  @Output() itemToggle = new EventEmitter<{ id: string; isExpanded: boolean }>();

  // ========================================================================
  // VIEWCHILD
  // ========================================================================

  @ViewChild('accordionContainer', { static: false }) accordionContainer!: ElementRef;

  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Set de IDs expandidos para búsqueda rápida */
  private expandedSet: Set<string> = new Set();

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private renderer: Renderer2) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngAfterViewInit(): void {
    // Inicializar items expandidos
    this.expandedIds.forEach(id => this.expandedSet.add(id));
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS - Gestión de eventos
  // ========================================================================

  /**
   * Alterna el estado de un item del acordeón
   * Implementa event binding según ClienteFase1
   */
  toggleItem(itemId: string, event?: MouseEvent | KeyboardEvent): void {
    const item = this.items.find(i => i.id === itemId);

    // No hacer nada si el item está deshabilitado
    if (item?.disabled) {
      event?.preventDefault();
      return;
    }

    const isCurrentlyExpanded = this.isExpanded(itemId);

    if (isCurrentlyExpanded) {
      // Colapsar
      this.expandedSet.delete(itemId);
    } else {
      // Expandir
      if (!this.allowMultiple) {
        // Si no permite múltiples, cerrar todos los demás
        this.expandedSet.clear();
      }
      this.expandedSet.add(itemId);
    }

    // Actualizar el array de IDs expandidos
    this.expandedIds = Array.from(this.expandedSet);

    // Emitir evento
    this.itemToggle.emit({
      id: itemId,
      isExpanded: !isCurrentlyExpanded
    });
  }

  /**
   * Maneja eventos de teclado para accesibilidad
   * Implementa manejo de eventos de teclado según ClienteFase1
   */
  onKeyDown(event: KeyboardEvent, itemId: string, index: number): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleItem(itemId, event);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(index + 1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(index - 1);
        break;

      case 'Home':
        event.preventDefault();
        this.focusItem(0);
        break;

      case 'End':
        event.preventDefault();
        this.focusItem(this.items.length - 1);
        break;
    }
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS - Utilidades
  // ========================================================================

  /**
   * Verifica si un item está expandido
   */
  isExpanded(itemId: string): boolean {
    return this.expandedSet.has(itemId);
  }

  /**
   * Expande todos los items
   */
  expandAll(): void {
    if (!this.allowMultiple) return;

    this.items.forEach(item => {
      if (!item.disabled) {
        this.expandedSet.add(item.id);
      }
    });
    this.expandedIds = Array.from(this.expandedSet);
  }

  /**
   * Colapsa todos los items
   */
  collapseAll(): void {
    this.expandedSet.clear();
    this.expandedIds = [];
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /**
   * Enfoca un item por su índice usando Renderer2
   */
  private focusItem(index: number): void {
    // Asegurar que el índice esté dentro de los límites
    if (index < 0) index = this.items.length - 1;
    if (index >= this.items.length) index = 0;

    // Buscar el siguiente item no deshabilitado
    let attempts = 0;
    while (this.items[index]?.disabled && attempts < this.items.length) {
      index = index + 1 >= this.items.length ? 0 : index + 1;
      attempts++;
    }

    if (this.accordionContainer) {
      const buttons = this.accordionContainer.nativeElement.querySelectorAll('.accordion__header');
      if (buttons[index]) {
        buttons[index].focus();
      }
    }
  }

  // ========================================================================
  // GETTERS para plantilla
  // ========================================================================

  /**
   * Genera las clases CSS para un item
   */
  getItemClasses(item: AccordionItem): string {
    const classes = ['accordion__item'];

    if (this.isExpanded(item.id)) {
      classes.push('accordion__item--expanded');
    }

    if (item.disabled) {
      classes.push('accordion__item--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Genera el ID único para el panel de contenido
   */
  getPanelId(itemId: string): string {
    return `accordion-panel-${itemId}`;
  }

  /**
   * Genera el ID único para el header
   */
  getHeaderId(itemId: string): string {
    return `accordion-header-${itemId}`;
  }
}

