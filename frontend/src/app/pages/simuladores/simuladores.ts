import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Hero } from '../../components/home/hero/hero';
import { PageHeader } from '../../components/lecciones/page-header/page-header';
import { SearchBar } from '../../components/home/search-bar/search-bar';
import { QuickFilters } from '../../components/lecciones/quick-filters/quick-filters';
import { SidebarFiltros } from '../../components/lecciones/sidebar-filtros/sidebar-filtros';
import { LeccionCard, Leccion } from '../../components/lecciones/leccion-card/leccion-card';
import { Pagination } from '../../components/lecciones/pagination/pagination';
import { Button } from '../../components/shared/button/button';

/**
 * Página de Simuladores - Catálogo de Simuladores de Prácticas
 *
 * Muestra un catálogo de simuladores para prácticas de aspectos de internet
 * con filtros, búsqueda y paginación.
 * El breadcrumb es gestionado globalmente por BreadcrumbNav en app.html
 * y se genera automáticamente desde route.data.breadcrumb
 */
@Component({
  selector: 'app-simuladores',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Hero,
    PageHeader,
    SearchBar,
    QuickFilters,
    SidebarFiltros,
    LeccionCard,
    Pagination,
    Button
  ],
  templateUrl: './simuladores.html',
  styleUrl: './simuladores.scss',
})
export class Simuladores implements OnInit {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}
  // Simulador destacado
  featuredSimulador: Leccion | null = null;
  // Segundo simulador destacado
  featuredSimulador2: Leccion | null = null;

  // Estados de reproducción para simuladores destacados
  isSpeakingFeatured1 = false;
  isSpeakingFeatured2 = false;
  private currentUtteranceFeatured: SpeechSynthesisUtterance | null = null;
  private synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? (window as any).speechSynthesis : null;

  // Progreso del usuario
  userProgress = {
    completedSimuladores: 3,
    level: 3,
    points: 520,
    percentage: 45
  };

  // Datos de ejemplo
  allSimuladores: Leccion[] = [
    {
      id: 1,
      titulo: 'Realizar una transferencia bancaria',
      descripcion: 'Aprende paso a paso cómo hacer una transferencia bancaria online de forma segura. Conocerás dónde encontrar la opción de transferencia en tu banca online, cómo rellenar los datos del beneficiario y cómo confirmar la operación sin cometer errores.',
      categoria: 'Básico',
      nivel: 'Principiante',
      duracion: '8 min',
      imagen: 'assets/images/imagen-1-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-1-small.webp',
        medium: 'assets/images/imagen-1-medium.webp',
        large: 'assets/images/imagen-1-large.webp'
      },
      valoracion: 4.8
    },
    {
      id: 2,
      titulo: 'Hacer un Bizum',
      descripcion: 'Domina la forma más rápida de enviar dinero a tus amigos y familiares. Te guiaremos en la instalación de Bizum, cómo registrarse, buscar contactos y completar un envío en segundos de forma segura y sin comisiones.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '6 min',
      imagen: 'assets/images/imagen-2-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-2-small.webp',
        medium: 'assets/images/imagen-2-medium.webp',
        large: 'assets/images/imagen-2-large.webp'
      },
      valoracion: 4.9,
      completado: true
    },
    {
      id: 3,
      titulo: 'Comprar de forma segura online',
      descripcion: 'Descubre cómo comprar en internet sin riesgos: identificar tiendas confiables, proteger tus datos de pago, verificar certificados de seguridad y cómo proceder si algo sale mal. Incluye consejos para evitar estafas y fraudes comunes.',
      categoria: 'Seguridad',
      nivel: 'Intermedio',
      duracion: '12 min',
      imagen: 'assets/images/imagen-3-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-3-small.webp',
        medium: 'assets/images/imagen-3-medium.webp',
        large: 'assets/images/imagen-3-large.webp'
      },
      valoracion: 4.7
    },
    {
      id: 4,
      titulo: 'Enviar un SMS de forma segura',
      descripcion: 'Practica cómo enviar mensajes de texto sin revelar información personal. Aprenderás a usar correctamente la función de SMS, a verificar que el mensaje llegó al destinatario correcto y a protegerte de estafas mediante SMS falsos.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '5 min',
      imagen: 'assets/images/imagen-4-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-4-small.webp',
        medium: 'assets/images/imagen-4-medium.webp',
        large: 'assets/images/imagen-4-large.webp'
      },
      valoracion: 4.6
    },
    {
      id: 5,
      titulo: 'Crear una contraseña segura',
      descripcion: 'Entiende qué hace que una contraseña sea realmente segura. Practica creando contraseñas robustas, aprendiendo los patrones a evitar y cómo guardarlas de forma segura sin olvidarlas. Incluye consejos para cada tipo de cuenta.',
      categoria: 'Seguridad',
      nivel: 'Básico',
      duracion: '7 min',
      imagen: 'assets/images/imagen-5-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-5-small.webp',
        medium: 'assets/images/imagen-5-medium.webp',
        large: 'assets/images/imagen-5-large.webp'
      },
      valoracion: 4.5
    },
    {
      id: 6,
      titulo: 'Pagar con tarjeta en establecimientos',
      descripcion: 'Aprende a realizar pagos con tarjeta de crédito o débito en comercios físicos. Conocerás los tipos de pago (contactless, PIN, firma), cómo verificar que la transacción es segura y qué hacer si el terminal te rechaza la tarjeta.',
      categoria: 'Básico',
      nivel: 'Principiante',
      duracion: '6 min',
      imagen: 'assets/images/imagen-6-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-6-small.webp',
        medium: 'assets/images/imagen-6-medium.webp',
        large: 'assets/images/imagen-6-large.webp'
      },
      valoracion: 4.7,
      completado: true
    },
    {
      id: 7,
      titulo: 'Reconocer emails de phishing',
      descripcion: 'Desarrolla tu instinto para identificar correos electrónicos fraudulentos antes de caer en la trampa. Descubre señales de alerta, enlaces peligrosos y estrategias de los estafadores. Practica analizando ejemplos reales de phishing.',
      categoria: 'Seguridad',
      nivel: 'Intermedio',
      duracion: '10 min',
      imagen: 'assets/images/imagen-7-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-7-small.webp',
        medium: 'assets/images/imagen-7-medium.webp',
        large: 'assets/images/imagen-7-large.webp'
      },
      valoracion: 4.8
    },
    {
      id: 8,
      titulo: 'Cambiar la contraseña de tu cuenta',
      descripcion: 'Practica los pasos para cambiar tu contraseña de forma segura en diferentes plataformas. Aprenderás dónde encontrar la opción en cada servicio, cuáles son los requisitos y cómo hacerlo sin perder el acceso a tu cuenta.',
      categoria: 'Seguridad',
      nivel: 'Básico',
      duracion: '5 min',
      imagen: 'assets/images/imagen-1-medium.webp',
      imageVariants: {
        small: 'assets/images/imagen-1-small.webp',
        medium: 'assets/images/imagen-1-medium.webp',
        large: 'assets/images/imagen-1-large.webp'
      },
      valoracion: 4.4
    }
  ];

  filteredSimuladores: Leccion[] = [];
  displayedSimuladores: Leccion[] = [];
  searchTerm: string = '';
  selectedFilters: any = {};

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  ngOnInit(): void {
    this.filteredSimuladores = [...this.allSimuladores];
    this.setFeaturedSimuladores();
    this.updatePagination();
  }

  setFeaturedSimuladores(): void {
    this.featuredSimulador = this.allSimuladores[0] || null;
    this.featuredSimulador2 = this.allSimuladores[1] || null;
  }

  onSearch(searchText: string): void {
    this.searchTerm = searchText.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(filters: any): void {
    this.selectedFilters = filters;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredSimuladores = this.allSimuladores.filter(simulador => {
      // Buscar por texto
      const matchesSearch = !this.searchTerm ||
        simulador.titulo.toLowerCase().includes(this.searchTerm) ||
        simulador.descripcion.toLowerCase().includes(this.searchTerm);

      // Buscar por filtros
      let matchesFilters = true;
      if (this.selectedFilters['categoria']) {
        matchesFilters = this.selectedFilters['categoria'].includes(simulador.categoria);
      }
      if (this.selectedFilters['nivel']) {
        matchesFilters = matchesFilters && this.selectedFilters['nivel'].includes(simulador.nivel);
      }

      return matchesSearch && matchesFilters;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredSimuladores.length / this.itemsPerPage);
    this.displayedSimuladores = this.filteredSimuladores.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get totalSimuladores(): number {
    return this.filteredSimuladores.length;
  }

  onImgError(event: any): void {
    event.target.src = 'assets/images/default-image.svg';
  }

  togglePlayFeatured(simuladorIndex: number, text: string): void {
    if (!this.synth) return;

    if (simuladorIndex === 1) {
      if (this.isSpeakingFeatured1) {
        // Detener reproducción
        this.synth.cancel();
        this.ngZone.run(() => {
          this.isSpeakingFeatured1 = false;
          this.cd.detectChanges();
        });
      } else {
        // Iniciar reproducción
        this.playSpeech(text, 1);
      }
    } else if (simuladorIndex === 2) {
      if (this.isSpeakingFeatured2) {
        // Detener reproducción
        this.synth.cancel();
        this.ngZone.run(() => {
          this.isSpeakingFeatured2 = false;
          this.cd.detectChanges();
        });
      } else {
        // Iniciar reproducción
        this.playSpeech(text, 2);
      }
    }
  }

  private playSpeech(text: string, simuladorIndex: number): void {
    if (!this.synth) return;

    // Si ya está hablando algo, cancelarlo para evitar solapamientos
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;

    // Buscar una voz en español
    const voices = this.synth.getVoices();
    let spanishVoice: SpeechSynthesisVoice | undefined;

    if (voices.length > 0) {
      spanishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('es'));
      if (!spanishVoice) {
        spanishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang === 'es-ES');
      }
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
    }

    // Callbacks para manejar estados
    utterance.onstart = () => {
      this.ngZone.run(() => {
        if (simuladorIndex === 1) this.isSpeakingFeatured1 = true;
        if (simuladorIndex === 2) this.isSpeakingFeatured2 = true;
        this.currentUtteranceFeatured = utterance;
        this.cd.detectChanges();
      });
    };

    utterance.onend = () => {
      this.ngZone.run(() => {
        if (simuladorIndex === 1) this.isSpeakingFeatured1 = false;
        if (simuladorIndex === 2) this.isSpeakingFeatured2 = false;
        this.currentUtteranceFeatured = null;
        this.cd.detectChanges();
      });
    };

    utterance.onerror = () => {
      this.ngZone.run(() => {
        if (simuladorIndex === 1) this.isSpeakingFeatured1 = false;
        if (simuladorIndex === 2) this.isSpeakingFeatured2 = false;
        this.currentUtteranceFeatured = null;
        this.cd.detectChanges();
      });
    };

    this.synth.speak(utterance);
  }

  saveSim(id: number | string) {
    console.log('Save simulator:', id);
  }
}
