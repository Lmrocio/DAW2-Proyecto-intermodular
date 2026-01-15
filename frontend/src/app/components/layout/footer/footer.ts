import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Globe, Mail, Youtube } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  // Iconos de Lucide
  readonly Globe = Globe;
  readonly Mail = Mail;
  readonly Youtube = Youtube;

  // Email para newsletter
  newsletterEmail: string = '';

  subscribeNewsletter(): void {
    if (this.newsletterEmail.trim()) {
      console.log('Suscribiendo email:', this.newsletterEmail);
      // TODO: Implementar lógica de suscripción
      this.newsletterEmail = '';
    }
  }
}
