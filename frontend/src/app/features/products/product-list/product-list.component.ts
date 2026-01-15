import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

/**
 * Componente de listado de productos
 *
 * Funcionalidades:
 * - Muestra listado de productos desde la API
 * - Permite eliminar productos con confirmación
 * - Navegación a detalle y formulario de edición
 *
 * FASE 5 - Tarea 2: Implementa operaciones GET y DELETE
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

  // Signal para almacenar la lista de productos
  products = signal<Product[]>([]);

  // Signal para estado de carga
  loading = signal(true);

  // Signal para errores
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Carga el listado de productos desde la API
   */
  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar productos');
        this.loading.set(false);
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
        this.products.update(products =>
          products.filter(p => p.id !== product.id)
        );
        console.log('Producto eliminado correctamente');
      },
      error: (err) => {
        alert('Error al eliminar el producto');
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

