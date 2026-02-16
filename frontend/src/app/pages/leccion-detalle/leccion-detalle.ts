import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Leccion } from '../../services/leccion.service';
import { Hero } from '../../components/home/hero/hero';
import { Button } from '../../components/shared/button/button';
import { SpeechService } from '../../core/services/speech.service';
import { VttParserService } from '../../core/services/vtt-parser.service';
import { VideoTutorialComponent } from '../../components/shared/video-tutorial';

interface LessonStep {
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Componente de detalle de lección
 *
 * FUNCIONALIDAD RESOLVER (FASE 4 - Tarea 5):
 * - Los datos de la lección se precargan con leccionResolver
 * - Se leen desde route.data en lugar de cargarlos aquí
 * - Si el resolver falla, redirige a /lecciones automáticamente
 *
 * VENTAJAS:
 * - No se muestra vista vacía mientras carga
 * - Manejo centralizado de errores en resolver
 * - Mejor UX: datos listos al activar componente
 */
@Component({
  selector: 'app-leccion-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, Hero, Button, VideoTutorialComponent],
  templateUrl: './leccion-detalle.html',
  styleUrl: './leccion-detalle.scss'
})
export class LeccionDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private speech = inject(SpeechService);
  vttParser = inject(VttParserService);

  // Datos precargados por resolver
  leccion = signal<Leccion | null>(null);
  loading = signal<boolean>(false);

  // Pasos de la lección (mock data - en producción vendría del backend) - PÚBLICO para template
  steps: LessonStep[] = [];

  // Transcripción del video tutorial (cargada dinámicamente desde archivo VTT)
  videoTranscripcion = signal<string>('Cargando transcripción...');

  ngOnInit() {
    // Leer datos PRECARGADOS desde route.data (resolver)
    this.route.data.subscribe(data => {
      const leccionData = data['leccion'] as Leccion | null;

      if (leccionData) {
        console.log('✅ LeccionDetalle: Datos recibidos del resolver:', leccionData);
        this.leccion.set(leccionData);
        this.generateSteps();
        // Debug hero values
        console.log('LeccionDetalle: heroTitle=', this.getHeroTitle());
        console.log('LeccionDetalle: heroSubtitle=', this.getHeroSubtitle());
      } else {
        console.warn('⚠️ LeccionDetalle: No hay datos (resolver falló o redirigió)');
        // El resolver ya redirigió a /lecciones con mensaje de error
      }
    });

    // Cargar transcripción desde archivo VTT
    this.loadVideoTranscription();

    // Ejemplo de lectura de query params (si se usan para filtros)
    this.route.queryParamMap.subscribe(queryParams => {
      const destacado = queryParams.get('destacado');
      if (destacado) {
        console.log('🌟 Lección destacada:', destacado);
      }
    });
  }

  /**
   * Carga la transcripción del video desde el archivo VTT
   * Extrae el texto plano de los subtítulos para mostrar la transcripción completa
   */
  private loadVideoTranscription(): void {
    // Ruta al archivo de subtítulos en español
    const vttPath = 'assets/subtitles/tutorial-bizum.vtt';

    this.vttParser.parseVttToFormattedText(vttPath).subscribe({
      next: (transcription: string) => {
        console.log('✅ Transcripción cargada desde VTT:', transcription.substring(0, 100) + '...');
        this.videoTranscripcion.set(transcription);
      },
      error: (error: Error) => {
        console.error('❌ Error al cargar transcripción:', error);
        this.videoTranscripcion.set('No se pudo cargar la transcripción del video.');
      }
    });
  }

  /**
   * Genera pasos de la lección basados en el contenido
   * En un escenario real, estos pasos vendrían del backend
   */
  private generateSteps(): void {
    // Tutorial de cómo realizar un Bizum
    this.steps = [
      {
        number: 1,
        title: 'Abre la aplicación de tu banco',
        description: 'Busca en tu móvil el icono de la aplicación de tu banco (puede ser BBVA, Santander, CaixaBank, etc.). Toca el icono para abrir la app e introduce tu código de acceso o usa tu huella dactilar para entrar.',
        icon: 'account_balance',
        color: 'rgba(230, 126, 34, 0.4)'
      },
      {
        number: 2,
        title: 'Busca la opción Bizum',
        description: 'Una vez dentro de la app, busca en el menú principal la opción "Bizum". Normalmente aparece en la pantalla principal o en el menú lateral. Algunos bancos tienen un acceso directo con el logo de Bizum (una "B" en color naranja).',
        icon: 'search',
        color: 'rgba(52, 152, 219, 0.3)'
      },
      {
        number: 3,
        title: 'Selecciona "Enviar dinero"',
        description: 'Dentro de Bizum, verás varias opciones. Pulsa en "Enviar dinero" o "Hacer un Bizum". Luego introduce el número de teléfono de la persona a la que quieres enviar dinero. Asegúrate de que el número sea correcto.',
        icon: 'send',
        color: 'rgba(99, 102, 241, 0.25)'
      },
      {
        number: 4,
        title: 'Introduce la cantidad y confirma',
        description: 'Escribe la cantidad de dinero que quieres enviar (por ejemplo, 10€). Puedes añadir un mensaje opcional para indicar el motivo. Revisa que todo esté correcto y pulsa "Enviar". ¡El dinero llegará al instante!',
        icon: 'euro',
        color: 'rgba(16, 185, 129, 0.25)'
      }
    ];
  }

  /**
   * Obtiene el título formateado para el Hero
   */
  getHeroTitle(): string {
    return 'Cómo hacer un Bizum';
  }

  /**
   * Obtiene el subtítulo/descripcion para el Hero (texto amigable y descriptivo)
   */
  getHeroSubtitle(): string {
    return 'Aprende a enviar dinero a tus familiares y amigos de forma fácil y segura desde tu móvil. Bizum es rápido, sencillo y está disponible en tu banco.';
  }

  /**
   * Reproduce el audio de un paso específico
   */
  async playStepAudio(text: string): Promise<void> {
    try {
      await this.speech.speak(text);
    } catch (error) {
      console.error('Error al reproducir audio del paso:', error);
    }
  }

  /**
   * Marca la lección como completada
   */
  markAsCompleted(): void {
    console.log('✅ Lección marcada como completada:', this.leccion()?.id);
    // Aquí iría la lógica para marcar como completada en el backend
    alert('¡Lección marcada como completada! 🎉');
  }

  /**
   * Añade la lección a favoritos
   */
  addToFavorites(): void {
    console.log('❤️ Lección añadida a favoritos:', this.leccion()?.id);
    // Aquí iría la lógica para añadir a favoritos en el backend
    alert('¡Lección añadida a favoritos! ⭐');
  }
}
