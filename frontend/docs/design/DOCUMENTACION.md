# Documentación del Sistema de Estilos - TecnoMayores

## Índice de Contenidos

1. [Sección 1: Arquitectura CSS y Comunicación Visual](#sección-1-arquitectura-css-y-comunicación-visual)
   - [1.1 Principios de Comunicación Visual](#11-principios-de-comunicación-visual)
   - [1.2 Metodología CSS: BEM (Block Element Modifier)](#12-metodología-css-bem-block-element-modifier)
   - [1.3 Organización de Archivos: Arquitectura ITCSS](#13-organización-de-archivos-arquitectura-itcss)
   - [1.4 Sistema de Design Tokens](#14-sistema-de-design-tokens)
   - [1.5 Mixins y Funciones Reutilizables](#15-mixins-y-funciones-reutilizables)
   - [1.6 ViewEncapsulation en Angular](#16-viewencapsulation-en-angular)
   - [Resumen de Decisiones Arquitectónicas](#resumen-de-decisiones-arquitectónicas)

2. [Sección 2: HTML Semántico y Estructura](#sección-2-html-semántico-y-estructura)
   - [2.1 Elementos Semánticos Utilizados](#21-elementos-semánticos-utilizados)
   - [2.2 Jerarquía de Headings (Encabezados)](#22-jerarquía-de-headings-encabezados)
   - [2.3 Estructura de Formularios](#23-estructura-de-formularios)

3. [Sección 3: Sistema de Componentes UI](#sección-3-sistema-de-componentes-ui)
   - [3.1 Componentes Implementados](#31-componentes-implementados)
   - [3.2 Nomenclatura y Metodología BEM](#32-nomenclatura-y-metodología-bem)
   - [3.3 Style Guide](#33-style-guide)
   - [Resumen de la Sección 3](#resumen-de-la-sección-3)

---

## Sección 1: Arquitectura CSS y Comunicación Visual

---

### 1.1 Principios de Comunicación Visual

La comunicación visual de esta aplicación se fundamenta en cinco principios de diseño adaptados específicamente para usuarios mayores con poca experiencia tecnológica. A continuación se describe cada uno y cómo se aplica en el proyecto.

#### Jerarquía Visual

La jerarquía visual guía al usuario a través de la interfaz, indicando qué elementos son más importantes mediante el uso de tamaño, peso y espaciado.

Aplicación en el proyecto:

- Los títulos principales (h1) utilizan `$font-size-5xl` (61px) para garantizar máxima visibilidad
- Los títulos emplean `$font-weight-semibold` (600) mientras que el texto base usa `$font-weight-regular` (400)
- Los títulos tienen `margin-top: $spacing-8` para separarlos visualmente del contenido anterior
- El texto principal emplea un color muy oscuro (`$color-text-dark: #030303`) para máximo contraste

Ejemplo de implementación:

```scss
h1 {
  font-size: $font-size-5xl;
  font-weight: $font-weight-semibold;
  margin-top: $spacing-8;
  color: $color-text-dark;
}

p {
  font-size: $font-size-base;
  font-weight: $font-weight-regular;
  margin-bottom: $spacing-4;
}
```

<img width="939" height="343" alt="Captura de pantalla 2025-12-18 205343" src="https://github.com/user-attachments/assets/1da45e72-3c55-40ac-92b7-7049a1fd4778" />


#### Contraste

El contraste es crítico para usuarios con visión reducida, una condición muy común en mayores de 65 años.

Aplicación en el proyecto:

- Contraste de color: El fondo principal `$color-bg-light: #fff6df` (amarillo muy claro) combinado con texto oscuro `$color-text-dark: #030303` (casi negro) proporciona un ratio WCAG AA de 13.5:1, considerado excelente
- Contraste de tamaño: Los botones principales tienen `height: $button-height-lg` (48px) frente a los botones pequeños (32px)
- Contraste de peso: Los títulos usan pesos de 600-700 mientras que los párrafos emplean 400

Colores semánticos con alto contraste:

- Error: `$color-error: #ff0000` (rojo puro)
- Exito: `$color-success: #74eb05` (verde brillante)
- Advertencia: `$color-warning: #fde800` (amarillo brillante)
- Informacion: `$color-info: #00cffd` (azul claro brillante)

<img width="926" height="570" alt="Captura de pantalla 2025-12-18 205556" src="https://github.com/user-attachments/assets/fee44471-72c9-40e5-9461-384fadc9f98e" />


#### Alineación

La alineación crea orden visual y facilita el escaneo del contenido por parte del usuario.

Estrategia de alineación implementada:

- Eje vertical: Contenido alineado al inicio (top), utilizando flexbox con `align-items: flex-start`
- Eje horizontal: Contenido centrado o alineado a la izquierda según el contexto
- Contenedores: Todos utilizan la clase `.container` que aplica el mixin `@include container` para centrado

Ejemplo de implementación:

```scss
.flex {
  @include flex;
}

.container {
  @include container;
  margin-left: auto;
  margin-right: auto;
}
```

<img width="1153" height="764" alt="Captura de pantalla 2025-12-18 205738" src="https://github.com/user-attachments/assets/479ca715-4336-40d5-a272-62ee4ef298ec" />


#### Proximidad

Los elementos relacionados se agrupan cerca, creando "unidades visuales" que el ojo percibe como una sola entidad.

Aplicación en el proyecto:

- Espaciado interno (padding): `$spacing-4` (16px) para contenido relacionado dentro de un componente
- Espaciado externo (margin): `$spacing-6` (24px) entre secciones diferentes
- Gap entre elementos: `$gap-md` (16px) para espaciado consistente en layouts grid y flex

Ejemplo de implementación:

```scss
.card {
  padding: $spacing-4;
}

section + section {
  margin-top: $spacing-6;
}

.grid {
  gap: $gap-md;
}
```

<img width="978" height="707" alt="Captura de pantalla 2025-12-18 205836" src="https://github.com/user-attachments/assets/db249a66-fd4f-4358-86a2-84d78975b4b4" />


#### Repetición

La repetición crea cohesión visual y comunica que los elementos están relacionados entre si.

Patrones repetidos en el proyecto:

- Colores primarios: El amarillo (`$color-primary: #f8d770`) aparece de forma consistente en botones, acentos y fondos
- Radio de borde: Todos los botones y tarjetas utilizan `$radius-md: 0.5rem` (8px)
- Sombra: Todas las elevaciones emplean `@include elevation` con sombras predefinidas
- Tipografia: Todo el texto utiliza las fuentes definidas (`$font-primary`, `$font-secondary`, `$font-body`) de forma consistente
- Transiciones: Toda interacción utiliza `@include transition` con la misma duracion y easing

Ejemplo de implementación:

```scss
.button--primary { background-color: $color-primary; }
.accent { color: $color-primary; }
.highlight { background-color: rgba($color-primary, 0.1); }

button, .card, input { border-radius: $radius-md; }

button, a, input { @include transition; }
```

<img width="946" height="724" alt="Captura de pantalla 2025-12-18 205957" src="https://github.com/user-attachments/assets/3ab9f340-628b-4222-a2a7-0c32c824b89f" />


---

### 1.2 Metodología CSS: BEM (Block Element Modifier)

Se utiliza BEM (Block Element Modifier) como metodología de nomenclatura CSS. BEM proporciona un sistema escalable y mantenible para nombres de clases.

#### Definición de BEM

- **Block (Bloque)**: Componente independiente y reutilizable. Ejemplo: `.card`, `.button`, `.form`. Debe ser autodescriptivo.
  
- **Element (Elemento)**: Parte del bloque que depende del mismo. Sintaxis: `.block__element`. Ejemplo: `.card__title`, `.card__description`, `.button__icon`.
  
- **Modifier (Modificador)**: Variante o estado del bloque o elemento. Sintaxis: `.block--modifier` o `.block__element--modifier`. Ejemplo: `.button--primary`, `.button--disabled`, `.card--featured`.

#### Ejemplos de nomenclatura en el proyecto

```scss
// BLOCK: componente independiente
.button {
  // Estilos base del boton
}

// ELEMENTS: partes del boton
.button__text {
  // Texto dentro del boton
}

.button__icon {
  // Icono dentro del boton
}

// MODIFIERS: variantes del boton
.button--primary {
  background-color: $color-primary;
}

.button--secondary {
  background-color: $color-secondary;
}

.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--large {
  height: $button-height-lg;
}

// COMBINACIONES
.button--primary:hover {
  // Interaccion hover
}

.button__icon--right {
  margin-left: $spacing-2;
}
```

#### Ventajas de BEM en este proyecto

1. Claridad: Cualquier desarrollador entiende la estructura leyendo los nombres de las clases
2. Escalabilidad: Resulta sencillo agregar nuevos componentes sin generar conflictos
3. Mantenibilidad: Los cambios locales no afectan el resto del CSS
4. Reutilización: Los componentes se pueden mover entre proyectos facilmente
5. Comunicacion: Los nombres comunican la intencion del estilo

#### Reglas de nomenclatura

- Correcto: `.card` (bloque unico, sin guiones)
- Correcto: `.card__title` (elemento con doble guion bajo)
- Correcto: `.card--featured` (modificador con doble guion)
- Incorrecto: `.card-title` (guion simple puede confundirse)
- Incorrecto: `.cardTitle` (camelCase no se usa en CSS)
- Incorrecto: `.card_title` (guion bajo simple no es BEM)

---

### 1.3 Organización de Archivos: Arquitectura ITCSS

Se utiliza ITCSS (Inverted Triangle CSS), una arquitectura que organiza CSS de menor a mayor especificidad.

#### Beneficios de ITCSS

- Evita conflictos de especificidad
- Facilita la reutilizacion de codigo
- Mantiene estilos escalables
- Simplifica el debugging

#### Estructura de carpetas

```
src/styles/
├── 00-settings/
│   ├── _variables.scss          // Design tokens: colores, tipografia, espaciado
│   └── _css-variables.scss      // Variables CSS para temas dinamicos
├── 01-tools/
│   └── _mixins.scss             // Mixins y funciones reutilizables
├── 02-generic/
│   └── _reset.scss              // Reset CSS global y normalizacion
├── 03-elements/
│   └── _elements.scss           // Estilos base de elementos HTML
├── 04-layout/
│   └── _layout.scss             // Sistemas de grid, flexbox, containers
└── styles.scss                  // Archivo principal que importa todo
```

#### Explicación de cada nivel (de menor a mayor especificidad)

**Nivel 1: Settings (Variables)**

Contiene variables SCSS y design tokens. No genera CSS de salida.

```scss
$color-primary: #f8d770;
$spacing-4: 1rem;
$font-size-base: 1rem;
```

**Nivel 2: Tools (Mixins)**

Contiene funciones y mixins reutilizables. No genera CSS de salida.

```scss
@mixin flex($justify, $align, $direction) { ... }
@mixin respond-to($breakpoint) { ... }
```

**Nivel 3: Generic (Reset)**

Contiene el reset CSS y normalizacion global. Especificidad muy baja con selectores universales.

```scss
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: $font-body; }
```

**Nivel 4: Elements (Base)**

Contiene estilos de elementos HTML sin clases. Especificidad baja con selectores de elemento.

```scss
h1 { font-size: $font-size-5xl; }
a { color: $color-accent; @include transition(color); }
button { @include button-accessible(lg); }
```

**Nivel 5: Layout**

Contiene sistemas de layout, grid y flexbox. Especificidad media con clases simples.

```scss
.container { @include container; }
.grid { @include grid(3, $gap-md); }
.flex { @include flex; }
```

#### Orden de importación en styles.scss

```scss
// El orden es critico y no debe cambiarse
@import '00-settings/variables';      // 1. Variables primero
@import '00-settings/css-variables';  // 2. Variables CSS para temas
@import '01-tools/mixins';            // 3. Mixins segundo
@import '02-generic/reset';           // 4. Reset tercero
@import '03-elements/elements';       // 5. Elementos base
@import '04-layout/layout';           // 6. Layouts
```

#### Ventajas de esta arquitectura

1. Escalabilidad: Se puede agregar codigo nuevo sin romper lo existente
2. Mantenibilidad: Cualquier desarrollador entiende donde colocar estilos nuevos
3. Performance: La especificidad baja reduce los conflictos CSS
4. Debugging: Resulta facil rastrear problemas
5. Reutilizacion: Los mixins y variables evitan duplicacion

---

### 1.4 Sistema de Design Tokens

Los design tokens son variables SCSS que definen todos los valores visuales del proyecto. Representan la unica fuente de verdad para colores, tipografia, espaciado y demas propiedades visuales.

#### Filosofia

En lugar de escribir valores directamente en CSS:

```scss
// MAL - Valores hardcoded
.button { background-color: #f8d770; padding: 16px; }
```

Se utilizan variables reutilizables:

```scss
// BIEN - Usa tokens
.button { background-color: $color-primary; padding: $spacing-4; }
```

#### Grupos de Design Tokens

**1. Colores**

Colores de marca:

```scss
$color-primary: #f8d770;      // Amarillo - color principal
$color-secondary: #ffb842;    // Naranja - apoyo
$color-tertiary: #f3742b;     // Naranja oscuro - acentos adicionales
$color-accent: #0454b1;       // Azul - interaccion, enlaces
```

Justificacion: Se eligieron colores calidos (amarillo, naranja) como primarios porque transmiten energia y positividad (importante para usuarios mayores que pueden sentirse inseguros), tienen excelente contraste con fondo claro, y son colores amigables y no amenazantes.

Colores semanticos:

```scss
$color-success: #74eb05;      // Verde - operaciones exitosas
$color-error: #ff0000;        // Rojo - errores, advertencias serias
$color-warning: #fde800;      // Amarillo - advertencias moderadas
$color-info: #00cffd;         // Azul - informacion, sugerencias
```

Colores de fondo y texto:

```scss
$color-bg-light: #fff6df;     // Fondo principal (amarillo muy claro)
$color-text-dark: #030303;    // Texto oscuro (casi negro)
$color-text-light: #fdfdfd;   // Texto claro (casi blanco)
```

Escala de grises neutrales:

```scss
$color-gray-50:  #fafafa;     // Practicamente blanco
$color-gray-100: #f5f5f5;
$color-gray-200: #e5e5e5;
$color-gray-300: #d4d4d4;
$color-gray-400: #a3a3a3;
$color-gray-500: #737373;     // Gris medio
$color-gray-600: #525252;
$color-gray-700: #404040;
$color-gray-800: #262626;
$color-gray-900: #171717;     // Casi negro
```

**2. Tipografia**

Familias de fuentes:

```scss
$font-primary: 'Arima Madurai', cursive;    // Titulos principales (h1, h2)
$font-secondary: 'Glory', sans-serif;        // Subtitulos (h3, h4, h5, h6)
$font-body: 'Montserrat', sans-serif;        // Texto normal del cuerpo
$font-mono: 'Fira Code', 'Courier New', monospace;  // Codigo
```

Justificacion: Se utilizan fuentes Google Fonts que combinan legibilidad con personalidad. Arima Madurai aporta caracter a los titulos, Glory proporciona claridad en subtitulos, y Montserrat es una fuente muy legible para el cuerpo del texto.

Tamanos (escala modular con ratio 1.25):

```scss
$font-size-xs:    0.75rem;        // 12px - etiquetas pequeñas
$font-size-sm:    0.875rem;       // 14px - texto pequeño
$font-size-base:  1rem;           // 16px - tamaño base (recomendado WCAG)
$font-size-lg:    1.25rem;        // 20px - parrafos principales
$font-size-xl:    1.5625rem;      // 25px - subtitulos
$font-size-2xl:   1.95313rem;     // 31px - titulos
$font-size-3xl:   2.44141rem;     // 39px - titulos grandes
$font-size-4xl:   3.05176rem;     // 49px - titulos muy grandes
$font-size-5xl:   3.81470rem;     // 61px - titulos gigantes
```

Justificacion: La base en 16px cumple con las recomendaciones WCAG AA (minimo 12px, 16px es optimo para legibilidad). La escala 1.25 proporciona una progresion clara pero no extrema. Los tamanos maximos (4xl, 5xl) garantizan titulos principales accesibles.

Pesos:

```scss
$font-weight-light:     300;  // Raramente usado
$font-weight-regular:   400;  // Texto normal
$font-weight-medium:    500;  // Sutilmente enfatizado
$font-weight-semibold:  600;  // Titulos, enfasis fuerte
$font-weight-bold:      700;  // Enfasis maximo
```

Alturas de linea:

```scss
$line-height-tight:    1.2;      // Titulos - compacto
$line-height-normal:   1.5;      // Parrafos - estandar WCAG
$line-height-relaxed:  1.75;     // Textos largos - mas espaciado
$line-height-loose:    2;        // Muy espaciado (para accesibilidad)
```

Justificacion: 1.5 es el estandar WCAG para legibilidad. Los titulos usan 1.2 para compactacion visual. Los textos largos usan 1.75+ para reducir fatiga visual, especialmente importante para usuarios mayores.

**3. Sistema de Espaciado**

```scss
$spacing-1:  0.25rem;     // 4px
$spacing-2:  0.5rem;      // 8px
$spacing-3:  0.75rem;     // 12px
$spacing-4:  1rem;        // 16px - espaciado estandar
$spacing-5:  1.25rem;     // 20px
$spacing-6:  1.5rem;      // 24px
$spacing-8:  2rem;        // 32px - separaciones grandes
$spacing-10: 2.5rem;      // 40px
$spacing-12: 3rem;        // 48px
$spacing-16: 4rem;        // 64px - secciones
$spacing-20: 5rem;        // 80px
$spacing-24: 6rem;        // 96px
$spacing-32: 8rem;        // 128px
$spacing-40: 10rem;       // 160px
```

Justificacion: La base en 4px mantiene alineacion de pixel perfecto. Los numeros pares (1,2,3,4,6,8...) resultan predictibles y faciles de recordar. Los valores grandes ($spacing-16+) se reservan para separaciones de secciones. Los multiplos de 4 facilitan calculos mentales.

**4. Breakpoints**

```scss
$breakpoint-sm:   640px;    // Movil grande
$breakpoint-md:   768px;    // Tablet
$breakpoint-lg:   1024px;   // Desktop
$breakpoint-xl:   1280px;   // Desktop grande
$breakpoint-2xl:  1536px;   // Desktop muy grande
```

Uso con mixin:

```scss
@include respond-to(lg) {
  // Estilos solo para desktop
}
```

Justificacion: Se sigue un enfoque mobile-first donde los estilos para movil se escriben primero y luego se agregan para pantallas grandes. 768px es el ancho tablet comun (iPad). 1024px es el ancho desktop minimo. Los espacios de 256px proporcionan margen suficiente para cambios significativos.

**5. Sombras**

```scss
$shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

Uso:

```scss
.card { @include elevation(md); }
```

Justificacion: Se utiliza rgba para opacidad, lo que permite que las sombras funcionen en cualquier fondo. La intensidad progresiva crea profundidad visual, importante para destacar elementos interactivos segun la Ley de Jakob.

**6. Bordes y Radios**

```scss
// Grosores
$border-thin:   1px;
$border-medium: 2px;
$border-thick:  4px;

// Radios de borde
$radius-sm:    0.125rem;    // 2px - sutil
$radius-base:  0.375rem;    // 6px
$radius-md:    0.5rem;      // 8px - recomendado
$radius-lg:    0.75rem;     // 12px
$radius-xl:    1rem;        // 16px
$radius-2xl:   1.5rem;      // 24px - muy redondeado
$radius-full:  9999px;      // Circulo perfecto
```

Justificacion: `$radius-md` (8px) es el estandar para botones y tarjetas, ofreciendo suficiente redondeamiento sin ser extremo. `$radius-full` se reserva para avatares y elementos circulares.

**7. Transiciones**

```scss
$transition-fast:  150ms;    // Hover, pequeños cambios
$transition-base:  300ms;    // Defecto para la mayoria
$transition-slow:  500ms;    // Cambios complejos

// Funciones de easing
$easing-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
$easing-out:       cubic-bezier(0.0, 0, 0.2, 1);
$easing-in:        cubic-bezier(0.4, 0, 1, 1);
```

Justificacion: `$transition-base` (300ms) es optimo: perceptible pero no lento. La funcion in-out resulta mas natural que linear. Es importante incluir `@media (prefers-reduced-motion: reduce)` para usuarios sensibles al movimiento.

**8. Z-index**

```scss
$z-dropdown:        1000;
$z-sticky:          1100;
$z-fixed:           1200;
$z-modal-backdrop:  1300;
$z-modal:           1400;
$z-popover:         1500;
$z-tooltip:         1600;
$z-notification:    1700;
$z-toast:           1800;
```

Justificacion: El sistema con espacios de 100 proporciona flexibilidad para insertar nuevas capas sin reorganizar todo. Los valores estan ordenados de menor a mayor importancia visual.

**9. Tamanos de Botones**

```scss
$button-height-sm:   2rem;        // 32px
$button-height-md:   2.5rem;      // 40px
$button-height-lg:   3rem;        // 48px - RECOMENDADO
$button-height-xl:   3.5rem;      // 56px - maxima accesibilidad
```

Justificacion: 48px minimo cumple con la Ley de Fitts y reduce errores de toque en movil. Para usuarios mayores, los botones grandes reducen la frustracion.

#### Regla fundamental

Nunca hardcodear valores en CSS. Siempre utilizar los tokens definidos.

```scss
// MAL
.button { background-color: #f8d770; padding: 16px; margin: 20px; }

// BIEN
.button { 
  background-color: $color-primary; 
  padding: $spacing-4; 
  margin: $spacing-5; 
}
```

#### Ventajas de Design Tokens

1. Mantenibilidad: Cambiar un color en un lugar produce un cambio global
2. Consistencia: Todos los desarrolladores usan los mismos valores
3. Accesibilidad: Los tokens se crean pensando en WCAG
4. Escalabilidad: Resulta facil agregar nuevos tokens
5. Documentacion: El nombre del token comunica su intencion

---

### 1.5 Mixins y Funciones Reutilizables

Los mixins son fragmentos de codigo SCSS reutilizables que eliminan repeticion y mantienen consistencia en todo el proyecto.

#### Mixins Principales

**1. Responsive Media Queries**

```scss
@include respond-to(lg) {
  .container { width: 1000px; }
}

// Genera:
@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```

Ventaja: No hay que recordar los valores de breakpoint, la nomenclatura es consistente.

**2. Flexbox Simplificado**

```scss
.hero { @include flex(center, center, column); }

// Genera:
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
```

Parametros:
- `$justify`: flex-start, flex-end, center, space-between, space-around
- `$align`: flex-start, flex-end, center, baseline, stretch
- `$direction`: row, column, row-reverse, column-reverse

**3. Grid Simplificado**

```scss
.cards { @include grid(3, $spacing-4); }

// Genera:
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-4;
}
```

**4. Transiciones Estandar**

```scss
button { @include transition(color, $transition-fast); }

// Genera:
button { transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1); }
```

**5. Sombras (Elevacion)**

```scss
.card { @include elevation(lg); }

// Genera:
.card { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
```

**6. Focus Visible (Accesibilidad)**

```scss
a { @include focus-visible; }
```

Proporciona un borde visible cuando el elemento se enfoca mediante teclado, fundamental para navegacion accesible.

**7. Truncate de Texto**

```scss
// Una linea
.title { @include truncate(); }

// Multiples lineas
.description { @include truncate(3); }
```

**8. Botones Accesibles**

```scss
button { @include button-accessible(lg); }
```

Genera un boton con tamano minimo 48x48px, cumpliendo con las recomendaciones WCAG AAA.

**9. Screen Reader Only (sr-only)**

```scss
.skip-nav { @include sr-only; }
```

Oculta visualmente el elemento pero lo mantiene accesible para lectores de pantalla.

**10. Prefers Reduced Motion**

```scss
.animation {
  animation: slide 300ms;
  
  @include reduced-motion {
    animation: none;
  }
}
```

Respeta la preferencia de usuarios sensibles al movimiento.

**11. Container Centrado**

```scss
.wrapper { @include container; }
```

Genera un contenedor centrado con ancho maximo y padding responsivo.

**12. Hover State**

```scss
.card {
  @include hover {
    @include elevation(lg);
  }
}
```

Aplica estilos solo en dispositivos que soportan hover (excluye moviles).

#### Combinacion de Mixins

Los mixins se pueden combinar para crear componentes complejos rapidamente:

```scss
.card {
  @include elevation(md);
  @include transition;
  border-radius: $radius-md;
  padding: $spacing-4;
  
  @include hover {
    @include elevation(lg);
  }
  
  @include respond-to(lg) {
    @include flex(space-between, center);
  }
}
```

#### Reglas para usar Mixins

1. Usar mixins para DRY: Si se escribe el mismo CSS 2+ veces, crear un mixin
2. Nombrar claramente: El nombre debe indicar que hace el mixin
3. Documentar parametros: Especificar que parametros acepta
4. Evitar nesting profundo: Maximo 3 niveles de anidamiento
5. Reutilizar mixins existentes: Antes de crear uno nuevo, verificar si ya existe

---

### 1.6 ViewEncapsulation en Angular

Angular proporciona diferentes estrategias de encapsulacion de estilos para componentes.

#### Opciones de ViewEncapsulation

**1. Emulated (Por defecto)**

```typescript
@Component({
  selector: 'app-button',
  template: `<button>Click</button>`,
  styles: [`.button { color: blue; }`],
  encapsulation: ViewEncapsulation.Emulated
})
export class ButtonComponent {}
```

Angular agrega atributos unicos a cada elemento y los estilos solo afectan a ese componente. Simula shadow DOM sin usar Shadow DOM real.

HTML generado:
```html
<app-button _ngcontent-ng-c12345>
  <button _ngcontent-ng-c12345>Click</button>
</app-button>
```

Ventajas:
- Aislamiento: los estilos no se filtran entre componentes
- Compatible con todos los navegadores
- Rendimiento predecible

Desventajas:
- No se comparte CSS entre componentes facilmente
- Codigo CSS duplicado si muchos componentes usan estilos similares

**2. None (Estilos globales)**

```typescript
@Component({
  selector: 'app-button',
  template: `<button class="btn">Click</button>`,
  styles: [`.btn { color: blue; }`],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {}
```

Los estilos se aplican globalmente sin encapsulacion. Cualquier componente puede acceder al CSS.

Ventajas:
- Reutilizacion de CSS
- Menos duplicacion
- Mas control global

Desventajas:
- Conflictos entre componentes
- Los nombres de clase pueden sobreescribirse

**3. ShadowDom (Shadow DOM real)**

```typescript
@Component({
  selector: 'app-button',
  template: `<button>Click</button>`,
  styles: [`.button { color: blue; }`],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ButtonComponent {}
```

Utiliza Shadow DOM real (HTML5) con aislamiento completo.

Desventajas:
- No compatible con IE11
- Variables CSS no se heredan bien
- Mas complejo de debuggear

#### Estrategia Elegida: ViewEncapsulation.Emulated

Se recomienda usar ViewEncapsulation.Emulated (por defecto) por las siguientes razones:

1. Compatibilidad: Funciona en todos los navegadores
2. Mantenibilidad: Los estilos de cada componente estan claros
3. Globalidad: Los design tokens en `styles.scss` se heredan correctamente
4. Accesibilidad: Las variables CSS globales funcionan bien

#### Acceso a Variables desde Componentes

Las variables SCSS definidas en `styles.scss` estan disponibles en todos los componentes:

```scss
// styles.scss define
$color-primary: #f8d770;
$spacing-4: 1rem;

// component.scss puede usar
.button {
  background-color: $color-primary;
  padding: $spacing-4;
}
```

No es necesario importar las variables, estan disponibles automaticamente.

#### Variables CSS (CSS Custom Properties)

Se pueden usar variables CSS para temas dinamicos:

```scss
// styles.scss
:root {
  --color-primary: #f8d770;
  --spacing-4: 1rem;
}

// component.scss
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-4);
}
```

Ventaja: Se pueden cambiar en tiempo de ejecucion con JavaScript, permitiendo funcionalidades como el cambio de tema claro/oscuro.

---

### Resumen de Decisiones Arquitectonicas

| Aspecto | Decision | Justificacion |
|---------|----------|---------------|
| Arquitectura CSS | ITCSS | Escalabilidad, mantenibilidad |
| Metodologia de nombrado | BEM | Claridad, prevencion de conflictos |
| Organizacion | 5 niveles ITCSS | Especificidad creciente |
| Tipografia base | 16px | WCAG AA (legibilidad optima) |
| Tamano boton minimo | 48px | WCAG AAA (accesibilidad) |
| Breakpoints | 5 puntos | Cobertura movil a desktop grande |
| ViewEncapsulation | Emulated | Compatibilidad + aislamiento |
| Color primario | Amarillo #f8d770 | Calido, accesible, positivo |
| Linea altura base | 1.5 | WCAG recomendado |

---

## Seccion 2: HTML Semantico y Estructura

---

### 2.1 Elementos Semanticos Utilizados

El HTML semantico utiliza elementos que tienen significado inherente, no solo visual. Esto es especialmente importante para usuarios que utilizan lectores de pantalla, una tecnologia muy utilizada por usuarios mayores con problemas de vision.

#### Elementos Semanticos Principales

**header - Encabezado de la aplicacion**

Contiene el logo, navegacion principal y elementos de utilidad (busqueda, usuario, accesibilidad). Debe aparecer al inicio de cada pagina.

```html
<header class="app-header">
  <div class="app-header__container">
    <a href="/" class="app-header__logo">TecnoMayores</a>
    
    <nav class="app-header__nav">
      <ul class="app-header__nav-list">
        <li><a href="/lecciones">Lecciones</a></li>
        <li><a href="/simuladores">Simuladores</a></li>
      </ul>
    </nav>
    
    <div class="app-header__utilities">
      <button class="app-header__utility-btn">?</button>
    </div>
  </div>
</header>
```

Los lectores de pantalla reconocen automaticamente que el header es el inicio de la pagina.

**nav - Navegacion**

Agrupa enlaces de navegacion. Existen dos tipos en el proyecto: navegacion principal (en el header) y navegacion secundaria (footer).

```html
<nav class="app-header__nav" aria-label="Navegacion principal">
  <ul class="app-header__nav-list">
    <li><a href="/lecciones">Lecciones</a></li>
    <li><a href="/simuladores">Simuladores</a></li>
  </ul>
</nav>
```

El atributo aria-label proporciona una etiqueta descriptiva para usuarios de lectores de pantalla y permite diferenciar entre multiples nav en la misma pagina.

**main - Contenido Principal**

Contiene el contenido principal unico de la pagina (no incluye headers, footers, sidebars). Se usa una vez por pagina.

```html
<main class="app-main">
  <ng-content></ng-content>
</main>
```

Los lectores de pantalla pueden saltar directamente al contenido principal sin tener que leer el header.

**aside - Contenido Secundario**

Contenido tangencialmente relacionado como sidebars con filtros, widgets o navegacion secundaria.

```html
<aside class="app-sidebar">
  <ng-content></ng-content>
</aside>
```

Los usuarios saben que este contenido es secundario y pueden optar por saltarselo.

**footer - Pie de Pagina**

Contiene informacion de la aplicacion, enlaces legales, redes sociales y copyright. Se usa una vez por pagina, al final.

```html
<footer class="app-footer">
  <div class="app-footer__container">
    <section class="app-footer__section">
      <h2 class="app-footer__section-title">TecnoMayores</h2>
      <p>Descripcion...</p>
    </section>
    
    <section class="app-footer__section">
      <h3 class="app-footer__section-title">Enlaces Rapidos</h3>
      <nav><ul><!-- enlaces --></ul></nav>
    </section>
  </div>
</footer>
```

**section - Secciones de Contenido**

Agrupa contenido relacionado tematicamente.

```html
<section class="app-footer__section">
  <h3 class="app-footer__section-title">Enlaces Legales</h3>
  <nav>
    <ul>
      <li><a href="/terminos">Terminos de servicio</a></li>
      <li><a href="/privacidad">Politica de privacidad</a></li>
    </ul>
  </nav>
</section>
```

**article - Articulos Independientes**

Contenido independiente y reutilizable como blog posts, lecciones o comentarios.

```html
<article class="lesson-card">
  <header class="lesson-card__header">
    <h2 class="lesson-card__title">Como enviar un email</h2>
  </header>
  <p class="lesson-card__description">Aprende paso a paso como enviar tu primer email...</p>
  <footer class="lesson-card__footer">
    <span class="lesson-card__duration">5 minutos</span>
  </footer>
</article>
```

#### Estructura Jerarquica Completa

```
<body>
  ├── <header>              // Encabezado con navegacion
  ├── <main>                // Contenido principal unico
  │   ├── <section>         // Secciones de contenido
  │   │   ├── <article>     // Articulos individuales
  │   │   └── <form>        // Formularios
  │   └── <aside>           // Contenido secundario (opcional)
  └── <footer>              // Pie de pagina
```

---

### 2.2 Jerarquia de Headings (Encabezados)

Los headings (h1-h6) son extremadamente importantes para accesibilidad. Los lectores de pantalla utilizan los headings para navegar por la pagina.

#### Reglas de Jerarquia

1. Un solo H1 por pagina - Representa el titulo principal de la pagina
2. No saltar niveles - Pasar de H1 a H3 resulta confuso
3. H2 para secciones principales - Divisiones mayores de contenido
4. H3 para subsecciones - Subdivisiones dentro de H2
5. H4-H6 son raros - Usarlos solo si hay mucha profundidad

#### Diagrama de Jerarquia en la Aplicacion

```
H1: "Lecciones" (titulo de la pagina)
  ├── H2: "Dispositivos Moviles" (categoria)
  │   ├── H3: "Como encender el movil" (leccion)
  │   ├── H3: "Como hacer una llamada" (leccion)
  │   └── H3: "Como enviar un mensaje" (leccion)
  │
  ├── H2: "Redes Sociales" (categoria)
  │   ├── H3: "Facebook Basico" (leccion)
  │   ├── H3: "WhatsApp Basico" (leccion)
  │   └── H3: "Llamadas de Video" (leccion)
  │
  └── H2: "Seguridad en Internet" (categoria)
      ├── H3: "Contraseñas seguras" (leccion)
      └── H3: "Reconocer estafas" (leccion)
```

#### Errores Comunes a Evitar

```html
<!-- MAL: Salta de H1 a H3 -->
<h1>Mi Pagina</h1>
<h3>Subtitulo</h3>  <!-- Deberia ser H2 -->

<!-- MAL: Multiples H1 en la misma pagina -->
<h1>Titulo Principal</h1>
<section>
  <h1>Otra seccion</h1>  <!-- Solo debe haber un H1 -->
</section>

<!-- CORRECTO: Jerarquia apropiada -->
<h1>Titulo Principal</h1>
<section>
  <h2>Seccion 1</h2>
  <h3>Subseccion 1.1</h3>
</section>
<section>
  <h2>Seccion 2</h2>
</section>
```

---

### 2.3 Estructura de Formularios

Los formularios son criticos en esta aplicacion (login, registro, contacto). Una estructura semantica adecuada es esencial para accesibilidad.

#### Elementos Clave

**form - Contenedor del Formulario**

```html
<form method="POST" action="/login" class="login-form__form">
  <!-- Campos del formulario aqui -->
</form>
```

Atributos importantes:
- `method`: GET (para busquedas) o POST (para datos sensibles)
- `action`: URL a donde se envia el formulario
- `novalidate`: Si se usa validacion con JavaScript (como en Angular)

**fieldset - Agrupa Campos Relacionados**

Agrupa campos relacionados tematicamente como credenciales de login, informacion personal u opciones de configuracion.

```html
<fieldset class="login-form__fieldset">
  <legend class="login-form__legend">Credenciales de Acceso</legend>
  <!-- Campos email y password aqui -->
</fieldset>
```

**legend - Describe el Fieldset**

Proporciona una etiqueta para el fieldset. Los lectores de pantalla leen la leyenda al entrar en un fieldset.

**label - Etiqueta de Campo**

Asocia texto descriptivo con un campo de input. Dos formas de asociar:

Opcion 1: Atributos for/id (recomendado)
```html
<label for="email-input">Correo Electronico</label>
<input id="email-input" type="email" name="email">
```

Opcion 2: Label envuelve el input
```html
<label>
  Correo Electronico
  <input type="email" name="email">
</label>
```

En este proyecto se usa la Opcion 1 en el componente `form-input`:

```html
<label [for]="inputId" class="form-input__label">
  <span class="form-input__label-text">{{ label }}</span>
  <span *ngIf="required" class="form-input__required-indicator">*</span>
</label>

<input [id]="inputId" [type]="inputType" ...>
```

Impacto en accesibilidad:
- Los usuarios saben que campo es cual
- Hacer clic en el label enfoca el input
- El area clickeable es mas grande

#### Componente FormInput - Estructura Completa

El componente `app-form-input` implementa un campo de formulario accesible y reutilizable:

```html
<div class="form-input">
  
  <!-- 1. LABEL con indicador de requerido -->
  <label [for]="inputId" class="form-input__label">
    <span class="form-input__label-text">{{ label }}</span>
    <span *ngIf="required" class="form-input__required-indicator">*</span>
  </label>

  <!-- 2. INPUT con validacion -->
  <input 
    [id]="inputId"
    [type]="inputType"
    [name]="inputName"
    [placeholder]="placeholder"
    [required]="required"
    [value]="value"
    (input)="onInputChange($event)"
    class="form-input__field"
    [class.form-input__field--error]="hasError">
  
  <!-- 3. MENSAJE DE ERROR (si hay error) -->
  <span 
    *ngIf="hasError && errorMessage" 
    class="form-input__error" 
    [id]="errorId"
    role="alert">
    {{ errorMessage }}
  </span>
  
  <!-- 4. TEXTO DE AYUDA (opcional) -->
  <span 
    *ngIf="helpText" 
    class="form-input__help" 
    [id]="helpId">
    {{ helpText }}
  </span>

</div>
```

Caracteristicas de accesibilidad:
- Label asociado con for/id
- Indicador visual de requerido (asterisco)
- Mensaje de error con role="alert" para lectores de pantalla
- Texto de ayuda para instrucciones adicionales

#### Mejores Practicas Implementadas

| Practica | Implementacion | Beneficio |
|----------|----------------|-----------|
| Labels asociados | for/id | Area clickeable mas grande |
| Fieldsets y legends | Agrupacion tematica | Estructura clara |
| Indicadores visuales | Asterisco para requeridos | Usuario sabe que es obligatorio |
| Mensajes de error | role="alert" | Lectores de pantalla lo leen |
| Validacion en tiempo real | Componente form-input | Feedback inmediato |
| Texto de ayuda | Debajo de cada campo | Instrucciones claras |
| Contraste | Colores WCAG AA | Visible para usuarios con baja vision |
| Tamano de campo | Altura minima 48px | Facil de tocar en moviles |

---

## Seccion 3: Sistema de Componentes UI

---

### 3.1 Componentes Implementados

La Fase 3 introduce un sistema completo de componentes UI reutilizables que forman los bloques de construccion de la aplicacion. Cada componente tiene variantes, tamanos y estados completamente implementados.

#### app-button (Componente de Boton)

Ubicacion: `src/app/components/shared/button/`

Proposito: Boton interactivo reutilizable con multiples variantes y tamanos para diferentes contextos.

Variantes disponibles:
- `variant="primary"` - Accion principal (color amarillo/dorado)
- `variant="secondary"` - Accion secundaria (color azul accent)
- `variant="ghost"` - Accion neutral, sin fondo (solo borde)
- `variant="danger"` - Accion destructiva (color rojo)

Tamanos disponibles:
- `size="sm"` - Pequeño (36px de altura)
- `size="md"` - Mediano por defecto (48px de altura)
- `size="lg"` - Grande (56px de altura)

Estados que maneja:
- :hover - Cambio de color + elevacion de sombra + transformacion translateY(-2px)
- :focus - Outline de 3px en color accent
- :focus-visible - Outline visible para navegacion con teclado
- :active - Escala reducida (0.95) para feedback de clic
- [disabled] - Opacidad 0.6 + cursor no-drop

Propiedades del componente:

```typescript
@Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
@Input() size: 'sm' | 'md' | 'lg' = 'md';
@Input() disabled: boolean = false;
@Input() type: 'button' | 'submit' | 'reset' = 'button';
@Output() click = new EventEmitter<void>();
```

Ejemplo de uso:

```html
<!-- Boton primario grande -->
<app-button variant="primary" size="lg" (click)="onSubmit()">
  Guardar
</app-button>

<!-- Boton peligroso, deshabilitado -->
<app-button variant="danger" [disabled]="isDeleting">
  Eliminar
</app-button>

<!-- Boton fantasma pequeño -->
<app-button variant="ghost" size="sm" (click)="cancel()">
  Cancelar
</app-button>
```

Accesibilidad:
- Outline focus visible de 3px
- Area minima 48x48px (Ley de Fitts)
- Contraste WCAG AA
- Navegacion con teclado (Tab, Enter)
- Estados claros y diferenciables

#### app-card (Componente de Tarjeta)

Ubicacion: `src/app/components/shared/card/`

Proposito: Contenedor visual para mostrar contenido relacionado (imagen, titulo, descripcion, acciones).

Variantes disponibles:
- `variant="vertical"` - Imagen arriba, contenido abajo (por defecto)
- `variant="horizontal"` - Imagen a la izquierda, contenido a la derecha

Estados que maneja:
- :hover - Elevacion de sombra + transformacion translateY(-4px) para feedback
- :normal - Sombra sutil, sin transformacion

Propiedades del componente:

```typescript
@Input() title: string = '';
@Input() description: string = '';
@Input() image?: string;
@Input() variant: 'vertical' | 'horizontal' = 'vertical';
```

Ejemplo de uso:

```html
<app-card 
  title="Aprende HTML"
  description="Guia completa de HTML5 desde cero"
  image="/assets/html-course.jpg"
  variant="vertical"
>
  <app-button variant="primary" size="sm">
    Leer mas
  </app-button>
</app-card>
```

Accesibilidad:
- Elemento semantico article
- Estructura clara (h3 para titulo)
- Imagen con alt text
- Contraste de colores WCAG AA
- Responsive en todos los tamanos de pantalla

#### app-form-textarea (Componente de Area de Texto)

Ubicacion: `src/app/components/shared/form-textarea/`

Proposito: Campo de entrada para multiples lineas de texto con validacion y mensajes de error.

Estados que maneja:
- :focus - Borde color accent + sombra azul
- :focus-visible - Outline de 3px
- :disabled - Opacidad 0.6
- [error] - Borde rojo + fondo rojo tenue

Propiedades del componente:

```typescript
@Input() label: string = '';
@Input() placeholder: string = '';
@Input() rows: number = 4;
@Input() required: boolean = false;
@Input() error?: string;
@Input() hint?: string;
@Input() value: string = '';
@Output() change = new EventEmitter<string>();
```

Ejemplo de uso:

```html
<app-form-textarea
  label="Descripcion"
  placeholder="Escribe tu descripcion aqui..."
  [rows]="5"
  [required]="true"
  [(ngModel)]="description"
></app-form-textarea>
```

Accesibilidad:
- Label asociado con for/id
- Indicador de requerido (asterisco rojo)
- Mensajes de error con role="alert"
- Resize vertical permitido
- ControlValueAccessor para Reactive Forms

#### app-form-select (Componente de Dropdown)

Ubicacion: `src/app/components/shared/form-select/`

Proposito: Dropdown para seleccionar una opcion de una lista.

Estados que maneja:
- :hover - Borde color accent
- :focus - Sombra azul + outline
- option:checked - Fondo azul, texto blanco
- [disabled] - Opacidad 0.6
- [error] - Borde rojo + fondo rojo tenue

Propiedades del componente:

```typescript
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Input() label: string = '';
@Input() options: SelectOption[] = [];
@Input() placeholder: string = 'Selecciona una opcion';
@Input() required: boolean = false;
@Input() error?: string;
@Input() hint?: string;
@Input() value: string | number = '';
@Output() change = new EventEmitter<string | number>();
```

Ejemplo de uso:

```html
<app-form-select
  label="Selecciona un curso"
  [options]="cursos"
  placeholder="Elige un curso"
  [required]="true"
  [error]="cursoError"
></app-form-select>
```

Accesibilidad:
- Label asociado con for/id
- Opciones con texto visible
- Contraste de colores WCAG AA
- Tamaño adecuado para clics en pantallas tactiles

#### app-alert (Componente de Alerta)

Ubicacion: `src/app/components/shared/alert/`

Proposito: Mensajes de feedback visual para el usuario con diferentes tipos semanticos segun el contexto.

Variantes disponibles:
- `type="success"` - Confirmacion de acciones exitosas (color verde)
- `type="error"` - Errores o problemas (color rojo)
- `type="warning"` - Advertencias o precauciones (color naranja)
- `type="info"` - Informacion general (color azul)

Estados que maneja:
- Visible/oculto mediante propiedad visible
- Cerrable con boton X (opcional)
- Animacion de entrada y salida

Propiedades del componente:

```typescript
@Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
@Input() message: string = '';
@Input() description?: string;
@Input() closeable: boolean = true;
@Input() visible: boolean = true;
@Output() close = new EventEmitter<void>();
```

Ejemplo de uso:

```html
<app-alert
  type="success"
  message="Operacion completada"
  description="Los cambios se han guardado correctamente."
  [closeable]="true"
></app-alert>

<app-alert
  type="error"
  message="Error al guardar"
  description="No se pudo completar la operacion. Intentalo de nuevo."
></app-alert>
```

Accesibilidad:
- Colores semanticos diferenciados
- Iconos distintivos para cada tipo
- Contraste WCAG AA
- Boton de cierre con area minima 44x44px
- Mensajes claros y descriptivos

---

### 3.2 Nomenclatura y Metodologia BEM

El proyecto sigue la metodologia BEM (Block Element Modifier) para nombrar clases CSS de forma consistente y escalable. BEM facilita la comprension del codigo y evita conflictos de nombres.

#### Estructura de BEM

**Block (Bloque)**: Componente independiente que tiene sentido por si mismo.

```scss
.button { }
.card { }
.form-input { }
```

**Element (Elemento)**: Parte de un bloque que no tiene sentido por si mismo fuera del bloque.

```scss
.button__icon { }
.card__title { }
.card__description { }
.form-input__label { }
.form-input__field { }
```

**Modifier (Modificador)**: Variacion o estado de un bloque o elemento.

```scss
.button--primary { }
.button--secondary { }
.button--disabled { }
.card--horizontal { }
.form-input__field--error { }
```

#### Ejemplos Reales del Proyecto

**Componente Button**

```scss
// Block
.button {
  display: inline-flex;
  border: none;
  cursor: pointer;
}

// Modifiers de variante
.button--primary {
  background-color: $color-primary;
  color: $color-text-dark;
}

.button--secondary {
  background-color: $color-accent;
  color: $color-text-light;
}

.button--ghost {
  background-color: transparent;
  border: $border-medium solid $color-gray-300;
}

.button--danger {
  background-color: $color-error;
  color: $color-text-light;
}

// Modifiers de tamaño
.button--sm {
  height: $button-height-sm;
  padding: $spacing-1 $spacing-3;
  font-size: $font-size-sm;
}

.button--md {
  height: $button-height-md;
  padding: $spacing-2 $spacing-5;
  font-size: $font-size-base;
}

.button--lg {
  height: $button-height-lg;
  padding: $spacing-3 $spacing-6;
  font-size: $font-size-lg;
}

// Modifier de estado
.button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

**Componente Card**

```scss
// Block
.card {
  display: flex;
  flex-direction: column;
  border-radius: $radius-lg;
  background-color: $color-gray-50;
}

// Elements
.card__image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card__image-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__content {
  display: flex;
  flex-direction: column;
  padding: $spacing-5;
}

.card__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-dark;
}

.card__description {
  font-size: $font-size-base;
  color: $color-gray-600;
}

.card__footer {
  display: flex;
  gap: $spacing-3;
  margin-top: auto;
}

// Modifier de variante
.card--horizontal {
  flex-direction: row;
  
  .card__image {
    width: 200px;
    height: auto;
  }
}
```

**Componente Form Input**

```scss
// Block
.form-input {
  display: flex;
  flex-direction: column;
  gap: $spacing-2;
}

// Elements
.form-input__label {
  display: flex;
  align-items: center;
  gap: $spacing-1;
  font-weight: $font-weight-medium;
}

.form-input__label-text {
  color: $color-text-dark;
}

.form-input__required-indicator {
  color: $color-error;
}

.form-input__field {
  height: $input-height;
  padding: $input-padding-y $input-padding-x;
  border: $border-medium solid $color-gray-300;
  border-radius: $radius-md;
}

.form-input__error {
  color: $color-error;
  font-size: $font-size-sm;
}

.form-input__help {
  color: $color-gray-600;
  font-size: $font-size-sm;
}

// Modifier de estado
.form-input__field--error {
  border-color: $color-error;
  background-color: rgba($color-error, 0.05);
}
```

#### Ventajas de BEM en el Proyecto

1. **Claridad**: Al leer una clase se entiende inmediatamente su funcion
   - `.card__title` es claramente el titulo de una card
   - `.button--primary` es claramente un boton con estilo primario

2. **Evita conflictos**: Los nombres son unicos y especificos
   - No hay colisiones entre `.card__title` y `.article__title`

3. **Facilita mantenimiento**: Es facil encontrar donde esta definido un estilo
   - Buscar `.button--ghost` lleva directamente al archivo button.scss

4. **Escalabilidad**: Se pueden añadir nuevos elementos sin afectar los existentes
   - Añadir `.card__badge` no afecta a `.card__title`

5. **Reutilizacion**: Los bloques son independientes y portables
   - El componente `.button` puede usarse en cualquier contexto

#### Criterios de Nomenclatura

**Cuando usar Block**:
- Componente completo que tiene sentido por si mismo
- Puede existir independientemente
- Ejemplos: button, card, modal, alert

**Cuando usar Element**:
- Parte de un componente que no tiene sentido fuera del bloque
- Depende del contexto del bloque padre
- Ejemplos: card__title, button__icon, modal__close

**Cuando usar Modifier**:
- Variacion visual del bloque o elemento
- Estado temporal (hover, active, disabled)
- Ejemplos: button--primary, card--horizontal, input--error

**No usar BEM para**:
- Utilidades generales (.text-center, .mt-4)
- Estados CSS nativos (:hover, :focus, :disabled)
- Clases de JavaScript (.js-toggle, .js-modal-trigger)

---

### 3.3 Style Guide

El Style Guide es una pagina especial de la aplicacion accesible en `/style-guide` que muestra visualmente todos los componentes UI implementados con todas sus variantes, tamanos y estados.

#### Proposito del Style Guide

1. **Documentacion visual**: Muestra como se ven todos los componentes en la aplicacion real
2. **Testing rapido**: Permite verificar que todos los componentes funcionan correctamente
3. **Referencia para desarrollo**: Los desarrolladores pueden copiar ejemplos de uso
4. **Control de calidad**: Facilita detectar inconsistencias visuales
5. **Onboarding**: Ayuda a nuevos desarrolladores a conocer los componentes disponibles

#### Estructura del Style Guide

El Style Guide esta organizado en secciones tematicas:

**Seccion 0: Design Tokens**
- Paleta de colores (marca, semanticos, grises)
- Tipografia (familias, tamanos, pesos, alturas de linea)
- Sistema de espaciado
- Border radius
- Elevaciones (sombras)
- Breakpoints responsive
- Transiciones

<img width="998" height="723" alt="Captura de pantalla 2025-12-18 210217" src="https://github.com/user-attachments/assets/68708e1f-7af6-44a7-a6f4-5ecf690b087f" />

<img width="1000" height="790" alt="Captura de pantalla 2025-12-18 210251" src="https://github.com/user-attachments/assets/e7c98b67-1d8c-4f4a-b4eb-dbcb43efe927" />


<img width="975" height="208" alt="Captura de pantalla 2025-12-18 210352" src="https://github.com/user-attachments/assets/92e81ca1-a161-4830-8351-2368ecf8eef6" />


<img width="964" height="799" alt="Captura de pantalla 2025-12-18 210333" src="https://github.com/user-attachments/assets/98c459eb-a779-471f-8a6d-e569e3e89c76" />


<img width="975" height="808" alt="Captura de pantalla 2025-12-18 210321" src="https://github.com/user-attachments/assets/6262590c-e0b6-4bf5-9a15-010703cdc995" />


<img width="967" height="803" alt="Captura de pantalla 2025-12-18 210308" src="https://github.com/user-attachments/assets/20fad885-4949-4b72-905b-a395c51cdc53" />


**Seccion 1: Cards**
- Cards verticales
- Cards horizontales
- Cards sin imagen

<img width="972" height="336" alt="Captura de pantalla 2025-12-18 210459" src="https://github.com/user-attachments/assets/958af86b-e5b6-4917-817e-9e44fc84e0dd" />

<img width="1002" height="654" alt="Captura de pantalla 2025-12-18 210450" src="https://github.com/user-attachments/assets/727f06b3-7d92-4419-ba6e-747e9cef20d2" />

<img width="991" height="765" alt="Captura de pantalla 2025-12-18 210438" src="https://github.com/user-attachments/assets/5268a253-1024-4096-b81c-d874f3126fd0" />



**Seccion 2: Botones**
- Variante Primary (3 tamanos + disabled)
- Variante Secondary (3 tamanos + disabled)
- Variante Ghost (3 tamanos + disabled)
- Variante Danger (3 tamanos + disabled)

<img width="988" height="538" alt="Captura de pantalla 2025-12-18 210550" src="https://github.com/user-attachments/assets/f5e4aa05-ace8-48dd-a50b-62027f2e500b" />

<img width="977" height="456" alt="Captura de pantalla 2025-12-18 210600" src="https://github.com/user-attachments/assets/2b26938c-a33f-493c-bee1-c597d64d32fd" />


**Seccion 3: Formularios**
- Form Input (normal, con error, con ayuda)
- Form Textarea (normal, con error)
- Form Select (con opciones)


<img width="980" height="322" alt="Captura de pantalla 2025-12-18 210645" src="https://github.com/user-attachments/assets/7f9bd2ee-9773-42f7-9f86-d22820ccd0e8" />


<img width="980" height="680" alt="Captura de pantalla 2025-12-18 210630" src="https://github.com/user-attachments/assets/41612672-3859-4a83-9211-50f948f2bedd" />


**Seccion 4: Alertas**
- Alert Success
- Alert Error
- Alert Warning
- Alert Info

<img width="984" height="392" alt="Captura de pantalla 2025-12-18 210740" src="https://github.com/user-attachments/assets/2d20a4a2-b37f-4930-92ca-da1ed078a512" />


<img width="989" height="468" alt="Captura de pantalla 2025-12-18 210731" src="https://github.com/user-attachments/assets/0566b332-129a-4530-8487-cc9ff01fe9f9" />


Cada seccion muestra:
- Titulo descriptivo del componente
- Descripcion breve de su proposito
- Ejemplos visuales interactivos
- Todas las variantes disponibles
- Todos los tamanos disponibles
- Todos los estados (normal, hover, disabled)

#### Implementacion Tecnica

El Style Guide esta implementado como un componente Angular standalone:

```typescript
@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card,
    FormInput,
    FormTextarea,
    FormSelect,
    Alert,
    // ... otros componentes
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss'
})
export class StyleGuide {
  // Datos de ejemplo para mostrar componentes
  brandColors = [...];
  semanticColors = [...];
  exampleCards = [...];
  categoryOptions = [...];
  alertStates = {...};
}
```

#### Navegacion al Style Guide

El Style Guide es accesible desde:
- Menu de navegacion principal: `/style-guide`
- Header de la aplicacion
- Durante el desarrollo para verificar componentes

#### Beneficios del Style Guide

1. **Desarrollo mas rapido**: Los desarrolladores ven ejemplos de uso inmediatos
2. **Consistencia visual**: Todos usan los mismos componentes de la misma forma
3. **Documentacion actualizada**: Se actualiza automaticamente al modificar componentes
4. **Testing visual**: Se detectan rapidamente problemas de CSS
5. **Comunicacion con diseño**: Diseñadores pueden revisar la implementacion

---

### Resumen de la Seccion 3

| Aspecto | Implementacion | Justificacion |
|---------|----------------|---------------|
| Componentes obligatorios | button, card, form-textarea, form-select, alert | Base del sistema UI |
| Componentes opcionales | modal, tabs, toast, spinner, tooltip, accordion | Funcionalidades avanzadas |
| Metodologia | BEM estricta | Nombres claros, sin conflictos |
| Variantes | Multiples opciones visuales | Flexibilidad de uso |
| Tamanos | sm, md, lg | Adaptacion a contextos |
| Estados | hover, focus, active, disabled | Feedback interactivo |
| Accesibilidad | WCAG AA, navegacion teclado | Usable para todos |
| Style Guide | Pagina /style-guide | Documentacion visual en vivo |
| Reutilizacion | Componentes standalone | DRY, mantenible |

El sistema de componentes UI proporciona bloques de construccion consistentes, accesibles y bien documentados que se utilizan en toda la aplicacion para crear interfaces coherentes y profesionales.

---

## Sección 4: Responsive design y layouts completos

### 4.1 Breakpoints definidos

Para garantizar una visualización óptima en la amplia gama de dispositivos utilizados por el público objetivo (personas mayores, que a menudo emplean tablets o smartphones con configuraciones de zoom elevadas), se ha definido una escala de 5 puntos de ruptura en el archivo `_variables.scss`. Estos valores han sido seleccionados para cubrir las resoluciones más comunes del mercado actual:

| Breakpoint | Variable | Valor | Justificación Técnica |
| :--- | :--- | :--- | :--- |
| **SM** | `$breakpoint-sm` | 640px | Límite para smartphones en vertical. Se prioriza el apilamiento de elementos en una sola columna. |
| **MD** | `$breakpoint-md` | 768px | Orientado a tablets estándar (iPad). Aquí los componentes como el Sidebar o el Header mutan a su versión móvil. |
| **LG** | `$breakpoint-lg` | 1024px | Laptops y tablets en formato apaisado. Los grids de lecciones pasan de 2 a 3 columnas. |
| **XL** | `$breakpoint-xl` | 1280px | Resolución de escritorio estándar. El contenedor principal alcanza su ancho máximo (`1400px`). |
| **2XL** | `$breakpoint-2xl` | 1536px | Optimización para monitores de alta resolución, ampliando los márgenes laterales. |

### 4.2 Estrategia responsive

La aplicación utiliza una estrategia **Desktop-First**.

**Justificación:** El diseño de "TecnoMayores" se basa en una estética de "cuaderno de notas" con múltiples capas decorativas, sombras con offset y elementos posicionados (blobs) que alcanzan su máxima expresión visual en pantallas grandes. Resulta más eficiente a nivel de arquitectura CSS definir primero este layout complejo y, mediante consultas `@media (max-width: ...)`, ir simplificando la interfaz, eliminando elementos decorativos secundarios y aumentando los tamaños de los objetivos táctiles (botones) para reducir la carga cognitiva en dispositivos móviles.

**Ejemplo de implementación (`lecciones.scss`):**

```scss
// Layout principal por defecto (Desktop)
.lecciones-layout {
  display: grid;
  grid-template-columns: 288px minmax(0, 1fr);
  gap: v.$spacing-24;

  // Adaptación para tablets y móviles (Desktop-First)
  @media (max-width: v.$breakpoint-lg) {
    grid-template-columns: 1fr;
    gap: v.$spacing-10;
  }
}
```

---

### 4.3 Container Queries

Se ha implementado la tecnología de **Container Queries** en componentes estratégicos para lograr una verdadera independencia del viewport. El caso principal es el componente `app-header` (`header.scss`), el cual debe adaptar su densidad de información no solo basándose en el ancho de la pantalla, sino en el espacio disponible dentro de su propio contenedor.

**Justificación técnica:** Esta aproximación permite que el encabezado mantenga su integridad visual incluso si se integra en layouts con sidebars laterales persistentes que reduzcan su ancho efectivo sin cambiar la resolución del dispositivo. Se utiliza `container-type: inline-size` para permitir que el CSS evalúe el ancho del componente.

**Ejemplo de implementación (`header.scss`):**

```scss
.app-header {
  container-type: inline-size;
  container-name: header;
}

// Cuando el contenedor del header es menor a 900px
@container header (max-width: 900px) {
  .app-header__nav--desktop {
    display: none; // Oculta navegación horizontal
  }
  .app-header__actions--mobile {
    display: flex; // Muestra iconos de acción móvil
  }
  .app-header__btn-guide-text {
    display: none; // Deja solo el icono para ahorrar espacio
  }
}
```

### 4.4 Adaptaciones principales

La aplicación realiza una transformación profunda entre dispositivos para cumplir con las expectativas de usabilidad. A continuación, se resumen los cambios estructurales más significativos:

| Elemento | Comportamiento en Desktop | Adaptación en Mobile |
| :--- | :--- | :--- |
| **Navegación** | Lista horizontal persistente en el header. | Menú lateral desplegable (`app-header__mobile-menu`) mediante botón hamburguesa. |
| **Grids de Contenido** | Disposición de hasta 3 columnas en el catálogo de lecciones. | Paso a 1 columna única (`stack`) para maximizar el tamaño del texto e imágenes. |
| **Sidebar de Filtros** | Columna lateral fija (288px) a la izquierda del contenido. | Se reposiciona sobre el listado ocupando el 100% del ancho con controles simplificados. |
| **Lección Destacada** | Layout horizontal con imagen a la izquierda y texto a la derecha. | Layout vertical; la imagen ocupa el ancho completo sobre el título. |
| **Formularios** | Agrupación de campos en filas (`form-row`) de 2 o 3 columnas. | Los campos se apilan verticalmente para facilitar la entrada de datos táctil. |

---

### 4.5 Páginas implementadas

Se han desarrollado layouts completos y responsivos para todas las vistas de la aplicación, asegurando una experiencia de usuario (UX) coherente en la navegación. Las páginas implementadas son:

*   **Home (`/home`):** Página de aterrizaje que combina el componente `Hero`, barra de búsqueda flotante y grillas de características (`FeaturesContainer`). En móvil, las secciones paralelas pasan a apilarse verticalmente.
*   **Catálogo de Lecciones / Simuladores (`/lecciones`, `/simuladores`):** Listados principales que implementan un layout asimétrico (`288px / 1fr`) en escritorio para alojar el `SidebarFiltros`, el cual muta a una disposición de bloque único en móvil.
*   **Detalle de Lección (`/lecciones/:id`):** Vista de contenido con alternancia visual (zigzag) de texto e ilustraciones en escritorio, que se normaliza a una lectura lineal (imagen arriba, texto abajo) en dispositivos táctiles.
*   **Simulador Interactivo (`/simuladores/:id`):** Layout complejo de 3 columnas (Instrucciones, Simulador Móvil, Tips) que en tablets y móviles se reordena en una sola columna para priorizar el área del simulador central.
*   **Autenticación (`/login`, `/register`):** Páginas con layout centrado (`@include flex(center, center)`) y tarjetas flotantes. Los formularios adaptan su densidad y tamaño de fuente en pantallas pequeñas.
*   **Área de Usuario (`/usuario/*`):** Panel de control con sub-rutas (Perfil, Progreso, Certificados) que utiliza un layout de Dashboard.
*   **Páginas Informativas (`/about`, `/ayuda`, `/404`):** Vistas basadas en contenedores de ancho máximo (`max-width`) centrados con tipografía adaptativa.

### 4.6 Screenshots comparativos

A continuación, se muestran las capturas de tres páginas clave en los *viewports* críticos para demostrar la adaptabilidad del diseño:

**1. Página de Inicio (Home)**

*   **Mobile (375px):**

<img width="445" height="798" alt="home-mobile" src="https://github.com/user-attachments/assets/df66286d-d782-419a-937d-00776dae8835" />


*   **Tablet (768px):**

<img width="543" height="784" alt="home-tablet" src="https://github.com/user-attachments/assets/fe172c54-965f-4c32-9a1d-9af296cc6878" />


*   **Desktop (1280px):**

<img width="2550" height="1232" alt="home-desktop" src="https://github.com/user-attachments/assets/652fc3e6-afa1-45b6-90e7-9808e2ba813d" />


**2. Catálogo de Simuladores**

*   **Mobile (375px):**

<img width="359" height="788" alt="simuladores-mobile" src="https://github.com/user-attachments/assets/921d935d-649c-411d-ab6e-618f64e7be0c" />


*   **Tablet (768px):**

<img width="542" height="785" alt="simuladores-tablet" src="https://github.com/user-attachments/assets/abab3228-1bd4-4c34-aaf9-820e5baa794d" />


*   **Desktop (1280px):**

<img width="2554" height="1229" alt="simuladores-desktop" src="https://github.com/user-attachments/assets/8d43399e-2c1b-423e-a16f-a0fbdabe313a" />


**3. Detalle de Simulador**

*   **Mobile (375px):**

<img width="430" height="942" alt="simulador-mobile" src="https://github.com/user-attachments/assets/e1aa4f84-d6c8-477b-9d3f-954a03c97769" />


*   **Tablet (768px):**

<img width="540" height="785" alt="simulador-tablet" src="https://github.com/user-attachments/assets/00f52497-b22e-445e-88e6-5dc835733ad4" />


*   **Desktop (1280px):**

<img width="2548" height="1232" alt="simulador-desktop" src="https://github.com/user-attachments/assets/963ea891-0e19-4e9e-8b4d-8ae8522d7a61" />


---

# SECCIÓN 5: OPTIMIZACIÓN MULTIMEDIA

La optimización de los activos multimedia en **TecnoMayores** es un pilar fundamental de la experiencia de usuario. Dado que nuestro público objetivo (personas mayores) puede disponer de dispositivos con hardware limitado o conexiones de red menos estables, se ha priorizado la eficiencia en la carga sin comprometer la nitidez visual necesaria para la legibilidad.

Se ha transformado la gestión de imágenes de un modelo estático y pesado (~17.4 MB en archivos PNG originales) a un sistema dinámico y optimizado (~830 KB totales), logrando una **reducción de peso del 95.2%**.

### 5.1 Formatos elegidos y justificación técnica

Se ha implementado una estrategia de formatos basada en la compatibilidad y la eficiencia de compresión, seleccionando cada uno según su propósito dentro de la interfaz:

#### **WebP (Formato Principal)**
Se ha elegido **WebP** como formato estándar para todas las ilustraciones y fotografías del catálogo.
*   **Justificación:** Ofrece una compresión superior (entre un 25% y 34% más eficiente que JPEG y PNG) manteniendo la transparencia alfa si fuera necesario.
*   **Soporte:** Su adopción garantiza compatibilidad con más del 95% de los navegadores modernos (Chrome 23+, Firefox 65+, Safari 14+).
*   **Calidad:** Se ha configurado un factor de calidad de **75**, que representa el "punto dulce" entre ahorro de ancho de banda y ausencia de artefactos visuales apreciables por el ojo humano.

#### **SVG (Iconografía y Gráficos Vectoriales)**
Para los iconos (Librería Lucide) y elementos decorativos geométricos.
*   **Justificación:** Permite escalabilidad infinita sin pixelación, algo crítico cuando el usuario utiliza herramientas de zoom en el navegador.
*   **Optimización:** Se han procesado mediante **SVGO** para eliminar metadatos innecesarios, reduciendo su peso a menos de 2KB por archivo.

#### **AVIF (Estrategia de Futuro)**
Aunque el formato principal es WebP, la arquitectura del elemento `<picture>` implementada está preparada para servir **AVIF** en cuanto el soporte sea universal, permitiendo reducciones adicionales del 20% respecto a WebP.

| Formato | Uso | Justificación |
| :--- | :--- | :--- |
| **WebP** | Ilustraciones de lecciones | Balance optimizado entre peso y compatibilidad. |
| **SVG** | Iconos y logotipos | Nitidez absoluta en cualquier nivel de zoom. |
| **PNG/JPG** | Fallback | Compatibilidad con navegadores antiguos. |

---

### 5.2 Herramientas utilizadas

Para conseguir que la aplicación cargue de forma fluida y los recursos multimedia no penalicen la experiencia del usuario, se han utilizado diversas herramientas enfocadas en reducir el peso de los archivos sin perder calidad visual.

#### Sharp (Procesamiento de imágenes)

La herramienta principal para transformar las imágenes ha sido **Sharp**. Es una librería que funciona con Node.js y permite automatizar tareas que manualmente serían muy costosas. Gracias a ella, se ha creado un script personalizado (`optimize-images.js`) que toma las imágenes originales en formato PNG y genera automáticamente tres versiones de cada una con diferentes anchos (400px, 800px y 1200px) y las convierte al formato WebP. El script aplica una lógica de redimensionamiento inteligente que evita el escalado hacia arriba (*withoutEnlargement*) para no comprometer la nitidez de los archivos pequeños.

Ejemplo de la lógica aplicada en el script:

```javascript
sharp(input)
  .resize(width, null, { withoutEnlargement: true })
  .webp({ quality: 75, effort: 6 })
  .toFile(output);
```

Este proceso asegura que cada dispositivo descargue la imagen que mejor se adapte a su pantalla, ahorrando datos innecesarios en móviles y manteniendo la nitidez en ordenadores de escritorio.

#### Lucide Angular (Gestión de iconografía)

A diferencia de las ilustraciones, los iconos de la interfaz no han requerido un proceso de optimización manual. Se ha utilizado la librería **Lucide Angular**, que integra los iconos directamente como elementos vectoriales. Al importar los iconos desde una librería especializada, nos aseguramos de que el código SVG ya venga optimizado de serie, sea muy ligero y se adapte perfectamente al estilo visual del proyecto sin necesidad de manipular archivos individuales.

#### Squoosh (Ajuste y revisión visual)

Para las imágenes más importantes de la aplicación, como la que aparece en la portada o *Hero*, se ha utilizado **Squoosh**. Esta aplicación web permite comparar visualmente la imagen original con la optimizada antes de guardarla. Ha sido de gran utilidad para elegir el nivel de compresión exacto, asegurando que el ahorro de espacio no afecte a la nitidez de los dibujos, algo fundamental para que los usuarios mayores identifiquen bien los elementos.

---

### 5.3 Resultados de optimización

Tras procesar las imágenes originales mediante el script de optimización, se ha logrado una reducción drástica en el peso total de los recursos multimedia. Este ahorro es fundamental para que la aplicación sea ligera y cargue rápidamente, incluso en conexiones móviles o dispositivos con menos potencia.

A continuación, se detallan los resultados obtenidos en cinco de las imágenes principales del proyecto, comparando el peso de los archivos PNG originales con el peso total de sus nuevas variantes en formato WebP.

| Nombre de imagen | Tamaño original | Tamaño optimizado (Total variantes) | Reducción (%) |
| :--- | :--- | :--- | :--- |
| imagen-1.png | 919,12 KB | 104,47 KB | 88,6% |
| imagen-4.png | 3.037,37 KB | 187,07 KB | 93,8% |
| imagen-5.png | 1.275,91 KB | 91,56 KB | 92,8% |
| imagen-6.png | 4.556,97 KB | 71,49 KB | 98,4% |
| imagen-7.png | 5.794,06 KB | 212,09 KB | 96,3% |

#### Análisis de los resultados

La reducción media del peso de las imágenes supera el 90%. El impacto más significativo se observa en las imágenes de mayor resolución (como la imagen-6 e imagen-7), donde el formato WebP gestiona de manera mucho más eficiente las áreas de color y los degradados que el formato PNG original.

Gracias a esta optimización, el peso total de los recursos multimedia ha pasado de aproximadamente 17,4 MB a apenas 830 KB. Esto supone que la página inicial y el catálogo de lecciones se muestran de forma casi instantánea, mejorando la métrica de tiempo de carga y reduciendo el consumo de datos de los usuarios.

---

### 5.4 Tecnologías implementadas

Para garantizar que el navegador descargue el archivo más adecuado según el dispositivo y el contexto de visualización, se han implementado técnicas de imágenes responsivas nativas del estándar HTML5 integradas en los componentes de Angular.

#### Uso de srcset y sizes

Esta técnica se ha aplicado en las tarjetas de las lecciones y en el catálogo principal. Mediante el atributo `srcset`, proporcionamos al navegador una lista de archivos disponibles con sus respectivos anchos. Combinado con el atributo `sizes`, indicamos qué porcentaje del ancho de la pantalla ocupará la imagen en diferentes estados del layout (móvil, tablet o escritorio).

De este modo, el navegador calcula automáticamente qué versión descargar, evitando que un teléfono móvil procese una imagen de alta resolución diseñada para una pantalla de escritorio.

Ejemplo de implementación en `leccion-card.html`:

```html
<img
  [srcset]="leccion.imageVariants.small + ' 400w, ' + 
           leccion.imageVariants.medium + ' 800w, ' + 
           leccion.imageVariants.large + ' 1200w'"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  [src]="leccion.imagen"
  [alt]="leccion.titulo"
  loading="lazy">
```

#### Elemento picture para Control Avanzado

En secciones críticas como el *Hero* de la página de inicio, se ha utilizado el elemento `<picture>`. Esta etiqueta permite un control más estricto sobre el formato y la selección de la fuente de la imagen. Al definir diferentes fuentes (`source`), podemos priorizar formatos modernos como WebP y asegurar que la imagen se adapte no solo en tamaño, sino también en el formato que mejor procese el dispositivo.

Ejemplo de implementación en `hero.html`:

```html
<picture>
  <source
    [srcset]="imageVariants.small + ' 400w, ' + 
             imageVariants.medium + ' 800w, ' + 
             imageVariants.large + ' 1200w'"
    type="image/webp">
  <img [src]="imageUrl" [alt]="imageAlt" loading="lazy">
</picture>
```

#### Carga Diferida (Lazy Loading)

Se ha incluido el atributo `loading="lazy"` en todas las imágenes de la aplicación que no son críticas para el renderizado inicial. Esta tecnología indica al navegador que posponga la descarga de las imágenes que se encuentran fuera del área visible ( *viewport*) hasta que el usuario haga scroll cerca de ellas.

El impacto directo es una mejora significativa en el tiempo de interactividad de la página, ya que se prioriza la descarga de los estilos y la lógica del sitio sobre las imágenes que todavía no se necesitan mostrar.

---

### 5.5 Animaciones CSS

El sistema de animaciones de TecnoMayores se ha diseñado para ofrecer una experiencia fluida y gratificante sin sobrecargar visualmente al usuario. Se han evitado movimientos bruscos o excesivamente rápidos que puedan resultar confusos, optando por transiciones suaves que guían la atención hacia las interacciones importantes.

#### Criterios de rendimiento: Transform y Opacity

Todas las animaciones implementadas en el proyecto se limitan estrictamente a las propiedades `transform` (para movimiento, rotación o escala) y `opacity` (para desvanecimientos).

La elección de estas dos propiedades responde a una necesidad técnica de rendimiento: al animar solo transformaciones y opacidad, el navegador no tiene que recalcular la posición de todos los elementos de la página (proceso conocido como *reflow*) ni volver a dibujarlos píxel a píxel (*repaint*). El trabajo se delega directamente a la tarjeta gráfica del dispositivo, lo que garantiza una fluidez constante de 60 fotogramas por segundo, incluso en tablets o móviles antiguos con procesadores limitados.

#### Implementación 1: Indicador de carga (Spinner)

Se ha creado una animación de rotación continua para los estados de carga de datos. Esta animación utiliza un ciclo infinito para comunicar al usuario que la aplicación está trabajando.

```scss
// src/app/components/shared/spinner/spinner.scss
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner__circle {
  animation: spin 1s linear infinite;
}
```

#### Implementación 2: Notificaciones emergentes (Toasts)

Las notificaciones del sistema aparecen desde el lateral derecho de la pantalla mediante una combinación de desplazamiento horizontal y cambio de opacidad. Este efecto permite que el aviso sea visible de forma elegante sin tapar bruscamente el contenido principal.

```scss
// src/app/components/shared/toast/toast.scss
@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast {
  animation: toastSlideIn 0.28s ease-out;
}
```

#### Implementación 3: Interacciones en tarjetas y botones

Para mejorar la sensación de interactividad, las tarjetas de las lecciones y los botones principales reaccionan al pasar el cursor sobre ellos. Mediante el uso de `translateY`, el elemento parece elevarse ligeramente, simulando el comportamiento de un objeto físico sobre un cuaderno.

```scss
// src/app/components/lecciones/leccion-card/leccion-card.scss
.leccion-card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
  }
}
```

#### Respeto a las preferencias del usuario

Como medida de accesibilidad adicional, se ha incluido una regla global que detecta si el usuario tiene activada la opción de "reducir movimiento" en su sistema operativo. En ese caso, todas las transiciones y animaciones se desactivan o se reducen al mínimo para evitar mareos o distracciones.

---

## Sección 6: Sistema de Temas

---

### 6.1 Variables CSS Custom Properties

El sistema de temas utiliza **CSS Custom Properties** (variables CSS) definidas en el archivo `src/styles/00-settings/_css-variables.scss`. Esta aproximación permite cambiar dinámicamente entre tema claro y oscuro sin recargar la página, simplemente modificando el atributo `data-theme` del elemento `<html>`.

#### Ventajas de CSS Custom Properties para Temas

1. **Cambio dinámico en tiempo de ejecución**: Las variables CSS se pueden modificar con JavaScript sin recompilar SASS
2. **Cascada natural**: Las variables heredan el contexto del DOM
3. **Performance**: Cambiar temas no requiere cargar hojas de estilo adicionales
4. **Mantenibilidad**: Un solo archivo centraliza toda la lógica de temas
5. **Compatibilidad**: Soporte en todos los navegadores modernos

#### Estructura del Archivo de Variables CSS

```scss
// src/styles/00-settings/_css-variables.scss
@use './variables' as v;

:root {
  // Variables para TEMA CLARO (por defecto)
}

[data-theme='dark'] {
  // Variables para TEMA OSCURO (redefiniciones)
}
```

#### Tema Claro (Por Defecto)

```scss
:root {
  // ============================================================================
  // COLORES DE FONDO
  // ============================================================================
  --bg-primary: #{v.$color-bg-light-primary};       // #faf9f6 - Fondo principal
  --bg-secondary: #{v.$color-bg-light-secondary};   // #fafafa - Fondo secundario
  --bg-tertiary: #{v.$color-bg-light-tertiary};     // #f5f5f5 - Fondo terciario

  // ============================================================================
  // COLORES DE TEXTO
  // ============================================================================
  --text-primary: #{v.$color-text-dark};      // #030303 - Texto principal (casi negro)
  --text-secondary: #{v.$color-text-gray};    // #404040 - Texto secundario
  --text-tertiary: #{v.$color-text-muted};    // #737373 - Texto terciario
  --text-on-dark: #{v.$color-text-light};     // #fdfdfd - Texto sobre fondos oscuros

  // ============================================================================
  // COLORES DE MARCA (No cambian entre temas)
  // ============================================================================
  --color-primary: #{v.$color-primary};       // #f8d770 - Amarillo principal
  --color-secondary: #{v.$color-secondary};   // #ffb842 - Naranja secundario
  --color-tertiary: #{v.$color-tertiary};     // #f3742b - Naranja oscuro
  --color-accent: #{v.$color-accent};         // #0454b1 - Azul acento

  // ============================================================================
  // COLORES SEMÁNTICOS (No cambian entre temas)
  // ============================================================================
  --color-success: #{v.$color-success};       // #a7ee66 - Verde éxito
  --color-error: #{v.$color-error};           // #fb5353 - Rojo error
  --color-warning: #{v.$color-warning};       // #ffef51 - Amarillo advertencia
  --color-info: #{v.$color-info};             // #6adaf4 - Azul información

  // ============================================================================
  // BORDES
  // ============================================================================
  --border-color: #{v.$color-gray-300};       // #d4d4d4 - Borde estándar
  --border-color-light: #{v.$color-gray-200}; // #e5e5e5 - Borde claro

  // ============================================================================
  // SOMBRAS (Modo Claro - Más sutiles)
  // ============================================================================
  --shadow-sm: #{v.$shadow-sm};
  --shadow-md: #{v.$shadow-md};
  --shadow-lg: #{v.$shadow-lg};
  --shadow-xl: #{v.$shadow-xl};

  // ============================================================================
  // OVERLAYS
  // ============================================================================
  --overlay-bg: rgba(0, 0, 0, 0.5);           // Overlay oscuro para modales
}
```

**Justificación del Tema Claro:**
- Fondo **amarillo muy claro** (#faf9f6) reduce el brillo agresivo del blanco puro
- Texto **casi negro** (#030303) proporciona contraste máximo (ratio 13.5:1 WCAG AAA)
- Colores de marca **cálidos** (amarillo, naranja) transmiten energía y optimismo
- Sombras **sutiles** (0.05-0.1 opacidad) añaden profundidad sin ser intrusivas

#### Tema Oscuro

```scss
[data-theme='dark'] {
  // ============================================================================
  // COLORES DE FONDO (Invertidos)
  // ============================================================================
  --bg-primary: #{v.$color-gray-900};      // #171717 - Fondo principal oscuro
  --bg-secondary: #{v.$color-gray-800};    // #262626 - Fondo secundario oscuro
  --bg-tertiary: #{v.$color-gray-700};     // #404040 - Fondo terciario oscuro

  // ============================================================================
  // COLORES DE TEXTO (Invertidos)
  // ============================================================================
  --text-primary: #{v.$color-text-light};   // #fdfdfd - Texto claro principal
  --text-secondary: #{v.$color-gray-300};   // #d4d4d4 - Texto claro secundario
  --text-tertiary: #{v.$color-gray-400};    // #a3a3a3 - Texto claro terciario

  // ============================================================================
  // BORDES (Más oscuros)
  // ============================================================================
  --border-color: #{v.$color-gray-700};       // #404040 - Borde oscuro
  --border-color-light: #{v.$color-gray-600}; // #525252 - Borde oscuro claro

  // ============================================================================
  // SOMBRAS (Modo Oscuro - Más intensas para visibilidad)
  // ============================================================================
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 20px 30px rgba(0, 0, 0, 0.7);

  // ============================================================================
  // OVERLAYS
  // ============================================================================
  --overlay-bg: rgba(0, 0, 0, 0.8);  // Overlay más oscuro para mejor contraste
}
```

**Justificación del Tema Oscuro:**
- Fondo **gris muy oscuro** (#171717) en lugar de negro puro (#000) reduce la fatiga visual
- Texto **casi blanco** (#fdfdfd) en lugar de blanco puro reduce el deslumbramiento
- Sombras **más intensas** (0.4-0.7 opacidad) mantienen la profundidad visual en fondos oscuros
- Bordes **más claros** (#404040) para mantener la separación entre elementos
- Los colores de marca **se mantienen iguales** para preservar la identidad de marca

#### Mapeo de Variables SCSS a CSS Custom Properties

| Variable SCSS Original | Variable CSS | Tema Claro | Tema Oscuro |
|------------------------|--------------|------------|-------------|
| `$color-bg-light` | `var(--bg-primary)` | #faf9f6 | #171717 |
| `$color-text-dark` | `var(--text-primary)` | #030303 | #fdfdfd |
| `$color-gray-200` | `var(--border-color-light)` | #e5e5e5 | #525252 |
| `$color-gray-600` | `var(--text-tertiary)` | #525252 | #a3a3a3 |
| `$color-primary` | `var(--color-primary)` | #f8d770 | #f8d770 |
| `$color-accent` | `var(--color-accent)` | #0454b1 | #0454b1 |
| `$color-success` | `var(--color-success)` | #a7ee66 | #a7ee66 |

---

### 6.2 Implementación del Theme Switcher

El sistema de cambio de tema se implementa mediante dos componentes principales:

1. **ThemeService** (Servicio Angular)
2. **ThemeSwitcher** (Componente UI)

#### 6.2.1 ThemeService

**Ubicación:** `src/app/services/theme.service.ts`

El servicio centraliza toda la lógica de gestión de temas utilizando el patrón reactivo de RxJS.

**Características principales:**

```typescript
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'tecnomayores-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Subject reactivo para el tema actual
  private themeSubject = new BehaviorSubject<Theme>('light');
  
  // Observable público del tema
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeTheme();
  }
}
```

**1. Detección de Preferencia del Sistema**

```typescript
systemPrefersDark(): boolean {
  if (!this.isBrowser) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

Utiliza la Media Query `prefers-color-scheme` para detectar la preferencia del sistema operativo.

**2. Persistencia en localStorage**

```typescript
private saveToLocalStorage(theme: Theme): void {
  if (!this.isBrowser) return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

private getSavedTheme(): Theme | null {
  if (!this.isBrowser) return null;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return null;
}
```

Guarda la preferencia del usuario para persistir entre sesiones.

**3. Aplicación del Tema al DOM**

```typescript
private applyThemeToDocument(theme: Theme): void {
  if (!this.isBrowser) return;
  
  const documentElement = this.document.documentElement;
  
  // Usar atributo data-theme en lugar de clases
  if (theme === 'dark') {
    documentElement.setAttribute('data-theme', 'dark');
  } else {
    documentElement.removeAttribute('data-theme');
  }
  
  // Actualizar meta theme-color para móviles
  this.updateThemeColor(theme);
}
```

**4. Toggle entre Temas**

```typescript
toggleTheme(): void {
  const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';
  this.setTheme(newTheme);
}

setTheme(theme: Theme): void {
  if (!this.isBrowser) return;
  
  // Actualizar el subject reactivo
  this.themeSubject.next(theme);
  
  // Persistir en localStorage
  this.saveToLocalStorage(theme);
  
  // Aplicar al documento
  this.applyThemeToDocument(theme);
}
```

**5. Lógica de Prioridad**

```typescript
private initializeTheme(): void {
  if (!this.isBrowser) return;
  
  // PRIORIDAD 1: Tema guardado en localStorage
  const savedTheme = this.getSavedTheme();
  
  if (savedTheme) {
    this.setTheme(savedTheme);
  } else {
    // PRIORIDAD 2: Preferencia del sistema
    const prefersDark = this.systemPrefersDark();
    const systemTheme: Theme = prefersDark ? 'dark' : 'light';
    this.setTheme(systemTheme);
  }
  
  // Escuchar cambios en la preferencia del sistema
  this.watchSystemPreference();
}
```

**Orden de prioridad:**
1. **Tema guardado en localStorage** (preferencia explícita del usuario)
2. **Preferencia del sistema** (`prefers-color-scheme`)
3. **Tema claro por defecto** (fallback)

**6. Escucha de Cambios del Sistema**

```typescript
watchSystemPreference(callback?: (prefersDark: boolean) => void): void {
  if (!this.isBrowser) return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const listener = (event: MediaQueryListEvent) => {
    // Solo aplicar si no hay preferencia guardada
    if (!this.getSavedTheme()) {
      const newTheme: Theme = event.matches ? 'dark' : 'light';
      this.setTheme(newTheme);
      callback?.(event.matches);
    }
  };
  
  mediaQuery.addEventListener('change', listener);
}
```

Si el usuario cambia la preferencia del sistema operativo y **no ha seleccionado manualmente un tema**, la aplicación se adapta automáticamente.

#### 6.2.2 ThemeSwitcher Component

**Ubicación:** `src/app/components/shared/theme-switcher/`

Componente UI que proporciona el toggle visual para cambiar el tema.

**Template (theme-switcher.html):**

```html
<button
  class="theme-switcher"
  (click)="toggleTheme()"
  (keydown)="onKeyDown($event)"
  [attr.aria-label]="ariaLabel"
  [title]="buttonTitle"
  type="button"
>
  <app-header-icon
    [icon]="isDarkMode ? 'light_mode' : 'dark_mode'"
    [ariaLabel]="ariaLabel"
  />
</button>
```

**Componente TypeScript:**

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, Theme } from '../../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.scss',
})
export class ThemeSwitcher implements OnInit, OnDestroy {
  currentTheme: Theme = 'light';
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Suscribirse a cambios de tema
    this.themeSubscription = this.themeService.theme$.subscribe(
      (theme: Theme) => {
        this.currentTheme = theme;
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleTheme();
    }
  }

  get isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }

  get ariaLabel(): string {
    return this.isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
  }

  get buttonTitle(): string {
    return this.isDarkMode ? 'Modo claro' : 'Modo oscuro';
  }
}
```

**Características de Accesibilidad:**

- Atributo `aria-label` dinámico que describe la acción
- Soporte de teclado (Enter y Espacio)
- Atributo `title` para tooltip
- Icono visual que cambia según el tema actual

**Estilos (theme-switcher.scss):**

```scss
.theme-switcher {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: v.$spacing-2;
  border-radius: v.$radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color v.$transition-fast;

  &:hover {
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent 90%);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}
```

#### 6.2.3 Integración en el Header

El componente `ThemeSwitcher` se integra en el header principal de la aplicación:

```html
<!-- src/app/components/layout/header/header.html -->
<header class="app-header">
  <div class="app-header__utilities">
    <!-- Otros controles (búsqueda, notificaciones, etc.) -->
    <app-theme-switcher />
    <!-- Usuario, menú, etc. -->
  </div>
</header>
```

---

### 6.3 Capturas de Pantalla

A continuación se muestran capturas de diferentes páginas de la aplicación en **modo claro** y **modo oscuro** para demostrar la implementación del sistema de temas.

<img width="2549" height="1232" alt="lecciones-desktop" src="https://github.com/user-attachments/assets/b7db6e64-6d9f-45ed-afd3-32d4bc4bce5b" />

<img width="2541" height="1229" alt="lecciones-desktop-dark" src="https://github.com/user-attachments/assets/5589e641-8e92-4cf5-864e-785815fc201d" />

<img width="2549" height="1228" alt="login-desktop" src="https://github.com/user-attachments/assets/8a02d246-2625-4e19-aff6-9c73da8a4cd8" />

<img width="2538" height="1234" alt="login-desktop-dark" src="https://github.com/user-attachments/assets/ee1579e7-daae-4bd8-9a88-7e31651675bf" />

<img width="2542" height="1226" alt="simulador-desktop-dark" src="https://github.com/user-attachments/assets/0a964d37-2c55-4fff-8e41-5951511ee842" />

---

### 6.4 Problemas encontrados durante el desarrollo

Para que los componentes soporten ambos temas, se deben usar **variables CSS** en lugar de valores fijos o variables SCSS de color.

#### Incorrecto - Variables SCSS Hardcodeadas

```scss
// NO HACER ESTO
.card {
  background: $color-text-light;  // Valor fijo, no cambia con el tema
  color: $color-text-dark;        // Valor fijo, no cambia con el tema
  border: 1px solid $color-gray-200;
}

.button--primary {
  background: #f8d770;  // Hex hardcodeado
  color: #030303;       // Hex hardcodeado
}
```

**Problemas:**
- Los colores no cambian cuando se alterna el tema
- Difícil de mantener
- No sigue el sistema de diseño

#### Correcto - Variables CSS Dinámicas

```scss
// HACER ESTO
.card {
  background: var(--text-on-dark);   // Se adapta al tema
  color: var(--text-primary);        // Se adapta al tema
  border: 1px solid var(--border-color-light);
}

.button--primary {
  background: var(--color-primary);  // Usa la variable CSS
  color: var(--text-primary);        // Se invierte con el tema
}
```

**Ventajas:**
- Los colores cambian automáticamente con el tema
- Mantenible desde un solo archivo
- Sigue el sistema de diseño
- Performance óptima

#### Patrón Recomendado para Componentes

```scss
@use '../../../styles/00-settings/variables' as v;
@use '../../../styles/01-tools/mixins' as m;

.my-component {
  // Usar variables CSS para colores
  background: var(--bg-primary);
  color: var(--text-primary);
  border: v.$border-thin solid var(--border-color);
  
  // Usar variables SCSS para medidas (no cambian con el tema)
  padding: v.$spacing-4;
  border-radius: v.$radius-md;
  font-size: v.$font-size-base;
  
  // Mixins pueden usar ambos tipos
  @include m.elevation('md');
  @include m.transition(all, v.$transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
    box-shadow: var(--shadow-lg);
  }
}
```

#### Variables CSS vs Variables SCSS

| Tipo | Cuándo Usar | Ejemplo |
|------|-------------|---------|
| **Variables CSS** (`var(--...)`) | Colores, sombras, overlays - Todo lo que cambia entre temas | `var(--text-primary)`, `var(--bg-secondary)`, `var(--shadow-md)` |
| **Variables SCSS** (`v.$...`) | Medidas, tipografía, espaciado - Lo que NO cambia entre temas | `v.$spacing-4`, `v.$font-size-lg`, `v.$radius-md`, `v.$breakpoint-lg` |

#### Uso de color-mix() para Variaciones

Cuando necesitas una variación de un color (más claro, más oscuro, transparente), usa `color-mix()` en lugar de funciones SCSS:

```scss
// NO - Funciones SCSS (deprecated)
.button:hover {
  background: darken($color-primary, 10%);
  border-color: lighten($color-accent, 20%);
}

// SÍ - color-mix() CSS
.button:hover {
  background: color-mix(in srgb, var(--color-primary) 90%, black 10%);
  border-color: color-mix(in srgb, var(--color-accent) 80%, white 20%);
}

// Para transparencias
.overlay {
  background: color-mix(in srgb, var(--text-primary) 50%, transparent 50%);
}
```

**Ventaja de `color-mix()`:**
- Funciona con variables CSS dinámicas
- Estándar CSS moderno
- Mejor performance

#### Ejemplo Completo: Card Component

```scss
@use '../../../styles/00-settings/variables' as v;
@use '../../../styles/01-tools/mixins' as m;

.card {
  // Colores dinámicos (variables CSS)
  background: var(--bg-primary);
  color: var(--text-primary);
  border: v.$border-thin solid var(--border-color);
  
  // Medidas fijas (variables SCSS)
  border-radius: v.$radius-lg;
  padding: v.$spacing-6;
  
  // Sombra dinámica (variable CSS)
  box-shadow: var(--shadow-md);
  
  // Transición suave
  @include m.transition(all, v.$transition-fast);
  
  &:hover {
    // Color hover con color-mix
    background: color-mix(in srgb, var(--bg-primary) 95%, var(--color-accent) 5%);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }
  
  // Modificadores que usan variables CSS
  &--primary {
    background: var(--color-primary);
    color: var(--text-primary);
    border-color: var(--text-primary);
  }
  
  &--secondary {
    background: var(--bg-secondary);
    border-color: var(--border-color-light);
  }
}

.card__title {
  font-size: v.$font-size-2xl;          // SCSS: no cambia
  font-weight: v.$font-weight-bold;     // SCSS: no cambia
  color: var(--text-primary);           // CSS: cambia con el tema
  margin-bottom: v.$spacing-3;          // SCSS: no cambia
}

.card__description {
  font-size: v.$font-size-base;         // SCSS: no cambia
  line-height: v.$line-height-relaxed;  // SCSS: no cambia
  color: var(--text-secondary);         // CSS: cambia con el tema
}
```

---

### 6.5 Transiciones Suaves

Para proporcionar una experiencia visual fluida al cambiar entre temas, se implementan **transiciones CSS globales** que afectan a todos los elementos.

#### Implementación en _reset.scss

```scss
// src/styles/02-generic/_reset.scss
*,
*::before,
*::after {
  transition-property: background-color, color, border-color, box-shadow, fill, stroke;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

  // Respetar preferencia de movimiento reducido (accesibilidad)
  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

#### Propiedades que Transicionan

| Propiedad | Por qué | Ejemplo |
|-----------|---------|---------|
| `background-color` | Fondos de cards, botones, inputs | `.card { background: var(--bg-primary); }` |
| `color` | Texto | `.title { color: var(--text-primary); }` |
| `border-color` | Bordes de elementos | `.input { border: 1px solid var(--border-color); }` |
| `box-shadow` | Sombras que cambian con el tema | `.card { box-shadow: var(--shadow-md); }` |
| `fill` | Iconos SVG | `.icon { fill: var(--text-primary); }` |
| `stroke` | Bordes de SVG | `.icon { stroke: var(--border-color); }` |

#### Duración de Transición

```scss
transition-duration: 300ms;  // 0.3 segundos
```

**Justificación:**
- **300ms** es la duración ideal según estudios de UX
- **Más rápido** (150ms): Demasiado abrupto, no se aprecia
- **Más lento** (500ms+): Sensación de lentitud

#### Función de Easing

```scss
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```

**Curva ease-in-out personalizada:**
- Inicio suave (ease-in)
- Final suave (ease-out)
- Más natural que `linear` o `ease`
- Misma curva que Material Design

#### Accesibilidad: prefers-reduced-motion

```scss
@media (prefers-reduced-motion: reduce) {
  transition-duration: 0.01ms !important;
  animation-duration: 0.01ms !important;
}
```

**Respeta la preferencia del usuario:**

Usuarios que tienen activada la opción "Reducir movimiento" en su sistema operativo (común en personas con:
- Vértigo
- Sensibilidad a movimientos
- Epilepsia fotosensible
- Problemas vestibulares

**Cómo funciona:**
- Detecta la media query `prefers-reduced-motion: reduce`
- Reduce las transiciones a casi 0ms (0.01ms técnicamente presente pero imperceptible)
- Usa `!important` para sobrescribir cualquier transición específica

#### Ejemplo Visual del Efecto

**Sin transiciones:**
```
Tema Claro → [CAMBIO BRUSCO] → Tema Oscuro
```

**Con transiciones:**
```
Tema Claro → [FADE SUAVE 300ms] → Tema Oscuro
```

#### Optimización de Performance

Las transiciones solo afectan a propiedades que no disparan reflow/repaint costosos:

**Propiedades optimizadas:**
- `background-color` - Solo repaint
- `color` - Solo repaint
- `border-color` - Solo repaint
- `box-shadow` - Solo repaint (en capas GPU)

**Propiedades NO incluidas (costosas):**
- `width` / `height` - Disparan reflow
- `top` / `left` - Disparan reflow
- `margin` / `padding` - Disparan reflow

**Resultado:** Transiciones suaves a 60fps sin impacto en performance.

#### Casos Especiales: Transiciones Personalizadas

Algunos elementos pueden necesitar duraciones diferentes:

```scss
// Transición más rápida para hover
.button {
  transition: background-color 150ms ease-out,
              transform 150ms ease-out;
  
  &:hover {
    transform: translateY(-2px);
  }
}

// Transición más lenta para cambios grandes
.modal {
  transition: opacity 400ms ease-in-out,
              transform 400ms ease-in-out;
}
```

**Regla:** Las transiciones específicas sobrescriben la global.

---

## Sección 7: Aplicación completa y despliegue

---

En esta fase final, el objetivo ha sido integrar los componentes y servicios desarrollados en los módulos de DIW y DWEC para dar coherencia a la aplicación. El proyecto se ha desplegado públicamente utilizando **GitHub Pages** (mediante el paquete `angular-cli-ghpages`), lo que permite comprobar el funcionamiento de la interfaz en un entorno real.

Aunque la aplicación se presenta como una carcasa de frontend sin conexión a una base de datos real, se ha trabajado para que la navegación y la lógica de los componentes sean funcionales. Actualmente, el proyecto se encuentra en una fase de refinamiento visual, donde la estructura principal está asentada pero todavía requiere ajustes en los detalles de maquetación.

### 7.1 Estado final de la aplicación

A continuación se detalla el estado actual del proyecto, separando la parte de diseño de la lógica de programación.

#### Maquetación y Diseño (DIW)

*   **Páginas implementadas**: Se han creado las vistas principales (Inicio, Catálogo, Detalle y Área de Usuario). La navegación entre ellas funciona, aunque algunos layouts necesitan todavía un proceso de pulido para corregir pequeños errores visuales o de alineación.
*   **Sistema de estilos**: Se utiliza una arquitectura ITCSS para organizar el CSS. Los colores, fuentes y espaciados están centralizados en variables, lo que facilita el mantenimiento.
*   **Modo Oscuro**: El selector de temas es operativo. Cambia las variables de color de la aplicación y guarda la preferencia en el navegador del usuario para que no se pierda al recargar.
*   **Componentes Shared**: Se ha creado una base de componentes reutilizables (botones, tarjetas, alertas) que se usan en toda la web para mantener la uniformidad.

#### Lógica de la aplicación (DWEC)

*   **Enrutamiento**: El sistema de rutas de Angular está configurado, incluyendo el paso de parámetros (por ejemplo, para abrir una lección específica) y la protección de rutas mediante `AuthGuard`.
*   **Servicios y Datos**: Como no hay conexión con el backend, he desarrollado servicios que manejan datos simulados (*mock data*). Estos servicios emiten observables, por lo que si en el futuro se conecta a una API real, el código de los componentes apenas tendrá que cambiar.
*   **Formularios Reactivos**: El registro y el login están desarrollados con formularios reactivos. Tienen validaciones síncronas para controlar que los campos no estén vacíos y que los formatos (como el email) sean correctos.
*   **Uso de Web Speech API**: He integrado una funcionalidad básica de síntesis de voz que permite "leer" las instrucciones de los simuladores, pensando en la accesibilidad de los usuarios mayores.

---

### 7.2 Testing multi-dispositivo (Viewports)

Para asegurar que la aplicación es usable en diferentes tamaños de pantalla, he realizado pruebas utilizando las herramientas para desarrolladores de Chrome, simulando los *viewports* más comunes. El objetivo ha sido verificar que el contenido se reorganiza correctamente y que los elementos interactivos mantienen un tamaño adecuado.

| Viewport | Dispositivo (Simulado) | Resultado | Observaciones |
| :--- | :--- | :--- | :--- |
| **320px** | Móvil pequeño (iPhone SE) | **Aceptable** | El layout se adapta a una columna, aunque algunos márgenes son muy estrechos. |
| **375px** | Móvil estándar | **Correcto** | Las tarjetas de lecciones y botones se ven bien y son fáciles de pulsar. |
| **768px** | Tablet (iPad) | **Correcto** | El menú cambia a formato tablet y el grid de lecciones pasa a 2 columnas. |
| **1024px** | Laptop / Desktop pequeño | **Correcto** | Se activa el layout completo con el sidebar de filtros lateral. |
| **1280px** | Desktop estándar | **Correcto** | El contenedor principal se limita a su ancho máximo (1400px) para evitar líneas de texto demasiado largas. |

### 7.3 Testing en dispositivos reales

Además de las simulaciones en el navegador, he probado la aplicación desplegada en dispositivos físicos para comprobar la fluidez de las animaciones y la respuesta táctil.

| Dispositivo | Sistema Operativo | Navegador | Resultado |
| :--- | :--- | :--- | :--- |
| **Smartphone Android** | Android 13 | Chrome Mobile | **Correcto**. La navegación por pestañas es fluida. La síntesis de voz funciona bien. |
| **iPhone 13** | iOS 17 | Safari | **Correcto**. Los inputs de formulario se adaptan bien al teclado del sistema. |
| **Tablet (iPad)** | iPadOS 16 | Safari | **Aceptable**. En modo vertical el sidebar de filtros a veces queda demasiado pegado al borde. |

**Conclusiones del testing:**
La aplicación es funcional en todos los dispositivos probados. Sin embargo, se ha detectado que en dispositivos muy estrechos (320px) la maquetación de algunos componentes complejos, como el simulador, necesita un refinamiento para que los textos no queden tan comprimidos. Los botones cumplen con el tamaño mínimo para ser pulsados cómodamente con el dedo.

---

### 7.4 Verificación multi-navegador

He realizado pruebas de compatibilidad en los navegadores más utilizados para asegurar que las propiedades modernas de CSS (como Grid, Flexbox y las CSS Variables) se interpretan correctamente. Al tratarse de un proyecto desarrollado con Angular, el comportamiento del framework es muy estable, centrándose los riesgos en el renderizado de los estilos.

| Navegador | Motor | Resultado | Observaciones |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | Blink | **Correcto** | Es el navegador de desarrollo principal. Todo funciona como se esperaba. |
| **Mozilla Firefox** | Gecko | **Correcto** | El renderizado de las fuentes y el modo oscuro funcionan perfectamente. |
| **Safari** | WebKit | **Aceptable** | Los selectores de fecha y algunos sombreados varían ligeramente de forma nativa. |
| **Microsoft Edge** | Blink | **Correcto** | Comportamiento idéntico a Chrome. |

**Nota sobre compatibilidad:** Dado que la aplicación depende de las *CSS Custom Properties* para el sistema de temas y de *Container Queries* para el Header, el sitio requiere navegadores actualizados (versiones de 2023 en adelante). Para versiones muy antiguas, el sitio podría perder parte de su formato visual.

### 7.5 Capturas finales

Para documentar el estado actual de la interfaz y el funcionamiento del sistema de temas, he incluido capturas de las tres secciones principales en diferentes dispositivos. Se puede observar cómo el diseño se adapta y cómo cambian los colores al activar el modo oscuro.

#### 1. Página de Inicio (Home)
*   **Desktop (Modo Claro):**

<img width="2550" height="1232" alt="home-desktop" src="https://github.com/user-attachments/assets/6a396d4f-d97f-457f-9549-f19a10956104" />

*   **Mobile (Modo Oscuro):**

<img width="430" height="944" alt="home-mobile-dark" src="https://github.com/user-attachments/assets/c1934b24-b33f-411a-b11f-828c35d38b70" />

#### 2. Catálogo de Lecciones
*   **Tablet (Modo Claro):**

<img width="1039" height="1039" alt="lecciones-tablet" src="https://github.com/user-attachments/assets/8c0f367e-e1b1-46c1-b9e6-0a9b0a1155ce" />

*   **Desktop (Modo Oscuro):**

<img width="2530" height="1226" alt="lecciones-desktop-dark" src="https://github.com/user-attachments/assets/c535526b-b567-499d-b8a8-e0f2195898cc" />

#### 3. Detalle del Simulador
*   **Mobile (Modo Claro):**

<img width="377" height="822" alt="simulador-mobile" src="https://github.com/user-attachments/assets/58ceba16-be8a-4931-888f-771b2c42dfa0" />

*   **Desktop (Modo Oscuro):**

<img width="2538" height="1232" alt="simulador-desktop-dark" src="https://github.com/user-attachments/assets/e95931d4-3e14-4512-b0e1-bdc62a20fc4b" />

---

### 7.6 Despliegue

La aplicación se ha desplegado en un entorno real utilizando **GitHub Pages**. Para ello, he utilizado el paquete `angular-cli-ghpages`, que permite automatizar la generación del *build* de producción y su subida a la rama correspondiente del repositorio.

*   **URL de producción:** https://lmrocio.github.io/DAW2-Proyecto-intermodular/home
*   **Proceso técnico:** Se ha ejecutado el comando `ng build --configuration production --base-href /DAW2-Proyecto-intermodular/`. Este proceso minifica el código JavaScript y CSS, optimiza las imágenes WebP y prepara el sistema para ser servido de forma eficiente.
*   **Estado del despliegue:** La web es accesible y la navegación por rutas funciona correctamente. Al tratarse de una SPA (Single Page Application), se ha incluido un archivo `404.html` para gestionar las redirecciones y evitar errores al recargar la página en rutas internas.

### 7.7 Problemas conocidos y mejoras futuras

Al tratarse de una entrega que funciona como un prototipo de frontend, soy consciente de que existen puntos que deben ser refinados en fases posteriores del desarrollo:

1.  **Refinamiento de la maquetación:** Aunque la mayoría de las vistas son responsivas, algunos componentes (como el grid de filtros o las tablas de progreso) presentan detalles visuales mejorables en resoluciones intermedias. Tengo pendiente ajustar los *paddings* y *gaps* para que la estética de "cuaderno" sea perfecta en cualquier ancho de pantalla.
2.  **Persistencia de datos:** Actualmente no existe una conexión con un backend real. Los datos que se muestran son estáticos (*mock data*). La mejora inmediata sería implementar una API con Node.js o Spring Boot para que el registro de usuarios, el progreso en las lecciones y los certificados sean reales y persistentes.
3.  **Contenido de las lecciones:** Los textos de las lecciones y los pasos de los simuladores son demostrativos. Falta completar el catálogo con contenido pedagógico real diseñado específicamente para personas mayores.
4.  **Optimización SEO:** Al ser una aplicación privada tras un login, no se ha priorizado el SEO. En una versión pública, sería necesario trabajar los meta-tags dinámicos para cada lección.
5.  **Accesibilidad avanzada:** Aunque he integrado la Web Speech API, me gustaría ampliarla para que toda la interfaz, y no solo las instrucciones, pueda ser controlada por voz o leída íntegramente por el sistema, mejorando la autonomía del usuario.
