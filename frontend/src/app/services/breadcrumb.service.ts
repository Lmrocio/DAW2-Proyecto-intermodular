import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { take } from 'rxjs/operators';
import { LeccionService } from './leccion.service';
import { SimuladorService, Simulador } from './simulador.service';

/**
 * Interfaz para un breadcrumb individual
 */
export interface Breadcrumb {
  label: string;
  url: string;
}

/**
 * Servicio de Breadcrumbs Dinámicos
 * según FASE_4.md - Tarea 6
 *
 * Construye breadcrumbs automáticamente desde la configuración de rutas
 * usando la propiedad `data.breadcrumb` de cada ruta.
 *
 * CONFIGURACIÓN EN RUTAS:
 * {
 *   path: 'lecciones',
 *   component: Lecciones,
 *   data: { breadcrumb: 'Lecciones' }
 * }
 *
 * USO EN COMPONENTE:
 * breadcrumbService.breadcrumbs$.subscribe(crumbs => {
 *   this.breadcrumbs = crumbs;
 * });
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private router = inject(Router);
  private leccionService = inject(LeccionService);
  private simuladorService = inject(SimuladorService);

  // Observable de breadcrumbs que se actualiza en cada navegación
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {
    // Escuchar eventos de navegación
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        // Usar snapshot traversal para construir breadcrumbs de forma determinista
        const breadcrumbs = this.buildFromActivatedSnapshot(this.router.routerState.snapshot.root);
        this._breadcrumbs$.next(breadcrumbs);
        console.log('🍞 Breadcrumbs actualizados:', breadcrumbs);
      });
  }

  /**
   * Construir breadcrumbs recorriendo la cadena activada (ActivatedRouteSnapshot)
   * Esta función sigue únicamente la rama activa (first child) para preservar el orden
   */
  private buildFromActivatedSnapshot(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    let current: ActivatedRouteSnapshot | null = route;

    while (current) {
      // Reconstruir la porción de ruta desde routeConfig.path si está disponible
      const rcPath = current.routeConfig?.path ?? '';
      let constructedPart = '';
      if (rcPath) {
        const tokens = rcPath.split('/');
        // Capturar params del snapshot actual (current es no-null aquí)
        const params = current!.params;
        constructedPart = tokens
          .map(tok => tok.startsWith(':') ? (params ? params[tok.slice(1)] : tok) : tok)
          .filter(Boolean)
          .join('/');
      }

      // Fallback si no hay routeConfig: usar los segmentos reales
      if (!constructedPart) {
        const segments = current.url.map(s => s.path);
        constructedPart = segments.join('/');
      }

      // Construir URL acumulada
      let accumulatedUrl = url;
      if (constructedPart) {
        accumulatedUrl = url ? `${url}/${constructedPart}` : `/${constructedPart}`;
      }

      // Si rcPath contiene parámetros (ej: 'lecciones/:id'), añadir breadcrumb intermedio
      if (rcPath && rcPath.includes(':')) {
        // Extraer la parte estática antes del parámetro (ej: 'lecciones' de 'lecciones/:id')
        const staticPrefix = rcPath.split('/').filter(p => !p.startsWith(':')).join('/');
        if (staticPrefix) {
          const prefixUrl = `/${staticPrefix}`;
          // Buscar la ruta que coincida exactamente con el prefijo estático
          const match = this.router.config.find(r => r.path === staticPrefix);
          const prefixLabel = match?.data?.['breadcrumb'] as string | undefined;
          // Añadir el breadcrumb intermedio si existe y no está ya añadido
          if (prefixLabel && !breadcrumbs.some(b => b.url === prefixUrl)) {
            breadcrumbs.push({ label: prefixLabel, url: prefixUrl });
          }
        }
      }

      // Determinar label preferente: resolved 'leccion' -> titulo, sino data.breadcrumb
      let label: string | undefined = undefined;
      const resolvedLeccion = current.data && (current.data as any)['leccion'];
      const resolvedSimulador = current.data && (current.data as any)['simulador'];

      if (resolvedLeccion && typeof resolvedLeccion === 'object' && 'titulo' in resolvedLeccion) {
        label = resolvedLeccion.titulo;
      } else if (resolvedSimulador && typeof resolvedSimulador === 'object' && 'titulo' in resolvedSimulador) {
        label = resolvedSimulador.titulo;
      } else if (rcPath && rcPath.includes(':') && constructedPart) {
        // Fallback: si la ruta tiene parámetro pero no hay datos resueltos, intentar obtener título desde API
        const idParamMatch = rcPath.match(/:([a-zA-Z0-9_]+)/);
        const idParam = idParamMatch ? idParamMatch[1] : null;
        const idValue = idParam ? (current.params ? current.params[idParam] : null) : null;

        if (idValue && rcPath.startsWith('lecciones')) {
          // Lanzar petición para recuperar la lección y reemitir breadcrumbs cuando llegue
          this.leccionService.getLeccionById(idValue).pipe(take(1)).subscribe(leccion => {
            if (leccion && leccion.titulo) {
              // Recalcular y emitir breadcrumbs con el título resuelto
              const rebuilt = this.buildFromActivatedSnapshot(this.router.routerState.snapshot.root);
              this._breadcrumbs$.next(rebuilt);
            }
          }, () => {
            // en error no hacemos nada adicional
          });
        } else if (idValue && rcPath.startsWith('simuladores')) {
          // Lanzar petición para recuperar el simulador y reemitir breadcrumbs cuando llegue
          this.simuladorService.getSimuladorById(idValue).pipe(take(1)).subscribe((simulador: Simulador) => {
            if (simulador && simulador.titulo) {
              // Recalcular y emitir breadcrumbs con el título resuelto
              const rebuilt = this.buildFromActivatedSnapshot(this.router.routerState.snapshot.root);
              this._breadcrumbs$.next(rebuilt);
            }
          }, () => {
            // en error no hacemos nada adicional
          });
        }
      } else if (current.data && (current.data as any)['breadcrumb']) {
        label = (current.data as any)['breadcrumb'];
      }

      if (label) {
        breadcrumbs.push({ label, url: accumulatedUrl });
      }

      // Avanzar a la siguiente ruta activa (primera child del outlet primario)
      const next: ActivatedRouteSnapshot | null = (current.children && current.children.length) ? (current.children.find(c => c.outlet === 'primary') ?? current.children[0]) : null;
      url = accumulatedUrl; // actualizar url para el siguiente nivel
      current = next ?? null;
    }

    // Si el primer breadcrumb es '/home' y queremos mostrar desde Inicio, mantenerlo
    return breadcrumbs;
  }

  /**
   * Construir breadcrumbs recursivamente desde el árbol de rutas
   * Recorre todos los niveles de rutas anidadas
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    // Si no hay hijos, retornar los breadcrumbs acumulados
    if (children.length === 0) {
      return breadcrumbs;
    }

    // Procesar CADA child (puede haber múltiples rutas en paralelo)
    for (const child of children) {
      // Obtener segmentos URL de este child
      const routeSegments = child.snapshot.url.map(segment => segment.path);
      const routeURL = routeSegments.join('/');

      // Intentar detectar rutas con parámetros desde routeConfig (ej. 'lecciones/:id')
      const rcPath = child.routeConfig?.path ?? '';
      if (rcPath) {
        const staticParts = rcPath.split('/').filter(p => !p.startsWith(':'));
        if (staticParts.length > 0) {
          const intermediatePath = staticParts.join('/');
          const intermediateUrl = url ? `${url}/${intermediatePath}` : `/${intermediatePath}`;
          const match = this.router.config.find(r => r.path === intermediatePath);
          const intermediateLabel = match?.data?.['breadcrumb'] as string | undefined;
          if (intermediateLabel && !breadcrumbs.some(b => b.url === intermediateUrl)) {
            breadcrumbs.push({ label: intermediateLabel, url: intermediateUrl });
          }
        }
      } else if (routeSegments.length > 1) {
        // Fallback: si no hay routeConfig, usar el primer segmento
        const firstSegment = routeSegments[0];
        const intermediateUrl = url ? `${url}/${firstSegment}` : `/${firstSegment}`;
        const match = this.router.config.find(r => r.path === firstSegment);
        const intermediateLabel = match?.data?.['breadcrumb'] as string | undefined;
        if (intermediateLabel && !breadcrumbs.some(b => b.url === intermediateUrl)) {
          breadcrumbs.push({ label: intermediateLabel, url: intermediateUrl });
        }
      }

      // Acumular URL: combinar URL anterior + nuevo segmento
      let accumulatedUrl = url;
      if (routeURL !== '') {
        accumulatedUrl = url ? `${url}/${routeURL}` : `/${routeURL}`;
      }

      // Obtener label desde data.breadcrumb
      let label = child.snapshot.data['breadcrumb'] as string | undefined;

      // Si existe un dato resuelto tipo 'leccion', usar su título como label (dinámico)
      const resolvedLeccion = child.snapshot.data['leccion'] as any | undefined;
      if (resolvedLeccion && typeof resolvedLeccion === 'object' && 'titulo' in resolvedLeccion) {
        label = resolvedLeccion.titulo;
      }

      // Añadir breadcrumb si tiene label definido
      if (label) {
        breadcrumbs.push({
          label,
          url: accumulatedUrl
        });
      }

      // Continuar recursivamente con los hijos de este child,
      // pasando la URL acumulada para mantener la jerarquía completa
      this.buildBreadcrumbs(child, accumulatedUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Obtener breadcrumbs actuales (valor instantáneo)
   */
  getCurrentBreadcrumbs(): Breadcrumb[] {
    return this._breadcrumbs$.value;
  }

  /**
   * Construir breadcrumbs desde snapshot (alternativa)
   * Útil para casos donde no se usa el observable
   * Recorre todos los niveles de rutas anidadas
   */
  createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeSegments = child.url.map(segment => segment.path);
      const routeURL = routeSegments.join('/');

      // Si hay múltiples segmentos, añadir breadcrumb intermedio basado en la ruta configurada
      if (routeSegments.length > 1) {
        const firstSegment = routeSegments[0];
        const intermediateUrl = url ? `${url}/${firstSegment}` : `/${firstSegment}`;
        const match = this.router.config.find(r => r.path === firstSegment);
        const intermediateLabel = match?.data?.['breadcrumb'] as string | undefined;

        if (intermediateLabel && !breadcrumbs.some(b => b.url === intermediateUrl)) {
          breadcrumbs.push({ label: intermediateLabel, url: intermediateUrl });
        }
      }

      // Acumular URL correctamente
      let accumulatedUrl = url;
      if (routeURL !== '') {
        accumulatedUrl = url ? `${url}/${routeURL}` : `/${routeURL}`;
      }

      // Obtener label (estático) y sobrescribir si hay datos resueltos (lección)
      let label = child.data['breadcrumb'];
      const resolvedLeccion = child.data['leccion'] as any | undefined;
      if (resolvedLeccion && typeof resolvedLeccion === 'object' && 'titulo' in resolvedLeccion) {
        label = resolvedLeccion.titulo;
      }

      if (label) {
        breadcrumbs.push({
          label,
          url: accumulatedUrl
        });
      }

      // Continuar recursivamente con URL acumulada
      this.createBreadcrumbs(child, accumulatedUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}
