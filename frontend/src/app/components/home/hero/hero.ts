import { Component, Input, Output, EventEmitter, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../shared/button/button';
import { SearchBar } from '../search-bar/search-bar';
import { SpeechService } from '../../../core/services/speech.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, Button, SearchBar],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
})
export class Hero {
  // Identificador único por instancia para depuración
  private _instanceId: string = Math.random().toString(36).slice(2, 8);

  // Inputs para reutilización
  @Input() title: string = 'Aprende tecnología paso a paso';
  @Input() subtitle: string = 'Una plataforma diseñada como un cuaderno de notas, con explicaciones claras y dibujos sencillos para disfrutar aprendiendo.';
  @Input() imageUrl: string = 'assets/images/imagen-6.svg';
  @Input() imageAlt: string = 'Ilustración de dispositivo con TecnoMayores';

  // Mostrar botón de reproducción en línea junto a la descripción
  @Input() showInlineListen: boolean = false;

  // Opciones de búsqueda
  @Input() showSearch: boolean = false;
  @Input() searchPlaceholder: string = '¿Qué quieres aprender hoy?';

  // Opciones de botones
  @Input() showButton1: boolean = true;
  @Input() button1Text: string = 'Saber sobre nosotros';
  @Input() button1Link: string = '/about';
  @Input() button1Variant: 'orange' | 'blue' | 'yellow' = 'orange';

  @Input() showButton2: boolean = true;
  @Input() button2Text: string = 'Escuchar texto';
  @Input() button2Variant: 'orange' | 'blue' | 'yellow' = 'blue';

  // Texto a leer (ligado al contenido del hero)
  // Texto a leer: opcional. Si no se suministra, usaremos subtitle como fallback.
  @Input() description: string = '';
  // Input opcional específico para audio (mayor prioridad)
  @Input() audioText?: string;

  // Control visual de la imagen: tamaño y sombra
  @Input() imageLarge: boolean = false; // si true hace la imagen más grande
  @Input() imageHasShadow: boolean = true; // si false quita la sombra

  // Output para eventos
  @Output() searchChange = new EventEmitter<string>();

  // Estado para alternar texto del botón
  isSpeaking = false;

  // Flag para saber si fue cancelado por el usuario
  private userCancelled = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone, private speech: SpeechService) {}

  onSearch(query: string): void {
    this.searchChange.emit(query);
  }


  // Reproducir / detener el texto del hero usando la Web Speech API
  async playAudio(passedText?: string): Promise<void> {
    // Determine text
    const textToRead = (passedText && passedText.toString().trim()) || (this.audioText && this.audioText.trim()) || (this.subtitle && this.subtitle.trim()) || (this.description && this.description.trim()) || '';

    if (!textToRead) {
      console.warn('No hay texto disponible para leer');
      return;
    }

    // If already speaking locally, cancel via service
    if (this.isSpeaking) {
      this.speech.cancel();
      this.ngZone.run(() => {
        this.isSpeaking = false;
        this.cdr.detectChanges();
      });
      return;
    }

    this.ngZone.run(() => {
      this.isSpeaking = true;
      this.cdr.detectChanges();
    });

    try {
      console.log(`instance=${this._instanceId} speaking via SpeechService`);
      await this.speech.speak(textToRead);
    } catch (e) {
      console.error('Error al reproducir audio (SpeechService):', e);
    } finally {
      this.ngZone.run(() => {
        this.isSpeaking = false;
        this.cdr.detectChanges();
      });
    }
  }
}
