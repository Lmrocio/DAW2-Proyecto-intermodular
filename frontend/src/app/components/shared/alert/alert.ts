// ============================================================================
// COMPONENTE: ALERT - ClienteFase1
// ============================================================================
// Componente Alert reutilizable con creación/eliminación dinámica de elementos
// IMPLEMENTA: Creación y eliminación de elementos DOM con Renderer2 (Requisito 1.3)
// Usa: renderer.createElement, renderer.appendChild, renderer.removeChild

import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Alert reutilizable
 *
 * Variantes: success | error | warning | info
 * Puede cerrarse con botón X
 * IMPLEMENTA: Renderer2 para manipulación segura del DOM (Requisito 1.3)
 */
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert implements AfterViewInit, OnDestroy {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Mensaje o título
  @Input() message: string = '';

  // Descripción adicional (opcional)
  @Input() description?: string;

  // Mostrar botón de cerrar
  @Input() closeable: boolean = true;

  // Mostrar/ocultar la alerta
  @Input() visible: boolean = true;

  // Permitir añadir badges/tags dinámicamente
  @Input() tags: string[] = [];

  // Evento cuando se cierra
  @Output() close = new EventEmitter<void>();

  // Evento cuando se elimina un tag
  @Output() tagRemoved = new EventEmitter<string>();

  // Referencia al contenedor de tags
  @ViewChild('tagContainer', { static: false }) tagContainer?: ElementRef;

  // Lista de elementos de tags creados dinámicamente
  private createdTagElements: HTMLElement[] = [];

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    // Crear tags iniciales usando Renderer2 (Requisito 1.3)
    this.createTagElements();
  }

  ngOnDestroy(): void {
    // Limpiar elementos creados dinámicamente (Requisito 1.3 - limpieza en ngOnDestroy)
    this.cleanupTagElements();
  }

  /**
   * Crea elementos de tags dinámicamente usando Renderer2
   * IMPLEMENTA: renderer.createElement, appendChild (Requisito 1.3)
   */
  private createTagElements(): void {
    if (!this.tagContainer || this.tags.length === 0) return;

    this.tags.forEach(tag => {
      this.addTagElement(tag);
    });

    console.log(`🏷️ Alert: ${this.tags.length} tags creados con Renderer2`);
  }

  /**
   * Añade un nuevo tag dinámicamente
   * IMPLEMENTA: renderer.createElement, appendChild, setStyle (Requisito 1.3)
   */
  addTagElement(tagText: string): void {
    if (!this.tagContainer) return;

    // Crear el elemento del tag
    const tagEl = this.renderer.createElement('span');
    this.renderer.addClass(tagEl, 'alert__tag');
    this.renderer.setAttribute(tagEl, 'data-tag', tagText);

    // Crear texto del tag
    const textNode = this.renderer.createText(tagText);
    this.renderer.appendChild(tagEl, textNode);

    // Crear botón de eliminar
    const removeBtn = this.renderer.createElement('button');
    this.renderer.addClass(removeBtn, 'alert__tag-remove');
    this.renderer.setAttribute(removeBtn, 'type', 'button');
    this.renderer.setAttribute(removeBtn, 'aria-label', `Eliminar tag ${tagText}`);
    const removeBtnText = this.renderer.createText('×');
    this.renderer.appendChild(removeBtn, removeBtnText);

    // Añadir listener para eliminar
    this.renderer.listen(removeBtn, 'click', (event: MouseEvent) => {
      event.stopPropagation();
      this.removeTagElement(tagEl, tagText);
    });

    // Ensamblar y añadir al contenedor
    this.renderer.appendChild(tagEl, removeBtn);
    this.renderer.appendChild(this.tagContainer.nativeElement, tagEl);

    // Guardar referencia para limpieza
    this.createdTagElements.push(tagEl);

    console.log(`🏷️ Alert: Tag "${tagText}" creado con Renderer2.createElement`);
  }

  /**
   * Elimina un tag dinámicamente
   * IMPLEMENTA: renderer.removeChild (Requisito 1.3)
   */
  removeTagElement(tagEl: HTMLElement, tagText: string): void {
    if (!this.tagContainer) return;

    // Añadir animación de salida
    this.renderer.addClass(tagEl, 'alert__tag--removing');

    // Eliminar después de la animación
    setTimeout(() => {
      if (this.tagContainer && tagEl.parentNode === this.tagContainer.nativeElement) {
        this.renderer.removeChild(this.tagContainer.nativeElement, tagEl);

        // Eliminar de la lista de referencias
        const index = this.createdTagElements.indexOf(tagEl);
        if (index > -1) {
          this.createdTagElements.splice(index, 1);
        }

        // Eliminar del array de tags
        const tagIndex = this.tags.indexOf(tagText);
        if (tagIndex > -1) {
          this.tags.splice(tagIndex, 1);
        }

        // Emitir evento
        this.tagRemoved.emit(tagText);

        console.log(`🏷️ Alert: Tag "${tagText}" eliminado con Renderer2.removeChild`);
      }
    }, 200);
  }

  /**
   * Limpia todos los elementos de tags creados
   * IMPLEMENTA: Limpieza correcta en ngOnDestroy (Requisito 1.3)
   */
  private cleanupTagElements(): void {
    if (!this.tagContainer) return;

    this.createdTagElements.forEach(tagEl => {
      if (tagEl.parentNode === this.tagContainer!.nativeElement) {
        this.renderer.removeChild(this.tagContainer!.nativeElement, tagEl);
      }
    });

    this.createdTagElements = [];
    console.log('🏷️ Alert: Tags limpiados en ngOnDestroy');
  }

  /**
   * Añade un nuevo tag programáticamente
   * Método público para uso externo
   */
  addTag(tagText: string): void {
    if (!this.tags.includes(tagText)) {
      this.tags.push(tagText);
      this.addTagElement(tagText);
    }
  }

  /**
   * Clona un tag existente usando cloneNode
   * IMPLEMENTA: Clonación de nodos (Requisito 1.3 para 9/10)
   */
  cloneTag(tagText: string): void {
    if (!this.tagContainer) return;

    // Buscar el tag existente por su atributo data-tag
    const existingTag = this.createdTagElements.find(
      el => el.getAttribute('data-tag') === tagText
    );

    if (existingTag) {
      // Clonar el nodo completo (deep clone = true)
      const clonedTag = existingTag.cloneNode(true) as HTMLElement;

      // Añadir el tag clonado al contenedor usando Renderer2
      this.renderer.appendChild(this.tagContainer.nativeElement, clonedTag);

      // Guardar referencia para limpieza posterior
      this.createdTagElements.push(clonedTag);

      // Añadir al array de tags
      this.tags.push(tagText);

      // Reconfigurar event listener del botón de eliminar en el clon
      const removeBtn = clonedTag.querySelector('.alert__tag-remove');
      if (removeBtn) {
        this.renderer.listen(removeBtn, 'click', (event: MouseEvent) => {
          event.stopPropagation();
          this.removeTagElement(clonedTag, tagText);
        });
      }

      console.log(`🏷️ Alert: Tag "${tagText}" clonado usando cloneNode()`);
    } else {
      console.warn(`🏷️ Alert: No se encontró tag "${tagText}" para clonar`);
    }
  }

  // Método para cerrar
  onClose(): void {
    this.visible = false;
    this.close.emit();
  }

  // Obtener icono según tipo
  getIcon(): string {
    switch (this.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  getAlertClasses(): string {
    const classes = ['alert'];
    classes.push(`alert--${this.type}`);
    return classes.join(' ');
  }
}

