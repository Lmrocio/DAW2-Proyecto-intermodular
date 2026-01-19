import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, Button],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  // ...existing code...

  // Texto a leer (ligado al contenido del hero)
  description: string = `Una plataforma diseñada como un cuaderno de notas, con explicaciones claras y dibujos sencillos para disfrutar aprendiendo.`;

  // Estado para alternar texto del botón
  isSpeaking = false;

  // Flag para saber si fue cancelado por el usuario
  private userCancelled = false;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  // Reproducir / detener el texto del hero usando la Web Speech API
  playAudio(): void {
    console.log('=== playAudio() ===');
    console.log('isSpeaking:', this.isSpeaking);

    const synth = window.speechSynthesis;

    if (!synth) {
      console.error('❌ SpeechSynthesis NO está disponible');
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }

    // Si ya está hablando (verificar estado local isSpeaking)
    if (this.isSpeaking) {
      console.log('🛑 Deteniendo síntesis...');
      this.userCancelled = true; // Marcar como cancelado por usuario
      synth.cancel();

      this.ngZone.run(() => {
        this.isSpeaking = false;
        this.cdr.detectChanges();
      });

      console.log('✅ Síntesis detenida');
      return;
    }

    // Marcar como NO cancelado por usuario (es nuevo)
    this.userCancelled = false;

    // Marcar como hablando inmediatamente
    this.ngZone.run(() => {
      this.isSpeaking = true;
      this.cdr.detectChanges();
    });

    // Crear utterance con el texto del hero
    const utterance = new SpeechSynthesisUtterance(this.description);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Callbacks
    utterance.onstart = () => {
      console.log('🔊 Audio iniciado');
      this.ngZone.run(() => {
        this.isSpeaking = true;
        this.cdr.detectChanges();
      });
    };

    utterance.onend = () => {
      console.log('✅ Audio finalizado');
      this.ngZone.run(() => {
        this.isSpeaking = false;
        this.cdr.detectChanges();
      });
    };

    utterance.onerror = (event: any) => {
      console.error('❌ Error:', event.error);

      // Solo actualizar estado si NO fue cancelado por el usuario
      if (!this.userCancelled) {
        this.ngZone.run(() => {
          this.isSpeaking = false;
          this.cdr.detectChanges();
        });
      } else {
        console.log('ℹ️ Error fue por cancelación del usuario, ignorando');
      }
    };

    // Seleccionar voz en español
    const voices = synth.getVoices();
    if (voices.length > 0) {
      const spanishVoice = voices.find((v) => v.lang && v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
        console.log(`✅ Voz: ${spanishVoice.name}`);
      }
    }

    // Reproducir
    const trySpeak = () => {
      console.log('▶️ Reproduciendo...');
      synth.speak(utterance);
    };

    // Si no hay voces, esperar a que se carguen
    if (voices.length === 0) {
      console.log('⏳ Cargando voces...');

      synth.onvoiceschanged = () => {
        synth.onvoiceschanged = null;
        const loadedVoices = synth.getVoices();

        if (loadedVoices.length > 0) {
          const spanishVoice = loadedVoices.find((v) => v.lang && v.lang.startsWith('es'));
          if (spanishVoice) {
            utterance.voice = spanishVoice;
          }
        }

        trySpeak();
      };


      // Fallback con timeout
      setTimeout(() => {
        synth.onvoiceschanged = null;
        trySpeak();
      }, 200);
    } else {
      // Voces ya disponibles
      trySpeak();
    }
  }
}
