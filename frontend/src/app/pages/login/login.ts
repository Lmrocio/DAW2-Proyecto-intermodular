import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Breadcrumb, BreadcrumbItem } from '../../components/shared/breadcrumb/breadcrumb';
import { LoginForm } from '../../components/shared/login-form/login-form';
import { Alert } from '../../components/shared/alert/alert';
import { LucideAngularModule, Info } from 'lucide-angular';

/**
 * Página de Login - Acceso de Usuario
 *
 * Página para que los usuarios accedan a su cuenta.
 * Incluye formulario de login, opción de Google OAuth y enlaces de ayuda.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Breadcrumb,
    LoginForm,
    Alert,
    LucideAngularModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  readonly Info = Info;

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Acceso de Usuario' }
  ];

  onLoginSubmit(data: { email: string; password: string; rememberMe: boolean }): void {
    console.log('Login data:', data);
    // TODO: Implementar lógica de autenticación
  }

  onGoogleLogin(): void {
    console.log('Login con Google');
    // TODO: Implementar OAuth con Google
  }
}

