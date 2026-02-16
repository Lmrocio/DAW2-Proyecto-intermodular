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

He ejecutado tres herramientas de análisis automático para evaluar la accesibilidad de TecnoMayores antes de aplicar correcciones.

### 3.1 Herramientas Utilizadas

#### Lighthouse (Chrome DevTools)

He analizado la página principal de TecnoMayores usando Lighthouse integrado en Chrome DevTools:

- **Puntuación obtenida:** 93/100
- **Método:** F12 → Pestaña Lighthouse → Categoría "Accessibility" → "Analyze page load"

| Herramienta | Puntuación/Errores | Captura                                              |
|-------------|-------------------|------------------------------------------------------|
| Lighthouse | 93/100 | ![Lighthouse inicial](capturas/lighthouse-antes.png) |
| WAVE | 8.2/10 - 5 errores de contraste, 1 alerta | ![WAVE inicial](capturas/wave-antes.png)             |
| TAW | 11 problemas en 5 criterios, 38 advertencias, 16 no verificados | ![TAW](capturas/taw-antes.png)                          |

### 3.2 Problemas Detectados por Lighthouse

#### Problema 1: Contraste Insuficiente (Contrast)

**Descripción:** Los colores de fondo y primer plano no tienen una relación de contraste suficiente.

**Impacto:** El texto de bajo contraste es difícil o imposible de leer para muchos usuarios, especialmente personas mayores con problemas visuales o usuarios con daltonismo.

**Elementos afectados:**
- `span.button__text` (texto de botones)
- `a.button.button--brutal.button--md.button--secondary` (botón secundario)
- `button.button.button--brutal.button--md.button--secondary` (botón secundario)
- `span.leccion-badge.badge-orange` (insignia naranja de lecciones)
- `a.app-footer__action-link.app-footer__accessibility-btn` (botón de accesibilidad en footer)
- `footer.app-footer` (pie de página)
- `a.app-footer__action-link.app-footer__language-btn` (botón de idioma en footer)
- `footer.app-footer` (pie de página)

**Criterio WCAG afectado:** 1.4.3 - Contraste mínimo (Nivel AA)

#### Problema 2: Estructura de Listas (Lists)

**Descripción:** Las listas no contienen únicamente elementos `<li>` y elementos de soporte de script (`<script>` y `<template>`).

**Impacto:** Los lectores de pantalla tienen una forma específica de anunciar listas. Una estructura de lista incorrecta dificulta la salida del lector de pantalla y confunde a usuarios ciegos o con baja visión.

**Elementos afectados:**
- `ul.breadcrumb-nav__list` - contiene `span.breadcrumb-nav__prefix` como hijo directo

**Criterio WCAG afectado:** 1.3.1 - Información y relaciones (Nivel A)

---

### 3.3 Problemas Detectados por WAVE

#### WAVE (Web Accessibility Evaluation Tool)

He analizado la página principal de TecnoMayores usando la extensión WAVE para navegadores:

- **Puntuación obtenida:** 8.2/10
- **Total de errores:** 5 errores de contraste
- **Total de alertas:** 1 alerta
- **Método:** Extensión WAVE activada en la página principal

#### Error 1: Contraste Muy Bajo en Botón "Saber sobre nosotros"

**Elemento afectado:**
```html
<a class="button button--brutal button--md button--secondary" tabindex="0" href="/about">
  <span class="button__text" style="opacity: 1; color: rgb(253, 253, 253); background-color: rgb(255, 184, 66);">
    Saber sobre nosotros
  </span>
</a>
```

**Descripción:** Contraste muy bajo (Very low contrast) entre el texto blanco (rgb(253, 253, 253)) y el fondo amarillo-naranja (rgb(255, 184, 66)).

**Ubicación:** Sección Hero de la página principal.

**Impacto:** El texto es difícil de leer para personas mayores con problemas visuales o usuarios con daltonismo. El amarillo claro sobre blanco no proporciona suficiente diferenciación.

#### Error 2: Contraste Muy Bajo en Botón "Ver Lecciones"

**Elemento afectado:**
```html
<button class="button button--brutal button--md button--secondary" type="button">
  <span class="button__text" style="opacity: 1; color: rgb(253, 253, 253); background-color: rgb(255, 184, 66);">
    Ver Lecciones
  </span>
</button>
```

**Descripción:** Mismo problema de contraste que el Error 1. Texto blanco sobre fondo amarillo-naranja.

**Ubicación:** Footer de la sección de características (feature-section).

**Impacto:** Los usuarios con baja visión no pueden distinguir claramente el texto del botón, dificultando la navegación a las lecciones.

#### Error 3: Contraste Muy Bajo en Badge de Categoría

**Elemento afectado:**
```html
<span class="leccion-badge badge-orange">
  Comunicación
</span>
```

**Descripción:** La insignia naranja que categoriza las lecciones no tiene suficiente contraste.

**Ubicación:** Tarjetas de lecciones en el catálogo.

**Impacto:** Las etiquetas de categoría son importantes para la navegación y clasificación del contenido. Un contraste insuficiente impide que usuarios con discapacidad visual identifiquen rápidamente el tipo de lección.

#### Error 4: Contraste Muy Bajo en Botón de Accesibilidad del Footer

**Elemento afectado:**
```html
<a href="/accesibilidad" aria-label="Declaración de Accesibilidad" 
   class="app-footer__action-link app-footer__accessibility-btn">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10..."></path>
  </svg>
  AAA
</a>
```

**Descripción:** El enlace al documento de accesibilidad, irónicamente, tiene problemas de contraste.

**Ubicación:** Pie de página (footer).

**Impacto:** Un enlace que debería demostrar el compromiso con la accesibilidad no cumple con los estándares mínimos de contraste.

