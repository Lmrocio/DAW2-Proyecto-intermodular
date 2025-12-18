// ============================================================================
// SERVICIO: THEME SERVICE
// ============================================================================
// Servicio para gestión del tema (claro/oscuro)
// Implementa Theme Switcher según ClienteFase1:
// - Detectar prefers-color-scheme
// - Toggle entre tema claro/oscuro
// - Persistir preferencia en localStorage
// - Aplicar tema al cargar la aplicación

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

/** Tipos de tema disponibles */
export type Theme = 'light' | 'dark';

/** Clave para localStorage */
const THEME_STORAGE_KEY = 'tecnomayores-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Subject reactivo para el tema actual */
  private themeSubject = new BehaviorSubject<Theme>('light');

  /** Observable público del tema actual */
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  /** Indica si estamos en el navegador */
  private isBrowser: boolean;

  // ========================================================================
  // CONSTRUCTOR
  // ========================================================================

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Inicializar el tema al cargar el servicio
    this.initializeTheme();
  }

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Obtiene el tema actual
   */
  get currentTheme(): Theme {
    return this.themeSubject.getValue();
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    // Actualizar el subject
    this.themeSubject.next(theme);

    // Persistir en localStorage
    this.saveToLocalStorage(theme);

    // Aplicar al documento
    this.applyThemeToDocument(theme);
  }

  /**
   * Alterna entre tema claro y oscuro
   * Implementa toggle según ClienteFase1
   */
  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Verifica si el sistema prefiere el tema oscuro
   * Implementa detección de prefers-color-scheme según ClienteFase1
   */
  systemPrefersDark(): boolean {
    if (!this.isBrowser) return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Escucha cambios en la preferencia del sistema
   */
  watchSystemPreference(callback: (prefersDark: boolean) => void): void {
    if (!this.isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listener para cambios en la preferencia del sistema
    const listener = (event: MediaQueryListEvent) => {
      // Solo aplicar si no hay preferencia guardada por el usuario
      if (!this.getSavedTheme()) {
        const newTheme: Theme = event.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
        callback(event.matches);
      }
    };

    // Usar addEventListener con opciones modernas
    mediaQuery.addEventListener('change', listener);
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /**
   * Inicializa el tema al cargar la aplicación
   * Implementa la lógica de ClienteFase1:
   * 1. Leer localStorage
   * 2. Si hay valor guardado, usarlo
   * 3. Si no hay, mirar prefers-color-scheme
   */
  private initializeTheme(): void {
    if (!this.isBrowser) return;

    // 1. Intentar obtener tema guardado en localStorage
    const savedTheme = this.getSavedTheme();

    if (savedTheme) {
      // 2. Si hay valor guardado, usarlo
      this.setTheme(savedTheme);
    } else {
      // 3. Si no hay, detectar preferencia del sistema
      const prefersDark = this.systemPrefersDark();
      const systemTheme: Theme = prefersDark ? 'dark' : 'light';
      this.setTheme(systemTheme);
    }

    // Escuchar cambios en la preferencia del sistema
    this.watchSystemPreference((prefersDark) => {
      console.log(`System preference changed to ${prefersDark ? 'dark' : 'light'} mode`);
    });
  }

  /**
   * Obtiene el tema guardado en localStorage
   */
  private getSavedTheme(): Theme | null {
    if (!this.isBrowser) return null;

    const saved = localStorage.getItem(THEME_STORAGE_KEY);

    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    return null;
  }

  /**
   * Guarda el tema en localStorage
   * Implementa persistencia según ClienteFase1
   */
  private saveToLocalStorage(theme: Theme): void {
    if (!this.isBrowser) return;

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  /**
   * Aplica el tema al documento HTML
   * Implementa aplicación de clases según ClienteFase1
   */
  private applyThemeToDocument(theme: Theme): void {
    if (!this.isBrowser) return;

    const documentElement = document.documentElement;

    // Remover clases de tema anteriores
    documentElement.classList.remove('theme-light', 'theme-dark');

    // Añadir nueva clase de tema
    documentElement.classList.add(`theme-${theme}`);

    // También actualizar el atributo data-theme para CSS
    documentElement.setAttribute('data-theme', theme);

    // Actualizar meta theme-color para móviles
    this.updateThemeColor(theme);
  }

  /**
   * Actualiza el meta tag theme-color para navegadores móviles
   */
  private updateThemeColor(theme: Theme): void {
    if (!this.isBrowser) return;

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    // Colores de _css-variables.scss: bg-primary claro y oscuro
    const color = theme === 'dark' ? '#2a2420' : '#fff6df'; // bg-primary oscuro : bg-primary claro

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', color);
    } else {
      // Crear el meta tag si no existe
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }
}

