import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

/**
 * Configuración de la aplicación
 *
 * LAZY LOADING (FASE 4 - Tarea 3):
 * - withPreloading(PreloadAllModules): precarga todos los módulos lazy
 *   después de la carga inicial, mejorando UX en navegaciones posteriores
 *
 * HTTP CLIENT (FASE 5 - Tarea 1):
 * - provideHttpClient: habilita HttpClient a nivel global
 * - withInterceptors: registra interceptores funcionales en orden específico
 *
 * INTERCEPTORES (FASE 5 - Tarea 6):
 * Orden de ejecución (request → response):
 * 1. authInterceptor: añade headers (Content-Type, X-App-Client, Authorization)
 * 2. errorInterceptor: manejo global de errores con mensajes de usuario
 * 3. loggingInterceptor: logging de requests/responses (solo desarrollo)
 *
 * Los interceptores se ejecutan en orden inverso para las respuestas:
 * logging → error → auth
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // Estrategia de precarga
    ),
    provideHttpClient(
      withInterceptors([
        authInterceptor,      // 1º Añade headers de autenticación
        errorInterceptor,     // 2º Maneja errores globalmente
        loggingInterceptor    // 3º Loggea peticiones/respuestas
      ])
    )
  ]
};


