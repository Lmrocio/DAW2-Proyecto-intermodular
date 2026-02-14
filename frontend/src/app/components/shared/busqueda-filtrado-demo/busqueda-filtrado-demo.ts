import { Component, OnInit, OnDestroy, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, delay } from 'rxjs/operators';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-busqueda-filtrado-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './busqueda-filtrado-demo.html',
  styleUrl: './busqueda-filtrado-demo.scss'
})
export class BusquedaFiltradoDemo implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Control de búsqueda
  searchControl = new FormControl('');

  // Filtros
  categoryFilter = new FormControl('all');
  minPriceFilter = new FormControl('');
  maxPriceFilter = new FormControl('');

  // Tabs
  activeTab = signal<'local' | 'remote'>('local');

  // Datos completos (para filtrado local)
  private allProducts: Product[] = this.generateMockProducts(100);

  // Estado para filtrado local
  filteredProductsLocal = signal<Product[]>([...this.allProducts]);
  searchTermLocal = signal('');

  // Estado para filtrado remoto
  filteredProductsRemote = signal<Product[]>([]);
  loadingRemote = signal(false);
  searchTermRemote = signal('');

  // Estadísticas
  totalProducts = this.allProducts.length;
  resultCountLocal = computed(() => this.filteredProductsLocal().length);
  resultCountRemote = computed(() => this.filteredProductsRemote().length);

  // Categorías disponibles
  categories = ['all', 'Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

  ngOnInit(): void {
    this.setupLocalSearch();
    this.setupRemoteSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ==================== BÚSQUEDA LOCAL ====================

  setupLocalSearch(): void {
    // Combinar todos los filtros
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTermLocal.set(term || '');
      this.applyLocalFilters();
    });

    this.categoryFilter.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyLocalFilters();
    });

    this.minPriceFilter.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyLocalFilters();
    });

    this.maxPriceFilter.valueChanges.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyLocalFilters();
    });
  }

  applyLocalFilters(): void {
    const searchTerm = this.searchTermLocal().toLowerCase();
    const category = this.categoryFilter.value || 'all';
    const minPrice = parseFloat(this.minPriceFilter.value || '0');
    const maxPrice = parseFloat(this.maxPriceFilter.value || '999999');

    let filtered = [...this.allProducts];

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por categoría
    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filtrar por precio
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

    this.filteredProductsLocal.set(filtered);
  }

  // ==================== BÚSQUEDA REMOTA ====================

  setupRemoteSearch(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500), // Mayor debounce para llamadas HTTP
      distinctUntilChanged(),
      switchMap(term => {
        this.searchTermRemote.set(term || '');
        if (this.activeTab() === 'remote') {
          return this.simulateRemoteSearch(term || '');
        }
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.filteredProductsRemote.set(results);
      this.loadingRemote.set(false);
    });
  }

  simulateRemoteSearch(term: string): Observable<Product[]> {
    this.loadingRemote.set(true);

    const searchTerm = term.toLowerCase().trim();
    const category = this.categoryFilter.value || 'all';

    let filtered = [...this.allProducts];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Simular latencia de red
    return of(filtered).pipe(delay(800));
  }

  // ==================== HELPERS ====================

  trackById(index: number, item: Product): number {
    return item.id;
  }

  resetFilters(): void {
    this.searchControl.setValue('');
    this.categoryFilter.setValue('all');
    this.minPriceFilter.setValue('');
    this.maxPriceFilter.setValue('');
    this.searchTermLocal.set('');
    this.searchTermRemote.set('');
    this.filteredProductsLocal.set([...this.allProducts]);
    this.filteredProductsRemote.set([]);
  }

  onTabChange(tab: 'local' | 'remote'): void {
    this.activeTab.set(tab);
    if (tab === 'remote' && this.searchControl.value) {
      // Trigger remote search
      this.simulateRemoteSearch(this.searchControl.value).subscribe(results => {
        this.filteredProductsRemote.set(results);
        this.loadingRemote.set(false);
      });
    }
  }

  private generateMockProducts(count: number): Product[] {
    const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
    const adjectives = ['Premium', 'Básico', 'Profesional', 'Económico', 'Deluxe'];
    const products: Product[] = [];

    for (let i = 1; i <= count; i++) {
      const category = categories[i % categories.length];
      const adjective = adjectives[i % adjectives.length];

      products.push({
        id: i,
        name: `${adjective} Producto ${i}`,
        description: `Descripción detallada del producto ${i} de categoría ${category}`,
        category: category,
        price: Math.round((Math.random() * 1000 + 10) * 100) / 100,
        stock: Math.floor(Math.random() * 100)
      });
    }

    return products;
  }
}

