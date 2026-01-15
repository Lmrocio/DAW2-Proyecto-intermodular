import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Home, Headphones } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly Home = Home;
  readonly Headphones = Headphones;

  playAudio(): void {
    // TODO: Implementar funcionalidad de reproducción de audio
    console.log('Reproduciendo audio de la página');
  }
}

