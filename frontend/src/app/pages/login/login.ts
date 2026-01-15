import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb';
import { LoginForm } from '../../components/shared/login-form/login-form';
import { LucideAngularModule, Info } from 'lucide-angular';
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
    Breadcrumb,
    LoginForm,
    LucideAngularModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly Info = Info;

  // URL a la que volver después del login (desde authGuard)
  private returnUrl: string = '/home';

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Acceso de Usuario' }
  ];

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

  onLoginSubmit(data: { email: string; password: string; rememberMe: boolean }): void {
    console.log('🔐 Intentando login con:', data.email);

    // Llamar al servicio de autenticación
    const success = this.authService.login(data.email, data.password);

    if (success) {
      console.log('✅ Login exitoso, redirigiendo a:', this.returnUrl);

      // Redirigir a la URL original (o /home si no hay returnUrl)
      this.router.navigateByUrl(this.returnUrl);
    } else {
      console.error('❌ Login fallido');
      // En producción: mostrar mensaje de error al usuario
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

