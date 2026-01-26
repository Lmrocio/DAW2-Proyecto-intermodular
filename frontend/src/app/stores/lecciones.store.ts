import { Injectable, signal, computed } from '@angular/core';
import { LeccionService, Leccion } from '../services/leccion.service';

/**
 * Store de Lecciones - Gestión de estado centralizada
 *
 * Implementa el patrón de gestión de estado con Signals de Angular
 * para actualización dinámica sin recargas.
 *
 * Características:
 * - Estado reactivo con signals
 * - Actualización automática de listas tras CRUD
 * - Contadores y estadísticas en tiempo real
 * - Preservación de scroll en actualizaciones
 */
@Injectable({
  providedIn: 'root'
})
export class LeccionesStore {
  // Estado privado (writable signals)
  private _lecciones = signal<Leccion[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado público (readonly signals)
  lecciones = this._lecciones.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Contadores y estadísticas derivadas (computed signals)
  totalCount = computed(() => this._lecciones().length);

  totalCompletadas = computed(() =>
    this._lecciones().filter(l => (l as any).completado === true).length
  );

  porcentajeCompletado = computed(() => {
    const total = this.totalCount();
    if (total === 0) return 0;
    return Math.round((this.totalCompletadas() / total) * 100);
  });

  leccionesPorNivel = computed(() => {
    const lecciones = this._lecciones();
    return {
      basico: lecciones.filter(l => l.nivel === 'Básico').length,
      intermedio: lecciones.filter(l => l.nivel === 'Intermedio').length,
      avanzado: lecciones.filter(l => l.nivel === 'Avanzado').length
    };
  });

  leccionesPorCategoria = computed(() => {
    const lecciones = this._lecciones();
    const categorias: Record<string, number> = {};

    lecciones.forEach(l => {
      categorias[l.categoria] = (categorias[l.categoria] || 0) + 1;
    });

    return categorias;
  });

  constructor(private leccionService: LeccionService) {
    this.load();
  }

  /**
   * Cargar todas las lecciones (carga inicial)
   */
  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.leccionService.getAllLecciones().subscribe({
      next: (lecciones) => {
        this._lecciones.set(lecciones);
        this._loading.set(false);
        console.log('✅ LeccionesStore: Lecciones cargadas', lecciones.length);
      },
      error: (err) => {
        this._error.set('Error al cargar lecciones');
        this._loading.set(false);
        console.error('❌ LeccionesStore: Error al cargar lecciones', err);
      }
    });
  }

  /**
   * Refrescar datos sin perder scroll
   * Actualiza la lista completa manteniendo el estado del DOM
   */
  refresh(): void {
    this.load();
  }

  /**
   * Añadir una nueva lección
   * Actualización inmutable para preservar referencias y scroll
   */
  add(leccion: Leccion): void {
    const current = this._lecciones();
    this._lecciones.set([...current, leccion]);
    console.log('➕ LeccionesStore: Lección añadida', leccion.id);
  }

  /**
   * Actualizar una lección existente
   * Actualización inmutable manteniendo el orden
   */
  update(leccion: Leccion): void {
    const current = this._lecciones();
    this._lecciones.set(
      current.map(l => (l.id === leccion.id ? leccion : l))
    );
    console.log('✏️ LeccionesStore: Lección actualizada', leccion.id);
  }

  /**
   * Eliminar una lección por ID
   * Actualización inmutable preservando el scroll
   */
  remove(id: string): void {
    const current = this._lecciones();
    this._lecciones.set(current.filter(l => l.id !== id));
    console.log('🗑️ LeccionesStore: Lección eliminada', id);
  }

  /**
   * Marcar lección como completada
   */
  markAsCompleted(id: string): void {
    const current = this._lecciones();
    this._lecciones.set(
      current.map(l => l.id === id ? { ...l, completado: true } as any : l)
    );
    console.log('✅ LeccionesStore: Lección marcada como completada', id);
  }

  /**
   * Marcar lección como no completada
   */
  markAsIncomplete(id: string): void {
    const current = this._lecciones();
    this._lecciones.set(
      current.map(l => l.id === id ? { ...l, completado: false } as any : l)
    );
    console.log('⭕ LeccionesStore: Lección marcada como no completada', id);
  }

  /**
   * Filtrar lecciones por categoría
   */
  getByCategoria(categoria: string): Leccion[] {
    return this._lecciones().filter(l =>
      l.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  /**
   * Filtrar lecciones por nivel
   */
  getByNivel(nivel: string): Leccion[] {
    return this._lecciones().filter(l =>
      l.nivel.toLowerCase() === nivel.toLowerCase()
    );
  }

  /**
   * Buscar lecciones por texto
   */
  search(term: string): Leccion[] {
    const searchTerm = term.toLowerCase().trim();
    if (!searchTerm) return this._lecciones();

    return this._lecciones().filter(l =>
      l.titulo.toLowerCase().includes(searchTerm) ||
      l.descripcion.toLowerCase().includes(searchTerm) ||
      l.categoria.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Obtener lección por ID
   */
  getById(id: string): Leccion | undefined {
    return this._lecciones().find(l => l.id === id);
  }
}

