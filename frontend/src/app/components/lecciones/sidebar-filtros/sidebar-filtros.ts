import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCategory {
  id: string;
  title: string;
  options: FilterOption[];
  expanded: boolean;
}

@Component({
  selector: 'app-sidebar-filtros',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './sidebar-filtros.html',
  styleUrl: './sidebar-filtros.scss',
})
export class SidebarFiltros {
  @Output() filterChange = new EventEmitter<any>();

  selectedFilters: { [key: string]: string[] } = {};

  categories: FilterCategory[] = [
    {
      id: 'categoria',
      title: 'Categoría',
      expanded: true,
      options: [
        { id: 'basico', label: 'Básico', count: 15 },
        { id: 'comunicacion', label: 'Comunicación', count: 12 },
        { id: 'multimedia', label: 'Multimedia', count: 8 },
        { id: 'seguridad', label: 'Seguridad', count: 6 },
        { id: 'navegacion', label: 'Navegación', count: 10 }
      ]
    },
    {
      id: 'nivel',
      title: 'Nivel',
      expanded: true,
      options: [
        { id: 'principiante', label: 'Principiante', count: 20 },
        { id: 'intermedio', label: 'Intermedio', count: 15 },
        { id: 'avanzado', label: 'Avanzado', count: 8 }
      ]
    }
  ];

  toggleFilter(categoryId: string, optionId: string): void {
    if (!this.selectedFilters[categoryId]) {
      this.selectedFilters[categoryId] = [];
    }

    const index = this.selectedFilters[categoryId].indexOf(optionId);
    if (index > -1) {
      this.selectedFilters[categoryId].splice(index, 1);
    } else {
      this.selectedFilters[categoryId].push(optionId);
    }

    // NO emitir automáticamente: filtrado manual mediante botón "Buscar"
  }

  isFilterSelected(categoryId: string, optionId: string): boolean {
    return this.selectedFilters[categoryId]?.includes(optionId) || false;
  }

  clearAllFilters(): void {
    this.selectedFilters = {};
    // No emitir automáticamente. El usuario debe pulsar "Buscar" para aplicar.
  }

  // Método que aplica los filtros seleccionados y emite el evento
  applyFilters(): void {
    this.filterChange.emit(this.selectedFilters);
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some(arr => arr.length > 0);
  }
}
