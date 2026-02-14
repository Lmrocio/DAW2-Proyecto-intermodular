import { Component, Input, ChangeDetectorRef, NgZone, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Button } from '../../shared/button/button';

export interface Leccion {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  duracion: string;
  imagen: string;
  imageVariants?: {
    small: string;
    medium: string;
    large: string;
  };
  valoracion?: number;
  completado?: boolean;
}

export type CardType = 'leccion' | 'simulador';

@Component({
  selector: 'app-leccion-card',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './leccion-card.html',
  styleUrls: ['./leccion-card.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeccionCard {
  @Input() leccion!: Leccion;
  @Input() type: CardType = 'leccion'; // Por defecto es lección

  constructor(private router: Router, private ngZone: NgZone, private cd: ChangeDetectorRef) {}

  isSpeaking: boolean = false;
  private synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? (window as any).speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Textos dinámicos según el tipo
  get buttonText(): string {
    return this.type === 'simulador' ? 'Ver simulador' : 'Ver lección';
  }

  get routePrefix(): string {
    return this.type === 'simulador' ? '/simuladores' : '/lecciones';
  }

  get ariaLabelPlay(): string {
    return this.isSpeaking
      ? 'Detener lectura'
      : (this.type === 'simulador' ? 'Escuchar simulador' : 'Escuchar lección');
  }

  get nivelColor(): string {
    // Normalizamos la categoría para evitar tildes/diacríticos y espacios
    const raw = (this.leccion?.categoria || '').toLowerCase();
    const normalized = raw.normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();

    const colors: { [key: string]: string } = {
      'basico': 'green',
      'comunicacion': 'blue',
      'seguridad': 'orange',
      'multimedia': 'orange',
      'ocio': 'orange'
    };

    return colors[normalized] || 'green';
  }

  onStartClick(): void {
    // Navegar al detalle de la lección. No recibimos Event desde app-button (emite void).
    this.router.navigate(['/lecciones', this.leccion.id]);
  }

  togglePlay(): void {
    if (this.isSpeaking) {
      this.stop();
    } else {
      // Leer título + descripción
      const textToRead = `${this.leccion.titulo}. ${this.leccion.descripcion}`;
      this.playText(textToRead);
    }
  }

  playText(text: string): void {
    if (!this.synth) return;
    try {
      // Si ya está hablando algo, cancelarlo primero (y limpiar estado)
      if (this.synth.speaking) {
        this.synth.cancel();
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          this.cd.detectChanges();
        });
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'es-ES';

      // Pre-mark as speaking para que UI cambie inmediatamente
      this.ngZone.run(() => {
        this.isSpeaking = true;
        this.currentUtterance = utter;
        this.cd.detectChanges();
      });

      utter.onend = () => {
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          this.cd.detectChanges();
        });
      };
      utter.onerror = () => {
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          this.cd.detectChanges();
        });
      };

      this.synth.speak(utter);
    } catch (e) {
      console.error('Speech error', e);
      this.isSpeaking = false;
    }
  }

  stop(): void {
    if (!this.synth) return;
    this.synth.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.cd.detectChanges();
  }

  toggleSpeak(leccion: any) {
    // Implementación toggle speak
    console.log('Toggle speak:', leccion);
  }

  startLesson(id: number | string) {
    console.log('Start lesson:', id);
  }
}
