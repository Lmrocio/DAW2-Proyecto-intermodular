import { Injectable, inject } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

/**
 * Servicio de navegación centralizado que demuestra todas las capacidades
 * de navegación programática de Angular Router.
 *
 * Ejemplos de uso según FASE_4.md Tarea 2
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  // =========================================================================
  // NAVEGACIÓN BÁSICA
  // =========================================================================

  /**
   * Navega a la página de inicio
   */
  goHome() {
    this.router.navigate(['/']);
  }

  /**
   * Navega a la lista de lecciones
   */
  goToLecciones() {
    this.router.navigate(['/lecciones']);
  }

  // =========================================================================
  // NAVEGACIÓN CON PARÁMETROS DE RUTA
  // =========================================================================

  /**
   * Navega al detalle de una lección específica
   * Ejemplo: /lecciones/123
   */
  goToLeccionDetalle(leccionId: number | string) {
    this.router.navigate(['/lecciones', leccionId]);
  }

  // =========================================================================
  // NAVEGACIÓN CON QUERY PARAMS
  // =========================================================================

  /**
   * Navega a lecciones con filtros de búsqueda
   * Ejemplo: /lecciones?categoria=trafico&nivel=basico&page=2
   */
  goToLeccionesConFiltros(categoria?: string, nivel?: string, page?: number) {
    const queryParams: any = {};

    if (categoria) queryParams.categoria = categoria;
    if (nivel) queryParams.nivel = nivel;
    if (page) queryParams.page = page;

    this.router.navigate(['/lecciones'], { queryParams });
  }

  /**
   * Navega preservando los query params existentes
   */
  goToLeccionesPreservandoFiltros() {
    this.router.navigate(['/lecciones'], {
      queryParamsHandling: 'preserve' // mantiene query params actuales
    });
  }

  /**
   * Navega fusionando query params nuevos con existentes
   */
  goToLeccionesMergeandoFiltros(nuevosFiltros: { [key: string]: any }) {
    this.router.navigate(['/lecciones'], {
      queryParams: nuevosFiltros,
      queryParamsHandling: 'merge' // fusiona con los existentes
    });
  }

  // =========================================================================
  // NAVEGACIÓN CON FRAGMENT (ANCHOR/SCROLL)
  // =========================================================================

  /**
   * Navega a una sección específica de la página
   * Ejemplo: /about#mision
   */
  goToAboutSeccion(seccion: string) {
    this.router.navigate(['/about'], {
      fragment: seccion // hace scroll a #mision, #vision, etc.
    });
  }

  /**
   * Navega a lección con filtros Y scroll a comentarios
   * Ejemplo: /lecciones/123?destacado=true#comentarios
   */
  goToLeccionConFiltrosYFragment(leccionId: number, fragment: string) {
    this.router.navigate(['/lecciones', leccionId], {
      queryParams: { destacado: true },
      fragment: fragment
    });
  }

  // =========================================================================
  // NAVEGACIÓN CON STATE (datos en memoria, no en URL)
  // =========================================================================

  /**
   * Navega pasando datos que NO se ven en la URL
   * Útil para pasar objetos complejos entre rutas
   */
  goToLeccionConDatos(leccionId: number, datosCompletos: any) {
    this.router.navigate(['/lecciones', leccionId], {
      state: {
        leccion: datosCompletos,
        origen: 'buscador',
        timestamp: Date.now()
      }
    });
  }

  /**
   * Ejemplo: Navegación después de login pasando datos del usuario
   */
  redirectDespuesLogin(usuario: any, returnUrl: string = '/') {
    this.router.navigate([returnUrl], {
      state: {
        usuario,
        mensaje: 'Bienvenido de nuevo'
      },
      replaceUrl: true // no añade al historial (evita volver al login con "atrás")
    });
  }

  // =========================================================================
  // NAVEGACIÓN CON NavigationExtras COMPLETO
  // =========================================================================

  /**
   * Ejemplo completo usando todas las opciones de NavigationExtras
   * según documentación de FASE_4.md
   */
  navegacionCompleta(leccionId: number) {
    const extras: NavigationExtras = {
      // Parámetros de consulta en la URL
      queryParams: {
        categoria: 'seguridad',
        destacado: true,
        page: 1
      },

      // Fragment para scroll
      fragment: 'comentarios',

      // Cómo manejar query params existentes
      queryParamsHandling: 'merge', // 'preserve' | 'merge' | ''

      // Datos en memoria (no visibles en URL)
      state: {
        detallesExtendidos: { /* objeto complejo */ },
        origenNavegacion: 'menu-principal'
      },

      // Reemplazar entrada en historial (útil para redirects)
      replaceUrl: false, // true evita que "atrás" vuelva aquí

      // Navegar sin cambiar la URL visible
      skipLocationChange: false, // true = navegación invisible en barra de direcciones

      // Preservar fragmento actual
      preserveFragment: false
    };

    this.router.navigate(['/lecciones', leccionId], extras);
  }

  // =========================================================================
  // NAVEGACIÓN RELATIVA
  // =========================================================================

  /**
   * Navega relativamente a la ruta actual
   * Debe usarse con ActivatedRoute inyectado en el componente
   */
  navegarRelativo(route: any, segmento: string) {
    this.router.navigate([segmento], {
      relativeTo: route // navega relativo a la ruta actual
    });
  }

  // =========================================================================
  // NAVEGACIÓN CON CONFIRMACIÓN
  // =========================================================================

  /**
   * Navega después de confirmar acción
   */
  async navegarConConfirmacion(destino: string[]) {
    const confirmar = confirm('¿Estás seguro de salir?');
    if (confirmar) {
      await this.router.navigate(destino);
    }
  }

  // =========================================================================
  // NAVEGACIÓN PROGRAMÁTICA CON URL STRING
  // =========================================================================

  /**
   * Navega usando URL como string (menos recomendado que arrays)
   */
  navigateByUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  // =========================================================================
  // OBTENER ESTADO DE NAVEGACIÓN ACTUAL
  // =========================================================================

  /**
   * Lee el estado pasado en la navegación anterior
   * Debe llamarse en ngOnInit del componente destino
   */
  obtenerEstadoNavegacion(): any {
    const navigation = this.router.getCurrentNavigation();
    return navigation?.extras.state;
  }

  /**
   * Obtiene la URL actual
   */
  obtenerUrlActual(): string {
    return this.router.url;
  }
}

