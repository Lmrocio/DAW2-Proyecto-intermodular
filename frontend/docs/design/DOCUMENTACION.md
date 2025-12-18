# Documentación del Sistema de Estilos - TecnoMayores

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

---

### Resumen de Decisiones de Accesibilidad

| Componente | Decision | Justificacion |
|------------|----------|---------------|
| Header | Navegacion principal + utilidades | Acceso rapido a funciones |
| Main | Proyeccion de contenido | Reutilizable, flexible |
| Footer | Secciones tematicas con nav | Organizado, accesible |
| FormInput | Componente reutilizable | DRY, consistencia |
| LoginForm | Fieldsets + Legends | Estructura semantica clara |
| Jerarquia H1-H6 | Un H1, no saltar niveles | Navegacion por lectores de pantalla |
| Elementos semanticos | header, nav, main, section, article, aside, footer | Significado inherente |

---

## Sección 2: HTML Semántico y Estructura

---

### 2.1 Elementos Semánticos Utilizados

El HTML semántico es la base de una aplicación web accesible y mantenible. Los elementos semánticos proporcionan significado al contenido y mejoran la experiencia tanto para usuarios con tecnologías de asistencia como para desarrolladores que mantienen el código.

#### header - Encabezado de la Aplicación

Utilizado en el componente app-header para definir el encabezado principal de la aplicación.

Cuándo usar:
- Para el encabezado principal del sitio que contiene logo y navegación
- Para encabezados de secciones cuando contienen información introductoria

Ejemplo de implementación:

```html
<header class="app-header">
  <div class="app-header__container">
    <a href="/" class="app-header__logo" aria-label="Inicio - TecnoMayores">
      <span class="app-header__logo-text">TecnoMayores</span>
    </a>
    <nav class="app-header__nav" aria-label="Navegación principal">
      <ul class="app-header__nav-list">
        <li><a href="/" class="app-header__nav-link">Inicio</a></li>
        <li><a href="/lecciones" class="app-header__nav-link">Lecciones</a></li>
      </ul>
    </nav>
  </div>
</header>
```

Beneficios:
- Los lectores de pantalla identifican automáticamente el encabezado
- Facilita la navegación por puntos de referencia (landmarks)
- Mejora la estructura semántica del documento

#### nav - Navegación

Utilizado para contener bloques de enlaces de navegación. En nuestro proyecto se usa en el header y en el footer.

Cuándo usar:
- Para navegación principal del sitio
- Para navegación secundaria (breadcrumbs, paginación)
- Para enlaces agrupados temáticamente en el footer

Ejemplo de implementación:

```html
<nav class="app-header__nav" aria-label="Navegación principal">
  <ul class="app-header__nav-list">
    <li class="app-header__nav-item">
      <a href="/" class="app-header__nav-link">Inicio</a>
    </li>
    <li class="app-header__nav-item">
      <a href="/lecciones" class="app-header__nav-link">Lecciones</a>
    </li>
  </ul>
</nav>
```

Buenas prácticas:
- Siempre incluir aria-label descriptivo cuando hay múltiples nav en la página
- Usar listas (ul/li) para estructurar los enlaces
- No abusar del elemento: solo para navegación real, no para cualquier grupo de enlaces

#### main - Contenido Principal

El elemento main representa el contenido principal de la aplicación. Solo debe haber un main visible por página.

Cuándo usar:
- Para envolver el contenido único de cada página
- Excluir header, footer y sidebars que se repiten en todas las páginas

Ejemplo de implementación:

```html
<main class="app-main">
  <ng-content></ng-content>
</main>
```

Uso en el componente:

```html
<app-main>
  <h1>Título de la página</h1>
  <p>Contenido principal de esta página específica</p>
</app-main>
```

Beneficios:
- Permite a los lectores de pantalla saltar directamente al contenido principal
- Mejora la navegación por teclado
- Clarifica la estructura del documento

#### article - Contenido Independiente

Utilizado para contenido que tiene sentido por sí mismo y podría distribuirse independientemente.

