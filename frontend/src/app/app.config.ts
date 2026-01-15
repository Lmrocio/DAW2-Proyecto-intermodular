import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

import { routes } from './app.routes';

/**
 * Configuración de la aplicación
 *
 * LAZY LOADING (FASE 4 - Tarea 3):
 * - withPreloading(PreloadAllModules): precarga todos los módulos lazy
 *   después de la carga inicial, mejorando UX en navegaciones posteriores
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // Estrategia de precarga
    )
  ]
};