**Alerta asociada:** Link redundante - el icono SVG y el texto "AAA" apuntan al mismo destino.

#### Error 5: Contraste Muy Bajo en Botón de Idioma del Footer

**Elemento afectado:**
```html
<a href="#" aria-label="Selector de idioma" 
   class="app-footer__action-link app-footer__language-btn">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10..."></path>
  </svg>
  Español
</a>
```

**Descripción:** El selector de idioma presenta contraste insuficiente.

**Ubicación:** Pie de página (footer).

**Impacto:** Los usuarios que necesitan cambiar el idioma pueden tener dificultades para localizar esta opción.

#### Alerta 1: Link Redundante

**Elemento afectado:** Botón de accesibilidad del footer (Error 4).

**Descripción:** El icono SVG y el texto "AAA" dentro del mismo enlace crean redundancia.

**Recomendación:** Considerar usar `aria-hidden="true"` en el SVG para evitar que los lectores de pantalla anuncien el contenido dos veces.

**Criterios WCAG afectados:**
- **1.4.3 - Contraste mínimo (Nivel AA):** Todos los errores de contraste
- **2.4.4 - Propósito de los enlaces (Nivel A):** Alerta de link redundante

---

### 3.4 Problemas Detectados por TAW

#### TAW (Test de Accesibilidad Web)

He analizado la página principal de TecnoMayores usando la herramienta online TAW:

- **URL analizada:** https://lmrocio.github.io/DAW2-Proyecto-intermodular/
- **Fecha del análisis:** 16/02/2026 14:05
- **Nivel del análisis:** AA
- **Pautas aplicadas:** WCAG 2.0
- **Tecnologías detectadas:** HTML, CSS
- **Método:** Análisis automático vía https://www.tawdis.net/?lang=es

#### Resumen de Resultados TAW

| Tipo de Resultado | Cantidad | Criterios Afectados | Descripción |
|-------------------|----------|---------------------|-------------|
| **Problemas (Fallos)** | 11 | 5 criterios de éxito | Errores verificados que requieren corrección |
| **Advertencias** | 38 | 12 criterios de éxito | Requieren revisión manual |
| **No verificados** | 16 | 16 criterios de éxito | Comprobación completamente manual |

**Distribución de Problemas por Principio WCAG:**

| Principio | Problemas | Advertencias | No verificados |
|-----------|-----------|--------------|----------------|
| **Perceptible** | 5 | 10 | 4 |
| **Operable** | 2 | 22 | 7 |
| **Comprensible** | 2 | 6 | 5 |
| **Robusto** | 2 | 0 | 0 |
| **Total** | **11** | **38** | **16** |

#### Análisis por Principio WCAG

TAW organiza los resultados según los cuatro principios WCAG. Detallo a continuación los problemas más relevantes:

##### Principio 1: Perceptible

| Criterio WCAG | Comprobación | Resultado | Incidencias | Líneas |
|---------------|--------------|-----------|-------------|--------|
| **1.1.1** Contenido no textual | Controles de formulario sin etiquetar | Falla | 2 | 15 |
| **1.1.1** Contenido no textual | Imágenes que pueden requerir descripción larga | Desconocido | 4 | 15 |
| **1.3.1** Información y relaciones | Controles de formulario sin etiquetar | Falla | 2 | 15 |
| **1.3.1** Información y relaciones | Generación de contenido desde CSS | Desconocido | 2 | 14 |
| **1.3.1** Información y relaciones | Dos encabezados consecutivos sin contenido | Falla | 1 | 15 |
| **1.3.2** Secuencia con significado | Posicionamiento absoluto | Desconocido | 2 | 14 |
| **1.4.4** Redimensionamiento texto | Tamaños de fuente absolutos | Desconocido | 1 | 14 |
| **1.4.4** Redimensionamiento texto | Medidas absolutas en bloques | Desconocido | 1 | 14 |

**Detalle de los fallos del Principio 1:**

**Error TAW-P1-1: Controles de formulario sin etiquetar (1.1.1)**

Los campos de entrada (`<input>`) detectados en la línea 15 no tienen asociada una etiqueta `<label>` correctamente vinculada mediante el atributo `for`, o carecen de atributos ARIA (`aria-label`, `aria-labelledby`) que los identifiquen.

**Elementos afectados:**
- Campo de búsqueda en el buscador principal
- Campo de email en el formulario de newsletter del footer

**Técnicas WCAG relacionadas:** H44, H65

**Error TAW-P1-2: Dos encabezados consecutivos sin contenido (1.3.1) - CORREGIDO**

Se detectó una estructura de encabezados incorrecta donde aparecían dos encabezados del mismo nivel seguidos sin contenido textual entre ellos. Esto violaba la técnica H42 que establece que los encabezados deben seguir una jerarquía lógica con contenido significativo.

**Solución aplicada:** Se identificó que el componente `simulator-card` utilizaba elementos `<h3>` para los títulos de las tarjetas ("Seguro" e "Infinito"). Dado que estas tarjetas no representan secciones de contenido que deban ser navegadas por encabezados, se cambió `<h3>` a `<p>`, manteniendo los estilos visuales pero corrigiendo la semántica HTML.

**Impacto resuelto:** Los usuarios de lectores de pantalla ahora pueden navegar correctamente por la jerarquía de encabezados sin encontrar elementos consecutivos confusos.

**Archivo modificado:** `src/app/components/shared/simulator-card/simulator-card.component.html`

##### Principio 2: Operable