Cuándo usar:
- Para tarjetas de lecciones individuales
- Para entradas de blog o noticias
- Para contenido que podría ser sindicado (RSS)

Ejemplo de implementación:

```html
<article class="lesson-card">
  <h2 class="lesson-card__title">Introducción al correo electrónico</h2>
  <p class="lesson-card__description">
    Aprende a enviar y recibir correos electrónicos de forma segura.
  </p>
  <footer class="lesson-card__footer">
    <time datetime="2024-01-15">15 de enero de 2024</time>
  </footer>
</article>
```

Criterio de decisión:
- Si el contenido respondería a la pregunta "¿Podría publicarse esto de forma independiente?", usa article
- Si no, considera usar section o div

#### section - Sección Temática

Utilizado para agrupar contenido relacionado temáticamente. Generalmente incluye un encabezado.

Cuándo usar:
- Para agrupar contenido por tema (ej: sección de lecciones, sección de FAQ)
- Para dividir una página larga en partes lógicas
- Cuando el contenido tiene un encabezado natural

Ejemplo de implementación:

```html
<section class="home-section">
  <h2 class="home-section__title">Lecciones Populares</h2>
  <div class="home-section__content">
    <article>...</article>
    <article>...</article>
  </div>
</section>
```

Diferencia con article:
- section agrupa contenido relacionado
- article contiene contenido independiente
- A menudo article se usa dentro de section

#### aside - Contenido Complementario

Utilizado para contenido tangencialmente relacionado con el contenido principal.

Cuándo usar:
- Para barras laterales con filtros
- Para información relacionada pero no esencial
- Para widgets o contenido promocional

Ejemplo de implementación:

```html
<aside class="app-sidebar">
  <h3 class="app-sidebar__title">Filtros</h3>
  <form class="app-sidebar__filters">
    <label>
      <input type="checkbox" name="completed">
      Lecciones completadas
    </label>
  </form>
</aside>
```

Uso recomendado:
- No usar aside para contenido crítico
- Asegurarse de que el contenido principal funciona sin el aside
- Considerar el diseño responsive: el aside puede moverse al final en móvil

#### footer - Pie de Página

Utilizado para el pie de página de la aplicación o de secciones específicas.

Cuándo usar:
- Para el footer principal del sitio con enlaces y copyright
- Para información meta de un article (autor, fecha, tags)

Ejemplo de implementación:

```html
<footer class="app-footer">
  <div class="app-footer__container">
    <section class="app-footer__section">
      <h3 class="app-footer__section-title">Legal</h3>
      <nav aria-label="Enlaces legales">
        <ul>
          <li><a href="/terminos">Términos de servicio</a></li>
          <li><a href="/privacidad">Política de privacidad</a></li>
          <li><a href="/cookies">Política de cookies</a></li>
        </ul>
      </nav>
    </section>
    <div class="app-footer__bottom">
      <p>&copy; 2024 TecnoMayores. Todos los derechos reservados.</p>
    </div>
  </div>
</footer>
```

Buenas prácticas:
- Incluir información de copyright
- Agrupar enlaces por temática usando section
- Considerar la accesibilidad: los footers son landmarks de navegación

---

### 2.2 Jerarquía de Headings

La jerarquía correcta de encabezados es fundamental para la accesibilidad y el SEO. Los usuarios con lectores de pantalla navegan por los encabezados para entender la estructura de la página.

#### Reglas Fundamentales

1. Solo un h1 por página
   - El h1 debe describir el contenido principal único de la página
   - En aplicaciones Angular, cada ruta debería tener su propio h1

2. No saltar niveles
   - Correcto: h1 → h2 → h3
   - Incorrecto: h1 → h3 (se salta el h2)

3. Anidamiento lógico
   - Los h2 son subsecciones del h1
   - Los h3 son subsecciones del h2 anterior
   - Y así sucesivamente

4. No usar headings solo por estilo
   - Si necesitas texto grande pero no es un encabezado, usa clases CSS
   - Los headings tienen significado semántico, no solo visual

#### Estructura de Headings por Tipo de Página

**Página de Inicio**

