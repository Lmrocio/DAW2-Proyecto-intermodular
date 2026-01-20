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
 * Página de Lecciones - Catálogo de Lecciones
 *
 * Muestra un catálogo de lecciones con filtros, búsqueda y paginación.
 * El breadcrumb es gestionado globalmente por BreadcrumbNav en app.html
 * y se genera automáticamente desde route.data.breadcrumb
 */
@Component({
  selector: 'app-lecciones',
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
  templateUrl: './lecciones.html',
  styleUrl: './lecciones.scss',
})
export class Lecciones implements OnInit {
  constructor(private ngZone: NgZone, private cd: ChangeDetectorRef) {}
  // Lección destacada
  featuredLesson: Leccion | null = null;
  // Segunda lección destacada
  featuredLesson2: Leccion | null = null;

  // Estados de reproducción para lecciones destacadas
  isSpeakingFeatured1 = false;
  isSpeakingFeatured2 = false;
  private currentUtteranceFeatured: SpeechSynthesisUtterance | null = null;
  private synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? (window as any).speechSynthesis : null;

  // Progreso del usuario
  userProgress = {
    completedLessons: 4,
    level: 4,
    points: 650,
    percentage: 65
  };

  // Datos de ejemplo
  allLecciones: Leccion[] = [
    {
      id: 1,
      titulo: 'Mi primer teléfono inteligente',
      descripcion: 'Aprende lo básico para usar tu smartphone desde cero: cómo encenderlo, realizar y recibir llamadas, enviar mensajes, gestionar contactos y ajustar las funciones más útiles para tu día a día. Ideal si empiezas desde cero y quieres sentirte seguro usando tu teléfono.',
      categoria: 'Básico',
      nivel: 'Principiante',
      duracion: '5 min',
      imagen: 'assets/images/imagen-5.svg',
      valoracion: 4.8
    },
    {
      id: 2,
      titulo: 'WhatsApp para ver a la familia',
      descripcion: 'Domina las videollamadas paso a paso: instalación, configuración, cómo iniciar y atender llamadas y videollamadas, compartir fotos y vídeos y mantener la privacidad. Perfecto para hablar y ver a tus seres queridos con confianza.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '8 min',
      imagen: 'assets/images/whatsapp.jpg',
      valoracion: 4.9,
      completado: true
    },
    {
      id: 3,
      titulo: 'Navega seguro por Internet',
      descripcion: 'Protege tus datos y aprende a identificar sitios y correos seguros: consejos prácticos para crear contraseñas robustas, detectar fraudes comunes, configurar privacidad en navegadores y evitar riesgos al hacer compras o gestionar tu información online.',
      categoria: 'Seguridad',
      nivel: 'Intermedio',
      duracion: '10 min',
      imagen: 'assets/images/imagen-5.svg',
      valoracion: 4.7
    },
    {
      id: 4,
      titulo: 'Cómo hacer videollamadas',
      descripcion: 'Aprende a realizar videollamadas con tu familia usando distintas aplicaciones: pasos para iniciar una llamada, compartir pantalla, ajustar el micrófono y la cámara, y pequeños trucos para que la llamada sea cómoda y estable.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '7 min',
      imagen: 'assets/images/imagen-6.svg',
      valoracion: 4.6
    },
    {
      id: 5,
      titulo: 'Gestiona tus fotos y videos',
      descripcion: 'Organiza, edita y comparte tus fotos y vídeos: aprende a crear álbumes, recortar y mejorar imágenes, enviar recuerdos a la familia y guardar copias de seguridad para no perder tus momentos más valiosos.',
      categoria: 'Multimedia',
      nivel: 'Intermedio',
      duracion: '12 min',
      imagen: 'assets/images/imagen-7.svg',
      valoracion: 4.5
    },
    {
      id: 6,
      titulo: 'Correo electrónico básico',
      descripcion: 'Envía y recibe correos, adjunta archivos, organiza tu bandeja de entrada y aprende buenas prácticas para evitar spam y conservar mensajes importantes. Ideal para usar el correo con seguridad y orden.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '6 min',
      imagen: 'assets/images/imagen-1.svg',
      valoracion: 4.8
    }
  ];

