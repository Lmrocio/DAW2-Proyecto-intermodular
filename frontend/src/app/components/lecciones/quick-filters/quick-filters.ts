import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-filters.html',
  styleUrl: './quick-filters.scss',
})
export class QuickFilters {
  @Output() filterSelected = new EventEmitter<string>();

  filters = ['WhatsApp', 'Videollamadas', 'Fotos', 'Seguridad'];
  selectedFilter: string | null = null;

  selectFilter(filter: string): void {
    this.selectedFilter = this.selectedFilter === filter ? null : filter;
    this.filterSelected.emit(this.selectedFilter || '');
  }
}

