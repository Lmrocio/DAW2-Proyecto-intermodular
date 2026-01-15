/**
 * Modelo completo de Producto
 * Representa un producto en el catálogo de la autoescuela
 */
export interface Product {
  /** Identificador único del producto */
  id: string;

  /** Nombre del producto */
  name: string;

  /** Descripción detallada del producto */
  description: string;

  /** Precio en euros */
  price: number;

  /** URL de la imagen del producto */
  imageUrl: string;

  /** Categoría del producto (Manuales, Tests, Simuladores, Packs, Cursos) */
  category: string;

  /** Unidades disponibles en stock */
  stock: number;

  /** Fecha de creación del producto (ISO 8601) */
  createdAt: string;
}

/**
 * DTO para crear un nuevo producto
 * No incluye 'id' ni 'createdAt' (generados por el servidor)
 */
export interface CreateProductDto {
  /** Nombre del producto */
  name: string;

  /** Descripción detallada del producto */
  description: string;

  /** Precio en euros */
  price: number;

  /** URL de la imagen del producto */
  imageUrl: string;

  /** Categoría del producto */
  category: string;

  /** Unidades disponibles en stock */
  stock: number;
}

/**
 * DTO para actualizar un producto existente
 * Todos los campos son opcionales (actualización parcial)
 */
export interface UpdateProductDto {
  /** Nombre del producto */
  name?: string;

  /** Descripción detallada del producto */
  description?: string;

  /** Precio en euros */
  price?: number;

  /** URL de la imagen del producto */
  imageUrl?: string;

  /** Categoría del producto */
  category?: string;

  /** Unidades disponibles en stock */
  stock?: number;
}

