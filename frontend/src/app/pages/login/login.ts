import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../core/models/auth.model';

/**
 * Página de Login - Acceso de Usuario
 *
 * Página para que los usuarios accedan a su cuenta.
 * Incluye formulario de login y enlaces de ayuda.
 *
 * FUNCIONALIDAD ROUTE GUARD (FASE 4 - Tarea 4):
 * - Maneja returnUrl desde queryParams cuando authGuard redirige aquí
 * - Después del login exitoso, redirige a la URL original o a /home
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  private returnUrl: string = '/home';

  ngOnInit(): void {
    // Leer returnUrl desde queryParams (puesto por authGuard)
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    console.log('📍 ReturnURL capturado:', this.returnUrl);

    // Si ya está autenticado, redirigir directamente
    if (this.authService.isLoggedIn) {
      console.log('✅ Usuario ya autenticado, redirigiendo...');
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    console.log('🔐 Intentando login con:', this.username);
    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.login(this.username, this.password).subscribe({
      next: (_response: AuthResponse) => {
        console.log('✅ Login exitoso, redirigiendo a:', this.returnUrl);
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: Error) => {
        console.error('❌ Login fallido:', error.message);
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al iniciar sesión';
      }
    });
  }

  onGoogleLogin(): void {
    // TODO: Implementar OAuth con Google
    this.errorMessage = 'Login con Google no disponible aún';
  }
}