```
h1: "Bienvenido a TecnoMayores"
├── h2: "Lecciones Destacadas"
│   └── h3: Títulos individuales de lecciones (dentro de cada article)
├── h2: "Cómo Funciona"
│   ├── h3: "Paso 1: Regístrate"
│   ├── h3: "Paso 2: Elige una lección"
│   └── h3: "Paso 3: Practica"
└── h2: "Testimonios"
```

**Página de Lección Individual**

```
h1: "Introducción al Correo Electrónico"
├── h2: "Qué aprenderás"
├── h2: "Contenido de la Lección"
│   ├── h3: "¿Qué es el correo electrónico?"
│   ├── h3: "Partes de un correo"
│   └── h3: "Cómo enviar un correo"
├── h2: "Práctica"
│   ├── h3: "Ejercicio 1"
│   └── h3: "Ejercicio 2"
└── h2: "Recursos Adicionales"
```

**Página de Listado de Lecciones**

```
h1: "Catálogo de Lecciones"
├── h2: "Lecciones de Correo Electrónico"
│   └── h3: Título de cada lección (dentro de article)
├── h2: "Lecciones de Navegación Web"
│   └── h3: Título de cada lección (dentro de article)
└── h2: "Lecciones de Seguridad"
    └── h3: Título de cada lección (dentro de article)
```

#### Implementación en Componentes

**En el layout principal (app.component.html)**

```html
<app-header></app-header>
<app-main>
  <!-- Cada página define su propio h1 -->
  <router-outlet></router-outlet>
</app-main>
<app-footer></app-footer>
```

**En una página específica (home.component.html)**

```html
<h1 class="home__title">Bienvenido a TecnoMayores</h1>

<section class="home__section">
  <h2 class="home__section-title">Lecciones Destacadas</h2>
  <div class="home__cards">
    <article class="lesson-card">
      <h3 class="lesson-card__title">Introducción al Correo</h3>
      <p class="lesson-card__description">...</p>
    </article>
  </div>
</section>

<section class="home__section">
  <h2 class="home__section-title">Cómo Funciona</h2>
  <div class="home__steps">
    <article class="step">
      <h3 class="step__title">Paso 1: Regístrate</h3>
      <p class="step__description">...</p>
    </article>
  </div>
</section>
```

#### Verificación de Jerarquía

Para verificar que la jerarquía es correcta, puedes usar:

1. Extensiones de navegador:
   - HeadingsMap (Chrome/Firefox)
   - WAVE Web Accessibility Evaluation Tool

2. Lectores de pantalla:
   - NVDA (Windows, gratuito)
   - JAWS (Windows, de pago)
   - VoiceOver (macOS/iOS, integrado)

3. Consola del navegador:

```javascript
// Extraer todos los headings de la página
Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  .map(h => `${h.tagName}: ${h.textContent.trim()}`);
```

#### Errores Comunes a Evitar

**Error: Múltiples h1**

```html
<!-- MAL -->
<h1>TecnoMayores</h1>
<main>
  <h1>Bienvenido</h1>
</main>
```

Solución: El logo no debe ser h1, usar h1 solo para el título de la página.

**Error: Saltar niveles**

```html
<!-- MAL -->
<h1>Título principal</h1>
<h3>Subsección</h3> <!-- Se salta el h2 -->
```

Solución: Siempre usar h2 antes de h3.

**Error: Usar headings para estilo**

```html
<!-- MAL -->
<h4 class="small-title">Este texto es pequeño</h4>
```

Solución: Usar clases CSS para estilos, headings solo para estructura.

```html
<!-- BIEN -->
<p class="text--small">Este texto es pequeño</p>
```

---

### 2.3 Estructura de Formularios

Los formularios son uno de los componentes más críticos en términos de accesibilidad. Un formulario bien estructurado permite que todos los usuarios, independientemente de sus capacidades, puedan completarlo con éxito.

#### Componente form-input: Estructura Base

El componente form-input es la base de todos los campos de formulario en la aplicación. Su estructura garantiza accesibilidad y reutilización.

**HTML del componente (form-input.html)**

