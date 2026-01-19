import { Component, OnInit } from '@angular/core';
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
  // Lección destacada
  featuredLesson: Leccion | null = null;

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
      descripcion: 'Aprende lo básico para usar tu smartphone desde cero. Llamadas, mensajes y más.',
      categoria: 'Básico',
      nivel: 'Principiante',
      duracion: '5 min',
      imagen: 'assets/images/imagen-3.svg',
      valoracion: 4.8
    },
    {
      id: 2,
      titulo: 'WhatsApp para ver a la familia',
      descripcion: 'Domina las videollamadas paso a paso. Aprende a llamar a tus hijos y nietos de forma segura y sencilla.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '8 min',
      imagen: 'assets/images/whatsapp.svg',
      valoracion: 4.9,
      completado: true
    },
    {
      id: 3,
      titulo: 'Navega seguro por Internet',
      descripcion: 'Protege tus datos y aprende a identificar sitios seguros mientras navegas.',
      categoria: 'Seguridad',
      nivel: 'Intermedio',
      duracion: '10 min',
      imagen: 'assets/images/imagen-5.svg',
      valoracion: 4.7
    },
    {
      id: 4,
      titulo: 'Cómo hacer videollamadas',
      descripcion: 'Aprende a realizar videollamadas con tu familia usando diferentes aplicaciones.',
      categoria: 'Comunicación',
      nivel: 'Principiante',
      duracion: '7 min',
      imagen: 'assets/images/imagen-6.svg',
      valoracion: 4.6
    },
    {
      id: 5,
      titulo: 'Gestiona tus fotos y videos',
      descripcion: 'Organiza, edita y comparte tus recuerdos de forma sencilla.',
      categoria: 'Multimedia',
      nivel: 'Intermedio',
      duracion: '12 min',
      imagen: 'assets/images/imagen-7.svg',
      valoracion: 4.5
    },
    {
      id: 6,
      titulo: 'Correo electrónico básico',
      descripcion: 'Envía y recibe correos, adjunta archivos y organiza tu bandeja de entrada.',
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

  get totalLecciones(): number {
    return this.filteredLecciones.length;
  }
}
