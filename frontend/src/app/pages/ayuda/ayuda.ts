import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Button } from '../../components/shared/button/button';
import { SpeechService } from '../../core/services/speech.service';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  isExpanded: boolean;
}

interface HelpCategory {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: 'yellow' | 'blue' | 'orange';
}

/**
 * Componente de Centro de Ayuda y Preguntas Frecuentes
 * Muestra categorías de ayuda, buscador y FAQs
 */
@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.scss'
})
export class Ayuda {
  searchQuery = signal<string>('');

  categories: HelpCategory[] = [
    {
      title: 'Mi cuenta',
      description: 'Gestión de perfil y acceso',
      icon: 'person',
      link: '/usuario/perfil',
      color: 'yellow'
    },
    {
      title: 'Lecciones',
      description: 'Cursos y aprendizaje',
      icon: 'book',
      link: '/lecciones',
      color: 'blue'
    },
    {
      title: 'Simuladores',
      description: 'Prácticas interactivas',
      icon: 'devices',
      link: '/simuladores',
      color: 'orange'
    },
    {
      title: 'Técnico',
      description: 'Soporte y dispositivos',
      icon: 'construction',
      link: '/ayuda/tecnico',
      color: 'yellow'
    }
  ];

  faqs = signal<FAQ[]>([
    {
      id: 1,
      question: '¿Es gratis usar esta página?',
      answer: '¡Sí! El acceso a todos nuestros cursos básicos y simuladores es completamente gratuito para las personas mayores. Nuestro objetivo es reducir la brecha digital y ayudarles a navegar con confianza.',
      isExpanded: true
    },
    {
      id: 2,
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Para cambiar tu contraseña, ve a "Mi Perfil" en el menú superior, luego a "Configuración de cuenta" y haz clic en "Cambiar contraseña". Te pediremos tu contraseña actual y la nueva contraseña dos veces para confirmar.',
      isExpanded: false
    },
    {
      id: 3,
      question: '¿Puedo ver las clases en mi tablet?',
      answer: 'Por supuesto. Nuestra plataforma está diseñada para funcionar perfectamente en móviles, tablets y ordenadores. Solo necesitas un navegador con acceso a Internet.',
      isExpanded: false
    }
  ]);

  constructor(private speechService: SpeechService) {}

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    console.log('Buscando:', input.value);
  }

  toggleFAQ(faqId: number): void {
    this.faqs.update(faqs =>
      faqs.map(faq =>
        faq.id === faqId
          ? { ...faq, isExpanded: !faq.isExpanded }
          : faq
      )
    );
  }

  async playAnswer(answer: string): Promise<void> {
    try {
      await this.speechService.speak(answer);
    } catch (error) {
      console.error('Error al reproducir respuesta:', error);
    }
  }

  sendEmail(): void {
    window.location.href = 'mailto:ayuda@tecnomayores.com?subject=Consulta desde Centro de Ayuda';
  }

  openWhatsApp(): void {
    window.open('https://wa.me/34600000000?text=Hola, necesito ayuda con la plataforma', '_blank');
  }
}
