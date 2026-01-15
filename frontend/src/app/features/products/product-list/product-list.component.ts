import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

/**
 * Estado de carga de productos
 */
interface ProductState {
  loading: boolean;
  error: string | null;
  data: Product[] | null;
}

/**
 * Componente de listado de productos
 *
 * Funcionalidades:
 * - Muestra listado de productos desde la API
 * - Permite eliminar productos con confirmación
 * - Navegación a detalle y formulario de edición
 *
 * FASE 5 - Tarea 2: Implementa operaciones GET y DELETE
 * FASE 5 - Tarea 5: Estados de carga, error y vacío con signal
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  // Signal para estado completo (loading, error, data)
  state = signal<ProductState>({
    loading: false,
    error: null,
    data: null
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga el listado de productos desde la API
   * Gestiona estados: loading, error, success
   */
  loadProducts(): void {
    // Iniciar carga
    this.state.set({
      loading: true,
      error: null,
      data: null
    });

    this.productService.getAll().subscribe({
      next: (products) => {
        // Éxito: actualizar con datos
        this.state.set({
          loading: false,
          error: null,
          data: products
        });
      },
      error: (err) => {
        // Error: mostrar mensaje
        this.state.set({
          loading: false,
          error: err.message || 'Error al cargar productos',
          data: null
        });
        console.error('Error loading products:', err);
      }
    });
  }

  /**
   * Elimina un producto con confirmación
   * @param product - Producto a eliminar
   */
  onDelete(product: Product): void {
    const confirmed = confirm(`¿Estás seguro de eliminar "${product.name}"?`);

    if (!confirmed) return;

    this.productService.delete(product.id).subscribe({
      next: () => {
        // Eliminar del estado local
        const currentData = this.state().data;
        if (currentData) {
          this.state.update(state => ({
            ...state,
            data: currentData.filter(p => p.id !== product.id)
          }));
        }
        console.log('Producto eliminado correctamente');
      },
      error: (err) => {
        alert(err.message || 'Error al eliminar el producto');
        console.error('Error deleting product:', err);
      }
    });
  }

  /**
   * Formatea el precio para mostrar
   * @param price - Precio numérico
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}

