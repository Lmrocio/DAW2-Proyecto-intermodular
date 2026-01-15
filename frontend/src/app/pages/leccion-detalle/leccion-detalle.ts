import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leccion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './leccion-detalle.html',
  styleUrl: './leccion-detalle.scss'
})
export class LeccionDetalle implements OnInit {
  private route = inject(ActivatedRoute);

  leccionId = signal<string | null>(null);
  loading = signal<boolean>(true);

  // Datos de ejemplo - en producción vendrían de un servicio
  leccion = signal<any>(null);

  ngOnInit() {
    // Opción 1: Lectura snapshot (valor actual)
    const id = this.route.snapshot.paramMap.get('id');
    this.leccionId.set(id);

    // Opción 2: Suscripción a cambios de parámetro (recomendado)
    this.route.paramMap.subscribe(params => {
      const leccionId = params.get('id');
      this.leccionId.set(leccionId);
      this.cargarLeccion(leccionId);
    });

    // Leer query params si existen
    this.route.queryParamMap.subscribe(queryParams => {
      const categoria = queryParams.get('categoria');
      const nivel = queryParams.get('nivel');
      console.log('Filtros aplicados:', { categoria, nivel });
    });
  }

  private cargarLeccion(id: string | null) {
    this.loading.set(true);

    // Simulación de carga de datos
    setTimeout(() => {
      this.leccion.set({
        id,
        titulo: `Lección ${id}`,
        descripcion: 'Descripción detallada de la lección',
        duracion: '45 min',
        nivel: 'Intermedio'
      });
      this.loading.set(false);
    }, 500);
  }
}

