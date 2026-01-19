import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-guia-mode',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './guia-mode.html',
  styleUrl: './guia-mode.scss',
})
export class GuiaMode {
  constructor(private cdr: ChangeDetectorRef) {}

  @Input() title: string = '¿Te sientes perdido? Activa el Asistente';
  @Input() description: string = 'El Modo Guía te mostrará flechas y explicaciones paso a paso en cada rincón de la web.';
  @Input() buttonText: string = 'Activar Modo Guía';
  @Input() isVisible: boolean = true;

  @Output() activateGuide = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  isSpeaking: boolean = false;

  onActivateGuide(): void {
    this.activateGuide.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  playAudio(): void {
    const textToRead = this.description;

    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.cdr.detectChanges();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang && v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // Forzar estado UI antes de speak para respuesta inmediata
    this.isSpeaking = true;
    this.cdr.detectChanges();

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.cdr.detectChanges();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };

    utterance.onerror = (e) => {
      console.error('Error en síntesis de voz (guia-mode):', e);
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };

    window.speechSynthesis.speak(utterance);
  }
}
