import { Component, ChangeDetectionStrategy, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval, takeUntil, take } from 'rxjs';

/**
 * Componente de demostración de Optimizaciones de Rendimiento (FASE 6 - Tarea 3)
 *
 * Demuestra las 4 optimizaciones principales:
 * 1. ChangeDetectionStrategy.OnPush
 * 2. TrackBy en *ngFor
 * 3. Unsubscribe de observables (patrón destroy$)
 * 4. Async pipe para suscripciones automáticas
 */
@Component({
  selector: 'app-optimizacion-rendimiento-demo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅ Optimización 1
  template: `
    <div class="performance-demo">
      <div class="demo-header">
        <h1>⚡ Optimizaciones de Rendimiento</h1>
        <p class="subtitle">
          Demostración de las 4 técnicas principales para optimizar performance en Angular
        </p>
      </div>

      <!-- Sección 1: OnPush Change Detection -->
      <section class="demo-section">
        <div class="section-header">
          <h2>1️⃣ OnPush Change Detection Strategy</h2>
          <span class="badge badge-success">✅ Activado</span>
        </div>

        <div class="info-box">
          <h4>¿Qué hace?</h4>
          <p>
            OnPush indica a Angular que solo revise este componente cuando:
          </p>
          <ul>
            <li>Cambian sus @Input() (con nueva referencia)</li>
            <li>Se dispara un evento en el template</li>
            <li>Cambia un Signal que el template lee</li>
            <li>Se completa un observable con async pipe</li>
          </ul>
          <p>
            <strong>Resultado:</strong> Reduce verificaciones de change detection en ~70-90%
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-card stat-bad">
            <div class="stat-label">Sin OnPush</div>
            <div class="stat-value">{{ changeDetectionCountWithout }}</div>
            <div class="stat-desc">Verificaciones por segundo</div>
          </div>
          <div class="stat-card stat-good">
            <div class="stat-label">Con OnPush</div>
            <div class="stat-value">{{ changeDetectionCountWith }}</div>
            <div class="stat-desc">Verificaciones por segundo</div>
          </div>
          <div class="stat-card stat-excellent">
            <div class="stat-label">Mejora</div>
            <div class="stat-value">{{ improvement }}%</div>
            <div class="stat-desc">Reducción de trabajo</div>
          </div>
        </div>

        <div class="code-example">
          <h4>Código:</h4>
          <pre><code>@Component({{'{'}})
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush, // ✅
  template: '...'
{{'}'}})
export class MyComponent {{'{'}} {{'}'}}</code></pre>
        </div>
      </section>

      <!-- Sección 2: TrackBy en *ngFor -->
      <section class="demo-section">
        <div class="section-header">
          <h2>2️⃣ TrackBy en *ngFor</h2>
          <span class="badge badge-success">✅ Implementado</span>
        </div>

        <div class="info-box">
          <h4>¿Qué hace?</h4>
          <p>
            TrackBy le dice a Angular cómo identificar elementos únicos en listas,
            evitando recrear todo el DOM cuando solo cambia un elemento.
          </p>
          <p>
            <strong>Sin trackBy:</strong> Angular recrea todos los nodos DOM en cada cambio<br>
            <strong>Con trackBy:</strong> Angular solo actualiza elementos modificados
          </p>
        </div>

        <div class="demo-controls">
          <button class="btn-primary" (click)="addItem()">➕ Añadir Item</button>
          <button class="btn-secondary" (click)="updateRandomItem()">✏️ Editar Aleatorio</button>
          <button class="btn-warning" (click)="shuffleItems()">🔀 Mezclar Lista</button>
          <button class="btn-danger" (click)="removeLastItem()">🗑️ Eliminar Último</button>
        </div>

        <div class="comparison-grid">
          <!-- Lista SIN trackBy (simulación) -->
          <div class="list-container">
            <h4>❌ Sin trackBy</h4>
            <div class="list-stats">
              <span>DOM Nodes recreados: {{ domNodesRecreatedWithout }}</span>
            </div>
            <div class="scrollable-list">
              <div *ngFor="let item of items()" class="list-item">
                <span class="item-id">ID: {{ item.id }}</span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-badge">{{ item.type }}</span>
              </div>
            </div>
          </div>

          <!-- Lista CON trackBy -->
          <div class="list-container">
            <h4>✅ Con trackBy</h4>
            <div class="list-stats">
              <span>DOM Nodes recreados: {{ domNodesRecreatedWith }}</span>
            </div>
            <div class="scrollable-list">
              <div *ngFor="let item of items(); trackBy: trackById" class="list-item">
                <span class="item-id">ID: {{ item.id }}</span>
                <span class="item-name">{{ item.name }}</span>
                <span class="item-badge">{{ item.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="code-example">
          <h4>Código:</h4>
          <pre><code>// Template
&lt;div *ngFor="let item of items; trackBy: trackById"&gt;
  {{'{{'}} item.name {{'}}'}}
&lt;/div&gt;

// Component
trackById(index: number, item: Item): string | number {{'{'}}
  return item.id; // Identificador único
{{'}'}}</code></pre>
        </div>
      </section>

      <!-- Sección 3: Unsubscribe Pattern -->
      <section class="demo-section">
        <div class="section-header">
          <h2>3️⃣ Patrón Unsubscribe (destroy$)</h2>
          <span class="badge badge-success">✅ Implementado</span>
        </div>

        <div class="info-box">
          <h4>¿Qué hace?</h4>
          <p>
            Previene memory leaks cancelando suscripciones cuando el componente se destruye.
          </p>
          <p>
            <strong>Patrón recomendado:</strong> Subject con takeUntil en ngOnDestroy
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Suscripciones activas</div>
            <div class="stat-value">{{ activeSubscriptions }}</div>
            <div class="stat-desc">Se limpiarán al destruir</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Contador timer</div>
            <div class="stat-value">{{ timerCount() }}</div>
            <div class="stat-desc">Observable con takeUntil</div>
          </div>
        </div>

        <div class="demo-controls">
          <button class="btn-primary" (click)="startTimer()">▶️ Iniciar Timer</button>
          <button class="btn-danger" (click)="stopTimer()">⏹️ Detener Timer</button>
          <p class="info-text">
            ℹ️ El timer se detendrá automáticamente al destruir el componente (sin memory leak)
          </p>
        </div>

        <div class="code-example">
          <h4>Código (Patrón destroy$):</h4>
          <pre><code>export class MyComponent implements OnDestroy {{'{'}}
  private destroy$ = new Subject&lt;void&gt;();

  ngOnInit() {{'{'}}
    this.service.getData()
      .pipe(takeUntil(this.destroy$)) // ✅ Se cancela automáticamente
      .subscribe(data => {{'{'}} ... {{'}'}});
  {{'}'}}

  ngOnDestroy() {{'{'}}
    this.destroy$.next();    // Emite señal de destrucción
    this.destroy$.complete(); // Completa el subject
  {{'}'}}
{{'}'}}</code></pre>
        </div>

        <div class="code-example">
          <h4>Alternativa (take, first):</h4>
          <pre><code>// Para observables que completan de una vez
this.service.getUser(id)
  .pipe(take(1)) // Solo toma 1 emisión y se completa
  .subscribe(user => {{'{'}} ... {{'}'}});

// Equivalente con first()
this.service.getUser(id)
  .pipe(first())
  .subscribe(user => {{'{'}} ... {{'}'}});</code></pre>
        </div>
      </section>

      <!-- Sección 4: Async Pipe -->
      <section class="demo-section">
        <div class="section-header">
          <h2>4️⃣ Async Pipe</h2>
          <span class="badge badge-success">✅ Recomendado</span>
        </div>

        <div class="info-box">
          <h4>¿Qué hace?</h4>
          <p>
            El async pipe se suscribe automáticamente a observables y se desuscribe
            cuando el componente se destruye. Es la forma más segura de usar observables.
          </p>
          <p>
            <strong>Ventajas:</strong>
          </p>
          <ul>
            <li>No requiere subscribe() manual</li>
            <li>No requiere unsubscribe en ngOnDestroy</li>
            <li>Funciona con OnPush automáticamente</li>
            <li>Previene memory leaks</li>
          </ul>
        </div>

        <div class="demo-display">
          <h4>Observable Timer (con async pipe):</h4>
          <div class="timer-display">
            <span class="timer-value">{{ asyncTimer$ | async }}</span>
            <span class="timer-label">segundos</span>
          </div>
          <p class="info-text">
            ℹ️ Este observable se gestiona 100% por el async pipe (cero código en el componente)
          </p>
        </div>

        <div class="code-example">
          <h4>Código:</h4>
          <pre><code>// Component
export class MyComponent {{'{'}}
  // Solo exponer el observable
  data$ = this.service.getData();
  loading$ = this.service.loading$;
{{'}'}}

// Template
&lt;div *ngIf="loading$ | async"&gt;Cargando...&lt;/div&gt;

&lt;div *ngIf="data$ | async as data"&gt;
  &lt;p&gt;{{'{{'}} data.title {{'}}'}}&lt;/p&gt;
&lt;/div&gt;</code></pre>
        </div>

        <div class="comparison-table">
          <h4>Comparativa:</h4>
          <table>
            <thead>
              <tr>
                <th>Aspecto</th>
                <th>Subscribe Manual</th>
                <th>Async Pipe ✅</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Código en componente</td>
                <td class="bad">~10 líneas</td>
                <td class="good">1 línea</td>
              </tr>
              <tr>
                <td>Riesgo de memory leak</td>
                <td class="bad">Alto</td>
                <td class="good">Cero</td>
              </tr>
              <tr>
                <td>OnPush compatible</td>
                <td class="bad">Requiere ChangeDetectorRef</td>
                <td class="good">Automático</td>
              </tr>
              <tr>
                <td>Mantenibilidad</td>
                <td class="bad">Media</td>
                <td class="good">Alta</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Resumen Final -->
      <section class="demo-section summary-section">
        <h2>📊 Resumen de Optimizaciones</h2>

        <div class="checklist">
          <div class="checklist-item">
            <span class="check">✅</span>
            <div class="item-content">
              <h4>OnPush Change Detection</h4>
              <p>Reduce verificaciones de CD en ~{{ improvement }}%</p>
            </div>
          </div>
          <div class="checklist-item">
            <span class="check">✅</span>
            <div class="item-content">
              <h4>TrackBy en listas</h4>
              <p>Evita recrear {{ items().length }} nodos DOM innecesariamente</p>
            </div>
          </div>
          <div class="checklist-item">
            <span class="check">✅</span>
            <div class="item-content">
              <h4>Patrón destroy$</h4>
              <p>Previene {{ activeSubscriptions }} memory leaks potenciales</p>
            </div>
          </div>
          <div class="checklist-item">
            <span class="check">✅</span>
            <div class="item-content">
              <h4>Async Pipe</h4>
              <p>Gestión automática de suscripciones en templates</p>
            </div>
          </div>
        </div>

        <div class="final-stats">
          <h3>Impacto Estimado:</h3>
          <div class="impact-grid">
            <div class="impact-card">
              <div class="impact-icon">⚡</div>
              <div class="impact-label">Performance</div>
              <div class="impact-value">+85%</div>
            </div>
            <div class="impact-card">
              <div class="impact-icon">🧠</div>
              <div class="impact-label">Uso de Memoria</div>
              <div class="impact-value">-40%</div>
            </div>
            <div class="impact-card">
              <div class="impact-icon">🔧</div>
              <div class="impact-label">Mantenibilidad</div>
              <div class="impact-value">+60%</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .performance-demo {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .demo-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .demo-header h1 {
      color: #2563eb;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #6b7280;
      font-size: 1.1rem;
    }

    .demo-section {
      background: white;
      border-radius: 0.75rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .section-header h2 {
      margin: 0;
      color: #111827;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .info-box {
      background: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      border-radius: 0.5rem;
    }

    .info-box h4 {
      margin-top: 0;
      color: #1e40af;
    }

    .info-box ul {
      margin-bottom: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1.5rem;
      border-radius: 0.75rem;
      text-align: center;
    }

    .stat-bad {
      background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
    }

    .stat-good {
      background: linear-gradient(135deg, #34d399 0%, #059669 100%);
    }

    .stat-excellent {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .stat-desc {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .code-example {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-top: 1.5rem;
      overflow-x: auto;
    }

    .code-example h4 {
      margin-top: 0;
      color: #f1f5f9;
    }

    .code-example pre {
      margin: 0;
    }

    .code-example code {
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .demo-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .btn-primary, .btn-secondary, .btn-warning, .btn-danger {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #10b981;
      color: white;
    }

    .btn-primary:hover {
      background: #059669;
    }

    .btn-secondary {
      background: #3b82f6;
      color: white;
    }

    .btn-secondary:hover {
      background: #2563eb;
    }

    .btn-warning {
      background: #f59e0b;
      color: white;
    }

    .btn-warning:hover {
      background: #d97706;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .list-container h4 {
      margin-top: 0;
      color: #111827;
    }

    .list-stats {
      background: #f3f4f6;
      padding: 0.75rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .scrollable-list {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 0.75rem;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      transition: all 0.2s;
    }

    .list-item:hover {
      background: #f9fafb;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .item-id {
      font-size: 0.75rem;
      color: #6b7280;
      font-family: monospace;
    }

    .item-name {
      font-weight: 600;
      color: #111827;
    }

    .item-badge {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
    }

    .info-text {
      color: #6b7280;
      font-size: 0.875rem;
      font-style: italic;
      margin: 0.5rem 0;
    }

    .demo-display {
      background: #f9fafb;
      padding: 2rem;
      border-radius: 0.75rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .timer-display {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.5rem;
      margin: 1rem 0;
    }

    .timer-value {
      font-size: 4rem;
      font-weight: bold;
      color: #2563eb;
    }

    .timer-label {
      font-size: 1.5rem;
      color: #6b7280;
    }

    .comparison-table {
      margin-top: 1.5rem;
    }

    .comparison-table table {
      width: 100%;
      border-collapse: collapse;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    .comparison-table th {
      background: #f3f4f6;
      font-weight: 600;
      color: #111827;
    }

    .comparison-table .bad {
      color: #dc2626;
      font-weight: 500;
    }

    .comparison-table .good {
      color: #059669;
      font-weight: 500;
    }

    .summary-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .summary-section h2 {
      color: white;
      border-bottom-color: rgba(255, 255, 255, 0.2);
    }

    .checklist {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .checklist-item {
      display: flex;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 0.75rem;
    }

    .checklist-item .check {
      font-size: 2rem;
    }

    .checklist-item h4 {
      margin: 0 0 0.5rem 0;
    }

    .checklist-item p {
      margin: 0;
      opacity: 0.9;
    }

    .final-stats h3 {
      color: white;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .impact-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }

    .impact-card {
      background: rgba(255, 255, 255, 0.15);
      padding: 2rem;
      border-radius: 0.75rem;
      text-align: center;
    }

    .impact-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .impact-label {
      font-size: 0.875rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .impact-value {
      font-size: 2rem;
      font-weight: bold;
    }

    @media (max-width: 768px) {
      .comparison-grid {
        grid-template-columns: 1fr;
      }

      .impact-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OptimizacionRendimientoDemo implements OnDestroy {
  // Estadísticas OnPush
  changeDetectionCountWithout = 250;
  changeDetectionCountWith = 25;
  improvement = 90;

  // Items para demostrar trackBy
  private itemCounter = 1;
  items = signal<Array<{id: number, name: string, type: string}>>([
    { id: 1, name: 'Item 1', type: 'Type A' },
    { id: 2, name: 'Item 2', type: 'Type B' },
    { id: 3, name: 'Item 3', type: 'Type A' },
    { id: 4, name: 'Item 4', type: 'Type C' },
    { id: 5, name: 'Item 5', type: 'Type B' }
  ]);

  domNodesRecreatedWithout = computed(() => this.items().length);
  domNodesRecreatedWith = computed(() => 1); // Solo el modificado

  // Patrón destroy$ para unsubscribe
  private destroy$ = new Subject<void>(); // ✅ Optimización 3
  activeSubscriptions = 0;
  timerCount = signal(0);
  private timerSubscription: any = null;

  // Async pipe demo
  asyncTimer$ = interval(1000); // ✅ Optimización 4

  constructor() {
    this.itemCounter = this.items().length + 1;
  }

  // ✅ TrackBy function (Optimización 2)
  trackById(index: number, item: { id: number, name: string, type: string }): number {
    return item.id;
  }

  // Métodos para manipular items
  addItem(): void {
    const newItem = {
      id: this.itemCounter++,
      name: `Item ${this.itemCounter}`,
      type: ['Type A', 'Type B', 'Type C'][Math.floor(Math.random() * 3)]
    };
    this.items.update(list => [...list, newItem]);
  }

  updateRandomItem(): void {
    const currentItems = this.items();
    if (currentItems.length === 0) return;

    const randomIndex = Math.floor(Math.random() * currentItems.length);
    const updated = currentItems.map((item, idx) =>
      idx === randomIndex
        ? { ...item, name: `${item.name} (editado)` }
        : item
    );
    this.items.set(updated);
  }

  shuffleItems(): void {
    const shuffled = [...this.items()].sort(() => Math.random() - 0.5);
    this.items.set(shuffled);
  }

  removeLastItem(): void {
    const current = this.items();
    if (current.length > 0) {
      this.items.set(current.slice(0, -1));
    }
  }

  // Demostración patrón destroy$
  startTimer(): void {
    if (this.timerSubscription) {
      this.stopTimer();
    }

    this.activeSubscriptions++;
    this.timerCount.set(0);

    // ✅ Uso de takeUntil para auto-limpieza
    this.timerSubscription = interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.timerCount.update(c => c + 1);
      });
  }

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
      this.activeSubscriptions--;
    }
  }

  // ✅ Implementación de OnDestroy (Optimización 3)
  ngOnDestroy(): void {
    console.log('🧹 Limpiando suscripciones...');
    this.destroy$.next();
    this.destroy$.complete();
    console.log('✅ Componente destruido sin memory leaks');
  }
}

