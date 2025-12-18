// ============================================================================
// COMPONENTE: HEADER
// ============================================================================
// Encabezado principal de la aplicación
// Incluye logo, navegación responsive con menú hamburguesa y utilidades

import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Estado del menú hamburguesa
  menuOpen = false;

  // Alternar menú
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Prevenir scroll del body cuando el menú está abierto
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Cerrar menú
  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
  }

  // Cerrar menú con tecla Escape
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  // Cerrar menú al cambiar el tamaño de la ventana (si es mayor que móvil)
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const window = event.target as Window;
    if (window.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }
}

