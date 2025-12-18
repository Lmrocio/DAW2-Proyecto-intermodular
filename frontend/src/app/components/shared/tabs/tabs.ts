// ============================================================================
// COMPONENTE: TABS
// ============================================================================
// Sistema de pestañas accesible con navegación por teclado
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
 * Interfaz para definir una pestaña
 */
export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs implements AfterViewInit {
  // ========================================================================
  // INPUTS
  // ========================================================================

  /** Lista de pestañas a mostrar */
  @Input() tabs: Tab[] = [];

  /** ID de la pestaña activa inicial */
  @Input() activeTabId: string = '';

  /** Variante visual: default, pills, underline */
  @Input() variant: 'default' | 'pills' | 'underline' = 'default';

  // ========================================================================
  // OUTPUTS
  // ========================================================================

  /** Evento emitido cuando cambia la pestaña activa */
  @Output() tabChange = new EventEmitter<string>();

  // ========================================================================
  // VIEWCHILD - Acceso al DOM
  // ========================================================================

  @ViewChild('tabList', { static: false }) tabList!: ElementRef;

  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Índice de la pestaña con foco actual (para navegación por teclado) */
  private focusedIndex: number = 0;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private renderer: Renderer2) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngAfterViewInit(): void {
    // Establecer la primera pestaña como activa si no se especificó
    if (!this.activeTabId && this.tabs.length > 0) {
      this.activeTabId = this.tabs[0].id;
    }

    // Encontrar el índice inicial
    this.focusedIndex = this.tabs.findIndex(tab => tab.id === this.activeTabId);
    if (this.focusedIndex === -1) this.focusedIndex = 0;
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS - Gestión de eventos
  // ========================================================================

  /**
   * Selecciona una pestaña por su ID
   * Implementa event binding según ClienteFase1
   */
  selectTab(tabId: string, event?: MouseEvent): void {
    const tab = this.tabs.find(t => t.id === tabId);

    // No hacer nada si la pestaña está deshabilitada
    if (tab?.disabled) {
      event?.preventDefault();
      return;
    }

    this.activeTabId = tabId;
    this.focusedIndex = this.tabs.findIndex(t => t.id === tabId);
    this.tabChange.emit(tabId);
  }

  /**
   * Maneja eventos de teclado para navegación accesible
   * Implementa manejo de eventos de teclado según ClienteFase1
   */
  onKeyDown(event: KeyboardEvent): void {
    const enabledTabs = this.tabs.filter(tab => !tab.disabled);

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.moveFocus(-1);
        break;

      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.moveFocus(1);
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstTab();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastTab();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocusedTab();
        break;
    }
  }

  /**
   * Maneja el foco en una pestaña
   */
  onTabFocus(index: number): void {
    this.focusedIndex = index;
  }

  // ========================================================================
  // MÉTODOS PRIVADOS - Navegación por teclado
  // ========================================================================

  /**
   * Mueve el foco a la siguiente o anterior pestaña habilitada
   */
  private moveFocus(direction: number): void {
    const enabledIndexes = this.tabs
      .map((tab, index) => ({ tab, index }))
      .filter(item => !item.tab.disabled)
      .map(item => item.index);

    if (enabledIndexes.length === 0) return;

    const currentPosition = enabledIndexes.indexOf(this.focusedIndex);
    let newPosition = currentPosition + direction;

    // Circular navigation
    if (newPosition < 0) {
      newPosition = enabledIndexes.length - 1;
    } else if (newPosition >= enabledIndexes.length) {
      newPosition = 0;
    }

    this.focusedIndex = enabledIndexes[newPosition];
    this.focusTabByIndex(this.focusedIndex);
  }

  /**
   * Enfoca la primera pestaña habilitada
   */
  private focusFirstTab(): void {
    const firstEnabled = this.tabs.findIndex(tab => !tab.disabled);
    if (firstEnabled !== -1) {
      this.focusedIndex = firstEnabled;
      this.focusTabByIndex(this.focusedIndex);
    }
  }

  /**
   * Enfoca la última pestaña habilitada
   */
  private focusLastTab(): void {
    for (let i = this.tabs.length - 1; i >= 0; i--) {
      if (!this.tabs[i].disabled) {
        this.focusedIndex = i;
        this.focusTabByIndex(i);
        break;
      }
    }
  }

  /**
   * Selecciona la pestaña actualmente enfocada
   */
  private selectFocusedTab(): void {
    const tab = this.tabs[this.focusedIndex];
    if (tab && !tab.disabled) {
      this.selectTab(tab.id);
    }
  }

  /**
   * Enfoca una pestaña por su índice usando Renderer2
   */
  private focusTabByIndex(index: number): void {
    if (this.tabList) {
      const buttons = this.tabList.nativeElement.querySelectorAll('[role="tab"]');
      if (buttons[index]) {
        buttons[index].focus();
      }
    }
  }

  // ========================================================================
  // GETTERS para plantilla
  // ========================================================================

  /**
   * Verifica si una pestaña está activa
   */
  isActive(tabId: string): boolean {
    return this.activeTabId === tabId;
  }

  /**
   * Genera las clases CSS del contenedor de tabs
   */
  get containerClasses(): string {
    return `tabs tabs--${this.variant}`;
  }

  /**
   * Genera las clases CSS para una pestaña específica
   */
  getTabClasses(tab: Tab): string {
    const classes = ['tabs__tab'];

    if (this.isActive(tab.id)) {
      classes.push('tabs__tab--active');
    }

    if (tab.disabled) {
      classes.push('tabs__tab--disabled');
    }

    return classes.join(' ');
  }
}

