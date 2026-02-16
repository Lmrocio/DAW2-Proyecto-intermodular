# Análisis de Accesibilidad - TecnoMayores

> **Proyecto:** TecnoMayores - Plataforma de alfabetización digital para personas mayores  
> **Autora:** Rocío Luque Montes   
> **Fecha:** 16 de febrero de 2026  
> **Nivel de conformidad objetivo:** WCAG 2.1 Nivel AA

---

## Índice

1. [Fundamentos de Accesibilidad](#sección-1-fundamentos-de-accesibilidad)
2. [Componente Multimedia Implementado](#sección-2-componente-multimedia-implementado)
3. [Auditoría Automatizada Inicial](#sección-3-auditoría-automatizada-inicial)
4. [Análisis y Corrección de Errores](#sección-4-análisis-y-corrección-de-errores)
5. [Análisis de Estructura Semántica](#sección-5-análisis-de-estructura-semántica)
6. [Verificación Manual](#sección-6-verificación-manual)
7. [Resultados Finales](#sección-7-resultados-finales-después-de-correcciones)
8. [Conclusiones y Reflexión](#sección-8-conclusiones-y-reflexión)

---

## Sección 1: Fundamentos de Accesibilidad

### 1.1 ¿Por qué es necesaria la accesibilidad web?

La accesibilidad web es fundamental para garantizar que todas las personas, independientemente de sus capacidades, puedan acceder a la información y servicios digitales. En TecnoMayores, esta necesidad cobra especial relevancia dado que mi público objetivo son personas mayores que frecuentemente presentan discapacidades visuales (presbicia, cataratas, degeneración macular), auditivas (pérdida de audición relacionada con la edad), motoras (artritis, temblores, reducción de precisión) y cognitivas (dificultades de memoria, menor velocidad de procesamiento).

He comprobado que la accesibilidad beneficia a todos los usuarios: textos legibles, navegación clara y contenido multimedia con alternativas mejoran la experiencia de cualquier persona. En España, el Real Decreto 1112/2018 y la Directiva Europea 2016/2102 establecen la obligatoriedad de que los sitios web del sector público y servicios esenciales cumplan con estándares de accesibilidad, por lo que esto no solo es una buena práctica, sino un requisito legal.

### 1.2 Los 4 Principios de WCAG 2.1

Las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 se organizan en torno a cuatro principios fundamentales, conocidos por el acrónimo **POUR** (Perceivable, Operable, Understandable, Robust):

#### 1. Perceptible
> La información y los componentes de la interfaz deben presentarse de formas que los usuarios puedan percibir.

**Explicación:** El contenido debe poder ser percibido por al menos uno de los sentidos del usuario, ya sea mediante la vista, el oído o el tacto.

**Ejemplo en TecnoMayores:**  
En mi componente `VideoTutorialComponent`, he implementado subtítulos en español e inglés mediante etiquetas `<track>` para usuarios con discapacidad auditiva. Además, he incluido una transcripción completa en texto plano debajo del video, permitiendo que usuarios sordos o con dificultades auditivas accedan al contenido. Las imágenes de la plataforma incluyen textos alternativos descriptivos (`alt`) que los lectores de pantalla pueden anunciar.

```html
<!-- Ejemplo real de TecnoMayores: subtítulos accesibles -->
<track kind="subtitles" src="tutorial-bizum.vtt" srclang="es" label="Español" default>
<track kind="subtitles" src="tutorial-bizum-en.vtt" srclang="en" label="English">
```

---

#### 2. Operable
> Los componentes de la interfaz y la navegación deben ser operables por todos los usuarios.

**Explicación:** Los usuarios deben poder interactuar con todos los controles y elementos de navegación, independientemente de si usan ratón, teclado, voz u otras tecnologías de asistencia.

**Ejemplo en TecnoMayores:**  
Todos los botones de mi plataforma tienen un tamaño mínimo de 48x48 píxeles, cumpliendo con las recomendaciones WCAG AAA para áreas táctiles. Esto es especialmente importante para personas mayores con artritis o temblores. Además, he implementado estados de foco visibles (`focus-visible`) en todos los elementos interactivos, permitiendo la navegación completa mediante teclado. El reproductor de video utiliza controles nativos de HTML5 que son completamente accesibles por teclado.

```scss
/* Mixin de TecnoMayores para botones accesibles */
@mixin button-accessible($size: 'lg') {
  min-height: 48px;  /* Cumple WCAG AAA */
  min-width: 48px;
  @include focus-visible;  /* Foco visible para navegación por teclado */
}
```

---

#### 3. Comprensible
> La información y el funcionamiento de la interfaz deben ser comprensibles.

**Explicación:** El contenido debe ser legible y predecible. Los usuarios deben poder entender la información y cómo funciona la interfaz sin confusión.

**Ejemplo en TecnoMayores:**  
El servicio de síntesis de voz (`SpeechService`) que he implementado permite a los usuarios escuchar cualquier texto de la plataforma con un simple clic en el botón "Escuchar". Esto beneficia especialmente a personas mayores con dificultades de lectura o fatiga visual. He utilizado un lenguaje sencillo y directo en todas las instrucciones, evitando jerga técnica. Los pasos de cada lección se presentan de forma secuencial y numerada, facilitando el seguimiento.

```typescript
// Servicio de síntesis de voz de TecnoMayores
async speak(text: string): Promise<void> {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';  // Idioma español
  utterance.rate = 1;        // Velocidad normal (ajustable)
  // Selecciona voz española automáticamente
}
```

---

#### 4. Robusto
> El contenido debe ser lo suficientemente robusto para ser interpretado por una amplia variedad de agentes de usuario, incluidas las tecnologías de asistencia.

**Explicación:** El código debe seguir los estándares web para garantizar compatibilidad con navegadores actuales y futuros, así como con tecnologías de asistencia como lectores de pantalla.

**Ejemplo en TecnoMayores:**  
He utilizado HTML5 semántico con landmarks apropiados (`<header>`, `<nav>`, `<main>`, `<footer>`) que los lectores de pantalla interpretan correctamente. El componente de video incluye atributos ARIA (`aria-label`, `role="region"`) para proporcionar contexto adicional a las tecnologías de asistencia. Además, he incluido un mensaje de respaldo para navegadores sin soporte de video HTML5.

```html
<!-- Estructura semántica y ARIA en TecnoMayores -->
<video controls [attr.aria-label]="videoTitle">
  <!-- Mensaje de respaldo para navegadores antiguos -->
  <p class="video-fallback">
    Lo sentimos, tu navegador no soporta la reproducción de video.
  </p>
</video>
<div role="region" aria-label="Transcripción del video">
  <!-- Transcripción accesible -->
</div>
```

---

### 1.3 Niveles de Conformidad WCAG

Las WCAG 2.1 definen tres niveles de conformidad que representan diferentes grados de accesibilidad:

| Nivel | Descripción | Requisito |
|-------|-------------|-----------|
| **A** | Nivel mínimo de accesibilidad | Elimina las barreras más críticas. Sin él, algunos usuarios no pueden acceder al contenido en absoluto. |
| **AA** | Nivel intermedio (recomendado) | Elimina barreras significativas. Es el **estándar legal** en España y la UE para sitios web públicos. |
| **AAA** | Nivel máximo de accesibilidad | Proporciona la mejor experiencia posible. No siempre es alcanzable para todo el contenido. |

#### Objetivo de TecnoMayores: Nivel AA

Mi objetivo es alcanzar el nivel AA de conformidad, que es:
- El estándar requerido por la legislación española y europea
- El nivel que garantiza acceso a la gran mayoría de usuarios con discapacidad
- Un equilibrio realista entre accesibilidad óptima y recursos de desarrollo

Adicionalmente, he implementado algunas mejoras de nivel AAA especialmente relevantes para mi público objetivo (personas mayores):
- Contraste mejorado en textos importantes
- Tamaños de fuente base de 16px (superior al mínimo)
- Áreas táctiles de 48x48px (recomendación AAA)
- Síntesis de voz para contenido textual

---

## Sección 2: Componente Multimedia Implementado

### 2.1 Tipo de Componente

**Reproductor de Video Accesible** (`VideoTutorialComponent`)

### 2.2 Descripción del Componente

El `VideoTutorialComponent` es un reproductor de video HTML5 diseñado específicamente para la plataforma TecnoMayores, con un enfoque prioritario en la accesibilidad para personas mayores. El componente reproduce tutoriales educativos (como "Qué es Bizum y cómo funciona") e incluye múltiples alternativas para garantizar que el contenido sea accesible independientemente de las capacidades del usuario.

**Ubicación:** `src/app/components/shared/video-tutorial/`

**Archivos del componente:**
- `video-tutorial.component.ts` - Lógica del componente
- `video-tutorial.component.html` - Plantilla HTML
- `video-tutorial.component.scss` - Estilos CSS

### 2.3 Características de Accesibilidad Implementadas

El componente implementa las siguientes características de accesibilidad, alineadas con los criterios WCAG 2.1:

#### 1. Controles Nativos de HTML5
```html
<video class="video-player" controls [attr.aria-label]="videoTitle" preload="metadata">
```

- **Atributo `controls`:** Proporciona controles de reproducción nativos del navegador (play, pausa, volumen, pantalla completa, barra de progreso)
- **Beneficio:** Los controles nativos son completamente accesibles por teclado y compatibles con lectores de pantalla sin necesidad de JavaScript adicional
- **WCAG:** Cumple criterio **2.1.1 Teclado** (Nivel A)

#### 2. Subtítulos Multilingües con WebVTT
```html
<track kind="subtitles" [src]="subtitlesEsPath" srclang="es" label="Español" default>
<track kind="subtitles" [src]="subtitlesEnPath" srclang="en" label="English">
```

- **Formato WebVTT:** Estándar W3C para subtítulos web, con timestamps precisos
- **Idiomas:** Español (por defecto) e inglés disponibles
- **Atributo `default`:** Los subtítulos en español se activan automáticamente
- **Archivos VTT:**
  - `assets/subtitles/tutorial-bizum.vtt` (español)
  - `assets/subtitles/tutorial-bizum-en.vtt` (inglés)
- **WCAG:** Cumple criterio **1.2.2 Subtítulos (grabados)** (Nivel A)

**Ejemplo del archivo VTT:**
```vtt
WEBVTT

00:00:00.000 --> 00:00:03.000
Hola, hoy vamos a hablar de una
herramienta que simplifica algo que

00:00:03.000 --> 00:00:06.000
hacemos todos los días, los pagos.
```

#### 3. Transcripción Completa Integrada
```html
<details class="transcription-section">
  <summary class="transcription-summary">
    <span class="material-symbols-outlined">description</span>
    <h3 class="transcription-title">Transcripción completa del video</h3>
    <span class="material-symbols-outlined">expand_more</span>
  </summary>
  <div class="transcription-content" role="region" aria-label="Transcripción del video" 
       [innerHTML]="formattedTranscription">
  </div>
</details>
```

- **Elemento `<details>`:** Desplegable nativo accesible por teclado
- **Transcripción formateada:** El texto se divide automáticamente en párrafos para mejorar la legibilidad
- **Atributos ARIA:** `role="region"` y `aria-label` para identificar la sección ante lectores de pantalla
- **Beneficio:** Proporciona una alternativa textual completa para usuarios sordos, con dificultades auditivas, o que prefieren leer
- **WCAG:** Cumple criterio **1.2.1 Solo audio y solo vídeo (grabado)** (Nivel A) y contribuye a **1.2.3 Audiodescripción o alternativa multimedia** (Nivel A)

**Procesamiento inteligente de la transcripción:**
```typescript
get formattedTranscription(): string {
  // Divide el texto en párrafos de 3-4 oraciones para mejor legibilidad
  const sentences = this.transcription.split('. ');
  const paragraphs: string[] = [];
  
  for (let i = 0; i < sentences.length; i += 3) {
    const paragraphSentences = sentences.slice(i, i + 3);
    paragraphs.push(`<p>${paragraphSentences.join('. ')}.</p>`);
  }
  
  return paragraphs.join('');
}
```

#### 4. Etiquetado ARIA para Tecnologías de Asistencia
```html
<video [attr.aria-label]="videoTitle">
```

- **`aria-label` dinámico:** Describe el contenido del video para lectores de pantalla
- **Valor configurable:** Se puede personalizar para cada instancia del componente
- **WCAG:** Cumple criterio **4.1.2 Nombre, función, valor** (Nivel A)

#### 5. Mensaje de Respaldo para Navegadores Incompatibles
```html
<p class="video-fallback">
  Lo sentimos, tu navegador no soporta la reproducción de video.
  Por favor, actualiza tu navegador o descarga el video para verlo.
</p>
```

- **Degradación elegante:** Usuarios con navegadores antiguos reciben un mensaje informativo
- **WCAG:** Contribuye a la robustez del contenido (Principio 4)

#### 6. Diseño Responsive y Accesible
```scss
.video-player {
  width: 100%;
  height: auto;
  
  &:focus {
    outline: $border-medium solid $color-accent;
    outline-offset: 2px;
  }
  
  &::cue {
    background-color: rgba(0, 0, 0, 0.8);
    color: $color-text-light;
    font-size: $font-size-base;
  }
}
```

- **Video responsive:** Se adapta al ancho del contenedor
- **Foco visible:** Borde de color accent cuando el video tiene el foco
- **Subtítulos estilizados:** Fondo oscuro semitransparente para máximo contraste
- **WCAG:** Cumple criterio **2.4.7 Foco visible** (Nivel AA)

### 2.4 Resumen de Cumplimiento WCAG

| Criterio WCAG | Nivel | Estado | Implementación |
|---------------|-------|--------|----------------|
| 1.2.1 - Solo audio/vídeo | A | Cumple | Transcripción completa |
| 1.2.2 - Subtítulos | A | Cumple | Archivos VTT en ES/EN |
| 2.1.1 - Teclado | A | Cumple | Controles nativos HTML5 |
| 2.4.7 - Foco visible | AA | Cumple | Outline en :focus |
| 4.1.2 - Nombre, función, valor | A | Cumple | aria-label en video |

### 2.5 Uso del Componente

```html
<app-video-tutorial
  videoSrc="Qué_es_Bizum_y_cómo_funciona.webm"
  subtitlesEs="tutorial-bizum.vtt"
  subtitlesEn="tutorial-bizum-en.vtt"
  videoTitle="Tutorial sobre Bizum - Qué es y cómo funciona"
  [transcription]="videoTranscripcion()"
></app-video-tutorial>
```

**Inputs configurables:**
| Input | Tipo | Descripción |
|-------|------|-------------|
| `videoSrc` | string | Ruta del archivo de video (relativa a `assets/videos/`) |
| `subtitlesEs` | string | Archivo VTT de subtítulos en español |
| `subtitlesEn` | string | Archivo VTT de subtítulos en inglés |
| `videoTitle` | string | Título accesible para lectores de pantalla |
| `transcription` | string | Texto completo de la transcripción |

---

## Sección 3: Auditoría Automatizada Inicial

> **Pendiente de completar**
> 
> Esta sección se completará con los resultados de las herramientas:
> - Lighthouse (Chrome DevTools)
> - WAVE (Extensión de navegador)
> - TAW (Test de Accesibilidad Web)

| Herramienta | Puntuación/Errores | Captura |
|-------------|-------------------|---------|
| Lighthouse | [ ]/100 | ![Lighthouse inicial](./capturas/lighthouse-antes.png) |
| WAVE | [ ] errores, [ ] alertas | ![WAVE inicial](./capturas/wave-antes.png) |
| TAW | [ ] problemas | ![TAW](./capturas/taw.png) |

---

## Sección 4: Análisis y Corrección de Errores

> **Pendiente de completar**

---

## Sección 5: Análisis de Estructura Semántica

> **Pendiente de completar**

---

## Sección 6: Verificación Manual

> **Pendiente de completar**

---

## Sección 7: Resultados Finales Después de Correcciones

> **Pendiente de completar**

---

## Sección 8: Conclusiones y Reflexión

> **Pendiente de completar**

---

## Referencias

- [WCAG 2.1 - W3C](https://www.w3.org/TR/WCAG21/)
- [Introducción a la Accesibilidad Web - W3C WAI](https://www.w3.org/WAI/fundamentals/accessibility-intro/es)
- [WebVTT - W3C](https://www.w3.org/TR/webvtt1/)
- [Accesible.es](https://accesible.es)
- [Real Decreto 1112/2018](https://www.boe.es/eli/es/rd/2018/09/07/1112)

