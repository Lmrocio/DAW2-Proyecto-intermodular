// ============================================================================
// SERVICIO: LOADING SERVICE - ClienteFase2
// ============================================================================
// Gestión de estados de carga global y local
// Implementa patrón Observable con BehaviorSubject
// CON TIMEOUT DE SEGURIDAD: Se auto-cierra después de 30 segundos

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Subject para el estado de loading global */
  private loadingSubject = new BehaviorSubject<boolean>(false);

  /** Observable público del estado de loading */
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  /** Contador de peticiones activas */
  private requestCount = 0;

  /** Timeout de seguridad para auto-hide */
  private safetyTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /** Duración máxima del loading (10 segundos) - timeout de seguridad */
  private readonly MAX_LOADING_DURATION = 10000;

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Obtiene el valor actual del loading
   */
  get isLoading(): boolean {
    return this.loadingSubject.getValue();
  }

  /**
   * Muestra el spinner de loading con timeout de seguridad
   */
  show(): void {
    this.requestCount++;
    console.log(`⏳ LoadingService.show() - requestCount: ${this.requestCount}`);
    this.loadingSubject.next(true);

    // Establecer timeout de seguridad solo si no existe
    if (!this.safetyTimeoutId) {
      console.log(`⏳ LoadingService: Timeout de seguridad configurado para ${this.MAX_LOADING_DURATION}ms`);
      this.safetyTimeoutId = setTimeout(() => {
        console.warn('⏳ LoadingService: ⚠️ TIMEOUT ALCANZADO - CERRANDO AUTOMÁTICAMENTE');
        this.reset();
      }, this.MAX_LOADING_DURATION);
    }
  }

  /**
   * Oculta el spinner de loading
   */
  hide(): void {
    this.requestCount--;
    console.log(`⏳ LoadingService.hide() - requestCount: ${this.requestCount}`);
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      console.log('⏳ LoadingService: Ocultando spinner');
      this.loadingSubject.next(false);
      this.clearSafetyTimeout();
    }
  }

  /**
   * Fuerza el reset del loading (útil para errores)
   */
  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    this.clearSafetyTimeout();
  }

  /**
   * Limpia el timeout de seguridad
   */
  private clearSafetyTimeout(): void {
    if (this.safetyTimeoutId) {
      clearTimeout(this.safetyTimeoutId);
      this.safetyTimeoutId = null;
    }
  }
}

