import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

/**
 * Modelo de Simulador
 */
export interface Simulador {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  duracion?: string;
  nivel?: 'Básico' | 'Intermedio' | 'Avanzado';
}

/**
 * Servicio de simuladores
 * En producción: conectaría con API backend
 */
@Injectable({
  providedIn: 'root'
})
export class SimuladorService {
  // Datos simulados (en producción vendrían de API)
  private simuladores: Simulador[] = [
    {
      id: '1',
      titulo: 'Cómo hacer un Bizum',
      descripcion: 'Aprende a enviar dinero de forma rápida y segura',
      categoria: 'Banca Digital',
      duracion: '15 min',
      nivel: 'Básico'
    },
    {
      id: '2',
      titulo: 'Instalar una App desde Google Play',
      descripcion: 'Descarga aplicaciones en tu móvil Android',
      categoria: 'Aplicaciones',
      duracion: '20 min',
      nivel: 'Básico'
    },
    {
      id: '3',
      titulo: 'Configurar WhatsApp',
      descripcion: 'Configura tu cuenta de WhatsApp paso a paso',
      categoria: 'Mensajería',
      duracion: '25 min',
      nivel: 'Intermedio'
    },
    {
      id: '4',
      titulo: 'Hacer una Videollamada',
      descripcion: 'Aprende a hacer videollamadas con tus seres queridos',
      categoria: 'Comunicación',
      duracion: '20 min',
      nivel: 'Básico'
    },
    {
      id: '5',
      titulo: 'Compartir Fotos por WhatsApp',
      descripcion: 'Envía fotos y videos a tus contactos',
      categoria: 'Multimedia',
      duracion: '18 min',
      nivel: 'Intermedio'
    }
  ];

  /**
   * Obtener simulador por ID
   * Simula llamada HTTP con delay
   *
   * @param id - ID del simulador
   * @returns Observable<Simulador> o error si no existe
   */
  getSimuladorById(id: string): Observable<Simulador> {
    console.log(`🎮 SimuladorService: Buscando simulador con ID ${id}...`);

    const simulador = this.simuladores.find(s => s.id === id);

    if (!simulador) {
      console.error(`❌ SimuladorService: Simulador ${id} no encontrado`);
      return throwError(() => new Error(`Simulador con ID ${id} no encontrado`)).pipe(
        delay(300)
      );
    }

    console.log(`✅ SimuladorService: Simulador ${id} encontrado`);
    return of(simulador).pipe(delay(800));
  }

  /**
   * Obtener todos los simuladores
   */
  getAllSimuladores(): Observable<Simulador[]> {
    return of(this.simuladores).pipe(delay(300));
  }

  /**
   * Obtener simuladores por categoría
   */
  getSimuladoresByCategoria(categoria: string): Observable<Simulador[]> {
    const filtrados = this.simuladores.filter(s =>
      s.categoria.toLowerCase() === categoria.toLowerCase()
    );
    return of(filtrados).pipe(delay(300));
  }
}
