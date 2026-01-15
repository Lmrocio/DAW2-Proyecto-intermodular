import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Modelo de Lección
 */
export interface Leccion {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado';
  categoria: string;
  imagen?: string;
  contenido?: string;
}

/**
 * Servicio de lecciones
 * En producción: conectaría con API backend
 *
 * Usado por leccionResolver para precargar datos antes de activar ruta
 */
@Injectable({
  providedIn: 'root'
})
export class LeccionService {
  // Datos simulados (en producción vendrían de API)
  private lecciones: Leccion[] = [
    {
      id: '1',
      titulo: 'Introducción a la Seguridad Vial',
      descripcion: 'Conceptos básicos de seguridad vial y normativa',
      duracion: '45 min',
      nivel: 'Básico',
      categoria: 'Seguridad',
      contenido: 'Contenido completo de la lección sobre seguridad vial...'
    },
    {
      id: '2',
      titulo: 'Señales de Tráfico',
      descripcion: 'Identificación y significado de señales',
      duracion: '60 min',
      nivel: 'Intermedio',
      categoria: 'Señalización',
      contenido: 'Contenido detallado sobre señales de tráfico...'
    },
    {
      id: '3',
      titulo: 'Normas de Circulación',
      descripcion: 'Reglas de circulación en vías urbanas e interurbanas',
      duracion: '50 min',
      nivel: 'Intermedio',
      categoria: 'Normativa',
      contenido: 'Contenido sobre normativa de circulación...'
    },
    {
      id: '123',
      titulo: 'Lección de Ejemplo',
      descripcion: 'Lección usada en ejemplos de navegación',
      duracion: '30 min',
      nivel: 'Básico',
      categoria: 'Ejemplos',
      contenido: 'Contenido de ejemplo...'
    },
    {
      id: '456',
      titulo: 'Conducción Defensiva',
      descripcion: 'Técnicas de conducción preventiva',
      duracion: '55 min',
      nivel: 'Avanzado',
      categoria: 'Conducción',
      contenido: 'Contenido sobre conducción defensiva...'
    }
  ];

  /**
   * Obtener lección por ID (usado por resolver)
   * Simula llamada HTTP con delay
   *
   * @param id - ID de la lección
   * @returns Observable<Leccion> o error si no existe
   */
  getLeccionById(id: string): Observable<Leccion> {
    console.log(`📚 LeccionService: Buscando lección con ID ${id}...`);

    const leccion = this.lecciones.find(l => l.id === id);

    if (!leccion) {
      console.error(`❌ LeccionService: Lección ${id} no encontrada`);
      // Simular error HTTP
      return throwError(() => new Error(`Lección con ID ${id} no encontrada`)).pipe(
        delay(300) // Simular latencia de red
      );
    }

    console.log(`✅ LeccionService: Lección ${id} encontrada`);

    // Simular llamada HTTP con delay
    return of(leccion).pipe(
      delay(800) // Simular latencia de red
    );
  }

  /**
   * Obtener todas las lecciones (para lista)
   */
  getAllLecciones(): Observable<Leccion[]> {
    return of(this.lecciones).pipe(delay(300));
  }

  /**
   * Obtener lecciones por categoría
   */
  getLeccionesByCategoria(categoria: string): Observable<Leccion[]> {
    const filtradas = this.lecciones.filter(l =>
      l.categoria.toLowerCase() === categoria.toLowerCase()
    );
    return of(filtradas).pipe(delay(300));
  }
}

