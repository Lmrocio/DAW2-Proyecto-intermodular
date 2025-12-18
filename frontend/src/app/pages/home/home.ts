import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from '../../components/shared/button/button';

/**
 * Componente Home - Página principal
 *
 * Muestra los botones de navegación principal:
 * - Guía de Estilos: navega a /style-guide
 * - Cliente: navega a /client (pendiente de implementar)
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}

