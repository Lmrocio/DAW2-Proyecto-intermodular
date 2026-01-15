import { Injectable, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

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
  private activatedRoute = inject(ActivatedRoute);

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
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this._breadcrumbs$.next(breadcrumbs);
        console.log('🍞 Breadcrumbs actualizados:', breadcrumbs);
      });
  }

  /**
   * Construir breadcrumbs recursivamente desde el árbol de rutas
   */
  private buildBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      // Construir URL acumulativa
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Obtener label desde data.breadcrumb
      const label = child.snapshot.data['breadcrumb'] as string | undefined;

      // Solo añadir si tiene label definido
      if (label) {
        breadcrumbs.push({ label, url });
      }

      // Continuar recursivamente con hijos
      return this.buildBreadcrumbs(child, url, breadcrumbs);
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
   */
  createBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const children: ActivatedRouteSnapshot[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url.map(segment => segment.path).join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}

