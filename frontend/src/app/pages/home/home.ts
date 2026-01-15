import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Hero } from '../../components/home/hero/hero';
import { SearchBar } from '../../components/home/search-bar/search-bar';
import { GuiaMode } from '../../components/home/guia-mode/guia-mode';
import { LeccionesFotos } from '../../components/home/lecciones-fotos/lecciones-fotos';
import { Simuladores } from '../../components/home/simuladores/simuladores';
import { LeccionesRecomendadas } from '../../components/home/lecciones-recomendadas/lecciones-recomendadas';
import { Testimonios } from '../../components/home/testimonios/testimonios';
import { Cta } from '../../components/home/cta/cta';

/**
 * Componente Home - Página principal
 *
 * Página de inicio de TecnoMayores con:
 * - Hero section con título y CTA
 * - Barra de búsqueda
 * - Banner Modo Guía
 * - Sección de lecciones con fotos
 * - Sección de simuladores
 * - Lecciones recomendadas
 * - Testimonios de alumnos
 * - Call to Action final
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Hero,
    SearchBar,
    GuiaMode,
    LeccionesFotos,
    Simuladores,
    LeccionesRecomendadas,
    Testimonios,
    Cta
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}