```html
<div class="form-input">
  <label [for]="inputId" class="form-input__label">
    <span class="form-input__label-text">{{ label }}</span>
    <span *ngIf="required" class="form-input__required-indicator" aria-label="requerido">
      *
    </span>
  </label>

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

  <span *ngIf="hasError && errorMessage" class="form-input__error" [id]="errorId" role="alert">
    {{ errorMessage }}
  </span>

  <span *ngIf="helpText" class="form-input__help" [id]="helpId">
    {{ helpText }}
  </span>
</div>
```

**TypeScript del componente (form-input.ts)**

```typescript
export class FormInput {
  @Input() label: string = '';
  @Input() inputType: string = 'text';
  @Input() inputName: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() value: string = '';
  @Input() errorMessage: string = '';
  @Input() hasError: boolean = false;
  @Input() helpText: string = '';
  
  @Output() valueChange = new EventEmitter<string>();

  inputId: string;
  errorId: string;
  helpId: string;

  constructor() {
    const uniqueId = Math.random().toString(36).substring(2, 11);
    this.inputId = `input-${this.inputName}-${uniqueId}`;
    this.errorId = `error-${this.inputName}-${uniqueId}`;
    this.helpId = `help-${this.inputName}-${uniqueId}`;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
```

#### Asociación Label - Input

La asociación correcta entre label e input es fundamental para la accesibilidad.

**Método 1: Atributos for e id (usado en este proyecto)**

```html
<label for="email" class="form-input__label">
  Correo Electrónico
</label>
<input id="email" type="email" name="email" class="form-input__field">
```

Ventajas:
- Funciona con cualquier estructura HTML
- El label puede estar físicamente separado del input
- Al hacer clic en el label, el focus va al input

**Método 2: Label envolvente (alternativa)**

```html
<label class="form-input__label">
  Correo Electrónico
  <input type="email" name="email" class="form-input__field">
</label>
```

Ventajas:
- No requiere IDs
- Relación implícita
- Más simple para casos básicos

Decisión de diseño: Se utiliza el Método 1 (for/id) porque permite mayor flexibilidad en el diseño y es más explícito, lo cual es mejor para el mantenimiento a largo plazo.

#### Generación de IDs Únicos

En Angular, los componentes pueden instanciarse múltiples veces en la misma página. Para evitar IDs duplicados, se generan IDs únicos en el constructor.

```typescript
constructor() {
  const uniqueId = Math.random().toString(36).substring(2, 11);
  this.inputId = `input-${this.inputName}-${uniqueId}`;
  this.errorId = `error-${this.inputName}-${uniqueId}`;
  this.helpId = `help-${this.inputName}-${uniqueId}`;
}
```

Esto garantiza que cada instancia del componente tenga IDs únicos, evitando conflictos.

#### Indicador de Campo Requerido

Los campos obligatorios se marcan visualmente y semánticamente.

**Indicador visual**

```html
<span *ngIf="required" class="form-input__required-indicator" aria-label="requerido">
  *
</span>
```

**Atributo HTML**

```html
<input [required]="required" ...>
```

Beneficios:
- El asterisco proporciona un indicador visual
- El atributo aria-label da contexto a lectores de pantalla
- El atributo required activa la validación HTML5

#### Mensajes de Error

Los mensajes de error deben ser claros, específicos y accesibles.

**Estructura HTML**

```html
<span *ngIf="hasError && errorMessage" class="form-input__error" [id]="errorId" role="alert">
  {{ errorMessage }}
</span>
```

Características:
- role="alert" anuncia automáticamente el error a lectores de pantalla
- ID único permite referenciarse con aria-describedby
- Solo se muestra cuando hay un error real

#### Texto de Ayuda

El texto de ayuda proporciona contexto adicional para completar el campo.

```html
<span *ngIf="helpText" class="form-input__help" [id]="helpId">
  {{ helpText }}
</span>
```

Ejemplo de uso:

```html
<app-form-input
  label="Contraseña"
  inputType="password"
  helpText="Mínimo 8 caracteres, incluye mayúsculas y números"
  [required]="true">
</app-form-input>
```

