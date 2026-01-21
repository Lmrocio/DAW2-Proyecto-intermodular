import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {

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
