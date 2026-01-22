import { Component, HostListener, Renderer2, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeSwitcher } from '../../shared/theme-switcher/theme-switcher';
import { Modal } from '../../shared/modal/modal';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ThemeSwitcher, Modal, LucideAngularModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  // Estado del menú hamburguesa
  menuOpen = false;

  // Estado del modal de guía
  isGuideModalOpen = false;

  // Estado del menú de perfil
  profileMenuOpen = false;

  // Referencia al modal para llamadas programáticas y para evitar warnings del compilador
  @ViewChild(Modal, { static: false }) guideModal?: Modal;

  // Referencias a elementos del header para control del dropdown
  @ViewChild('profileBtnDesktop', { read: ElementRef, static: false }) profileBtn?: ElementRef;
  @ViewChild('profileBtnMobile', { read: ElementRef, static: false }) profileBtnMobile?: ElementRef;
  @ViewChild('profileMenu', { read: ElementRef, static: false }) profileMenu?: ElementRef;

  // Listener para clic fuera
  private removeClickListener: (() => void) | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Registrar listener global de clic para detectar clic fuera del menú de perfil
    this.removeClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onDocumentClick(event);
    });
  }

  ngOnDestroy(): void {
    if (this.removeClickListener) {
      this.removeClickListener();
      this.removeClickListener = null;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;

    // Usar Renderer2 para manipulación segura del DOM (SSR-safe)
    if (this.menuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  closeMenu(): void {
    this.menuOpen = false;
    // Usar Renderer2 para manipulación segura del DOM
    this.renderer.removeStyle(document.body, 'overflow');
  }

  // Abrir modal de guía
  openGuideModal(): void {
    this.isGuideModalOpen = true;
    // Si tenemos la referencia al modal, usar su API (compatibilidad)
    if (this.guideModal) {
      this.guideModal.open();
    }
  }

  // Cerrar modal de guía
  onGuideModalClosed(): void {
    this.isGuideModalOpen = false;
  }

  // Siguiente paso en la guía (para futuro)
  onGuideNext(): void {
    console.log('Siguiente paso en la guía');
  }

  // Toggle perfil
  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }

  // Logout (placeholder - conectar con servicio de autenticación si existe)
  onLogout(): void {
    console.log('Cerrar sesión solicitado');
    // Aquí iría la lógica para cerrar la sesión (AuthService.logout())
    this.closeProfileMenu();
    this.closeMenu();
  }

  private onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!this.profileMenuOpen) return;

    const btnEl = this.profileBtn?.nativeElement as HTMLElement | undefined;
    const btnMobileEl = this.profileBtnMobile?.nativeElement as HTMLElement | undefined;
    const menuEl = this.profileMenu?.nativeElement as HTMLElement | undefined;

    if (btnEl && btnEl.contains(target)) {
      // click dentro del botón de escritorio -> toggle ya gestionado por (click)
      return;
    }

    if (btnMobileEl && btnMobileEl.contains(target)) {
      // click dentro del botón móvil -> toggle ya gestionado por (click)
      return;
    }

    if (menuEl && menuEl.contains(target)) {
      // click dentro del menú -> no cerramos
      return;
    }

    // Si el click no es ni en el botón ni en el menú, cerramos
    this.closeProfileMenu();
  }

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.menuOpen) {
      this.closeMenu();
    }

    if (this.profileMenuOpen) {
      this.closeProfileMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const window = event.target as Window;
    if (window.innerWidth > 768 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
