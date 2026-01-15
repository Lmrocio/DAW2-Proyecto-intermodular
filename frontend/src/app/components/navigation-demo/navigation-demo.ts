import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

/**
 * Componente de ejemplo que demuestra el uso de navegación programática
 * según FASE_4.md Tarea 2
 *
 * Incluye:
 * - Navegación básica con Router
 * - Navegación con parámetros de ruta
 * - Navegación con query params
 * - Navegación con fragments
 * - Navegación con state
 * - Lectura de parámetros con ActivatedRoute
 */
@Component({
  selector: 'app-navigation-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-demo.html',
  styleUrl: './navigation-demo.scss'
})
export class NavigationDemo implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  navService = inject(NavigationService); // cambiado a público para uso en template

  // Estado del componente
  estadoRecibido: any = null;
  parametrosRuta: any = null;
  queryParams: any = null;
  fragment: string | null = null;

  ngOnInit() {
    // ========================================================================
    // LECTURA DE PARÁMETROS CON ActivatedRoute
    // ========================================================================

    // Leer parámetros de ruta (ejemplo: /lecciones/:id)
    this.route.paramMap.subscribe(params => {
      this.parametrosRuta = {
        id: params.get('id'),
        categoria: params.get('categoria')
      };
      console.log('Parámetros de ruta:', this.parametrosRuta);
    });

    // Leer query params (ejemplo: ?categoria=trafico&nivel=basico)
    this.route.queryParamMap.subscribe(queryParams => {
      this.queryParams = {
        categoria: queryParams.get('categoria'),
        nivel: queryParams.get('nivel'),
        page: queryParams.get('page')
      };
      console.log('Query params:', this.queryParams);
    });

    // Leer fragment (ejemplo: #comentarios)
    this.route.fragment.subscribe(fragment => {
      this.fragment = fragment;
      console.log('Fragment:', this.fragment);
    });

    // Leer state pasado en la navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.estadoRecibido = navigation.extras.state;
      console.log('Estado recibido:', this.estadoRecibido);
    }
  }

  // ==========================================================================
  // EJEMPLOS DE NAVEGACIÓN PROGRAMÁTICA
  // ==========================================================================

  /**
   * Ejemplo 1: Navegación básica
   */
  irAHome() {
    this.router.navigate(['/home']);
  }

  /**
   * Ejemplo 2: Navegación con parámetros de ruta
   */
  irALeccion(leccionId: number) {
    this.router.navigate(['/lecciones', leccionId]);
  }

  /**
   * Ejemplo 3: Navegación con query params
   */
  irALeccionesFiltradas() {
    this.router.navigate(['/lecciones'], {
      queryParams: {
        categoria: 'trafico',
        nivel: 'basico',
        page: 1
      }
    });
  }

  /**
   * Ejemplo 4: Navegación con fragment (scroll a sección)
   */
  irAAboutMision() {
    this.router.navigate(['/about'], {
      fragment: 'mision'
    });
  }

  /**
   * Ejemplo 5: Navegación con state (datos no visibles en URL)
   */
  irALeccionConDatos() {
    this.router.navigate(['/lecciones', 123], {
      state: {
        leccion: {
          titulo: 'Señales de tráfico',
          duracion: '45 min',
          completada: false
        },
        origen: 'demo-navegacion',
        timestamp: Date.now()
      }
    });
  }

  /**
   * Ejemplo 6: Navegación completa con NavigationExtras
   */
  navegacionCompleta() {
    this.router.navigate(['/lecciones', 456], {
      queryParams: {
        destacado: true,
        categoria: 'seguridad'
      },
      fragment: 'comentarios',
      state: {
        detallesExtendidos: { /* datos complejos */ }
      },
      queryParamsHandling: 'merge' // fusiona con query params existentes
    });
  }

  /**
   * Ejemplo 7: Navegación preservando query params
   */
  navegarPreservandoFiltros() {
    this.router.navigate(['/lecciones'], {
      queryParamsHandling: 'preserve' // mantiene query params actuales
    });
  }

  /**
   * Ejemplo 8: Navegación con replaceUrl (no añade al historial)
   */
  redirectSinHistorial() {
    this.router.navigate(['/home'], {
      replaceUrl: true // el botón "atrás" no volverá aquí
    });
  }

  /**
   * Ejemplo 9: Usar el servicio de navegación centralizado
   */
  usarServicioNavegacion() {
    // Navegación básica
    this.navService.goToLecciones();

    // Navegación con parámetros
    this.navService.goToLeccionDetalle(789);

    // Navegación con filtros
    this.navService.goToLeccionesConFiltros('trafico', 'avanzado', 2);

    // Navegación con datos complejos
    this.navService.goToLeccionConDatos(123, {
      /* datos completos */
    });
  }

  /**
   * Ejemplo 10: Navegación relativa
   */
  navegarRelativo() {
    // Navega relativo a la ruta actual
    // Si estamos en /usuario, esto navega a /usuario/perfil
    this.router.navigate(['perfil'], {
      relativeTo: this.route
    });
  }
}

