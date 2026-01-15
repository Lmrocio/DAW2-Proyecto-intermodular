import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { CreateProductDto, UpdateProductDto } from '../models/product';
import { ToastService } from '../../../services/toast.service';

/**
 * Componente de formulario de producto
 *
 * Funcionalidades:
 * - Crear nuevo producto (POST)
 * - Editar producto existente (PUT)
 * - Validación de formulario
 * - Feedback de guardado
 *
 * FASE 5 - Tarea 2: Implementa operaciones POST y PUT
 * FASE 5 - Tarea 5: Estados isSaving y mensajes de éxito con toast
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  // Form group
  form!: FormGroup;

  // Signals para estados
  isEditMode = signal(false);
  isSaving = signal(false);
  productId = signal<string | null>(null);
  error = signal<string | null>(null);

  // Categorías disponibles
  categories = ['Manuales', 'Tests', 'Simuladores', 'Packs', 'Cursos'];

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  /**
   * Inicializa el formulario con validaciones
   */
  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  /**
   * Verifica si estamos en modo edición y carga el producto
   */
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  /**
   * Carga los datos del producto en el formulario
   * @param id - ID del producto
   */
  private loadProduct(id: string): void {
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          stock: product.stock
        });
      },
      error: (err) => {
        this.error.set('Error al cargar el producto');
        console.error('Error loading product:', err);
      }
    });
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    if (this.isEditMode()) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  /**
   * Crea un nuevo producto
   */
  private createProduct(): void {
    const dto: CreateProductDto = this.form.value;

    this.productService.create(dto).subscribe({
      next: (product) => {
        this.toast.success('Producto creado correctamente');
        this.router.navigate(['/products', product.id]);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al crear el producto');
        this.toast.error(err.message || 'Error al crear el producto');
        this.isSaving.set(false);
        console.error('Error creating product:', err);
      }
    });
  }

  /**
   * Actualiza un producto existente
   */
  private updateProduct(): void {
    const id = this.productId();
    if (!id) return;

    const dto: UpdateProductDto = this.form.value;

    this.productService.update(id, dto).subscribe({
      next: (product) => {
        this.toast.success('Producto actualizado correctamente');
        this.router.navigate(['/products', product.id]);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al actualizar el producto');
        this.toast.error(err.message || 'Error al actualizar el producto');
        this.isSaving.set(false);
        console.error('Error updating product:', err);
      }
    });
  }

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   * @param fieldName - Nombre del campo
   */
  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  /**
   * Obtiene el mensaje de error para un campo
   * @param fieldName - Nombre del campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.errors['min']) {
      return 'El valor debe ser mayor o igual a 0';
    }

    return '';
  }
}

