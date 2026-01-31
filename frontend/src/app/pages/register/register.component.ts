import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../core/models/auth.model';

/**
 * Página de Registro - Crear Nueva Cuenta
 *
 * Página para que nuevos usuarios creen su cuenta.
 * Incluye formulario de registro con validación básica.
 * Después del registro exitoso, redirige a /home.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  ngOnInit(): void {
    // Si ya está autenticado, redirigir a home
    if (this.authService.isLoggedIn) {
      console.log('✅ Usuario ya autenticado, redirigiendo a home...');
      this.router.navigateByUrl('/home');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    // Validación básica
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    // Validación username
    if (this.username.length < 3) {
      this.errorMessage = 'El nombre de usuario debe tener al menos 3 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    // Email básico validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor, introduce un email válido';
      return;
    }

    console.log('🔐 Intentando registrar usuario:', this.username);
    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.register(this.username, this.email, this.password, this.confirmPassword).subscribe({
      next: (_response: AuthResponse) => {
        console.log('✅ Registro exitoso, redirigiendo a home...');
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      },
      error: (error: Error) => {
        console.error('❌ Registro fallido:', error.message);
        this.isLoading = false;
        this.errorMessage = error.message || 'No se pudo completar el registro. Intenta de nuevo.';
      }
    });
  }
}
