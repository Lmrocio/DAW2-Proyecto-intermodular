import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// ============================================================================
// IMPORTAR COMPONENTES DE LAYOUT
// ============================================================================
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';
import { Sidebar } from './components/layout/sidebar/sidebar';

// ============================================================================
// IMPORTAR COMPONENTES FUNCIONALES
// ============================================================================
import { FormInput } from './components/shared/form-input/form-input';
import { LoginForm } from './components/shared/login-form/login-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Router
    RouterOutlet,
    // Layout Components
    Header,
    Main,
    Footer,
    Sidebar,
    // Functional Components
    FormInput,
    LoginForm,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // App component - punto de entrada de la aplicación
}
