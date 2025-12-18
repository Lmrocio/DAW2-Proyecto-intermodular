// ============================================================================
// PÁGINA: CLIENT - ClienteFase2 + ClienteFase3
// ============================================================================
// Área de usuario de TecnoMayores
//
// ClienteFase2 - Separación de responsabilidades:
// - Este componente solo gestiona la PRESENTACIÓN
// - La lógica de negocio está en LessonService
// - Las notificaciones van a través de ToastService
// - El loading global se gestiona con LoadingService
//
// ClienteFase3 - Formularios reactivos:
// - Formulario de registro con validadores síncronos y asíncronos
// - FormArray para contenido dinámico
// - Feedback visual de validación

import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

// Componentes existentes del proyecto
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { Alert } from '../../components/shared/alert/alert';
import { LoginForm } from '../../components/shared/login-form/login-form';

// Componentes interactivos - ClienteFase1
import { Modal } from '../../components/shared/modal/modal';
import { Tabs, Tab } from '../../components/shared/tabs/tabs';
import { Accordion, AccordionItem } from '../../components/shared/accordion/accordion';
import { Tooltip } from '../../components/shared/tooltip/tooltip';

// Formulario de registro - ClienteFase3
import { RegisterForm } from '../../components/shared/register-form/register-form';

// Servicios - ClienteFase2 (Separación de responsabilidades)
import { LessonService, Lesson } from '../../services/lesson.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Button,
    Card,
    Alert,
    LoginForm,
    Modal,
    Tabs,
    Accordion,
    Tooltip,
    RegisterForm
  ],
  templateUrl: './client.html',
  styleUrl: './client.scss',
})
export class Client implements OnInit, OnDestroy {

  // ========================================================================
  // VIEWCHILD - Acceso al DOM (ClienteFase1)
  // ========================================================================

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  // ========================================================================
  // ESTADO DE LA UI (Solo presentación)
  // ========================================================================

  /** Lecciones filtradas para mostrar */
  filteredLessons: Lesson[] = [];

  /** Progreso del usuario */
  progress = { completed: 0, total: 0, percentage: 0 };

  /** Tab activa */
  activeTabId = 'todas';

  /** Query de búsqueda */
  searchQuery = '';

  /** Estado de los modales */
  showLoginModal = false;
  showLessonModal = false;
  showRegisterModal = false;

  /** Estados de loading local (ClienteFase2) */
  isSavingLesson = signal(false);

  /** Alertas */
  showWelcomeAlert = true;

  /** Tabs del área de usuario */
  userTabs: Tab[] = [
    { id: 'todas', label: 'Todas las Lecciones', icon: '📚' },
    { id: 'progreso', label: 'Mi Progreso', icon: '📊' },
    { id: 'favoritos', label: 'Mis Favoritos', icon: '⭐' }
  ];

  /** FAQ - Preguntas frecuentes */
  faqItems: AccordionItem[] = [
    {
      id: 'faq1',
      title: '¿Cómo hago una videollamada por WhatsApp?',
      content: 'Abre WhatsApp, busca el contacto con quien quieras hablar, pulsa su nombre y luego el icono de la cámara de vídeo 📹. ¡Así de fácil!',
      icon: '📹'
    },
    {
      id: 'faq2',
      title: '¿Cómo puedo hacer las letras más grandes?',
      content: 'Ve a los Ajustes de tu teléfono (el icono de la ruedecita ⚙️), busca "Pantalla" o "Accesibilidad", y encontrarás la opción "Tamaño de texto".',
      icon: '🔍'
    },
    {
      id: 'faq3',
      title: '¿Es seguro comprar por Internet?',
      content: 'Sí, siempre que sigas unas normas básicas: compra solo en tiendas conocidas, busca el candado 🔒 en la barra de direcciones, nunca compartas tu PIN.',
      icon: '🔒'
    },
    {
      id: 'faq4',
      title: '¿Cómo guardo una foto que me han enviado?',
      content: 'Cuando recibas una foto por WhatsApp, mantenla pulsada unos segundos. Aparecerá un menú con la opción "Guardar".',
      icon: '📷'
    }
  ];

  /** Suscripciones */
  private subscriptions: Subscription[] = [];

  // ========================================================================
  // CONSTRUCTOR - Inyección de servicios
  // ========================================================================

  constructor(
    private renderer: Renderer2,
    private lessonService: LessonService,
    private toastService: ToastService,
    private loadingService: LoadingService
  ) {}

  // ========================================================================
  // CICLO DE VIDA
  // ========================================================================

