import { Injectable, signal, computed } from '@angular/core';
import { SimuladorService, Simulador } from '../services/simulador.service';

/**
 * Store de Simuladores - Gestión de estado centralizada
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
export class SimuladoresStore {
  // Estado privado (writable signals)
  private _simuladores = signal<Simulador[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado público (readonly signals)
  simuladores = this._simuladores.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Contadores y estadísticas derivadas (computed signals)
  totalCount = computed(() => this._simuladores().length);

  simuladoresPorNivel = computed(() => {
    const simuladores = this._simuladores();
    return {
      basico: simuladores.filter(s => s.nivel === 'Básico').length,
      intermedio: simuladores.filter(s => s.nivel === 'Intermedio').length,
      avanzado: simuladores.filter(s => s.nivel === 'Avanzado').length
    };
  });

  simuladoresPorCategoria = computed(() => {
    const simuladores = this._simuladores();
    const categorias: Record<string, number> = {};

    simuladores.forEach(s => {
      categorias[s.categoria] = (categorias[s.categoria] || 0) + 1;
    });

    return categorias;
  });

  // Simulador más largo (por duración)
  simuladorMasLargo = computed(() => {
    const simuladores = this._simuladores();
    if (simuladores.length === 0) return null;

    return simuladores.reduce((prev, current) => {
      if (!prev.duracion) return current;
      if (!current.duracion) return prev;

      const prevMinutos = parseInt(prev.duracion);
      const currentMinutos = parseInt(current.duracion);

      return currentMinutos > prevMinutos ? current : prev;
    });
  });

  constructor(private simuladorService: SimuladorService) {
    this.load();
  }

  /**
   * Cargar todos los simuladores (carga inicial)
   */
  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.simuladorService.getAllSimuladores().subscribe({
      next: (simuladores) => {
        this._simuladores.set(simuladores);
        this._loading.set(false);
        console.log('✅ SimuladoresStore: Simuladores cargados', simuladores.length);
      },
      error: (err) => {
        this._error.set('Error al cargar simuladores');
        this._loading.set(false);
        console.error('❌ SimuladoresStore: Error al cargar simuladores', err);
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
   * Añadir un nuevo simulador
   * Actualización inmutable para preservar referencias y scroll
   */
  add(simulador: Simulador): void {
    const current = this._simuladores();
    this._simuladores.set([...current, simulador]);
    console.log('➕ SimuladoresStore: Simulador añadido', simulador.id);
  }

  /**
   * Actualizar un simulador existente
   * Actualización inmutable manteniendo el orden
   */
  update(simulador: Simulador): void {
    const current = this._simuladores();
    this._simuladores.set(
      current.map(s => (s.id === simulador.id ? simulador : s))
    );
    console.log('✏️ SimuladoresStore: Simulador actualizado', simulador.id);
  }

  /**
   * Eliminar un simulador por ID
   * Actualización inmutable preservando el scroll
   */
  remove(id: string): void {
    const current = this._simuladores();
    this._simuladores.set(current.filter(s => s.id !== id));
    console.log('🗑️ SimuladoresStore: Simulador eliminado', id);
  }

  /**
   * Filtrar simuladores por categoría
   */
  getByCategoria(categoria: string): Simulador[] {
    return this._simuladores().filter(s =>
      s.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  /**
   * Filtrar simuladores por nivel
   */
  getByNivel(nivel: string): Simulador[] {
    return this._simuladores().filter(s =>
      s.nivel?.toLowerCase() === nivel.toLowerCase()
    );
  }

  /**
   * Buscar simuladores por texto
   */
  search(term: string): Simulador[] {
    const searchTerm = term.toLowerCase().trim();
    if (!searchTerm) return this._simuladores();

    return this._simuladores().filter(s =>
      s.titulo.toLowerCase().includes(searchTerm) ||
      s.descripcion.toLowerCase().includes(searchTerm) ||
      s.categoria.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Obtener simulador por ID
   */
  getById(id: string): Simulador | undefined {
    return this._simuladores().find(s => s.id === id);
  }
}

