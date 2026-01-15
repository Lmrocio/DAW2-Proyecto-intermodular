import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Volume2 } from 'lucide-angular';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  readonly Volume2 = Volume2;

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showReadingMode: boolean = true;

  activateReadingMode(): void {
    console.log('Activando modo lectura');
    // TODO: Implementar modo lectura
  }
}