  filteredLecciones: Leccion[] = [];
  displayedLecciones: Leccion[] = [];

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  ngOnInit(): void {
    this.filteredLecciones = [...this.allLecciones];
    // Establecer la lección destacada (la segunda)
    this.featuredLesson = this.allLecciones[1];
    // Establecer la segunda lección destacada (la tercera si existe)
    this.featuredLesson2 = this.allLecciones[2] || null;
    this.updatePagination();
  }

  // Aceptar string | Event y normalizar a string para compatibilidad con bindings
  onSearch(query: string | Event | any): void {
    let q = '';
    if (typeof query === 'string') {
      q = query;
    } else if (query && typeof query === 'object') {
      // Si es un CustomEvent con detail
      if ('detail' in query && typeof query.detail === 'string') {
        q = query.detail;
      } else if (query.target && query.target.value) {
        q = String(query.target.value);
      } else {
        q = '';
      }
    }

    if (!q.trim()) {
      this.filteredLecciones = [...this.allLecciones];
    } else {
      this.filteredLecciones = this.allLecciones.filter(leccion =>
        leccion.titulo.toLowerCase().includes(q.toLowerCase()) ||
        leccion.descripcion.toLowerCase().includes(q.toLowerCase()) ||
        leccion.categoria.toLowerCase().includes(q.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  onQuickFilter(filter: string): void {
    if (!filter) {
      this.filteredLecciones = [...this.allLecciones];
    } else {
      this.filteredLecciones = this.allLecciones.filter(leccion =>
        leccion.titulo.toLowerCase().includes(filter.toLowerCase()) ||
        leccion.categoria.toLowerCase().includes(filter.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  onFilterChange(filters: any): void {
    this.filteredLecciones = this.allLecciones.filter(leccion => {
      let match = true;

      if (filters.categoria && filters.categoria.length > 0) {
        match = match && filters.categoria.some((cat: string) =>
          leccion.categoria.toLowerCase().includes(cat)
        );
      }

      if (filters.nivel && filters.nivel.length > 0) {
        match = match && filters.nivel.some((niv: string) =>
          leccion.nivel.toLowerCase().includes(niv)
        );
      }

      return match;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredLecciones.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedLecciones = this.filteredLecciones.slice(startIndex, endIndex);
  }

  // Manejo de error en carga de imagen: poner imagen por defecto
  onImgError(event: any): void {
    const img: HTMLImageElement | null = event?.target || null;
    if (img) {
      img.src = 'assets/images/imagen-1.svg';
      img.onerror = null;
    }
  }

  get totalLecciones(): number {
    return this.filteredLecciones.length;
  }

  // Método para reproducir/detener audio en lecciones destacadas
  togglePlayFeatured(featuredIndex: number, text: string): void {
    if (!this.synth) return;

    if (featuredIndex === 1) {
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
    } else if (featuredIndex === 2) {
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

  private playSpeech(text: string, featuredIndex: number): void {
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
    const spanishVoice = voices.find((v: SpeechSynthesisVoice) => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => {
      this.ngZone.run(() => {
        if (featuredIndex === 1) this.isSpeakingFeatured1 = true;
        if (featuredIndex === 2) this.isSpeakingFeatured2 = true;
        this.currentUtteranceFeatured = utterance;
        this.cd.detectChanges();
      });
    };

    utterance.onend = () => {
      this.ngZone.run(() => {
        if (featuredIndex === 1) this.isSpeakingFeatured1 = false;
        if (featuredIndex === 2) this.isSpeakingFeatured2 = false;
        this.currentUtteranceFeatured = null;
        this.cd.detectChanges();
      });
    };

    utterance.onerror = () => {
      this.ngZone.run(() => {
        if (featuredIndex === 1) this.isSpeakingFeatured1 = false;
        if (featuredIndex === 2) this.isSpeakingFeatured2 = false;
        this.currentUtteranceFeatured = null;
        this.cd.detectChanges();
      });
    };

    // Marcar como hablando antes de invocar speak para que el botón cambie inmediatamente
    this.ngZone.run(() => {
      if (featuredIndex === 1) this.isSpeakingFeatured1 = true;
      if (featuredIndex === 2) this.isSpeakingFeatured2 = true;
      this.currentUtteranceFeatured = utterance;
      this.cd.detectChanges();
    });

    this.synth.speak(utterance);
  }
}
