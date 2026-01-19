import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb-nav.html',
  styleUrl: './breadcrumb-nav.scss'
})
export class BreadcrumbNav implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  breadcrumbs: Breadcrumb[] = [];
  // Breadcrumbs que realmente se muestran (sin duplicar 'Inicio')
  displayBreadcrumbs: Breadcrumb[] = [];

  // True si la única breadcrumb es 'Inicio' (ruta /home)
  isOnlyHome: boolean = false;

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe(crumbs => {
      this.breadcrumbs = crumbs;

      // Calcular si la única crumb es Inicio
      this.isOnlyHome = crumbs.length === 1 && crumbs[0].url === '/home';

      // Filtrar cualquier crumb que apunte a /home para evitar duplicados
      this.displayBreadcrumbs = crumbs.filter(c => c.url !== '/home');
    });
  }
}
