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
  private vttParser = inject(VttParserService);

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
        this.generateSteps(leccionData);
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
      next: (transcription) => {
        console.log('✅ Transcripción cargada desde VTT:', transcription.substring(0, 100) + '...');
        this.videoTranscripcion.set(transcription);
      },
      error: (error) => {
        console.error('❌ Error al cargar transcripción:', error);
        this.videoTranscripcion.set('No se pudo cargar la transcripción del video.');
      }
    });
  }

  /**
   * Genera pasos de la lección basados en el contenido
   * En un escenario real, estos pasos vendrían del backend
   */
  private generateSteps(leccion: Leccion): void {
    // Generamos pasos de ejemplo basados en la categoría
    const categoria = leccion.categoria?.toLowerCase() || '';

    if (categoria.includes('whatsapp') || categoria.includes('comunicación')) {
      this.steps = [
        {
          number: 1,
          title: 'Abre la aplicación',
          description: 'Busca en tu pantalla el icono de color verde con un pequeño teléfono blanco. Toca el icono suavemente con la punta de tu dedo una sola vez.',
          icon: 'touch_app',
          color: 'rgba(230, 126, 34, 0.4)'
        },
        {
          number: 2,
          title: 'Busca a tu contacto',
          description: 'Arriba a la derecha verás el dibujo de una lupa. Púlsala y escribe el nombre de la persona a la que quieres escribir.',
          icon: 'search',
          color: 'rgba(52, 152, 219, 0.3)'
        },
        {
          number: 3,
          title: 'Adjuntar una foto o archivo',
          description: 'Dentro del chat pulsa el icono del clip o la cámara para elegir una foto desde la galería o tomar una nueva. Selecciona la imagen y confirma para adjuntarla.',
          icon: 'photo_camera',
          color: 'rgba(99, 102, 241, 0.25)'
        },
        {
          number: 4,
          title: 'Enviar y confirmar recepción',
          description: 'Escribe tu mensaje en el cuadro inferior y pulsa el botón de enviar. Comprueba que aparecen las marcas de verificación para asegurar que el mensaje llegó.',
          icon: 'send',
          color: 'rgba(16, 185, 129, 0.25)'
        }
      ];
    } else if (categoria.includes('móvil') || categoria.includes('dispositivo')) {
      this.steps = [
        {
          number: 1,
          title: 'Enciende el dispositivo',
          description: 'Presiona el botón de encendido situado en el lateral derecho del móvil durante 2 segundos hasta que veas la pantalla iluminarse.',
          icon: 'power_settings_new',
          color: 'rgba(230, 126, 34, 0.4)'
        },
        {
          number: 2,
          title: 'Desbloquea la pantalla',
          description: 'Desliza el dedo desde la parte inferior de la pantalla hacia arriba para desbloquear el dispositivo.',
          icon: 'lock_open',
          color: 'rgba(52, 152, 219, 0.3)'
        },
        {
          number: 3,
          title: 'Abre la aplicación de mensajes',
          description: 'Busca el icono de la app de mensajería que uses y púlsalo. Si no está en la pantalla principal, desliza hacia arriba para abrir todas las aplicaciones.',
          icon: 'smartphone',
          color: 'rgba(99, 102, 241, 0.25)'
        },
        {
          number: 4,
          title: 'Ajustes y permisos básicos',
          description: 'Si la aplicación solicita permisos (acceso a fotos o micrófono), acepta para poder adjuntar archivos y enviar voz. Revisa ajustes si algo no funciona.',
          icon: 'settings',
          color: 'rgba(16, 185, 129, 0.25)'
        }
      ];
    } else {
      // Pasos por defecto: contenido orientado a comunicación/mensajería (estilo "Cómo usar WhatsApp")
      this.steps = [
        {
          number: 1,
          title: 'Cómo abrir la aplicación',
          description: 'Busca en la pantalla el icono verde de WhatsApp (un teléfono dentro de una burbuja). Pulsa una vez sobre el icono para abrir la aplicación.',
          icon: 'smartphone',
          color: 'rgba(230, 126, 34, 0.4)'
        },
        {
          number: 2,
          title: 'Buscar contacto y empezar a escribir',
          description: 'Utiliza la lupa para buscar el nombre de la persona. Toca el contacto y escribe el mensaje en el cuadro inferior, luego pulsa el botón de enviar.',
          icon: 'chat_bubble',
          color: 'rgba(52, 152, 219, 0.3)'
        },
        {
          number: 3,
          title: 'Adjunta una imagen o archivo',
          description: 'Pulsa el icono de adjuntar y selecciona una foto o documento. Espera a que se cargue y, después, pulsa enviar.',
          icon: 'attach_file',
          color: 'rgba(99, 102, 241, 0.25)'
        },
        {
          number: 4,
          title: 'Revisa respuestas y guarda información importante',
          description: 'Cuando recibas respuestas, mantén pulsado un mensaje para marcarlo como favorito o compartirlo. Así podrás recuperarlo más tarde.',
          icon: 'bookmark',
          color: 'rgba(16, 185, 129, 0.25)'
        }
      ];
    }
  }

  /**
   * Obtiene el título formateado para el Hero
   */
  getHeroTitle(): string {
    const titulo = this.leccion()?.titulo || '';
    // Si la categoría o título mencionan WhatsApp o comunicación, usar el título estilo guía
    const categoria = this.leccion()?.categoria?.toLowerCase() || '';
    if (titulo.toLowerCase().includes('whatsapp') || categoria.includes('whatsapp') || categoria.includes('comunicación')) {
      return 'Cómo usar WhatsApp';
    }

    // Si tenemos un título explícito, devolverlo. Si no, un título amigable.
    return titulo || 'Lección: Aprende paso a paso';
  }

  /**
   * Obtiene el subtítulo/descripcion para el Hero (texto amigable y descriptivo)
   */
  getHeroSubtitle(): string {
    const desc = this.leccion()?.descripcion?.trim();

    if (desc && desc.length > 20) {
      return desc;
    }

    // Fallback descriptivo (ejemplo del documento)
    return 'Aprende a enviar mensajes a tus amigos y familiares paso a paso. Es más fácil de lo que parece.';
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
