import { Injectable, signal } from '@angular/core';

/**
 * Servicio de autenticación simulado para demostrar Route Guards
 * según FASE_4.md - Tarea 4
 *
 * En producción, este servicio conectaría con un backend real,
 * manejaría tokens JWT, etc.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado de autenticación (simulado)
  private _isLoggedIn = signal<boolean>(false);

  // Usuario simulado
  private _currentUser = signal<{ name: string; email: string } | null>(null);

  /**
   * Obtener estado de autenticación
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  /**
   * Obtener usuario actual
   */
  get currentUser() {
    return this._currentUser();
  }

  /**
   * Simular inicio de sesión
   * En producción: llamaría a API, guardaría token, etc.
   */
  login(email: string, password: string): boolean {
    // Simulación simple: cualquier email/password es válido
    if (email && password) {
      this._isLoggedIn.set(true);
      this._currentUser.set({
        name: email.split('@')[0],
        email: email
      });

      // Guardar en localStorage para persistencia simple
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(this._currentUser()));

      return true;
    }
    return false;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
  }

  /**
   * Restaurar sesión desde localStorage (llamar en app init)
   */
  restoreSession(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userJson = localStorage.getItem('currentUser');

    if (isLoggedIn && userJson) {
      this._isLoggedIn.set(true);
      this._currentUser.set(JSON.parse(userJson));
    }
  }

  /**
   * Verificar si usuario tiene un rol específico (simulado)
   */
  hasRole(role: string): boolean {
    // En producción: verificar roles desde token/backend
    return this._isLoggedIn();
  }
}

