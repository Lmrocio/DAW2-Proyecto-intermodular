import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormComponent } from '../../guards/pending-changes.guard';
import { AuthService } from '../../services/auth.service';

/**
 * Componente de perfil de usuario
 *
 * FUNCIONALIDAD ROUTE GUARD (FASE 4 - Tarea 4):
 * - Implementa FormComponent para uso con pendingChangesGuard
 * - El guard detecta cambios sin guardar y solicita confirmación
 */
@Component({
  selector: 'app-user-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-perfil.html',
  styleUrl: './user-perfil.scss'
})
export class UserPerfil implements FormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  // FormGroup requerido por FormComponent (para pendingChangesGuard)
  form: FormGroup;

  constructor() {
    // Crear formulario reactive
    this.form = this.fb.group({
      name: [this.authService.currentUser?.name || '', Validators.required],
      email: [this.authService.currentUser?.email || '', [Validators.required, Validators.email]],
      bio: [''],
      phone: ['']
    });
  }

  /**
   * Guardar cambios del formulario
   */
  onSave(): void {
    if (this.form.valid) {
      console.log('💾 Guardando perfil:', this.form.value);

      // En producción: llamar a API para actualizar perfil
      // await this.userService.updateProfile(this.form.value);

      // Marcar formulario como pristine (sin cambios) después de guardar
      this.form.markAsPristine();

      alert('✅ Perfil actualizado correctamente');
    } else {
      alert('❌ Por favor, corrige los errores del formulario');
    }
  }

  /**
   * Cancelar cambios (restaurar valores originales)
   */
  onCancel(): void {
    this.form.reset({
      name: this.authService.currentUser?.name || '',
      email: this.authService.currentUser?.email || '',
      bio: '',
      phone: ''
    });
  }
}

