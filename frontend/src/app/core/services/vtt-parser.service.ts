import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/**
 * Servicio para procesar archivos de subtítulos WebVTT
 * Extrae el texto para generar transcripciones legibles
 */
@Injectable({
  providedIn: 'root'
})
export class VttParserService {
  constructor(private http: HttpClient) {}

  /**
   * Lee un archivo VTT y extrae solo el texto de los subtítulos
   * eliminando timestamps y metadatos
   *
   * @param vttPath Ruta al archivo VTT (ej: 'assets/subtitles/tutorial-bizum.vtt')
   * @returns Observable con el texto plano de la transcripción
   */
  parseVttToText(vttPath: string): Observable<string> {
    return this.http.get(vttPath, { responseType: 'text' }).pipe(
      map(vttContent => this.extractTextFromVtt(vttContent))
    );
  }

  /**
   * Extrae el texto de un contenido VTT
   *
   * Formato WebVTT:
   * WEBVTT
   *
   * 00:00:00.000 --> 00:00:03.000
   * Texto del subtítulo
   *
   * @param vttContent Contenido del archivo VTT
   * @returns Texto plano sin timestamps
   */
  private extractTextFromVtt(vttContent: string): string {
    // Eliminar la cabecera WEBVTT
    let content = vttContent.replace(/^WEBVTT.*\n\n?/i, '');

    // Dividir en bloques de subtítulos
    const blocks = content.split(/\n\n+/);

    const textLines: string[] = [];

    for (const block of blocks) {
      const lines = block.trim().split('\n');

      // Filtrar líneas que son timestamps (contienen -->)
      const subtitleText = lines
        .filter(line => !line.includes('-->'))
        .filter(line => !line.match(/^\d+$/)) // Eliminar números de índice si los hay
        .filter(line => line.trim().length > 0)
        .join(' ');

      if (subtitleText) {
        textLines.push(subtitleText);
      }
    }

    // Unir todo el texto en un solo párrafo
    return textLines.join(' ').trim();
  }

  /**
   * Extrae el texto con formato de párrafos para mejor legibilidad
   * Agrupa subtítulos relacionados en párrafos
   *
   * @param vttPath Ruta al archivo VTT
   * @returns Observable con el texto formateado en párrafos
   */
  parseVttToFormattedText(vttPath: string): Observable<string> {
    return this.http.get(vttPath, { responseType: 'text' }).pipe(
      map(vttContent => {
        const plainText = this.extractTextFromVtt(vttContent);
        // Aquí podrías agregar lógica para dividir en párrafos
        // basado en pausas largas o marcadores especiales
        return this.formatTextIntoParagraphs(plainText);
      })
    );
  }

  /**
   * Formatea el texto plano en párrafos para mejor legibilidad
   * Divide el texto en secciones lógicas
   */
  private formatTextIntoParagraphs(text: string): string {
    // Simple división cada ~500 caracteres en un punto final
    const words = text.split(' ');
    const paragraphs: string[] = [];
    let currentParagraph: string[] = [];
    let charCount = 0;
    const targetLength = 500;

    for (const word of words) {
      currentParagraph.push(word);
      charCount += word.length + 1;

      // Si alcanzamos el target y encontramos un punto, crear nuevo párrafo
      if (charCount > targetLength && word.endsWith('.')) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
        charCount = 0;
      }
    }

    // Añadir el último párrafo si queda algo
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }

    return paragraphs.join('\n\n');
  }
}