Beneficios:
- Reduce errores al proporcionar instrucciones claras
- Mejora la experiencia de usuario
- Ayuda a usuarios con dificultades cognitivas

#### Uso de fieldset y legend

fieldset y legend agrupan campos relacionados y proporcionan contexto semántico.

**Ejemplo del formulario de login**

```html
<form class="login-form__form" [formGroup]="loginFormGroup" (ngSubmit)="onSubmit()">
  <fieldset class="login-form__fieldset">
    <legend class="login-form__legend">Credenciales de Acceso</legend>

    <app-form-input
      label="Correo Electrónico"
      inputType="email"
      inputName="email"
      [required]="true">
    </app-form-input>

    <app-form-input
      label="Contraseña"
      inputType="password"
      inputName="password"
      [required]="true">
    </app-form-input>
  </fieldset>

  <button type="submit" [disabled]="loginFormGroup.invalid">
    Iniciar Sesión
  </button>
</form>
```

**Cuándo usar fieldset/legend**

Usar siempre que:
- Haya un grupo lógico de campos relacionados
- Sea necesario proporcionar contexto grupal
- Se quiera mejorar la navegación por teclado

No usar cuando:
- Solo hay un campo
- Los campos no están realmente relacionados
- Afecte negativamente al diseño (en cuyo caso, usar role="group" y aria-labelledby)

#### Ejemplo Completo: Formulario de Registro

**HTML (register-form.html) - Fragmento**

```html
<form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
  <fieldset class="register-form__section">
    <legend class="register-form__legend">Datos Personales</legend>

    <div class="register-form__field">
      <label for="nombre" class="register-form__label">
        Nombre <span class="required">*</span>
      </label>
      <input
        type="text"
        id="nombre"
        formControlName="nombre"
        class="register-form__input"
        [class.invalid]="nombre?.invalid && nombre?.touched"
        placeholder="Tu nombre">
      <small *ngIf="nombre?.invalid && nombre?.touched" class="register-form__error">
        {{ getErrorMessage('nombre') }}
      </small>
    </div>

    <div class="register-form__field">
      <label for="nif" class="register-form__label">
        NIF <span class="required">*</span>
      </label>
      <input
        type="text"
        id="nif"
        formControlName="nif"
        class="register-form__input"
        [class.invalid]="nif?.invalid && nif?.touched"
        [class.pending]="nif?.pending"
        placeholder="12345678Z"
        maxlength="9">
      <small *ngIf="nif?.pending" class="register-form__hint">
        Verificando NIF...
      </small>
      <small *ngIf="nif?.invalid && nif?.touched && !nif?.pending" class="register-form__error">
        {{ getErrorMessage('nif') }}
      </small>
    </div>
  </fieldset>

  <button type="submit" class="register-form__submit" [disabled]="registerForm.invalid">
    Crear Cuenta
  </button>
</form>
```

**TypeScript (register-form.ts) - Fragmento**

```typescript
export class RegisterForm implements OnInit {
  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      nif: ['', {
        validators: [Validators.required],
        asyncValidators: [this.nifValidator()],
        updateOn: 'blur'
      }]
    });
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('nifInvalid')) {
      return 'NIF inválido o ya registrado';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Formulario válido:', this.registerForm.value);
    }
  }
}
```

#### Validación Síncrona vs Asíncrona

**Validación Síncrona**

Se ejecuta inmediatamente al cambiar el valor.

```typescript
nombre: ['', [Validators.required, Validators.minLength(2)]]
```

Casos de uso:
- Validaciones simples (requerido, longitud, patrón)
- No requiere consulta al servidor
- Respuesta instantánea

**Validación Asíncrona**

Se ejecuta después de validaciones síncronas y puede tardar.

```typescript
nif: ['', {
  validators: [Validators.required],
  asyncValidators: [this.nifValidator()],
  updateOn: 'blur'
}]
```

Casos de uso:
- Verificar disponibilidad de username o email
- Validar NIF contra base de datos
- Cualquier validación que requiera servidor

#### Estados del Formulario

Los formularios reactivos de Angular tienen estados que podemos usar visualmente:

