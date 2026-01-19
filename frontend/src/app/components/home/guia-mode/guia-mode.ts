import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../../shared/button/button';
import { SpeechService } from '../../../core/services/speech.service';

@Component({
  selector: 'app-guia-mode',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './guia-mode.html',
  styleUrl: './guia-mode.scss',
})
export class GuiaMode {
  constructor(private cdr: ChangeDetectorRef, private speech: SpeechService) {}

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

  async playAudio(): Promise<void> {
    const textToRead = this.description;
    if (!textToRead) return;

    if (this.isSpeaking) {
      this.speech.cancel();
      this.isSpeaking = false;
      this.cdr.detectChanges();
      return;
    }

    this.isSpeaking = true;
    this.cdr.detectChanges();

    try {
      await this.speech.speak(textToRead);
    } catch (e) {
      console.error('Error en síntesis (guia-mode):', e);
    } finally {
      this.isSpeaking = false;
      this.cdr.detectChanges();
    }
  }
}
