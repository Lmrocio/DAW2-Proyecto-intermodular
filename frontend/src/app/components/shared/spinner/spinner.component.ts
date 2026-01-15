// ============================================================================
// COMPONENTE: SPINNER - ClienteFase2
// ============================================================================
// Spinner que se cierra AUTOMÁTICAMENTE después de 5 segundos máximo
// IMPLEMENTA: Creación y eliminación de elementos DOM con Renderer2 (Requisito 1.3)
// Usa: renderer.createElement, renderer.appendChild, renderer.removeChild

import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Renderer2,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  /** Indica si estamos en el navegador */
  private isBrowser: boolean;

  /** Overlay del spinner creado dinámicamente */
  private spinnerOverlay: HTMLElement | null = null;

  /** Elemento spinner creado dinámicamente */
  private spinnerElement: HTMLElement | null = null;

  constructor(
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    console.log('⏳ Spinner Component: ngOnInit - Suscribiéndose al servicio');
    this.subscription = this.loadingService.isLoading$.subscribe(loading => {
      console.log('⏳ Spinner Component: Recibido del servicio, loading =', loading);

      // Cancelar timeout anterior
      this.cancelSafetyTimeout();

      if (loading) {
        // Crear spinner dinámicamente con Renderer2 (Requisito 1.3)
        this.createSpinnerOverlay();

        // Mostrar spinner
        this.isVisible = true;
        console.log(`⏳ Spinner Component: Mostrando spinner, timeout de seguridad en ${this.MAX_DURATION}ms`);

        // Configurar timeout de seguridad - SIEMPRE se cierra después de 3 segundos
        this.safetyTimeout = setTimeout(() => {
          console.log('⏳ Spinner Component: ⚠️ TIMEOUT ALCANZADO - CERRANDO AUTOMÁTICAMENTE');
          this.removeSpinnerOverlay();
          this.isVisible = false;
          this.loadingService.reset();
          this.cdr.detectChanges(); // FORZAR detección de cambios
        }, this.MAX_DURATION);
      } else {
        // Eliminar spinner dinámicamente (Requisito 1.3)
        this.removeSpinnerOverlay();

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

    // Limpiar overlay creado dinámicamente (Requisito 1.3 - limpieza en ngOnDestroy)
    this.removeSpinnerOverlay();
  }

  /**
   * Crea el overlay del spinner dinámicamente usando Renderer2
   * IMPLEMENTA: renderer.createElement, appendChild, setStyle (Requisito 1.3)
   */
  private createSpinnerOverlay(): void {
    if (!this.isBrowser || this.spinnerOverlay) return;

    // Crear overlay
    this.spinnerOverlay = this.renderer.createElement('div');
    this.renderer.addClass(this.spinnerOverlay, 'spinner-overlay');
    this.renderer.addClass(this.spinnerOverlay, 'spinner-overlay--dynamic');
    this.renderer.setAttribute(this.spinnerOverlay, 'role', 'alert');
    this.renderer.setAttribute(this.spinnerOverlay, 'aria-busy', 'true');
    this.renderer.setAttribute(this.spinnerOverlay, 'aria-label', 'Cargando contenido');

    // Estilos del overlay
    this.renderer.setStyle(this.spinnerOverlay, 'position', 'fixed');
    this.renderer.setStyle(this.spinnerOverlay, 'top', '0');
    this.renderer.setStyle(this.spinnerOverlay, 'left', '0');
    this.renderer.setStyle(this.spinnerOverlay, 'right', '0');
    this.renderer.setStyle(this.spinnerOverlay, 'bottom', '0');
    this.renderer.setStyle(this.spinnerOverlay, 'backgroundColor', 'rgba(0, 0, 0, 0.5)');
    this.renderer.setStyle(this.spinnerOverlay, 'display', 'flex');
    this.renderer.setStyle(this.spinnerOverlay, 'justifyContent', 'center');
    this.renderer.setStyle(this.spinnerOverlay, 'alignItems', 'center');
    this.renderer.setStyle(this.spinnerOverlay, 'zIndex', '10000');

    // Crear contenedor del spinner
    const spinnerContainer = this.renderer.createElement('div');
    this.renderer.addClass(spinnerContainer, 'spinner-container');
    this.renderer.setStyle(spinnerContainer, 'display', 'flex');
    this.renderer.setStyle(spinnerContainer, 'flexDirection', 'column');
    this.renderer.setStyle(spinnerContainer, 'alignItems', 'center');
    this.renderer.setStyle(spinnerContainer, 'gap', '1rem');

    // Crear el spinner (círculo animado)
    this.spinnerElement = this.renderer.createElement('div');
    this.renderer.addClass(this.spinnerElement, 'spinner');
    this.renderer.addClass(this.spinnerElement, 'spinner--dynamic');
    this.renderer.setStyle(this.spinnerElement, 'width', '50px');
    this.renderer.setStyle(this.spinnerElement, 'height', '50px');
    this.renderer.setStyle(this.spinnerElement, 'border', '4px solid rgba(255, 255, 255, 0.3)');
    this.renderer.setStyle(this.spinnerElement, 'borderTop', '4px solid #ffffff');
    this.renderer.setStyle(this.spinnerElement, 'borderRadius', '50%');
    this.renderer.setStyle(this.spinnerElement, 'animation', 'spin 1s linear infinite');

    // Crear texto de carga
    const loadingText = this.renderer.createElement('span');
    this.renderer.setStyle(loadingText, 'color', '#ffffff');
    this.renderer.setStyle(loadingText, 'fontSize', '1rem');
    const textNode = this.renderer.createText('Cargando...');
    this.renderer.appendChild(loadingText, textNode);

    // Ensamblar
    this.renderer.appendChild(spinnerContainer, this.spinnerElement);
    this.renderer.appendChild(spinnerContainer, loadingText);
    this.renderer.appendChild(this.spinnerOverlay, spinnerContainer);

    // Añadir al body
    this.renderer.appendChild(document.body, this.spinnerOverlay);

    console.log('⏳ Spinner: Overlay creado con Renderer2.createElement y appendChild');
  }

  /**
   * Elimina el overlay del spinner usando Renderer2
   * IMPLEMENTA: renderer.removeChild (Requisito 1.3)
   */
  private removeSpinnerOverlay(): void {
    if (!this.isBrowser || !this.spinnerOverlay) return;

    // Añadir animación de salida
    this.renderer.setStyle(this.spinnerOverlay, 'opacity', '0');
    this.renderer.setStyle(this.spinnerOverlay, 'transition', 'opacity 0.3s ease');

    // Eliminar después de la animación
    setTimeout(() => {
      if (this.spinnerOverlay && this.spinnerOverlay.parentNode === document.body) {
        this.renderer.removeChild(document.body, this.spinnerOverlay);
        console.log('⏳ Spinner: Overlay eliminado con Renderer2.removeChild');
      }
      this.spinnerOverlay = null;
      this.spinnerElement = null;
    }, 300);
  }

  /** Cancela el timeout de seguridad */
  private cancelSafetyTimeout(): void {
    if (this.safetyTimeout) {
      clearTimeout(this.safetyTimeout);
      this.safetyTimeout = null;
    }
  }
}

