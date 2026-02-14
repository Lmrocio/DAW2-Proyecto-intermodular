/**
 * Modelos para autenticación
 */

/**
 * Rol del usuario
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * Datos del usuario para el frontend
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Request para login
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Request para registro
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Respuesta de autenticación del backend
 */
export interface AuthResponse {
  token: string;
  tokenType: string;
  user: User;
  message: string;
}

/**
 * Respuesta de error del backend
 */
export interface AuthError {
  code: string;
  message: string;
  timestamp?: string;
}
