// ============================================================================
// COMPONENTE: THEME SWITCHER
// ============================================================================
// Botón toggle para cambiar entre tema claro y oscuro
// Implementa Theme Switcher funcional según ClienteFase1

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher implements OnInit, OnDestroy {
  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Tema actual */
  currentTheme: Theme = 'light';

  /** Suscripción al observable del tema */
  private themeSubscription?: Subscription;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(private themeService: ThemeService) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnInit(): void {
    // Suscribirse a los cambios de tema
    this.themeSubscription = this.themeService.theme$.subscribe((theme: Theme) => {
      this.currentTheme = theme;
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripción
    this.themeSubscription?.unsubscribe();
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Alterna el tema
   * Implementa toggle según ClienteFase1
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Maneja eventos de teclado
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTheme();
    }
  }

  // ========================================================================
  // GETTERS
  // ========================================================================

  /** Verifica si el tema actual es oscuro */
  get isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  /** Texto para accesibilidad */
  get ariaLabel(): string {
    return this.isDarkMode
      ? 'Cambiar a tema claro'
      : 'Cambiar a tema oscuro';
  }

  /** Título del botón */
  get buttonTitle(): string {
    return this.isDarkMode
      ? 'Modo claro'
      : 'Modo oscuro';
  }
}