| Criterio WCAG | Comprobación | Resultado | Incidencias | Líneas |
|---------------|--------------|-----------|-------------|--------|
| **2.4.1** Evitar bloques | Saltar bloques de contenido | Sin revisar | 1 | - |
| **2.4.1** Evitar bloques | Dos encabezados consecutivos | Desconocido | 1 | 15 |
| **2.4.2** Páginas tituladas | Página con título descriptivo | Desconocido | 1 | 3 |
| **2.4.4** Propósito de enlaces | Enlaces sin contenido | Falla | 2 | 15 |
| **2.4.4** Propósito de enlaces | Enlaces con mismo texto y destinos diferentes | Desconocido | 3 | 15 |
| **2.4.6** Encabezados y etiquetas | Contenido adecuado | Desconocido | 15 | 15 |
| **2.4.7** Foco visible | Pseudoclase :focus | Desconocido | 2 | 13 |

**Detalle de los fallos del Principio 2:**
**Detalle de los fallos del Principio 2:**

**Error TAW-P2-1: Enlaces sin contenido (2.4.4)**

Se detectaron 2 enlaces (`<a>`) que no contienen texto visible ni alternativa accesible. Esto impide que los usuarios de tecnologías asistivas comprendan el propósito del enlace.

**Técnica WCAG relacionada:** F89 - Fallo por proporcionar enlaces sin texto descriptivo

**Elementos afectados (línea 15):**
- Enlaces en el footer que solo contienen iconos SVG sin texto alternativo adecuado
- Posibles enlaces con contenido generado solo por CSS (pseudoelementos `::before`/`::after`)

**Impacto:** Un lector de pantalla puede anunciar estos enlaces como "enlace" o "enlace vacío", sin proporcionar información sobre su destino o función.

##### Principio 3: Comprensible

| Criterio WCAG | Comprobación | Resultado | Incidencias | Líneas |
|---------------|--------------|-----------|-------------|--------|
| **3.1.2** Idioma de las partes | Cambios en el idioma | Sin revisar | 1 | - |
| **3.3.1** Identificación de errores | Identificar valores erróneos | Desconocido | 1 | 15 |
| **3.3.2** Etiquetas o instrucciones | Etiquetado de controles | Falla | 2 | 15 |
| **3.3.3** Sugerencias ante errores | Proporcionar sugerencias | Desconocido | 1 | 15 |
| **3.3.4** Prevención de errores | Formularios legales/financieros | Desconocido | 3 | 15 |

**Detalle de los fallos del Principio 3:**

**Error TAW-P3-1: Etiquetado incorrecto de controles de formulario (3.3.2)**

Los controles de formulario (campos de entrada) no proporcionan etiquetas o instrucciones claras sobre qué información se espera del usuario.

**Elementos afectados:**
- `<input type="text" class="search-input">` - Campo de búsqueda
- `<input type="email" class="app-footer__newsletter-input">` - Campo de newsletter

**Técnicas WCAG relacionadas:** H44 (Uso de `<label>` con `for`), H65 (Uso de `aria-label`)

**Impacto:** Los usuarios de lectores de pantalla no sabrán qué información introducir en estos campos. Para personas mayores con dificultades cognitivas, la falta de instrucciones claras puede resultar confusa.

##### Principio 4: Robusto

| Criterio WCAG | Comprobación | Resultado | Incidencias | Líneas |
|---------------|--------------|-----------|-------------|--------|
| **4.1.2** Nombre, función, valor | Controles sin etiquetar | Falla | 2 | 15 |
| **4.1.2** Nombre, función, valor | Nombre, rol y valor | Sin revisar | 1 | - |

**Detalle de los fallos del Principio 4:**

**Error TAW-P4-1: Controles sin nombre accesible (4.1.2)**

Los componentes de interfaz de usuario (campos de formulario) no exponen correctamente su nombre y función a las tecnologías asistivas mediante la API de accesibilidad del navegador.

**Técnicas WCAG relacionadas:** H44, H65

**Impacto:** Las tecnologías asistivas como JAWS, NVDA o VoiceOver no pueden identificar estos controles correctamente, lo que impide su uso efectivo por personas con discapacidad visual.

#### Resumen de Problemas Detectados por TAW

| # | Error | Criterio WCAG | Principio | Incidencias | Prioridad |
|---|-------|---------------|-----------|-------------|-----------|
| 1 | Controles de formulario sin etiquetar | 1.1.1 | Perceptible | 2 | Alta |
| 2 | Controles de formulario sin etiquetar | 1.3.1 | Perceptible | 2 | Alta |
| 3 | Encabezados consecutivos sin contenido (H42) - **CORREGIDO** | 1.3.1 | Perceptible | 1 | Media |
| 4 | Enlaces sin contenido | 2.4.4 | Operable | 2 | Alta |
| 5 | Etiquetado de controles | 3.3.2 | Comprensible | 2 | Alta |
| 6 | Controles sin nombre accesible | 4.1.2 | Robusto | 2 | Alta |
| **Total** | | **5 criterios** | **4 principios** | **11** | |

**Observación importante:** Varios de estos errores se refieren al mismo problema subyacente: los campos de entrada `<input>` de la página (buscador y newsletter) carecen de etiquetas accesibles. Este único problema de implementación genera múltiples fallos en diferentes criterios WCAG (1.1.1, 1.3.1, 3.3.2 y 4.1.2), lo que demuestra la importancia del etiquetado correcto de formularios.

---

### 3.5 Resumen de los 3 Problemas Más Graves

Después de analizar los resultados de las tres herramientas (Lighthouse, WAVE y TAW), he identificado los tres problemas de accesibilidad más críticos que debo corregir:

