import { Component, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, HelpCircle, User } from 'lucide-angular';
import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ThemeSwitcher],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Iconos de Lucide
  readonly HelpCircle = HelpCircle;
  readonly User = User;

  // Estado del menú hamburguesa
  menuOpen = false;

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