```typescript
registerForm.valid      // Todos los campos son válidos
registerForm.invalid    // Al menos un campo es inválido
registerForm.pending    // Hay validaciones asíncronas en progreso
registerForm.pristine   // El usuario no ha interactuado
registerForm.dirty      // El usuario ha modificado algún campo
registerForm.touched    // El usuario ha entrado y salido de un campo
```

Uso en el template:

```html
<input
  formControlName="email"
  [class.valid]="email?.valid && email?.touched"
  [class.invalid]="email?.invalid && email?.touched"
  [class.pending]="email?.pending">

<button type="submit" [disabled]="registerForm.invalid || registerForm.pending">
  Enviar
</button>
```

#### Mejores Prácticas de Formularios

1. Asociar siempre labels con inputs usando for/id o label envolvente
2. Indicar campos obligatorios visual y semánticamente
3. Proporcionar mensajes de error específicos con role="alert"
4. Validar en el momento adecuado (blur o submit, no mientras se escribe)
5. Deshabilitar el botón de envío cuando el formulario es inválido
6. Agrupar campos relacionados con fieldset/legend
7. Usar placeholders como ejemplo, no como label
8. Considerar el diseño responsive con campos grandes para móviles

---

### 2.4 CSS Custom Properties para Temas

Las CSS Custom Properties (variables CSS nativas) permiten crear temas dinámicos que pueden cambiar en tiempo de ejecución sin recargar la página.

#### Ventajas sobre Variables SCSS

**Variables SCSS**
- Se compilan en tiempo de build
- No pueden cambiar dinámicamente
- Mejor para valores que nunca cambian

```scss
$color-primary: #f8d770;  // Valor fijo en tiempo de compilación
```

**Variables CSS (Custom Properties)**
- Existen en tiempo de ejecución
- Pueden cambiar dinámicamente con JavaScript
- Pueden heredarse en cascada
- Perfectas para temas

```scss
:root {
  --color-primary: #{$color-primary};  // Valor dinámico en tiempo de ejecución
}
```

#### Estructura del Archivo _css-variables.scss

El archivo _css-variables.scss convierte las variables SCSS en variables CSS utilizando la interpolación.

```scss
:root {
  // Colores de fondo
  --bg-primary: #{$color-bg-light};
  --bg-secondary: #{$color-gray-50};
  --bg-tertiary: #{$color-gray-100};

  // Colores de texto
  --text-primary: #{$color-text-dark};
  --text-secondary: #{$color-gray-700};
  --text-tertiary: #{$color-gray-500};

  // Bordes
  --border-color-primary: #{$color-gray-300};
  --border-color-secondary: #{$color-gray-200};

  // Colores de marca
  --color-primary: #{$color-primary};
  --color-secondary: #{$color-secondary};
}
```

La sintaxis `#{$variable}` convierte una variable SCSS en un valor literal para CSS Custom Property.

#### Implementación del Tema Oscuro

El tema oscuro se implementa redefiniendo solo las variables que cambian, manteniendo la coherencia visual.

```scss
.theme-dark {
  // Fondos
  --bg-primary: #2a2420;          // Marrón oscuro
  --bg-secondary: #352e28;        // Marrón más claro
  --bg-tertiary: #403830;         // Marrón aún más claro

  // Textos - invertidos para contraste
  --text-primary: #f5f0eb;        // Casi blanco cálido
  --text-secondary: #d9d0c5;      // Beige claro
  --text-tertiary: #b8a999;       // Beige medio

  // Bordes
  --border-color-primary: #5a4d40;
  --border-color-secondary: #4a4038;

  // Sombras ajustadas para fondos oscuros
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
}
```

Estrategia de colores:
- Los fondos usan tonos marrones oscuros coherentes con la paleta cálida
- Los textos son claros para contraste sobre fondos oscuros
- Las sombras son más pronunciadas (mayor opacidad de negro)
- Los colores de marca (primary, secondary) no cambian para mantener identidad

#### Uso en Componentes

Los componentes utilizan las variables CSS en lugar de variables SCSS:

