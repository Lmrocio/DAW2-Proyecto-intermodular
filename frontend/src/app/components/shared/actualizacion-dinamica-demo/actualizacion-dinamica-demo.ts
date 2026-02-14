import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeccionesStore } from '../../../stores/lecciones.store';
import { SimuladoresStore } from '../../../stores/simuladores.store';
import { Leccion } from '../../../services/leccion.service';
import { Simulador } from '../../../services/simulador.service';

/**
 * Componente de demostración de Actualización Dinámica (FASE 6 - Tarea 1)
 *
 * Demuestra:
 * - Actualización de listas tras crear/editar/eliminar sin recargar la página
 * - Contadores y estadísticas que se recalculan automáticamente
 * - Preservación del scroll durante actualizaciones
 * - Gestión de estado reactiva con Signals
 *
 * OPTIMIZACIONES (FASE 6 - Tarea 3):
 * - ChangeDetectionStrategy.OnPush para rendimiento óptimo
 * - TrackBy functions en todas las listas
 * - Signals (auto-gestión de memoria, no requiere unsubscribe)
 */
@Component({
  selector: 'app-actualizacion-dinamica-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dynamic-update-demo">
      <div class="demo-header">
        <h1>📊 Demostración: Actualización Dinámica sin Recargas</h1>
        <p class="subtitle">
          Este componente demuestra la actualización automática de listas y estadísticas
          usando el patrón de gestión de estado con Signals de Angular.
        </p>
      </div>

      <!-- Tabs para alternar entre Lecciones y Simuladores -->
      <div class="tabs">
        <button
          class="tab"
          [class.active]="activeTab() === 'lecciones'"
          (click)="activeTab.set('lecciones')">
          📚 Lecciones
        </button>
        <button
          class="tab"
          [class.active]="activeTab() === 'simuladores'"
          (click)="activeTab.set('simuladores')">
          🎮 Simuladores
        </button>
      </div>

      <!-- SECCIÓN: LECCIONES -->
      <div *ngIf="activeTab() === 'lecciones'" class="section">
        <!-- Estadísticas en Tiempo Real -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ leccionesStore.totalCount() }}</div>
            <div class="stat-label">Total Lecciones</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ leccionesStore.totalCompletadas() }}</div>
            <div class="stat-label">Completadas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ leccionesStore.porcentajeCompletado() }}%</div>
            <div class="stat-label">Progreso</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ leccionesStore.leccionesPorNivel().basico }}</div>
            <div class="stat-label">Nivel Básico</div>
          </div>
        </div>

        <!-- Controles CRUD -->
        <div class="controls">
          <h3>🛠️ Operaciones CRUD</h3>

          <div class="control-group">
            <button class="btn-primary" (click)="addLeccion()">
              ➕ Añadir Lección
            </button>
            <button class="btn-secondary" (click)="leccionesStore.refresh()">
              🔄 Refrescar Lista
            </button>
            <button
              class="btn-warning"
              (click)="updateRandomLeccion()"
              [disabled]="leccionesStore.totalCount() === 0">
              ✏️ Editar Lección Aleatoria
            </button>
            <button
              class="btn-danger"
              (click)="removeLastLeccion()"
              [disabled]="leccionesStore.totalCount() === 0">
              🗑️ Eliminar Última Lección
            </button>
          </div>

          <div class="info-box">
            <strong>💡 Observa:</strong> Al realizar operaciones, las estadísticas se actualizan
            automáticamente y el scroll se mantiene en su posición.
          </div>
        </div>

        <!-- Lista con Scroll -->
        <div class="list-section">
          <h3>📋 Lista de Lecciones</h3>

          <div *ngIf="leccionesStore.loading()" class="loading">
            Cargando lecciones...
          </div>

          <div *ngIf="leccionesStore.error()" class="error">
            {{ leccionesStore.error() }}
          </div>

          <div class="scrollable-list" #leccionesList>
            <div
              *ngFor="let leccion of leccionesStore.lecciones(); trackBy: trackLeccionById"
              class="list-item"
              [class.completada]="isLeccionCompletada(leccion)">
              <div class="item-header">
                <span class="item-title">{{ leccion.titulo }}</span>
                <span class="item-badge">{{ leccion.nivel }}</span>
              </div>
              <div class="item-meta">
                <span class="item-categoria">📁 {{ leccion.categoria }}</span>
                <span class="item-duracion">⏱️ {{ leccion.duracion }}</span>
              </div>
              <div class="item-actions">
                <button
                  class="btn-small"
                  (click)="toggleCompletado(leccion.id)">
                  {{ isLeccionCompletada(leccion) ? '✅' : '⭕' }}
                  {{ isLeccionCompletada(leccion) ? 'Completada' : 'Marcar' }}
                </button>
                <button
                  class="btn-small btn-danger"
                  (click)="removeLeccion(leccion.id)">
                  🗑️
                </button>
              </div>
            </div>

            <div *ngIf="leccionesStore.totalCount() === 0" class="empty-state">
              No hay lecciones disponibles
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: SIMULADORES -->
      <div *ngIf="activeTab() === 'simuladores'" class="section">
        <!-- Estadísticas en Tiempo Real -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ simuladoresStore.totalCount() }}</div>
            <div class="stat-label">Total Simuladores</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ simuladoresStore.simuladoresPorNivel().basico }}</div>
            <div class="stat-label">Nivel Básico</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ simuladoresStore.simuladoresPorNivel().intermedio }}</div>
            <div class="stat-label">Nivel Intermedio</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">
              {{ simuladoresStore.simuladorMasLargo()?.duracion || 'N/A' }}
            </div>
            <div class="stat-label">Mayor Duración</div>
          </div>
        </div>

        <!-- Controles CRUD -->
        <div class="controls">
          <h3>🛠️ Operaciones CRUD</h3>

          <div class="control-group">
            <button class="btn-primary" (click)="addSimulador()">
              ➕ Añadir Simulador
            </button>
            <button class="btn-secondary" (click)="simuladoresStore.refresh()">
              🔄 Refrescar Lista
            </button>
            <button
              class="btn-warning"
              (click)="updateRandomSimulador()"
              [disabled]="simuladoresStore.totalCount() === 0">
              ✏️ Editar Simulador Aleatorio
            </button>
            <button
              class="btn-danger"
              (click)="removeLastSimulador()"
              [disabled]="simuladoresStore.totalCount() === 0">
              🗑️ Eliminar Último Simulador
            </button>
          </div>

          <div class="info-box">
            <strong>💡 Observa:</strong> Las estadísticas se recalculan instantáneamente
            sin necesidad de recargar la página.
          </div>
        </div>

        <!-- Lista con Scroll -->
        <div class="list-section">
          <h3>📋 Lista de Simuladores</h3>

          <div *ngIf="simuladoresStore.loading()" class="loading">
            Cargando simuladores...
          </div>

          <div *ngIf="simuladoresStore.error()" class="error">
            {{ simuladoresStore.error() }}
          </div>

          <div class="scrollable-list" #simuladoresList>
            <div
              *ngFor="let simulador of simuladoresStore.simuladores(); trackBy: trackSimuladorById"
              class="list-item">
              <div class="item-header">
                <span class="item-title">{{ simulador.titulo }}</span>
                <span class="item-badge">{{ simulador.nivel }}</span>
              </div>
              <div class="item-description">{{ simulador.descripcion }}</div>
              <div class="item-meta">
                <span class="item-categoria">📁 {{ simulador.categoria }}</span>
                <span class="item-duracion">⏱️ {{ simulador.duracion }}</span>
              </div>
              <div class="item-actions">
                <button
                  class="btn-small btn-danger"
                  (click)="removeSimulador(simulador.id)">
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div *ngIf="simuladoresStore.totalCount() === 0" class="empty-state">
              No hay simuladores disponibles
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dynamic-update-demo {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .demo-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .demo-header h1 {
      color: var(--primary-color, #2563eb);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-muted, #6b7280);
      font-size: 1rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      border-bottom: 2px solid var(--border-color, #e5e7eb);
    }

    .tab {
      padding: 0.75rem 1.5rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-muted, #6b7280);
      transition: all 0.2s;
    }

    .tab:hover {
      color: var(--primary-color, #2563eb);
    }

    .tab.active {
      color: var(--primary-color, #2563eb);
      border-bottom-color: var(--primary-color, #2563eb);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .controls {
      background: var(--bg-secondary, #f9fafb);
      padding: 1.5rem;
      border-radius: 0.75rem;
      margin-bottom: 2rem;
    }

    .controls h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--text-primary, #111827);
    }

    .control-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .btn-primary, .btn-secondary, .btn-warning, .btn-danger, .btn-small {
      padding: 0.625rem 1.25rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #10b981;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #059669;
    }

    .btn-secondary {
      background: #3b82f6;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .btn-warning:hover:not(:disabled) {
      background: #d97706;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
    }

    .btn-small {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .info-box {
      background: #dbeafe;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      border-radius: 0.5rem;
      color: #1e40af;
      font-size: 0.875rem;
    }

    .list-section h3 {
      margin-bottom: 1rem;
      color: var(--text-primary, #111827);
    }

    .loading, .error {
      text-align: center;
      padding: 2rem;
      font-size: 1rem;
    }

    .error {
      color: #dc2626;
      background: #fee2e2;
      border-radius: 0.5rem;
    }

    .scrollable-list {
      max-height: 500px;
      overflow-y: auto;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.75rem;
      padding: 1rem;
      background: white;
    }

    .list-item {
      padding: 1rem;
      border: 1px solid var(--border-color, #e5e7eb);
      border-radius: 0.5rem;
      margin-bottom: 0.75rem;
      transition: all 0.2s;
    }

    .list-item:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .list-item.completada {
      background: #f0fdf4;
      border-color: #86efac;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .item-title {
      font-weight: 600;
      color: var(--text-primary, #111827);
    }

    .item-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .item-description {
      color: var(--text-muted, #6b7280);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .item-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: var(--text-muted, #6b7280);
      margin-bottom: 0.75rem;
    }

    .item-actions {
      display: flex;
      gap: 0.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: var(--text-muted, #6b7280);
      font-style: italic;
    }
  `]
})
export class ActualizacionDinamicaDemo {
  activeTab = signal<'lecciones' | 'simuladores'>('lecciones');

  // Contador para IDs únicos
  private leccionCounter = 100;
  private simuladorCounter = 100;

  constructor(
    public leccionesStore: LeccionesStore,
    public simuladoresStore: SimuladoresStore
  ) {}

  // ==================== LECCIONES ====================

  addLeccion(): void {
    const newLeccion: Leccion = {
      id: String(this.leccionCounter++),
      titulo: `Nueva Lección ${this.leccionCounter}`,
      descripcion: 'Lección añadida dinámicamente para demostración',
      duracion: '15 min',
      nivel: this.getRandomNivel(),
      categoria: this.getRandomCategoria()
    };

    this.leccionesStore.add(newLeccion);
  }

  updateRandomLeccion(): void {
    const lecciones = this.leccionesStore.lecciones();
    if (lecciones.length === 0) return;

    const randomIndex = Math.floor(Math.random() * lecciones.length);
    const leccion = lecciones[randomIndex];

    const updatedLeccion: Leccion = {
      ...leccion,
      titulo: `${leccion.titulo} (Editada)`,
      nivel: this.getRandomNivel()
    };

    this.leccionesStore.update(updatedLeccion);
  }

  removeLastLeccion(): void {
    const lecciones = this.leccionesStore.lecciones();
    if (lecciones.length > 0) {
      const lastLeccion = lecciones[lecciones.length - 1];
      this.leccionesStore.remove(lastLeccion.id);
    }
  }

  removeLeccion(id: string): void {
    this.leccionesStore.remove(id);
  }

  toggleCompletado(id: string): void {
    const leccion = this.leccionesStore.getById(id);
    if (!leccion) return;

    if (this.isLeccionCompletada(leccion)) {
      this.leccionesStore.markAsIncomplete(id);
    } else {
      this.leccionesStore.markAsCompleted(id);
    }
  }

  isLeccionCompletada(leccion: Leccion): boolean {
    return (leccion as any).completado === true;
  }

  trackLeccionById(index: number, item: Leccion): string {
    return item.id;
  }

  // ==================== SIMULADORES ====================

  addSimulador(): void {
    const newSimulador: Simulador = {
      id: String(this.simuladorCounter++),
      titulo: `Nuevo Simulador ${this.simuladorCounter}`,
      descripcion: 'Simulador añadido dinámicamente para demostración',
      categoria: this.getRandomCategoria(),
      duracion: `${Math.floor(Math.random() * 30) + 10} min`,
      nivel: this.getRandomNivel()
    };

    this.simuladoresStore.add(newSimulador);
  }

  updateRandomSimulador(): void {
    const simuladores = this.simuladoresStore.simuladores();
    if (simuladores.length === 0) return;

    const randomIndex = Math.floor(Math.random() * simuladores.length);
    const simulador = simuladores[randomIndex];

    const updatedSimulador: Simulador = {
      ...simulador,
      titulo: `${simulador.titulo} (Editado)`,
      nivel: this.getRandomNivel()
    };

    this.simuladoresStore.update(updatedSimulador);
  }

  removeLastSimulador(): void {
    const simuladores = this.simuladoresStore.simuladores();
    if (simuladores.length > 0) {
      const lastSimulador = simuladores[simuladores.length - 1];
      this.simuladoresStore.remove(lastSimulador.id);
    }
  }

  removeSimulador(id: string): void {
    this.simuladoresStore.remove(id);
  }

  trackSimuladorById(index: number, item: Simulador): string {
    return item.id;
  }

  // ==================== HELPERS ====================

  private getRandomNivel(): 'Básico' | 'Intermedio' | 'Avanzado' {
    const niveles: ('Básico' | 'Intermedio' | 'Avanzado')[] = ['Básico', 'Intermedio', 'Avanzado'];
    return niveles[Math.floor(Math.random() * niveles.length)];
  }

  private getRandomCategoria(): string {
    const categorias = ['Comunicación', 'Seguridad', 'Multimedia', 'Banca Digital', 'Aplicaciones'];
    return categorias[Math.floor(Math.random() * categorias.length)];
  }
}

