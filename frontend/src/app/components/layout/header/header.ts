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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    document.body.style.overflow = '';
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

