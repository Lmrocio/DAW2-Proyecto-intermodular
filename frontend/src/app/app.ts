// ============================================================================
// COMPONENTE RAÍZ: APP
// ============================================================================
// Punto de entrada de la aplicación Angular
// Define la estructura principal: Header > RouterOutlet > Footer

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componentes de layout (siempre visibles)
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'TecnoMayores';
}

