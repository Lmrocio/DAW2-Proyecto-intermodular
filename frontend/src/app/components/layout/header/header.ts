import { Component, HostListener, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';
import { HeaderIcon } from '../../shared/header-icon/header-icon';
import { Modal } from '../../shared/modal/modal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, HeaderIcon, Modal],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Estado del menú hamburguesa
  menuOpen = false;

  // Estado del modal de guía
  isGuideModalOpen = false;

  // Referencia al modal para llamadas programáticas y para evitar warnings del compilador
  @ViewChild(Modal, { static: false }) guideModal?: Modal;

  constructor(private renderer: Renderer2) {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Usar Renderer2 para manipulación segura del DOM (SSR-safe)
    if (this.menuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    // Usar Renderer2 para manipulación segura del DOM
    this.renderer.removeStyle(document.body, 'overflow');
  }

  // Abrir modal de guía
  openGuideModal(): void {
    this.isGuideModalOpen = true;
    // Si tenemos la referencia al modal, usar su API (compatibilidad)
    if (this.guideModal) {
      this.guideModal.open();
    }
  }

  // Cerrar modal de guía
  onGuideModalClosed(): void {
    this.isGuideModalOpen = false;
  }

  // Siguiente paso en la guía (para futuro)
  onGuideNext(): void {
    console.log('Siguiente paso en la guía');
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const window = event.target as Window;
    if (window.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