1. **Controles de formulario sin etiquetar (detectado por TAW, afecta criterios 1.1.1, 1.3.1, 3.3.2, 4.1.2):**
   - Detectado por: TAW
   - Elementos afectados: Campo de búsqueda (`<input class="search-input">`) y campo de newsletter (`<input class="app-footer__newsletter-input">`)
   - Gravedad: ALTA - Un único problema causa múltiples violaciones de criterios WCAG de nivel A
   - Impacto en usuarios: Usuarios de lectores de pantalla (JAWS, NVDA, VoiceOver) no pueden identificar la función de estos campos. Personas mayores con discapacidad visual quedan completamente excluidas de usar el buscador o suscribirse al boletín.
   - Solución: Añadir etiquetas `<label>` con atributo `for` vinculado al `id` del input, o utilizar `aria-label` para proporcionar un nombre accesible.

2. **Contraste insuficiente en botones y elementos del footer (detectado por Lighthouse y WAVE):**
   - Detectado por: Lighthouse y WAVE
   - Elementos afectados: Botones secundarios "Saber sobre nosotros" y "Ver Lecciones" (color rgb(253, 253, 253) sobre rgb(255, 184, 66)), badges de categorías, botones de accesibilidad e idioma en footer
   - Ratio de contraste actual: Aproximadamente 1.5:1
   - Ratio requerido: 4.5:1 (WCAG AA para texto normal) o 7:1 (WCAG AAA)
   - Gravedad: ALTA - Los botones son elementos de navegación primarios
   - Impacto en usuarios: Personas mayores con presbicia, usuarios con daltonismo, usuarios en entornos con luz brillante. Irónicamente, el botón de "Accesibilidad" no es accesible.

3. **Enlaces sin contenido accesible y estructura de listas incorrecta (detectado por TAW y Lighthouse):**
   - Detectado por: TAW (enlaces sin contenido - 2.4.4) y Lighthouse (estructura de listas - 1.3.1)
   - Elementos afectados: 
     - Enlaces del footer que solo contienen iconos SVG sin texto alternativo
     - `ul.breadcrumb-nav__list` contiene `span.breadcrumb-nav__prefix` directamente (no dentro de `<li>`)
   - Gravedad: ALTA/MEDIA - Afecta la navegación con lectores de pantalla
   - Impacto en usuarios: Los usuarios de lectores de pantalla escuchan "enlace" o "enlace vacío" sin saber a dónde llevan los enlaces. La estructura incorrecta del breadcrumb confunde a usuarios ciegos sobre la navegación.

**Patrón común identificado:** La mayoría de los errores se relacionan con dos áreas problemáticas:
1. **Paleta de colores:** El color secundario (rgb(255, 184, 66) - amarillo-naranja) del diseño "brutal" no proporciona suficiente contraste con el texto blanco. Necesito revisar mi sistema de variables de color en `_variables.scss`.
2. **Formularios sin semántica accesible:** Los campos de entrada carecen de etiquetado apropiado, un error fundamental que afecta a cuatro criterios WCAG diferentes.

---

## Sección 4: Análisis y Corrección de Errores

En esta sección documento las correcciones que realicé para los 20 errores y advertencias más críticos detectados en las auditorías, mostrando el código antes y después de cada cambio.

### 4.1 Tabla Resumen de Errores Corregidos

| # | Error | Criterio WCAG | Herramienta | Solución aplicada |
|---|-------|---------------|-------------|-------------------|
| 1 | Estructura incorrecta del breadcrumb | 1.3.1 | Lighthouse | Movido `<span>` fuera del `<ul>` |
| 2 | Campo de búsqueda sin etiqueta | 1.1.1, 3.3.2, 4.1.2 | TAW | Añadido `<label>` con clase `visually-hidden` |
| 3 | Campo de newsletter sin etiqueta | 1.1.1, 3.3.2, 4.1.2 | TAW | Añadido `<label>` vinculado con `for` |
| 4 | Enlaces sociales sin texto accesible | 2.4.4 | TAW | Añadido texto oculto con `visually-hidden` |
| 5 | Bajo contraste en botones del footer | 1.4.3 | Lighthouse, WAVE | Cambiado color a `var(--text-primary)` |
| 6 | Bajo contraste en botones secundarios | 1.4.3 | Lighthouse, WAVE | Cambiado texto de blanco a negro |
| 7 | Bajo contraste en badge naranja | 1.4.3 | WAVE | Cambiado texto de blanco a negro |
| 8 | Link redundante en botón de accesibilidad | 2.4.4 | WAVE | Eliminado enlace duplicado de la lista de navegación |
| 9 | Título de página genérico | 2.4.2 | TAW | Cambiado de "Frontend" a título descriptivo |
| 10 | Enlaces sociales sin contenido textual | 2.4.4 | TAW | Añadido `<span class="visually-hidden">` con texto descriptivo |
| 11 | Encabezados consecutivos sin contenido (H42) | 1.3.1 | TAW | Cambiado `<h3>` a `<p>` en simulator-card |
| 12 | Falta enlace "Saltar al contenido" | 2.4.1 | TAW | Añadido enlace skip-to-main con estilos accesibles |
| 13 | Enlaces con mismo texto y destinos diferentes | 2.4.4 | TAW | Añadido `[ariaLabel]` descriptivo a botones de lección |
| 14 | Botones "Guardar" sin contexto | 2.4.4 | TAW | Añadido `[ariaLabel]` con nombre de la lección |
| 15 | Botones de reproducción sin contexto | 2.4.4 | TAW | Añadido `[ariaLabel]` dinámico con título de lección |
| 16 | Enlace "Ver todo catálogo" sin contexto | 2.4.4 | TAW | Añadido `aria-label` descriptivo |
| 17 | Botones del hero sin aria-label | 2.4.4 | TAW | Añadido `[ariaLabel]` a botones de acción |
| 18 | Botones de guía sin contexto | 2.4.4 | TAW | Añadido `ariaLabel` descriptivo a botones |
| 19 | Botón suscribir sin aria-label | 2.4.4 | TAW | Añadido `aria-label` al botón del newsletter |
| 20 | Enlaces footer sin contexto | 2.4.4 | TAW | Añadido `aria-label` a accesibilidad e idioma |

