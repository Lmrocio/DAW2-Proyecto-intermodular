import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ChevronDown, ChevronUp } from 'lucide-angular';

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
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sidebar-filtros.html',
  styleUrl: './sidebar-filtros.scss',
})
export class SidebarFiltros {
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;

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
    },
    {
      id: 'duracion',
      title: 'Duración',
      expanded: false,
      options: [
        { id: 'corta', label: '0-5 min', count: 12 },
        { id: 'media', label: '5-15 min', count: 18 },
        { id: 'larga', label: '15+ min', count: 13 }
      ]
    }
  ];

  toggleCategory(categoryId: string): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      category.expanded = !category.expanded;
    }
  }

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

    this.filterChange.emit(this.selectedFilters);
  }

  isFilterSelected(categoryId: string, optionId: string): boolean {
    return this.selectedFilters[categoryId]?.includes(optionId) || false;
  }

  clearAllFilters(): void {
    this.selectedFilters = {};
    this.filterChange.emit(this.selectedFilters);
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.selectedFilters).some(arr => arr.length > 0);
  }
}

