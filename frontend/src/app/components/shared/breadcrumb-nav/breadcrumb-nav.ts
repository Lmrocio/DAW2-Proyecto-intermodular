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

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe(crumbs => {
      this.breadcrumbs = crumbs;
    });
  }
}

