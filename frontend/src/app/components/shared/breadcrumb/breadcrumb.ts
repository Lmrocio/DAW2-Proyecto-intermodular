import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

/**
 * Componente Breadcrumb reutilizable
 *
 * Se utiliza en todas las páginas para mostrar la ruta de navegación.
 * Ejemplo: Inicio > Catálogo > Detalle
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  @Input() items: BreadcrumbItem[] = [];
}

