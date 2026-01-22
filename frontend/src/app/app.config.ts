import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, Home, User, Settings, Search, Sun, Moon, LogOut, BookOpen, HelpCircle, Play, Pause, ChevronLeft, ChevronRight, Menu, X, Check, AlertCircle, Info, XCircle, CheckCircle, ArrowLeft, ArrowRight, UserPlus, Lock, Mail, Eye, EyeOff, Award, Star, TrendingUp, Calendar, Clock, Download, Upload, Share2, Heart, Bookmark, Filter, MoreVertical, Edit, Trash2, Plus, Minus, RefreshCw, Loader, AlertTriangle } from 'lucide-angular';

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
 *
 * LUCIDE ICONS:
 * - LucideAngularModule.pick: configura los iconos de Lucide Angular disponibles globalmente
 * - Solo se incluyen los iconos que se usan en la aplicación para optimizar el bundle
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
    ),
    // Configuración de iconos Lucide
    importProvidersFrom(
      LucideAngularModule.pick({
        Home, User, Settings, Search, Menu, X,
        Sun, Moon,
        LogOut, UserPlus, Lock, Mail, Eye, EyeOff,
        BookOpen, HelpCircle, Play, Pause,
        ChevronLeft, ChevronRight, ArrowLeft, ArrowRight,
        Check, AlertCircle, Info, XCircle, CheckCircle, AlertTriangle,
        Award, Star, TrendingUp,
        Calendar, Clock, Download, Upload, Share2, Heart, Bookmark,
        Filter, MoreVertical, Edit, Trash2, Plus, Minus, RefreshCw, Loader
      })
    )
  ]
};
