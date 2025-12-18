// ============================================================================
// COMPONENTE: SPINNER - ClienteFase2
// ============================================================================
// Spinner que se cierra AUTOMÁTICAMENTE después de 5 segundos máximo

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.html',
  styleUrl: './spinner.scss'
})
export class Spinner implements OnInit, OnDestroy {

  /** Estado visible del spinner */
  isVisible = false;

  /** Timeout de seguridad - máximo 10 segundos */
  private safetyTimeout: any = null;

  /** Duración máxima del spinner */
  private readonly MAX_DURATION = 10000; // 10 segundos MÁXIMO (solo como seguridad)

  /** Suscripción al servicio */
  private subscription?: Subscription;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('⏳ Spinner Component: ngOnInit - Suscribiéndose al servicio');
    this.subscription = this.loadingService.isLoading$.subscribe(loading => {
      console.log('⏳ Spinner Component: Recibido del servicio, loading =', loading);

      // Cancelar timeout anterior
      this.cancelSafetyTimeout();

      if (loading) {
        // Mostrar spinner
        this.isVisible = true;
        console.log(`⏳ Spinner Component: Mostrando spinner, timeout de seguridad en ${this.MAX_DURATION}ms`);

        // Configurar timeout de seguridad - SIEMPRE se cierra después de 3 segundos
        this.safetyTimeout = setTimeout(() => {
          console.log('⏳ Spinner Component: ⚠️ TIMEOUT ALCANZADO - CERRANDO AUTOMÁTICAMENTE');
          this.isVisible = false;
          this.loadingService.reset();
          this.cdr.detectChanges(); // FORZAR detección de cambios
        }, this.MAX_DURATION);
      } else {
        // Ocultar spinner
        console.log('⏳ Spinner Component: Ocultando spinner');
        this.isVisible = false;
        this.cdr.detectChanges(); // FORZAR detección de cambios
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelSafetyTimeout();
    this.subscription?.unsubscribe();
  }

  /** Cancela el timeout de seguridad */
  private cancelSafetyTimeout(): void {
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
      this.safetyTimeout = null;
    }
  }
}