---

### 4.2 Detalle de Cada Error Corregido

#### Error #1: Estructura incorrecta del breadcrumb

**Problema:** El componente de migas de pan contenía un `<span>` como hijo directo de `<ul>`, violando la especificación HTML que solo permite elementos `<li>` dentro de listas.

**Impacto:** Los lectores de pantalla anuncian las listas de forma específica y una estructura incorrecta confunde a usuarios ciegos que dependen de la navegación por landmarks.

**Criterio WCAG:** 1.3.1 - Información y relaciones (Nivel A)

**Código ANTES:**
```html
<nav class="breadcrumb-nav" aria-label="Migas de pan">
  <ul class="breadcrumb-nav__list">
    <!-- ERROR: span como hijo directo de ul -->
    <span class="breadcrumb-nav__prefix">Estás en:</span>
    <li class="breadcrumb-nav__item">
      <a routerLink="/home">Inicio</a>
    </li>
  </ul>
</nav>
```

**Código DESPUÉS:**
```html
<nav class="breadcrumb-nav" aria-label="Migas de pan">
  <!-- Prefijo movido fuera de la lista -->
  <span class="breadcrumb-nav__prefix" aria-hidden="true">Estás en:</span>
  
  <ul class="breadcrumb-nav__list">
    <li class="breadcrumb-nav__item">
      <a routerLink="/home">Inicio</a>
    </li>
  </ul>
</nav>
```

**Archivo modificado:** `src/app/components/shared/breadcrumb-nav/breadcrumb-nav.html`

---

#### Error #2: Campo de búsqueda sin etiqueta accesible

**Problema:** El campo de búsqueda usaba solo `aria-label` sin un `<label>` asociado. Aunque `aria-label` es válido, la técnica preferida es usar `<label>` con `for` porque proporciona una zona de clic ampliada y mejor soporte en tecnologías asistivas antiguas.

**Impacto:** Usuarios de lectores de pantalla no identifican claramente la función del campo y personas mayores con dificultades cognitivas no reciben instrucciones claras.

**Criterio WCAG:** 1.1.1, 3.3.2, 4.1.2 (Nivel A)

**Código ANTES:**
```html
<div class="search-container">
  <div class="search-icon">
    <svg><!-- icono --></svg>
  </div>
  <input
    type="text"
    class="search-input"
    placeholder="Escribe aquí..."
    aria-label="Campo de búsqueda"
  />
</div>
```

**Código DESPUÉS:**
```html
<div class="search-container">
  <div class="search-icon" aria-hidden="true">
    <svg><!-- icono --></svg>
  </div>
  
  <!-- Label oculto visualmente pero accesible -->
  <label for="search-input" class="visually-hidden">Buscar en TecnoMayores</label>
  
  <input
    type="text"
    id="search-input"
    class="search-input"
    placeholder="Escribe aquí..."
  />
</div>
```

**Archivo modificado:** `src/app/components/home/search-bar/search-bar.html`

---

#### Error #3: Campo de newsletter sin etiqueta accesible

**Problema:** El campo de email del boletín usaba `aria-label` en lugar de un `<label>` correctamente vinculado mediante el atributo `for`.

**Impacto:** Usuarios ciegos no saben qué información introducir y el formulario no cumple con las técnicas WCAG H44 y H65 para etiquetado de controles.

**Criterio WCAG:** 1.1.1, 1.3.1, 3.3.2, 4.1.2 (Nivel A)

**Código ANTES:**
```html
<form class="app-footer__newsletter-form">
  <input
    type="email"
    class="app-footer__newsletter-input"
    placeholder="Tu correo"
    aria-label="Tu correo electrónico"
  />
  <button type="submit">Suscribir</button>
</form>
```

**Código DESPUÉS:**
```html
<form class="app-footer__newsletter-form">
  <label for="newsletter-email" class="visually-hidden">
    Tu correo electrónico para el boletín
  </label>
  <input
    type="email"
    id="newsletter-email"
    class="app-footer__newsletter-input"
    placeholder="Tu correo"
  />
  <button type="submit">Suscribir</button>
</form>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

---

#### Error #4: Enlaces sociales del footer sin texto accesible

**Problema:** Los enlaces a WhatsApp y Email contenían solo iconos SVG. Aunque tenían `aria-label`, los SVG no estaban marcados con `aria-hidden="true"`, lo que causaba anuncios duplicados en lectores de pantalla.

**Impacto:** Los lectores de pantalla anuncian "enlace, gráfico" sin describir el destino real del enlace.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces (Nivel A)

**Código ANTES:**
```html
<a href="https://wa.me/+34" class="app-footer__social-link" aria-label="WhatsApp">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472..."/>
  </svg>
</a>
```

**Código DESPUÉS:**
```html
<a href="https://wa.me/+34" class="app-footer__social-link" aria-label="Contactar por WhatsApp">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" 
       aria-hidden="true" focusable="false">
    <path d="M17.472..."/>
  </svg>
</a>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

Además de la corrección principal, añadí `aria-hidden="true"` en todos los SVG decorativos para que los lectores de pantalla los ignoren y `focusable="false"` para evitar que el SVG reciba foco en navegadores antiguos. También mejoré el texto del `aria-label` de "WhatsApp" a "Contactar por WhatsApp" y de "Email" a "Enviar correo electrónico".

---

#### Error #5: Bajo contraste en botones del footer

**Problema:** Los botones de "Accesibilidad" e "Idioma" usaban colores con contraste insuficiente: naranja (`--color-tertiary`) y amarillo (`--color-primary`) respectivamente.

**Impacto:** Usuarios con baja visión, presbicia o daltonismo no pueden leer estos enlaces correctamente.

