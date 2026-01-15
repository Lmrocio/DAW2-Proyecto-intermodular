import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { Product, CreateProductDto, UpdateProductDto } from './models/product';

/**
 * Interfaz extendida de Product con campos calculados
 */
interface ProductWithTax extends Product {
  /** Precio con IVA (21%) calculado */
  priceWithTax: number;

  /** Indica si el stock está bajo (< 10 unidades) */
  lowStock: boolean;
}

/**
 * Servicio para gestión de productos
 * Implementa operaciones CRUD completas usando ApiService
 *
 * FASE 5 - Tarea 3: Manejo de respuestas
 * - Usa operador map para transformar datos (añade priceWithTax)
 * - Usa retry(2) en getAll() para fallos temporales
 * - catchError específico con mensajes de negocio
 *
 * Endpoints consumidos:
 * - GET    /products       - Listado de productos
 * - GET    /products/:id   - Detalle de un producto
 * - POST   /products       - Crear producto
 * - PUT    /products/:id   - Actualizar producto (reemplazo completo)
 * - PATCH  /products/:id   - Actualizar producto (parcial)
 * - DELETE /products/:id   - Eliminar producto
 *
 * @example
 * // En un componente
 * constructor(private productService: ProductService) {}
 *
 * ngOnInit() {
 *   this.productService.getAll().subscribe(products => {
 *     console.log(products);
 *   });
 * }
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = inject(ApiService);
  private readonly endpoint = 'products';

  /** IVA aplicado (21%) */
  private readonly TAX_RATE = 0.21;

  /** Umbral de stock bajo */
  private readonly LOW_STOCK_THRESHOLD = 10;

  /**
   * Obtiene el listado completo de productos con datos transformados
   *
   * FASE 5 - Tarea 3:
   * - retry(2): reintenta hasta 2 veces en caso de fallo temporal
   * - map: añade campos calculados (priceWithTax, lowStock)
   * - catchError: manejo específico de errores
   *
   * @returns Observable con array de productos transformados
   */
  getAll(): Observable<ProductWithTax[]> {
    return this.api.get<Product[]>(this.endpoint).pipe(
      retry(2), // Reintentar hasta 2 veces en caso de error temporal
      map(products => products.map(p => this.transformProduct(p))),
      catchError(error => {
        const message = 'No se pudo cargar el catálogo de productos. Por favor, inténtalo de nuevo.';
        console.error('Error loading products:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Obtiene el detalle de un producto específico
   * @param id - Identificador del producto
   * @returns Observable con el producto transformado
   */
  getById(id: string): Observable<ProductWithTax> {
    return this.api.get<Product>(`${this.endpoint}/${id}`).pipe(
      map(product => this.transformProduct(product)),
      catchError(error => {
        const message = error.status === 404
          ? `El producto con ID ${id} no existe`
          : 'No se pudo cargar el producto. Por favor, inténtalo de nuevo.';
        console.error('Error loading product:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Crea un nuevo producto
   * @param dto - Datos del producto a crear
   * @returns Observable con el producto creado (incluye id generado)
   */
  create(dto: CreateProductDto): Observable<Product> {
    return this.api.post<Product>(this.endpoint, dto).pipe(
      catchError(error => {
        const message = error.status === 400
          ? 'Los datos del producto no son válidos'
          : 'No se pudo crear el producto. Por favor, inténtalo de nuevo.';
        console.error('Error creating product:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Actualiza un producto existente (reemplazo completo)
   * @param id - Identificador del producto
   * @param dto - Datos completos del producto
   * @returns Observable con el producto actualizado
   */
  update(id: string, dto: UpdateProductDto): Observable<Product> {
    return this.api.put<Product>(`${this.endpoint}/${id}`, dto).pipe(
      catchError(error => {
        const message = error.status === 404
          ? `El producto con ID ${id} no existe`
          : error.status === 400
          ? 'Los datos del producto no son válidos'
          : 'No se pudo actualizar el producto. Por favor, inténtalo de nuevo.';
        console.error('Error updating product:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Actualiza parcialmente un producto existente
   * @param id - Identificador del producto
   * @param dto - Datos parciales del producto
   * @returns Observable con el producto actualizado
   */
  patch(id: string, dto: Partial<UpdateProductDto>): Observable<Product> {
    return this.api.patch<Product>(`${this.endpoint}/${id}`, dto).pipe(
      catchError(error => {
        const message = 'No se pudo actualizar el producto. Por favor, inténtalo de nuevo.';
        console.error('Error patching product:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Elimina un producto
   * @param id - Identificador del producto a eliminar
   * @returns Observable vacío
   */
  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`).pipe(
      catchError(error => {
        const message = error.status === 404
          ? `El producto con ID ${id} no existe`
          : error.status === 409
          ? 'No se puede eliminar el producto porque tiene dependencias'
          : 'No se pudo eliminar el producto. Por favor, inténtalo de nuevo.';
        console.error('Error deleting product:', error);
        return throwError(() => new Error(message));
      })
    );
  }

  /**
   * Transforma un producto añadiendo campos calculados
   * @param product - Producto sin transformar
   * @returns Producto con campos calculados (priceWithTax, lowStock)
   */
  private transformProduct(product: Product): ProductWithTax {
    return {
      ...product,
      priceWithTax: Math.round((product.price * (1 + this.TAX_RATE)) * 100) / 100,
      lowStock: product.stock < this.LOW_STOCK_THRESHOLD
    };
  }
}