```scss
.app-header {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color-primary);
}
```

Cuando se cambia el tema, estas variables se actualizan automáticamente sin necesidad de recargar estilos.

#### Implementación del Theme Switcher

**HTML (theme-switcher.html)**

```html
<button
  class="theme-switcher"
  (click)="toggleTheme()"
  [attr.aria-label]="currentTheme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'"
  [attr.title]="currentTheme === 'light' ? 'Modo oscuro' : 'Modo claro'">
  <span class="theme-switcher__icon">
    {{ currentTheme === 'light' ? '🌙' : '☀️' }}
  </span>
</button>
```

**TypeScript (theme-switcher.ts)**

```typescript
export class ThemeSwitcher implements OnInit {
  currentTheme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme as 'light' | 'dark';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.currentTheme = 'dark';
    }
    this.applyTheme();
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    localStorage.setItem('theme', this.currentTheme);
  }

  private applyTheme(): void {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${this.currentTheme}`);
  }
}
```

Características:
- Persiste la preferencia del usuario en localStorage
- Respeta la preferencia del sistema operativo por defecto
- Cambia el tema añadiendo/quitando clases del body

#### Soporte para prefers-color-scheme

El archivo también incluye soporte para la preferencia del sistema operativo:

```scss
@media (prefers-color-scheme: dark) {
  :root:not(.theme-light):not(.theme-dark) {
    --bg-primary: #2a2420;
    --text-primary: #f5f0eb;
    // Solo redefinir variables que cambian
  }
}
```

Esto aplica el tema oscuro automáticamente si el usuario tiene preferencia de modo oscuro en su sistema y no ha seleccionado manualmente un tema.

#### Variables que NO Cambian entre Temas

Algunas variables deben ser consistentes en todos los temas:

```scss
:root {
  // Estas NO se redefinen en .theme-dark
  --color-primary: #{$color-primary};      // Amarillo mantequilla
  --color-secondary: #{$color-secondary};  // Azul eléctrico
  --color-success: #{$color-success};      // Verde
  --color-error: #{$color-error};          // Rojo
  --color-warning: #{$color-warning};      // Naranja
}
```

Razón: Los colores de marca y semánticos deben ser reconocibles en ambos temas.

#### Transiciones Suaves entre Temas

Para que el cambio de tema sea agradable visualmente, los componentes incluyen transiciones:

```scss
.app-main {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
}
```

Esto crea una animación suave cuando cambian los colores.

#### Buenas Prácticas con CSS Custom Properties

1. Nomenclatura descriptiva
   - Usar nombres que describan el propósito, no el valor
   - Correcto: --bg-primary (indica uso)
   - Incorrecto: --color-yellow (indica valor específico)

2. Organizar por categorías
   - Fondos juntos, textos juntos, bordes juntos

3. Usar valores fallback
   - `color: var(--text-primary, #030303);`

4. Documentar las variables
   - Comentarios que expliquen cuándo usar cada variable

5. Testear la accesibilidad en ambos temas
   - Verificar ratios de contraste
   - Probar con lectores de pantalla
   - Validar con herramientas como WAVE o axe DevTools

---

### Resumen de la Sección 2

| Aspecto | Implementación | Justificación |
|---------|----------------|---------------|
| Elementos semánticos | header, nav, main, article, section, aside, footer | Mejora accesibilidad y SEO |
| Jerarquía headings | Un h1 por página, no saltar niveles | Navegación por lectores de pantalla |
| Formularios | fieldset/legend, label asociado con for/id | Estructura semántica clara |
| form-input | Componente reutilizable con validación | DRY, consistencia, accesibilidad |
| Validación | Síncrona y asíncrona con feedback claro | UX mejorada, prevención de errores |
| CSS Custom Properties | Variables dinámicas en :root y .theme-dark | Temas cambiables en tiempo real |
| Theme Switcher | Componente con persistencia en localStorage | Respeta preferencias del usuario |

La correcta implementación de HTML semántico y estructuras accesibles garantiza que la aplicación sea usable para todos los usuarios, independientemente de sus capacidades o tecnologías de asistencia.