**Criterio WCAG:** 1.4.3 - Contraste mínimo (Nivel AA)

**Código ANTES (SCSS):**
```scss
.app-footer__accessibility-btn {
  color: var(--color-tertiary);  // Naranja - bajo contraste
  
  &:hover {
    opacity: 0.8;
  }
}

.app-footer__language-btn {
  color: var(--color-primary);  // Amarillo - bajo contraste
  
  &:hover {
    opacity: 0.8;
  }
}
```

**Código DESPUÉS (SCSS):**
```scss
.app-footer__accessibility-btn {
  color: var(--text-primary);  // Negro - alto contraste
  
  &:hover {
    color: var(--color-tertiary);  // Naranja solo en hover
  }
}

.app-footer__language-btn {
  color: var(--text-primary);  // Negro - alto contraste
  
  &:hover {
    color: var(--color-accent);  // Azul solo en hover
  }
}
```

**Archivo modificado:** `src/app/components/layout/footer/footer.scss`

Además de los cambios de color, también modifiqué el HTML: cambié el texto "AAA" por "Accesibilidad" para mayor claridad, envolví el texto en `<span>` para mejor control de estilos y añadí `aria-hidden="true"` a los iconos SVG.

---

#### Error #6: Bajo contraste en botones secundarios

**Problema:** Los botones con clase `.button--secondary` usaban texto blanco sobre fondo amarillo-naranja, con un ratio de contraste de aproximadamente 1.5:1, muy por debajo del mínimo requerido.

**Impacto:** Los botones de navegación principales resultan ilegibles para personas con problemas visuales o en entornos con mucha luz.

**Criterio WCAG:** 1.4.3 - Contraste mínimo (Nivel AA) - Requiere ratio 4.5:1 para texto normal

**Código ANTES (SCSS):**
```scss
.button--secondary {
  background-color: var(--color-secondary);
  color: var(--text-on-dark);  // Blanco #fdfdfd - bajo contraste
  border-color: var(--color-secondary);
}
```

**Código DESPUÉS (SCSS):**
```scss
.button--secondary {
  background-color: var(--color-secondary);
  color: var(--text-primary);  // Negro #030303 - alto contraste
  border-color: var(--color-secondary);
}
```

**Archivo modificado:** `src/app/components/shared/button/button.scss`

**Ratio de contraste conseguido:** Aproximadamente 9.5:1 (supera WCAG AAA)

---

#### Error #7: Bajo contraste en badge de categoría naranja

**Problema:** Las insignias de categoría `.badge-orange` usaban texto blanco sobre fondo naranja, sin cumplir el contraste mínimo.

**Impacto:** Los usuarios no pueden identificar rápidamente la categoría de las lecciones, dificultando la navegación.

**Criterio WCAG:** 1.4.3 - Contraste mínimo (Nivel AA)

**Código ANTES (SCSS):**
```scss
&.badge-orange {
  background: var(--color-tertiary);
  color: var(--text-on-dark);  // Blanco - bajo contraste
}
```

**Código DESPUÉS (SCSS):**
```scss
&.badge-orange {
  background: var(--color-tertiary);
  color: var(--text-primary);  // Negro - alto contraste
}
```

**Archivo modificado:** `src/app/components/home/lecciones-recomendadas/lecciones-recomendadas.scss`

---

#### Error #8: Link redundante en botón de accesibilidad del footer

**Problema:** WAVE detectó un enlace redundante a `/accesibilidad`. El footer contenía dos enlaces al mismo destino: uno en la lista de navegación "Nosotros" y otro como botón decorativo en la parte inferior.

**Impacto:** Los usuarios de tecnologías asistivas navegan por enlaces duplicados innecesariamente, generando confusión.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces (Nivel A)

**Código ANTES (HTML):**
```html
<!-- Columna 3: Nosotros -->
<section class="app-footer__section app-footer__section--lower">
  <h3 class="app-footer__section-title">Nosotros</h3>
  <nav class="app-footer__nav">
    <ul class="app-footer__nav-list">
      <li><a href="/quienes-somos" class="app-footer__link">¿Quiénes somos?</a></li>
      <li><a href="/privacidad" class="app-footer__link">Privacidad</a></li>
      <li><a href="/accesibilidad" class="app-footer__link">Accesibilidad</a></li>
    </ul>
  </nav>
</section>

<!-- Más abajo en el footer... -->
<div class="app-footer__actions">
  <a href="/accesibilidad" class="app-footer__action-link app-footer__accessibility-btn">
    <svg aria-hidden="true" focusable="false">...</svg>
    <span>Accesibilidad</span>
  </a>
</div>
```

**Código DESPUÉS (HTML):**
```html
<!-- Columna 3: Nosotros -->
<section class="app-footer__section app-footer__section--lower">
  <h3 class="app-footer__section-title">Nosotros</h3>
  <nav class="app-footer__nav">
    <ul class="app-footer__nav-list">
      <li><a href="/quienes-somos" class="app-footer__link">¿Quiénes somos?</a></li>
      <li><a href="/privacidad" class="app-footer__link">Privacidad</a></li>
      <!-- Enlace a Accesibilidad eliminado - ya existe en el footer decorativo -->
    </ul>
  </nav>
</section>

<!-- El botón decorativo del footer se mantiene -->
<div class="app-footer__actions">
  <a href="/accesibilidad" class="app-footer__action-link app-footer__accessibility-btn">
    <svg aria-hidden="true" focusable="false">...</svg>
    <span>Accesibilidad</span>
  </a>
</div>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

Eliminé el enlace duplicado de la lista de navegación "Nosotros" y mantuve el botón decorativo del footer que es más visible. Ahora solo existe un único enlace a `/accesibilidad` en todo el footer. También cambié el texto "AAA" por "Accesibilidad" para mayor claridad y añadí `aria-hidden="true"` y `focusable="false"` al SVG decorativo.

---

#### Error #9: Título de página genérico

**Problema:** El elemento `<title>` contenía el texto genérico "Frontend", que no describe el contenido ni propósito del sitio.

**Impacto:** Los usuarios ciegos con múltiples pestañas no pueden distinguir esta página de otras. El título también aparece en marcadores, historial y resultados de búsqueda.

**Criterio WCAG:** 2.4.2 - Páginas tituladas (Nivel A)

**Código ANTES (HTML):**
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Frontend</title>
  ...
</head>
```

