// ============================================================================
// SERVICIO: TOAST SERVICE - ClienteFase2
// ============================================================================
// Sistema centralizado de notificaciones/toasts
// Implementa patrón Observable con BehaviorSubject

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interfaz para mensajes de toast
 */
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // ========================================================================
  // PROPIEDADES
  // ========================================================================

  /** Subject para emitir toasts */
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);

  /** Observable público de toasts */
  public toast$: Observable<ToastMessage | null> = this.toastSubject.asObservable();

  /** Contador de IDs únicos */
  private idCounter = 0;

  // ========================================================================
  // MÉTODOS PÚBLICOS
  // ========================================================================

  /**
   * Muestra un toast genérico
   */
  show(message: string, type: ToastMessage['type'], duration = 5000): void {
    const toast: ToastMessage = {
      id: ++this.idCounter,
      message,
      type,
      duration
    };
    console.log('🔔 ToastService.show() - Emitiendo toast:', toast);
    this.toastSubject.next(toast);
  }

  /**
   * Toast de éxito (verde)
   */
  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Toast de error (rojo)
   */
  error(message: string, duration = 8000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Toast informativo (azul)
   */
  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Toast de advertencia (amarillo)
   */
  warning(message: string, duration = 6000): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Limpiar el toast actual
   */
  clear(): void {
    this.toastSubject.next(null);
  }
}

