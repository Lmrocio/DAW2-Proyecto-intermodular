import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Servicio base para peticiones HTTP
 * Centraliza la configuración de URL base y manejo de errores genéricos
 *
 * @example
 * // En un servicio de dominio
 * constructor(private api: ApiService) {}
 *
 * getProducts() {
 *   return this.api.get<Product[]>('products');
 * }
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  /**
   * Petición GET genérica
   * @param endpoint - Ruta relativa del endpoint (ej: 'products' o 'products/123')
   * @param options - Opciones adicionales de HttpClient
   */
  get<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Petición POST genérica
   * @param endpoint - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones adicionales de HttpClient
   */
  post<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Petición PUT genérica (reemplazo completo del recurso)
   * @param endpoint - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones adicionales de HttpClient
   */
  put<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Petición PATCH genérica (actualización parcial del recurso)
   * @param endpoint - Ruta relativa del endpoint
   * @param body - Cuerpo de la petición (campos parciales)
   * @param options - Opciones adicionales de HttpClient
   */
  patch<T>(endpoint: string, body: unknown, options?: object): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Petición DELETE genérica
   * @param endpoint - Ruta relativa del endpoint
   * @param options - Opciones adicionales de HttpClient
   */
  delete<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo genérico de errores HTTP
   * @param error - Error de HttpClient
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error('HTTP Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

