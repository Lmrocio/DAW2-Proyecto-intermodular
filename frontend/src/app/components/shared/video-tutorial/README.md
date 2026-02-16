# VideoTutorialComponent

Componente de reproductor de video accesible diseñado específicamente para TecnoMayores, con soporte completo para subtítulos multiidioma y transcripciones.

## 📋 Características

- ✅ **Reproductor HTML5** con controles nativos
- ✅ **Subtítulos multiidioma** (Español e Inglés)
- ✅ **Transcripción completa** del video en texto plano
- ✅ **Diseño 100% responsive** adaptado a todos los dispositivos
- ✅ **Accesibilidad WCAG 2.1** nivel AA cumplido
- ✅ **Modo oscuro** automático según preferencias del sistema
- ✅ **Alto contraste** para usuarios con necesidades visuales
- ✅ **Movimiento reducido** para usuarios sensibles al movimiento

## 🎯 Uso básico

### Importar el componente

```typescript
import { VideoTutorialComponent } from './components/shared/video-tutorial/video-tutorial.component';

@Component({
  // ...
  imports: [VideoTutorialComponent]
})
export class MiComponente { }
```

### Uso en la plantilla

```html
<!-- Uso básico con valores por defecto -->
<app-video-tutorial></app-video-tutorial>

<!-- Uso personalizado -->
<app-video-tutorial
  videoSrc="mi-video.webm"
  subtitlesEs="mis-subtitulos-es.vtt"
  subtitlesEn="mis-subtitulos-en.vtt"
  videoTitle="Mi Tutorial"
  [transcription]="miTextoTranscripcion"
></app-video-tutorial>
```

## 📥 Inputs

| Nombre | Tipo | Valor por defecto | Descripción |
|--------|------|-------------------|-------------|
| `videoSrc` | `string` | `'Qué_es_Bizum_y_cómo_funciona.webm'` | Nombre del archivo de video (ubicado en `assets/videos/`) |
| `subtitlesEs` | `string` | `'tutorial-bizum.vtt'` | Nombre del archivo de subtítulos en español (ubicado en `assets/subtitles/`) |
| `subtitlesEn` | `string` | `'tutorial-bizum-en.vtt'` | Nombre del archivo de subtítulos en inglés (ubicado en `assets/subtitles/`) |
| `videoTitle` | `string` | `'Tutorial de Bizum'` | Título del video para accesibilidad (aria-label) |
| `transcription` | `string` | `[texto completo]` | Transcripción completa del video en texto plano |

## 📁 Estructura de archivos

```
src/app/components/shared/video-tutorial/
├── video-tutorial.component.ts       # Lógica del componente
├── video-tutorial.component.html     # Template HTML
├── video-tutorial.component.scss     # Estilos
├── video-tutorial.component.spec.ts  # Tests unitarios
└── README.md                         # Esta documentación
```

## 🎨 Estilos

El componente utiliza las variables de `_variables.scss` del proyecto:

- Colores de marca y accesibilidad
- Sistema de espaciado consistente
- Tipografía del sistema de diseño
- Sombras y bordes predefinidos
- Breakpoints responsive

### Personalización

Si necesitas personalizar los estilos, puedes hacerlo mediante:

```scss
::ng-deep app-video-tutorial {
  .video-wrapper {
    // Tus estilos personalizados
  }
}
```

## ♿ Accesibilidad

### Características implementadas

1. **Subtítulos**: Soporte para múltiples idiomas con formato WebVTT
2. **Transcripción**: Texto completo del contenido del video
3. **ARIA labels**: Etiquetas descriptivas para lectores de pantalla
4. **Contraste**: Colores que cumplen WCAG AA (mínimo 4.5:1)
5. **Navegación por teclado**: Todos los controles accesibles vía teclado
6. **Enfoque visible**: Indicadores claros cuando se navega por teclado
7. **Responsive**: Adaptado a diferentes tamaños de pantalla y zoom

### Cumplimiento WCAG 2.1

- ✅ **1.2.1 Solo audio y solo video (grabado)**: Transcripción completa incluida
- ✅ **1.2.2 Subtítulos (grabados)**: Subtítulos sincronizados disponibles
- ✅ **1.2.3 Audiodescripción o medio alternativo**: Transcripción como alternativa
- ✅ **1.4.3 Contraste (mínimo)**: Ratio de contraste superior a 4.5:1
- ✅ **2.1.1 Teclado**: Totalmente operable con teclado
- ✅ **2.4.7 Foco visible**: Indicador de foco claramente visible
- ✅ **4.1.2 Nombre, función, valor**: Semántica HTML correcta

## 🎬 Formatos de video soportados

El componente está configurado para WebM, pero puede extenderse:

```html
<source [src]="videoPath" type="video/webm">
<source [src]="videoPathMp4" type="video/mp4">
<source [src]="videoPathOgg" type="video/ogg">
```

## 📝 Formato de subtítulos (WebVTT)

Los archivos de subtítulos deben seguir el formato WebVTT:

```
WEBVTT

00:00:00.000 --> 00:00:03.000
Texto del subtítulo línea 1

00:00:03.000 --> 00:00:06.000
Texto del subtítulo línea 2
```

## 🧪 Tests

Ejecutar los tests unitarios:

```bash
npm test -- --include='**/video-tutorial.component.spec.ts'
```

## 📖 Ejemplo completo

```typescript
import { Component } from '@angular/core';
import { VideoTutorialComponent } from './components/shared/video-tutorial/video-tutorial.component';

@Component({
  selector: 'app-leccion-bizum',
  standalone: true,
  imports: [VideoTutorialComponent],
  template: `
    <div class="leccion-container">
      <h2>Lección: ¿Qué es Bizum?</h2>
      
      <app-video-tutorial
        videoSrc="Qué_es_Bizum_y_cómo_funciona.webm"
        subtitlesEs="tutorial-bizum.vtt"
        subtitlesEn="tutorial-bizum-en.vtt"
        videoTitle="Tutorial sobre Bizum y cómo funciona"
        [transcription]="transcripcionCompleta"
      ></app-video-tutorial>
      
      <div class="actividades">
        <!-- Más contenido de la lección -->
      </div>
    </div>
  `
})
export class LeccionBizumComponent {
  transcripcionCompleta = `
    Hola, hoy vamos a hablar de una herramienta que simplifica...
    [resto del texto]
  `;
}
```

## 🔧 Mantenimiento

### Añadir un nuevo video

1. Coloca el archivo de video en `src/assets/videos/`
2. Crea los archivos VTT de subtítulos en `src/assets/subtitles/`
3. Prepara la transcripción completa en texto plano
4. Usa el componente con los nuevos valores:

```html
<app-video-tutorial
  videoSrc="nuevo-video.webm"
  subtitlesEs="nuevo-video-es.vtt"
  subtitlesEn="nuevo-video-en.vtt"
  videoTitle="Mi Nuevo Tutorial"
  [transcription]="nuevaTranscripcion"
></app-video-tutorial>
```

## 📚 Referencias

- [MDN - Element video](https://developer.mozilla.org/es/docs/Web/HTML/Element/video)
- [MDN - WebVTT](https://developer.mozilla.org/es/docs/Web/API/WebVTT_API)
- [WCAG 2.1 - Criterios de conformidad](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular - Componentes standalone](https://angular.io/guide/standalone-components)

## 👨‍💻 Autor

Desarrollado para el proyecto TecnoMayores con enfoque en accesibilidad y usabilidad.
