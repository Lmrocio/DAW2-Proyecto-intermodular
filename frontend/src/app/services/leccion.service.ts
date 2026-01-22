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
      titulo: 'Primeros Pasos con tu Móvil',
      descripcion: 'Aprende a encender, apagar y usar los botones básicos',
      duracion: '20 min',
      nivel: 'Básico',
      categoria: 'Iniciación',
      contenido: 'Contenido completo de la lección sobre primeros pasos con el móvil...'
    },
    {
      id: '2',
      titulo: 'Hacer y Recibir Llamadas',
      descripcion: 'Aprende a llamar a tus contactos y contestar llamadas',
      duracion: '25 min',
      nivel: 'Básico',
      categoria: 'Comunicación',
      contenido: 'Contenido detallado sobre cómo hacer y recibir llamadas...'
    },
    {
      id: '3',
      titulo: 'Enviar Mensajes de WhatsApp',
      descripcion: 'Aprende a escribir y enviar mensajes con WhatsApp',
      duracion: '30 min',
      nivel: 'Intermedio',
      categoria: 'Mensajería',
      contenido: 'Contenido sobre cómo usar WhatsApp paso a paso...'
    },
    {
      id: '123',
      titulo: 'Usar la Cámara de Fotos',
      descripcion: 'Aprende a hacer fotos y compartirlas con tus seres queridos',
      duracion: '30 min',
      nivel: 'Básico',
      categoria: 'Multimedia',
      contenido: 'Contenido sobre cómo usar la cámara del móvil...'
    },
    {
      id: '456',
      titulo: 'Videollamadas con la Familia',
      descripcion: 'Aprende a hacer videollamadas para ver a tus familiares',
      duracion: '35 min',
      nivel: 'Intermedio',
      categoria: 'Comunicación',
      contenido: 'Contenido sobre cómo hacer videollamadas...'
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

