import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, tap, catchError, map, of } from 'rxjs';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthError,
  UserRole
} from '../core/models/auth.model';

/**
 * Servicio de autenticación conectado al backend real
 *
 * Maneja:
 * - Login con JWT
 * - Registro de nuevos usuarios
 * - Persistencia de sesión en localStorage
 * - Estado reactivo del usuario
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // URL base del backend
  private readonly API_URL = 'http://localhost:8080/api/auth';

  // Estado de autenticación
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<User | null>(null);
  private _token = signal<string | null>(null);
  private _isLoading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Keys de localStorage
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'currentUser';

  constructor() {
    // Restaurar sesión al iniciar
    this.restoreSession();
  }

  /**
   * Getters reactivos para el estado
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  get currentUser(): User | null {
    return this._currentUser();
  }

  get token(): string | null {
    return this._token();
  }

  get isLoading(): boolean {
    return this._isLoading();
  }

  get error(): string | null {
    return this._error();
  }

  /**
   * Signal computed para verificar si es admin
   */
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');

  /**
   * Iniciar sesión
   * @param username Nombre de usuario
   * @param password Contraseña
   * @returns Observable con la respuesta de autenticación
   */
  login(username: string, password: string): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    const request: LoginRequest = { username, password };

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Registrar nuevo usuario
   * @param username Nombre de usuario
   * @param email Correo electrónico
   * @param password Contraseña
   * @param confirmPassword Confirmación de contraseña
   * @returns Observable con la respuesta de autenticación
   */
  register(username: string, email: string, password: string, confirmPassword: string): Observable<AuthResponse> {
    this._isLoading.set(true);
    this._error.set(null);

    const request: RegisterRequest = { username, email, password, confirmPassword };

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this._isLoading.set(false);
      }),
      catchError(error => {
        this._isLoading.set(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    // Limpiar estado
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    this._token.set(null);
    this._error.set(null);

    // Limpiar localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    console.log('🔓 Sesión cerrada');
  }

  /**
   * Restaurar sesión desde localStorage
   */
  restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userJson = localStorage.getItem(this.USER_KEY);

    if (token && userJson) {
      try {
        const user: User = JSON.parse(userJson);
        this._token.set(token);
        this._currentUser.set(user);
        this._isLoggedIn.set(true);
        console.log('🔄 Sesión restaurada para:', user.username);
      } catch (e) {
        console.error('Error restaurando sesión:', e);
        this.logout();
      }
    }
  }

  /**
   * Verificar si usuario tiene un rol específico
   * @param role Rol a verificar (puede ser string o UserRole)
   */
  hasRole(role: UserRole | string): boolean {
    const userRole = this._currentUser()?.role;
    if (!userRole) return false;
    return userRole.toUpperCase() === role.toString().toUpperCase();
  }

  /**
   * Obtener datos del usuario actual desde el backend
   * Útil para verificar si el token sigue siendo válido
   */
  getCurrentUserFromServer(): Observable<User | null> {
    if (!this._token()) {
      return of(null);
    }

    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap(user => {
        this._currentUser.set(user);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }),
      catchError(error => {
        console.error('Token inválido, cerrando sesión');
        this.logout();
        return of(null);
      })
    );
  }

  /**
   * Manejar autenticación exitosa
   */
  private handleAuthSuccess(response: AuthResponse): void {
    this._token.set(response.token);
    this._currentUser.set(response.user);
    this._isLoggedIn.set(true);

    // Persistir en localStorage
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));

    console.log('✅ Autenticación exitosa:', response.user.username);
  }

  /**
   * Manejar errores de autenticación
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error de conexión';

    if (error.error) {
      // Error del backend
      if (typeof error.error === 'object' && error.error.message) {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 409) {
      errorMessage = 'El usuario o email ya existe';
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    }

    this._error.set(errorMessage);
    console.error('❌ Error de autenticación:', errorMessage);

    return throwError(() => new Error(errorMessage));
  }
}


