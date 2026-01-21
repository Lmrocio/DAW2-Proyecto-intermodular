import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

/**
 * Página de Login - Acceso de Usuario
 *
 * Página para que los usuarios accedan a su cuenta.
 * Incluye formulario de login, opción de Google OAuth y enlaces de ayuda.
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

  email: string = '';
  password: string = '';
  showPassword: boolean = false;
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
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    console.log('🔐 Intentando login con:', this.email);

    // Llamar al servicio de autenticación
    const success = this.authService.login(this.email, this.password);

    if (success) {
      console.log('✅ Login exitoso, redirigiendo a:', this.returnUrl);
      this.router.navigateByUrl(this.returnUrl);
    } else {
      console.error('❌ Login fallido');
      alert('Credenciales inválidas');
    }
  }

  onGoogleLogin(): void {
    console.log('🔐 Login con Google (simulado)');

    // Simulación: crear usuario con Google
    const success = this.authService.login('usuario@gmail.com', 'google-oauth');

    if (success) {
      console.log('✅ Login con Google exitoso');
      this.router.navigateByUrl(this.returnUrl);
    }
  }
}



