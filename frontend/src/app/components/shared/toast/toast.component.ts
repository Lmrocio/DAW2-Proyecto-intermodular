// ============================================================================
// COMPONENTE: TOAST - ClienteFase2
// ============================================================================
// Notificaciones que se cierran AUTOMÁTICAMENTE después de X segundos

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService, ToastMessage } from '../../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit, OnDestroy {

  /** Toast actual a mostrar */
  currentToast: ToastMessage | null = null;

  /** Estado de cierre para animación */
  isClosing = false;

  /** Timeout para auto-cerrar */
  private autoCloseTimeout: any = null;

  /** Suscripción al servicio */
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    console.log('🔔 Toast Component: ngOnInit - Suscribiéndose al servicio');
    this.subscription = this.toastService.toast$.subscribe(toast => {
      console.log('🔔 Toast Component: Recibido del servicio:', toast);

      // Si hay un toast anterior, cancelar su timeout
      this.cancelAutoClose();

      if (toast) {
        // Mostrar el nuevo toast
        this.isClosing = false;
        this.currentToast = toast;

        // Configurar auto-cierre - SIEMPRE se cierra solo
        const duration = toast.duration > 0 ? toast.duration : 3000;
        console.log(`🔔 Toast Component: Mostrando toast, se cerrará en ${duration}ms`);

        this.autoCloseTimeout = setTimeout(() => {
          console.log('🔔 Toast Component: AUTO-CERRANDO AHORA');
          this.close();
        }, duration);
      } else {
        console.log('🔔 Toast Component: Toast es null, ocultando');
        this.currentToast = null;
        this.isClosing = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelAutoClose();
    this.subscription?.unsubscribe();
  }

  /** Cierra el toast con animación */
  close(): void {
    console.log('🔔 Toast Component: close() llamado - iniciando animación de cierre');
    this.isClosing = true;

    // Después de la animación, quitar el toast
    setTimeout(() => {
      console.log('🔔 Toast Component: Animación completada - ocultando toast');
      this.currentToast = null;
      this.isClosing = false;
    }, 300);

    this.cancelAutoClose();
  }

  /** Cancela el timeout de auto-cierre */
  private cancelAutoClose(): void {
    if (this.autoCloseTimeout) {
      clearTimeout(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  /** Obtiene el icono según el tipo */
  getIcon(): string {
    if (!this.currentToast) return 'ℹ';
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      info: 'ℹ',
      warning: '⚠'
    };
    return icons[this.currentToast.type] || 'ℹ';
  }
}