**Código DESPUÉS (HTML):**
```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>TecnoMayores - Aprende tecnología paso a paso</title>
  ...
</head>
```

**Archivo modificado:** `src/index.html`

**Solución aplicada:**
- Cambiado el título de "Frontend" a "TecnoMayores - Aprende tecnología paso a paso"
- El nuevo título incluye el nombre del sitio y su propósito principal
- Sigue el patrón recomendado: "Nombre del sitio - Descripción breve"

---

#### Error #10: Enlaces sociales sin contenido textual (segunda corrección)

**Problema:** Aunque los enlaces sociales tenían `aria-label`, TAW seguía reportándolos como "enlaces sin contenido" porque esta técnica no siempre es reconocida por todas las herramientas de validación.

**Impacto:** Algunas tecnologías asistivas antiguas pueden no interpretar correctamente `aria-label`, dejando el enlace sin nombre accesible.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces (Nivel A)

**Código ANTES (HTML):**
```html
<a href="https://wa.me/+34" class="app-footer__social-link"
   aria-label="Contactar por WhatsApp" target="_blank" rel="noopener noreferrer">
  <svg aria-hidden="true" focusable="false">...</svg>
</a>
```

**Código DESPUÉS (HTML):**
```html
<a href="https://wa.me/+34" class="app-footer__social-link"
   target="_blank" rel="noopener noreferrer">
  <svg aria-hidden="true" focusable="false">...</svg>
  <span class="visually-hidden">Contactar por WhatsApp</span>
</a>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

**Solución aplicada:**
- Eliminado `aria-label` del enlace (redundante con el texto oculto)
- Añadido `<span class="visually-hidden">` con texto descriptivo dentro del enlace
- Esta técnica es más robusta que `aria-label` y funciona en todas las tecnologías asistivas
- Aplicado a ambos enlaces sociales (WhatsApp y Email)

---

#### Error #11: Encabezados consecutivos sin contenido (H42)

**Problema:** El componente `simulator-card` utilizaba elementos `<h3>` para los títulos de las tarjetas ("Seguro" e "Infinito"), lo cual creaba encabezados consecutivos del mismo nivel sin contenido textual entre ellos, violando la técnica H42 de WCAG.

**Impacto:** Los usuarios de lectores de pantalla que navegan por encabezados escuchan varios encabezados seguidos sin contexto claro, lo cual resulta confuso.

**Criterio WCAG:** 1.3.1 - Información y relaciones (Nivel A)

**Código ANTES:**
```html
<div class="card-content">
  <div class="icon-container">
    <svg><!-- icono --></svg>
  </div>
  <h3 class="card-title">{{ title }}</h3>
</div>
```

**Código DESPUÉS:**
```html
<div class="card-content">
  <div class="icon-container">
    <svg><!-- icono --></svg>
  </div>
  <p class="card-title">{{ title }}</p>
</div>
```

**Archivo modificado:** `src/app/components/shared/simulator-card/simulator-card.component.html`

**Justificación:** Los títulos de las tarjetas de simulador son etiquetas descriptivas, no encabezados de sección. Usar `<p>` es semánticamente correcto porque estas tarjetas no representan secciones independientes que deban ser navegadas por encabezados. Ya existe un `<h2>` superior ("Practica sin miedo") que estructura correctamente esta sección.

---

#### Error #12: Falta enlace "Saltar al contenido principal"

**Problema:** La página no disponía de un mecanismo para saltar directamente al contenido principal, obligando a los usuarios de teclado a navegar por todos los elementos del header antes de llegar al contenido.

**Impacto:** Los usuarios que navegan solo con teclado o lectores de pantalla deben recorrer todos los enlaces de navegación en cada página, lo cual resulta tedioso.

**Criterio WCAG:** 2.4.1 - Evitar bloques (Nivel A)

**Código ANTES (HTML):**
```html
<!-- No existía enlace de salto -->
<app-header></app-header>
<main>
  <app-breadcrumb-nav></app-breadcrumb-nav>
  <router-outlet></router-outlet>
</main>
```

**Código DESPUÉS (HTML):**
```html
<!-- Enlace de salto para accesibilidad (WCAG 2.4.1) -->
<a href="#main-content" class="skip-to-main">Saltar al contenido principal</a>

<app-header></app-header>
<main id="main-content">
  <app-breadcrumb-nav></app-breadcrumb-nav>
  <router-outlet></router-outlet>
</main>
```

**Estilos añadidos (SCSS):**
```scss
// Enlace "Saltar al contenido principal" (WCAG 2.4.1)
.skip-to-main {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-accent);
  color: var(--text-on-dark);
  padding: 1rem 1.5rem;
  font-weight: 700;
  z-index: 9999;
  transition: top 0.2s ease;

  &:focus {
    top: 1rem;
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }
}
```

**Archivos modificados:** `src/app/app.html`, `src/styles/02-generic/_reset.scss`

Añadí el enlace de salto como primer elemento del DOM. Este enlace permanece oculto fuera de la pantalla hasta recibir foco; al presionar Tab, aparece visualmente y permite saltar al contenido principal. El elemento `main` tiene `id="main-content"` como destino del enlace.

---

#### Error #13: Enlaces con mismo texto y destinos diferentes

**Problema:** Los botones "Ver lección" de las tarjetas tenían el mismo texto visible pero enlazaban a diferentes URLs.

**Impacto:** Un usuario de lector de pantalla que lista todos los enlaces escucha "Ver lección" repetido sin poder distinguir a qué lección corresponde cada uno.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código ANTES (HTML):**
```html
<app-button
  [text]="leccion.ctaText || 'Ver lección'"
  [link]="['/lecciones', leccion.id]"
  color="accent"
  variant="brutal"
  size="md"
