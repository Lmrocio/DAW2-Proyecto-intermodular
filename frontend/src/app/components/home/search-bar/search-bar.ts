import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from '../../shared/button/button';
import { SpeechService } from '../../../core/services/speech.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, Button],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.scss'],
})
export class SearchBar implements OnInit {
  constructor(private cdr: ChangeDetectorRef, private speech: SpeechService) {}

  @Input() title: string = '¿Qué quieres aprender hoy?';
  @Input() placeholder: string = 'Escribe aquí tu búsqueda...';
  @Input() initialValue: string = '';
  @Input() helpText: string = 'Busca entre más de 50 lecciones por tema, nombre o palabra clave. Te mostraremos los resultados más relevantes para que encuentres exactamente lo que necesitas aprender.';

  // New inputs to control visibility
  @Input() showHelpText: boolean = true;
  @Input() showListen: boolean = true;
  // Variant inputs: hide title and remove default padding
  @Input() hideTitle: boolean = false;
  @Input() noPadding: boolean = false;

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

    if (!textToRead) return;

    if (this.isSpeaking) {
      this.speech.cancel();
      this.isSpeaking = false;
      this.cdr.detectChanges();
      return;
    }

    this.isSpeaking = true;
    this.cdr.detectChanges();

    this.speech.speak(textToRead).then(() => {
      this.isSpeaking = false;
      this.cdr.detectChanges();
    }).catch((e) => {
      console.error('Error speech:', e);
      this.isSpeaking = false;
      this.cdr.detectChanges();
    });
  }
}
