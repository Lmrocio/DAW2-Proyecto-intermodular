import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../shared/button/button';

interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  categoriaColor: 'yellow' | 'orange' | 'blue';
  icono: string;
  iconoFondo: 'yellow' | 'orange' | 'blue';
  // ...se añade la propiedad imagen para rutas de assets
  imagen?: string;
}

@Component({
  selector: 'app-lecciones-recomendadas',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './lecciones-recomendadas.html',
  styleUrl: './lecciones-recomendadas.scss',
})
export class LeccionesRecomendadas {
  // Estado de reproducción: id de la lección que se está reproduciendo
  speakingId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  lecciones: Leccion[] = [
    {
      id: 1,
      titulo: 'Mi primer móvil',
      descripcion: 'Encendido, botones principales y cómo ver tus mensajes de forma clara.',
      categoria: 'Básico',
      categoriaColor: 'yellow',
      icono: 'smartphone',
      iconoFondo: 'orange',
      imagen: 'assets/images/imagen-1.svg'
    },
    {
      id: 2,
      titulo: 'WhatsApp y fotos',
      descripcion: 'Cómo enviar audios, fotos y hacer videollamadas familiares con facilidad.',
      categoria: 'Comunicación',
      categoriaColor: 'orange',
      icono: 'chat',
      iconoFondo: 'yellow',
      imagen: 'assets/images/whatsapp.jpg'
    },
    {
      id: 3,
      titulo: 'Internet Seguro',
      descripcion: 'Evita engaños y navega con total tranquilidad hoy mismo por la red.',
      categoria: 'Seguridad',
      categoriaColor: 'blue',
      icono: 'lock',
      iconoFondo: 'blue',
      imagen: 'assets/images/seguridad.jpg'
    }
  ];

  // Alterna reproducción/stop para una lección
  toggleSpeak(leccion: Leccion): void {
    if (this.speakingId === leccion.id) {
      // Si ya está reproduciendo esa lección, la detenemos
      window.speechSynthesis.cancel();
      this.speakingId = null;
      this.cdr.detectChanges();
      return;
    }

    // Si estaba reproduciendo otra, cancelamos primero
    if (this.speakingId !== null) {
      window.speechSynthesis.cancel();
      this.speakingId = null;
      this.cdr.detectChanges();
    }

    // Iniciar reproducción de la descripción
    this.playText(leccion.id, leccion.descripcion);
  }

  private playText(id: number, textToRead: string): void {
    try {
      // Cancelar cualquier síntesis previa
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Seleccionar voz en español si existe
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang && v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      // Marcar estado antes de speak para respuesta UI inmediata
      this.speakingId = id;
      this.cdr.detectChanges();

      utterance.onstart = () => {
        this.speakingId = id;
        this.cdr.detectChanges();
      };

      utterance.onend = () => {
        // Solo limpiar si la misma utterance terminó
        this.speakingId = null;
        this.cdr.detectChanges();
      };

      utterance.onerror = (e) => {
        console.error('Error en síntesis de voz (lecciones-recomendadas):', e);
        this.speakingId = null;
        this.cdr.detectChanges();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('playText: error al reproducir texto', e);
      this.speakingId = null;
      this.cdr.detectChanges();
    }
  }
}
