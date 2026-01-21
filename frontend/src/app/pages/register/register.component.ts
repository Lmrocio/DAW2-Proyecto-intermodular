import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Tooltip as TooltipComponent } from '../../components/shared/tooltip/tooltip';

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
    TooltipComponent, // Añadido Tooltip para mostrar burbujas de ayuda
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  // Referencia utilizada solo para evitar diagnóstico de import no utilizado en template
  // (la plantilla usa <app-tooltip>), mantener referencia evita error de comprobación.
  public __tooltipRef = TooltipComponent;

  private authService = inject(AuthService);
  private router = inject(Router);

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  errorMessage: string = '';

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
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos';
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

    console.log('🔐 Intentando registrar usuario:', this.email);

    // Simulación de registro: crear usuario
    const success = this.authService.login(this.email, this.password);

    if (success) {
      console.log('✅ Registro exitoso, redirigiendo a home...');
      this.router.navigateByUrl('/home');
    } else {
      this.errorMessage = 'No se pudo completar el registro. Intenta de nuevo.';
      console.error('❌ Registro fallido');
    }
  }
}