  ngOnInit(): void {
    // Suscribirse a las lecciones del servicio
    const lessonsSub = this.lessonService.lessons$.subscribe(lessons => {
      this.updateFilteredLessons();
    });
    this.subscriptions.push(lessonsSub);

    // Cargar datos iniciales
    this.loadData();
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones (prevenir memory leaks)
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ========================================================================
  // MÉTODOS PRIVADOS
  // ========================================================================

  /**
   * Carga los datos iniciales
   */
  private loadData(): void {
    this.lessonService.getLessons().subscribe({
      next: () => {
        this.updateFilteredLessons();
        this.progress = this.lessonService.getProgress();
      },
      error: () => {
        this.toastService.error('Error al cargar las lecciones');
      }
    });
  }

  /**
   * Actualiza las lecciones filtradas
   */
  private updateFilteredLessons(): void {
    this.filteredLessons = this.lessonService.filterLessons(
      this.activeTabId as 'todas' | 'progreso' | 'favoritos',
      this.searchQuery
    );
    this.progress = this.lessonService.getProgress();
  }

  // ========================================================================
  // HANDLERS DE UI (Solo delegan a servicios)
  // ========================================================================

  /**
   * Cambio de tab
   */
  onTabChange(tabId: string): void {
    this.activeTabId = tabId;
    this.updateFilteredLessons();
  }

  /**
   * Búsqueda
   */
  onSearchKeyup(event: KeyboardEvent): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.updateFilteredLessons();
  }

  /**
   * Focus en el buscador (ClienteFase1 - Renderer2)
   */
  onSearchFocus(): void {
    if (this.searchInput) {
      this.renderer.addClass(this.searchInput.nativeElement, 'client__search-input--focused');
    }
  }

  /**
   * Blur del buscador
   */
  onSearchBlur(): void {
    if (this.searchInput) {
      this.renderer.removeClass(this.searchInput.nativeElement, 'client__search-input--focused');
    }
  }

  // ========================================================================
  // ACCIONES DE LECCIONES (Delegan a LessonService)
  // ========================================================================

  /**
   * Abre el modal de una lección
   */
  openLessonModal(lesson: Lesson): void {
    this.lessonService.selectLesson(lesson);
    this.showLessonModal = true;
  }

  /**
   * Cierra el modal de lección
   */
  closeLessonModal(): void {
    this.showLessonModal = false;
    this.lessonService.selectLesson(null);
  }

  /**
   * Completa una lección (con loading local)
   */
  completeLesson(lesson: Lesson): void {
    this.isSavingLesson.set(true);

    // Delegar al servicio
    this.lessonService.completeLesson(lesson.id);

    // Simular delay y cerrar modal
    setTimeout(() => {
      this.isSavingLesson.set(false);
      this.closeLessonModal();
      this.updateFilteredLessons();
    }, 800);
  }

  /**
   * Alterna favorito (delega a servicio)
   */
  toggleFavorite(lesson: Lesson, event: MouseEvent): void {
    event.stopPropagation();
    this.lessonService.toggleFavorite(lesson.id);
    this.updateFilteredLessons();
  }

  /**
   * Obtiene la lección seleccionada del servicio
   */
  get selectedLesson(): Lesson | null {
    return this.lessonService.selectedLesson();
  }

  /**
   * Obtiene etiqueta de dificultad (delega a servicio)
   */
  getDifficultyLabel(difficulty: string): string {
    return this.lessonService.getDifficultyLabel(difficulty);
  }

  // ========================================================================
  // MODALES
  // ========================================================================

  openLoginModal(): void {
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  openRegisterModal(): void {
    this.showRegisterModal = true;
  }

  closeRegisterModal(): void {
    this.showRegisterModal = false;
  }

  /**
   * Cerrar modales con ESC (ClienteFase1)
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeLoginModal();
    this.closeLessonModal();
    this.closeRegisterModal();
  }

  // ========================================================================
  // ALERTAS
  // ========================================================================

  closeWelcomeAlert(): void {
    this.showWelcomeAlert = false;
  }

  // ========================================================================
  // REGISTRO - ClienteFase3
  // ========================================================================

  onRegisterSubmit(formData: any): void {
    this.loadingService.show();

    // Simular registro
    setTimeout(() => {
      this.loadingService.hide();
      this.closeRegisterModal();
      this.toastService.success('¡Cuenta creada con éxito! Bienvenido a TecnoMayores 🎉');
      console.log('Datos de registro:', formData);
    }, 1500);
  }

  // ========================================================================
  // LOGIN
  // ========================================================================

  onLoginSubmit(data: { email: string; password: string; rememberMe: boolean }): void {
    this.loadingService.show();

    // Simular login
    setTimeout(() => {
      this.loadingService.hide();
      this.closeLoginModal();
      this.toastService.success('¡Bienvenido! Has iniciado sesión correctamente');
    }, 1500);
  }

  // ========================================================================
  // DEMOS DE TOAST (Para mostrar ClienteFase2)
  // ========================================================================

  showSuccessToast(): void {
    this.toastService.success('¡Operación completada con éxito!');
  }

  showErrorToast(): void {
    this.toastService.error('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
  }

  showInfoToast(): void {
    this.toastService.info('Consejo: Puedes usar las flechas del teclado para navegar.');
  }

  showWarningToast(): void {
    this.toastService.warning('Atención: Esta acción no se puede deshacer.');
  }
}

