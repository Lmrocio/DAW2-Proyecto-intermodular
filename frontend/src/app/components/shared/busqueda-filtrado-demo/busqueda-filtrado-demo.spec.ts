import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BusquedaFiltradoDemo } from './busqueda-filtrado-demo';
import { ReactiveFormsModule } from '@angular/forms';

describe('BusquedaFiltradoDemo', () => {
  let component: BusquedaFiltradoDemo;
  let fixture: ComponentFixture<BusquedaFiltradoDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaFiltradoDemo, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(BusquedaFiltradoDemo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.activeTab()).toBe('local');
    expect(component.searchControl.value).toBe('');
    expect(component.categoryFilter.value).toBe('all');
  });

  it('should have correct number of categories', () => {
    expect(component.categories.length).toBe(6); // all + 5 categorías
  });

  it('should apply local filters when search term changes', fakeAsync(() => {
    component.searchControl.setValue('Premium');

    // Esperar debounce
    tick(400);

    expect(component.searchTermLocal()).toBe('Premium');
    const results = component.filteredProductsLocal();
    expect(results.length).toBeGreaterThan(0);
  }));

  it('should filter by category', () => {
    component.categoryFilter.setValue('Electrónica');
    component.applyLocalFilters();

    const results = component.filteredProductsLocal();
    results.forEach(product => {
      expect(product.category).toBe('Electrónica');
    });
  });

  it('should filter by price range', () => {
    component.minPriceFilter.setValue('100');
    component.maxPriceFilter.setValue('500');
    component.applyLocalFilters();

    const results = component.filteredProductsLocal();
    results.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(100);
      expect(product.price).toBeLessThanOrEqual(500);
    });
  });

  it('should reset filters', () => {
    component.searchControl.setValue('test');
    component.categoryFilter.setValue('Electrónica');
    component.minPriceFilter.setValue('100');

    component.resetFilters();

    expect(component.searchControl.value).toBe('');
    expect(component.categoryFilter.value).toBe('all');
    expect(component.minPriceFilter.value).toBe('');
  });

  it('should have trackById function', () => {
    const mockProduct: any = { id: 123, name: 'Test' };
    const result = component.trackById(0, mockProduct);
    expect(result).toBe(123);
  });
});

