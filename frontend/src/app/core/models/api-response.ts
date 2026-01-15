/**
 * Respuesta genérica para listas paginadas
 * Útil para endpoints que devuelven datos con paginación
 */
export interface ApiListResponse<T> {
  /** Datos de la página actual */
  data: T[];

  /** Información de paginación */
  pagination: {
    /** Página actual (base 1) */
    currentPage: number;

    /** Tamaño de página */
    pageSize: number;

    /** Total de elementos */
    totalItems: number;

    /** Total de páginas */
    totalPages: number;
  };
}

/**
 * Respuesta estructurada de error de la API
 * Permite manejar errores de forma consistente
 */
export interface ErrorResponse {
  /** Código de estado HTTP */
  statusCode: number;

  /** Mensaje de error legible */
  message: string;

  /** Timestamp del error */
  timestamp: string;

  /** Ruta que generó el error */
  path?: string;

  /** Detalles adicionales del error */
  details?: Record<string, any>;
}

