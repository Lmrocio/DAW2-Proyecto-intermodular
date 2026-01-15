import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../models/product';

/**
 * Componente de detalle de producto
 *
 * Funcionalidades:
 * - Muestra detalle completo de un producto
 * - Obtiene el producto desde la API usando el ID de la ruta
 * - Permite navegar a edición o volver al listado
 *
 * FASE 5 - Tarea 2: Implementa operación GET individual
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signal para almacenar el producto
  product = signal<Product | null>(null);

  // Signal para estado de carga
  loading = signal(true);

  // Signal para errores
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Obtener ID desde parámetros de ruta
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('ID de producto no válido');
      this.loading.set(false);
      return;
    }

    this.loadProduct(id);
  }

  /**
   * Carga el detalle del producto desde la API
   * @param id - ID del producto
   */
  loadProduct(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Producto no encontrado');
        this.loading.set(false);
        console.error('Error loading product:', err);
      }
    });
  }

  /**
   * Elimina el producto actual con confirmación
   */
  onDelete(): void {
    const product = this.product();
    if (!product) return;

    const confirmed = confirm(`¿Estás seguro de eliminar "${product.name}"?`);

    if (!confirmed) return;

    this.productService.delete(product.id).subscribe({
      next: () => {
        console.log('Producto eliminado correctamente');
        this.router.navigate(['/products']);
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

  /**
   * Formatea la fecha de creación
   * @param dateString - Fecha en formato ISO
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

