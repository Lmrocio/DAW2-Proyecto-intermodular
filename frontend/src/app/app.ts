// ============================================================================
// COMPONENTE RAÍZ: APP
// ============================================================================
// Punto de entrada de la aplicación Angular
// Define la estructura principal: Header > RouterOutlet > Footer

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Componentes de layout (siempre visibles)
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';

// Componentes globales - ClienteFase2
import { Toast } from './components/shared/toast/toast.component';
import { Spinner } from './components/shared/spinner/spinner.component';

// Servicio de tema (ClienteFase1)
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Footer,
    Toast,
    Spinner,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'TecnoMayores';

  // Inyectar ThemeService para inicializarlo
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    console.log('App iniciada - Tema actual:', this.themeService.currentTheme);
  }
}

