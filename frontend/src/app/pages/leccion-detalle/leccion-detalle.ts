import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Leccion } from '../../services/leccion.service';

/**
 * Componente de detalle de lección
 *
 * FUNCIONALIDAD RESOLVER (FASE 4 - Tarea 5):
 * - Los datos de la lección se precargan con leccionResolver
 * - Se leen desde route.data en lugar de cargarlos aquí
 * - Si el resolver falla, redirige a /lecciones automáticamente
 *
 * VENTAJAS:
 * - No se muestra vista vacía mientras carga
 * - Manejo centralizado de errores en resolver
 * - Mejor UX: datos listos al activar componente
 */
@Component({
  selector: 'app-leccion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leccion-detalle.html',
  styleUrl: './leccion-detalle.scss'
})
export class LeccionDetalle implements OnInit {
  private route = inject(ActivatedRoute);

  // Datos precargados por resolver
  leccion = signal<Leccion | null>(null);
  loading = signal<boolean>(false);

  ngOnInit() {
    // Leer datos PRECARGADOS desde route.data (resolver)
    this.route.data.subscribe(data => {
      const leccionData = data['leccion'] as Leccion | null;

      if (leccionData) {
        console.log('✅ LeccionDetalle: Datos recibidos del resolver:', leccionData);
        this.leccion.set(leccionData);
      } else {
        console.warn('⚠️ LeccionDetalle: No hay datos (resolver falló o redirigió)');
        // El resolver ya redirigió a /lecciones con mensaje de error
      }
    });

    // Ejemplo de lectura de query params (si se usan para filtros)
    this.route.queryParamMap.subscribe(queryParams => {
      const destacado = queryParams.get('destacado');
      if (destacado) {
        console.log('🌟 Lección destacada:', destacado);
      }
    });
  }
}

