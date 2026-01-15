import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Quote } from 'lucide-angular';

interface Testimonial {
  name: string;
  age: string;
  text: string;
  avatar: string;
}

@Component({
  selector: 'app-testimonios',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.scss',
})
export class Testimonios {
  readonly Quote = Quote;

  testimonials: Testimonial[] = [
    {
      name: 'María González',
      age: '68 años',
      text: 'Gracias a TecnoMayores ahora hablo por videollamada con mis nietos todas las semanas. Las explicaciones son muy claras.',
      avatar: 'MG'
    },
    {
      name: 'Antonio Ruiz',
      age: '72 años',
      text: 'Los simuladores me ayudaron a perder el miedo al móvil. Ahora envío fotos por WhatsApp sin problema.',
      avatar: 'AR'
    },
    {
      name: 'Carmen López',
      age: '65 años',
      text: 'Muy útil y fácil de seguir. He aprendido a hacer compras online de forma segura. Me siento más independiente.',
      avatar: 'CL'
    }
  ];

  currentIndex = 0;

  nextTestimonial(): void {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentIndex = this.currentIndex === 0
      ? this.testimonials.length - 1
      : this.currentIndex - 1;
  }

  goToTestimonial(index: number): void {
    this.currentIndex = index;
  }

  get currentTestimonial(): Testimonial {
    return this.testimonials[this.currentIndex];
  }
}

