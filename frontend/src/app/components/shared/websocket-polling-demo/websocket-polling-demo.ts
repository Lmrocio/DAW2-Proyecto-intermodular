import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, timer, interval, of, Observable } from 'rxjs';
import { switchMap, takeUntil, shareReplay, delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
}

@Component({
  selector: 'app-websocket-polling-demo',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './websocket-polling-demo.html',
  styleUrl: './websocket-polling-demo.scss'
})
export class WebsocketPollingDemo implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Tabs
  activeTab = signal<'websocket' | 'polling'>('websocket');

  // WebSocket state
  websocketConnected = signal(false);
  websocketNotifications = signal<Notification[]>([]);
  private socket$: WebSocketSubject<any> | null = null;

  // Polling state
  pollingActive = signal(false);
  pollingNotifications = signal<Notification[]>([]);
  pollingInterval = signal(5000); // 5 segundos
  private pollingTimer$ = new Subject<void>();

  // Simulación de servidor
  private mockServerNotifications: string[] = [
    '¡Nuevo mensaje recibido!',
    'Tu pedido ha sido procesado',
    'Actualización del sistema disponible',
    'Recordatorio: Reunión en 15 minutos',
    'Has recibido un nuevo comentario',
    'Descarga completada exitosamente',
    'Error en la sincronización de datos',
    'Nuevo usuario registrado',
    'Backup completado',
    'Tu perfil ha sido actualizado'
  ];

  ngOnInit(): void {
    // Inicializar (sin auto-conectar)
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
    this.stopPolling();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== WEBSOCKET ====================

  connectWebSocket(): void {
    if (this.websocketConnected()) return;

    console.log('🔌 Conectando a WebSocket simulado...');

    // Simulamos WebSocket con un interval que emite notificaciones aleatorias
    // En producción sería: webSocket('wss://api.miapp.com/notifications')
    this.simulateWebSocketConnection();

    this.websocketConnected.set(true);
  }

  disconnectWebSocket(): void {
    if (!this.websocketConnected()) return;

    console.log('🔌 Desconectando WebSocket...');

    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }

    this.websocketConnected.set(false);
  }

  private simulateWebSocketConnection(): void {
    // Simular mensajes del servidor cada 3-7 segundos
    interval(this.getRandomInterval(3000, 7000))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.websocketConnected()) {
          this.handleWebSocketMessage(this.generateMockNotification());
        }
      });
  }

  private handleWebSocketMessage(notification: Notification): void {
    console.log('📨 WebSocket recibió:', notification);

    const current = this.websocketNotifications();
    this.websocketNotifications.set([notification, ...current].slice(0, 20)); // Máximo 20
  }

  clearWebSocketNotifications(): void {
    this.websocketNotifications.set([]);
  }

  // ==================== POLLING ====================

  startPolling(): void {
    if (this.pollingActive()) return;

    console.log(`⏱️ Iniciando polling cada ${this.pollingInterval()}ms...`);

    timer(0, this.pollingInterval())
      .pipe(
        switchMap(() => this.simulateHttpPoll()),
        takeUntil(this.pollingTimer$),
        takeUntil(this.destroy$)
      )
      .subscribe((notifications: Notification[]) => {
        console.log('📥 Polling recibió:', notifications.length, 'notificaciones');
        this.pollingNotifications.set(notifications);
      });

    this.pollingActive.set(true);
  }

  stopPolling(): void {
    if (!this.pollingActive()) return;

    console.log('⏱️ Deteniendo polling...');
    this.pollingTimer$.next();
    this.pollingActive.set(false);
  }

  private simulateHttpPoll(): Observable<Notification[]> {
    // Simular llamada HTTP GET /api/notifications
    // Retorna nuevas notificaciones cada vez
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 notificaciones
    const notifications: Notification[] = [];

    for (let i = 0; i < count; i++) {
      notifications.push(this.generateMockNotification());
    }

    // Simular latencia de red
    return of(notifications).pipe(delay(300));
  }

  changePollingInterval(ms: number): void {
    this.pollingInterval.set(ms);

    if (this.pollingActive()) {
      this.stopPolling();
      setTimeout(() => this.startPolling(), 100);
    }
  }

  clearPollingNotifications(): void {
    this.pollingNotifications.set([]);
  }

  // ==================== HELPERS ====================

  private generateMockNotification(): Notification {
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    const randomMessage = this.mockServerNotifications[
      Math.floor(Math.random() * this.mockServerNotifications.length)
    ];

    return {
      id: Date.now() + Math.random(),
      message: randomMessage,
      timestamp: new Date(),
      type: types[Math.floor(Math.random() * types.length)]
    };
  }

  private getRandomInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  trackById(index: number, item: Notification): number {
    return item.id;
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || 'ℹ️';
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}