></app-button>
```

**Código DESPUÉS (HTML):**
```html
<app-button
  [text]="leccion.ctaText || 'Ver lección'"
  [link]="['/lecciones', leccion.id]"
  color="accent"
  variant="brutal"
  size="md"
  [ariaLabel]="'Ver lección: ' + leccion.titulo"
></app-button>
```

**Archivo modificado:** `src/app/components/home/lecciones-recomendadas/lecciones-recomendadas.html`

Añadí un `aria-label` dinámico que incluye el título de la lección, de modo que los lectores de pantalla anuncian "Ver lección: Mi primer móvil", "Ver lección: WhatsApp y fotos", etc. El texto visible sigue siendo "Ver lección" para mantener el diseño.

---

#### Error #14: Botones "Guardar" sin contexto

**Problema:** Similar al error anterior, los botones "Guardar" de cada tarjeta de lección no indicaban qué lección se iba a guardar.

**Impacto:** Un usuario ciego escucharía "Guardar" repetido sin saber a qué elemento se refiere cada botón.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código ANTES (HTML):**
```html
<app-button
  text="Guardar"
  color="primary"
  variant="brutal"
  size="md"
  icon="bookmark"
  (btnClick)="saveLesson()"
></app-button>
```

**Código DESPUÉS (HTML):**
```html
<app-button
  text="Guardar"
  color="primary"
  variant="brutal"
  size="md"
  icon="bookmark"
  (btnClick)="saveLesson()"
  [ariaLabel]="'Guardar lección: ' + leccion.titulo"
></app-button>
```

**Archivo modificado:** `src/app/components/home/lecciones-recomendadas/lecciones-recomendadas.html`

Añadí un `aria-label` dinámico con el título de la lección, de modo que los lectores de pantalla anuncian "Guardar lección: Mi primer móvil", etc.

---

#### Error #15: Botones de reproducción sin contexto

**Problema:** Los botones de "play" para escuchar las lecciones solo tenían el icono visible, sin indicar qué lección se iba a reproducir.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<app-button
  [ariaLabel]="speakingId === leccion.id ? 'Detener lectura de ' + leccion.titulo : 'Escuchar lección ' + leccion.titulo">
</app-button>
```

**Archivo modificado:** `src/app/components/home/lecciones-recomendadas/lecciones-recomendadas.html`

---

#### Error #16: Enlace "Ver todo catálogo" sin contexto

**Problema:** El enlace "Ver todo el catálogo" no especificaba que se refería al catálogo de lecciones.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<a routerLink="/lecciones" class="lecciones-link" aria-label="Ver todo el catálogo de lecciones">
  Ver todo el catálogo
  <svg aria-hidden="true">...</svg>
</a>
```

**Archivo modificado:** `src/app/components/home/lecciones-recomendadas/lecciones-recomendadas.html`

---

#### Error #17: Botones del hero sin aria-label

**Problema:** Los botones de acción del hero no tenían aria-labels descriptivos.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<app-button
  [ariaLabel]="isSpeaking ? 'Detener lectura del texto' : 'Escuchar texto de la página'">
</app-button>
```

**Archivo modificado:** `src/app/components/home/hero/hero.html`

---

#### Error #18: Botones de guía sin contexto

**Problema:** Los botones "Saber más" y "Modo guía" no indicaban su propósito específico.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<app-button
  text="Saber más"
  ariaLabel="Saber más sobre el modo guía">
</app-button>
<app-button
  text="Modo guía"
  ariaLabel="Activar el modo guía de navegación">
</app-button>
```

**Archivo modificado:** `src/app/components/home/guia-mode/guia-mode.html`

---

#### Error #19: Botón suscribir sin aria-label

**Problema:** El botón "Suscribir" del formulario de newsletter no indicaba su función completa.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<button type="submit" class="app-footer__newsletter-btn" aria-label="Suscribirse al boletín semanal">
  Suscribir
</button>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

---

#### Error #20: Enlaces footer sin contexto

**Problema:** Los enlaces de "Accesibilidad" e "Idioma" en el footer no indicaban su propósito completo.

**Criterio WCAG:** 2.4.4 - Propósito de los enlaces en contexto (Nivel A)

**Código DESPUÉS (HTML):**
```html
<a href="/accesibilidad" aria-label="Ver declaración de accesibilidad">
  Accesibilidad
</a>
<a href="#" aria-label="Cambiar idioma a Español (idioma actual)">
  Español
</a>
```

**Archivo modificado:** `src/app/components/layout/footer/footer.html`

---

### 4.3 Clase de Utilidad Añadida

Para implementar las correcciones de etiquetado, añadí la clase `.visually-hidden` al archivo de estilos globales. Esta técnica es la recomendada por WCAG para ocultar contenido visualmente mientras se mantiene accesible para lectores de pantalla:

```scss
// Archivo: src/styles/02-generic/_reset.scss

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Esta clase reduce el elemento a 1x1 píxel (invisible pero presente en el DOM), usa `clip` para ocultar cualquier overflow y mantiene el elemento en el árbol de accesibilidad. Es preferible a `display: none` o `visibility: hidden` que ocultan el contenido también para lectores de pantalla.

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

