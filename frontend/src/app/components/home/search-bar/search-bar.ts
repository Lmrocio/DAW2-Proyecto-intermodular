import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/button/button';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}

  @Input() title: string = '¿Qué quieres aprender hoy?';
  @Input() placeholder: string = 'Escribe aquí tu búsqueda...';
  @Input() initialValue: string = '';
  @Input() helpText: string = 'Busca entre más de 50 lecciones por tema, nombre o palabra clave. Te mostraremos los resultados más relevantes para que encuentres exactamente lo que necesitas aprender.';

  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchValue: string = '';
  isSpeaking: boolean = false;

  ngOnInit(): void {
    this.searchValue = this.initialValue;
  }

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onSearchSubmit(): void {
    if (this.searchValue.trim()) {
      this.searchSubmit.emit(this.searchValue.trim());
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.searchChange.emit('');
  }

  playAudio(): void {
    const textToRead = this.helpText;

    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.cdr.detectChanges();
      return;
    }

    // Cancelar cualquier síntesis anterior
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Asignar voces disponibles
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(
      (voice) => voice.lang.startsWith('es')
    );
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    // Forzar estado UI antes de start para respuesta inmediata
    this.isSpeaking = true;
    this.cdr.detectChanges();

    utterance.onstart = () => {
      // onstart puede llegar después, pero el estado ya se activó
      // mantenemos detectChanges por seguridad
      this.isSpeaking = true;
      this.cdr.detectChanges();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };

    utterance.onerror = (event) => {
      console.error('Error en síntesis de voz:', event.error);
      this.isSpeaking = false;
      this.cdr.detectChanges();
    };

    window.speechSynthesis.speak(utterance);
  }
}
