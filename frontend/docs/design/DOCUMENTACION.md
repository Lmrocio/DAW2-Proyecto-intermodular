# Sección 1: Arquitectura CSS y Comunicación Visual

---

## 1.1 Principios de Comunicación Visual

La comunicación visual en esta aplicación sigue 5 principios fundamentales de diseño, especialmente adaptados para usuarios mayores con poca experiencia tecnológica:

### 1. **Jerarquía Visual**

La jerarquía visual guía al usuario a través de la interfaz, indicándole qué elementos son más importantes.

**Cómo se aplica en este proyecto:**

- **Tamaño**: Los títulos principales (h1) usan `$font-size-5xl` (61px) para máxima visibilidad
- **Peso de fuente**: Los títulos usan `$font-weight-semibold` (600) mientras que el texto base usa `$font-weight-regular` (400)
- **Espaciado**: Los títulos tienen `margin-top: $spacing-8` para separarlos visualmente del contenido anterior
- **Color**: El texto principal es muy oscuro (`$color-text-dark: #030303`) para máximo contraste

**Ejemplo:**
```scss
h1 {
  font-size: $font-size-5xl;        // 61px - muy grande
  font-weight: $font-weight-semibold; // 600 - pesado
  margin-top: $spacing-8;           // 32px de separación
  color: $color-text-dark;          // Casi negro
}

p {
  font-size: $font-size-base;       // 16px - normal
  font-weight: $font-weight-regular; // 400 - ligero
  margin-bottom: $spacing-4;        // 16px de separación
}
```

### 2. **Contraste**

El contraste es crítico para usuarios con visión reducida (muy común en mayores de 65 años).

**Cómo se aplica en este proyecto:**

- **Contraste de color**: 
  - Fondo: `$color-bg-light: #fff6df` (amarillo muy claro)
  - Texto oscuro: `$color-text-dark: #030303` (casi negro)
  - Ratio WCAG AA: 13.5:1 ✓ Excelente contraste
  
- **Contraste de tamaño**: Los botones principales tienen `height: $button-height-lg` (48px) vs botones pequeños (32px)

- **Contraste de peso**: Títulos (600-700) vs párrafos (400)

**Colores semánticos con contraste:**
- ✓ Error: `$color-error: #ff0000` (rojo puro - 255,0,0)
- ✓ Éxito: `$color-success: #74eb05` (verde brillante)
- ✓ Advertencia: `$color-warning: #fde800` (amarillo brillante)
- ✓ Info: `$color-info: #00cffd` (azul claro brillante)

### 3. **Alineación**

La alineación crea orden visual y facilita el escaneo de contenido.

**Estrategia de alineación en este proyecto:**

- **Eje vertical**: Contenido alineado al inicio (top), usando flexbox con `align-items: flex-start`
- **Eje horizontal**: Contenido centrado o alineado a la izquierda según contexto
- **Contenedores**: Todos usan clase `.container` que centra con `@include container` mixin

**Ejemplo:**
```scss
.flex {
  @include flex;  // Por defecto: flex-start, stretch, row
}

.container {
  @include container;  // Centrado auto con max-width
  margin-left: auto;
  margin-right: auto;
}
```

### 4. **Proximidad**

Los elementos relacionados se agrupan cerca, creando "unidades visuales" que el ojo percibe como una sola entidad.

**Cómo se aplica en este proyecto:**

- **Espaciado interno (padding)**: `$spacing-4` (16px) para contenido relacionado
- **Espaciado externo (margin)**: `$spacing-6` (24px) entre secciones diferentes
- **Gap entre elementos**: `$gap-md` (16px) para espaciado consistente en grids/flex

**Ejemplo:**
```scss
// Elementos en una tarjeta se agrupan con padding
.card {
  padding: $spacing-4;  // 16px - proximidad alta
}

// Secciones se separan con margin
section + section {
  margin-top: $spacing-6;  // 24px - separación clara
}

// Grid con gap para proximidad entre items
.grid {
  gap: $gap-md;  // 16px entre elementos
}
```

### 5. **Repetición**

La repetición crea cohesión visual y comunica que los elementos están relacionados.

**Patrones repetidos en este proyecto:**

- **Colores primarios**: El amarillo (`$color-primary: #f8d770`) aparece en botones, acentos, y fondos
- **Radio de borde**: Todos los botones y tarjetas usan `$radius-md: 0.5rem` (8px)
- **Sombra**: Todas las elevaciones usan `@include elevation` con sombras predefinidas
- **Tipografía**: Todo usa `$font-primary` consistentemente
- **Transiciones**: Toda interacción usa `@include transition` con misma duración y easing

**Ejemplo:**
```scss
// Repetición de primario
.button--primary { background-color: $color-primary; }
.accent { color: $color-primary; }
.highlight { background-color: rgba($color-primary, 0.1); }

// Repetición de radio
button, .card, input { border-radius: $radius-md; }

// Repetición de tipografía
* { font-family: $font-primary; }

// Repetición de transición
button, a, input { @include transition; }
```

---

## 1.2 Metodología CSS: BEM (Block Element Modifier)

Se utiliza **BEM (Block Element Modifier)** como metodología de nomenclatura CSS. BEM proporciona un sistema escalable y mantenible para nombres de clases.

### ¿Qué es BEM?

- **Block (Bloque)**: Componente independiente y reutilizable
  - Ejemplo: `.card`, `.button`, `.form`
  - Debe ser autodescriptivo
  
- **Element (Elemento)**: Parte del bloque que depende del mismo
  - Sintaxis: `.block__element`
  - Ejemplo: `.card__title`, `.card__description`, `.button__icon`
  
- **Modifier (Modificador)**: Variante o estado del bloque o elemento
  - Sintaxis: `.block--modifier` o `.block__element--modifier`
  - Ejemplo: `.button--primary`, `.button--disabled`, `.card--featured`

### Ejemplos de nomenclatura en este proyecto:

```scss
// BLOCK: componente independiente
.button {
  // Estilos base del botón
}

// ELEMENTS: partes del botón
.button__text {
  // Texto dentro del botón
}

.button__icon {
  // Ícono dentro del botón
}

// MODIFIERS: variantes del botón
.button--primary {
  // Estilo primario (amarillo)
  background-color: $color-primary;
}

.button--secondary {
  // Estilo secundario (naranja)
  background-color: $color-secondary;
}

.button--disabled {
  // Estado desactivado
  opacity: 0.6;
  cursor: not-allowed;
}

.button--large {
  // Tamaño grande
  height: $button-height-lg;
}

// COMBINACIONES
.button--primary:hover {
  // Interacción
}

.button__icon--right {
  // Elemento con modificador
  margin-left: $spacing-2;
}
```

### Ventajas de BEM en este proyecto:

1. **Claridad**: Cualquiera entiende la estructura leyendo los nombres
2. **Escalabilidad**: Fácil agregar nuevos componentes sin conflictos
3. **Mantenibilidad**: Cambios locales no afectan el resto del CSS
4. **Reutilización**: Componentes se pueden mover entre proyectos
5. **Accesibilidad**: Los nombres comunican intención (importante para usuarios mayores que leen fuente)

### Reglas a seguir:

- ✓ `.card` (bloque único, sin guiones)
- ✓ `.card__title` (elemento: doble guión bajo)
- ✓ `.card--featured` (modificador: doble guión)
- ✗ `.card-title` (evitar: guión simple)
- ✗ `.cardTitle` (evitar: camelCase en CSS)
- ✗ `.card_title` (evitar: guión bajo simple)

---

## 1.3 Organización de Archivos: Arquitectura ITCSS

Se utiliza **ITCSS (Inverted Triangle CSS)**, una arquitectura que organiza CSS de menor a mayor especificidad.

### ¿Por qué ITCSS?

ITCSS ayuda a:
- Evitar conflictos de especificidad
- Reutilizar código
- Mantener estilos escalables
- Facilitar el debugging

### Estructura de carpetas:

```
src/styles/
│
├── 00-settings/
│   └── _variables.scss          # Design tokens: colores, tipografía, espaciado
│
├── 01-tools/
│   └── _mixins.scss             # Mixins y funciones reutilizables
│
├── 02-generic/
│   └── _reset.scss              # Reset CSS global y normalización
│
├── 03-elements/
│   └── _elements.scss           # Estilos base de elementos HTML (h1, p, a, etc)
│
├── 04-layout/
│   └── _layout.scss             # Sistemas de grid, flexbox, containers
│
├── 05-components/               # (Futuro) Componentes reutilizables
│   └── _buttons.scss
│   └── _cards.scss
│
├── 06-utilities/                # (Futuro) Clases de utilidad
│   └── _utilities.scss
│
└── styles.scss                  # Archivo principal que importa todo
```

### Explicación de cada nivel (de menor a mayor especificidad):

#### **Nivel 1: Settings (Variables)**
- **Qué es**: Variables SCSS, design tokens, configuración
- **Especificidad**: No genera CSS
- **Objetivo**: Definir valores reutilizables
- **Archivo**: `00-settings/_variables.scss`

```scss
$color-primary: #f8d770;
$spacing-4: 1rem;
$font-size-base: 1rem;
```

#### **Nivel 2: Tools (Mixins)**
- **Qué es**: Funciones y mixins reutilizables
- **Especificidad**: No genera CSS
- **Objetivo**: Herramientas para DRY (Don't Repeat Yourself)
- **Archivo**: `01-tools/_mixins.scss`

```scss
@mixin flex($justify, $align, $direction) { ... }
@mixin respond-to($breakpoint) { ... }
```

#### **Nivel 3: Generic (Reset)**
- **Qué es**: Reset CSS, normalización global
- **Especificidad**: Muy baja (selectores universales)
- **Objetivo**: Normalizar comportamiento entre navegadores
- **Archivo**: `02-generic/_reset.scss`

```scss
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: $font-primary; }
```

#### **Nivel 4: Elements (Base)**
- **Qué es**: Estilos de elementos HTML sin clases
- **Especificidad**: Baja (selectores de elemento)
- **Objetivo**: Proporcionar base consistente
- **Archivo**: `03-elements/_elements.scss`

```scss
h1 { font-size: $font-size-5xl; }
a { color: $color-accent; @include transition; }
button { @include button-accessible(lg); }
```

#### **Nivel 5: Layout**
- **Qué es**: Sistemas de layout, grid, flexbox
- **Especificidad**: Media (clases simples como `.container`, `.grid`)
- **Objetivo**: Estructuras reutilizables para layouts
- **Archivo**: `04-layout/_layout.scss`

```scss
.container { @include container; }
.grid { @include grid(3, $gap-md); }
.flex { @include flex; }
```

#### **Nivel 6: Components (Futuro)**
- **Qué es**: Componentes específicos (botones, tarjetas, etc)
- **Especificidad**: Media (clases con metodología BEM)
- **Objetivo**: Bloques reutilizables
- **Nota**: En Angular, generalmente van en los componentes individuales

```scss
.card { ... }
.button { ... }
.modal { ... }
```

#### **Nivel 7: Utilities (Futuro)**
- **Qué es**: Clases de utilidad para casos específicos
- **Especificidad**: Media-Alta (clases pequeñas, pueden tener !important)
- **Objetivo**: Sobrescribir estilos en casos específicos
- **Nota**: Usar con moderación

```scss
.text-center { text-align: center; }
.m-4 { margin: $spacing-4; }
```

### Orden de importación en styles.scss:

```scss
// CRÍTICO: Este orden no debe cambiarse
@import '00-settings/variables';      // 1. Variables primero
@import '01-tools/mixins';            // 2. Mixins segundo
@import '02-generic/reset';           // 3. Reset tercero
@import '03-elements/elements';       // 4. Elementos base
@import '04-layout/layout';           // 5. Layouts
// @import '05-components/components'; // 6. (Futuro) Componentes
// @import '06-utilities/utilities';   // 7. (Futuro) Utilities
```

### Ventajas de ITCSS:

1. **Escalabilidad**: Se puede agregar código sin romper lo existente
2. **Mantenibilidad**: Cualquiera entiende dónde poner estilos nuevos
3. **Performance**: Especificidad baja = menos conflictos CSS
4. **Debugging**: Fácil de rastrear problemas
5. **Reutilización**: Mixins y variables evitan duplicación

---

## 1.4 Sistema de Design Tokens

Los design tokens son variables SCSS que definen todos los valores visuales del proyecto. Son la "únnica fuente de verdad" para colores, tipografía, espaciado, etc.

### Filosofía

En lugar de escribir valores directamente en CSS:
```scss
// ✗ MAL - Valores hardcoded
.button { background-color: #f8d770; padding: 16px; }
```

Se usan variables reutilizables:
```scss
// ✓ BIEN - Usa tokens
.button { background-color: $color-primary; padding: $spacing-4; }
```

### Grupos de Design Tokens

#### **1. Colores**

**Colores de marca (primarios, secundarios, etc):**
```scss
$color-primary: #f8d770;      // Amarillo - color principal
$color-secondary: #ffb842;    // Naranja - apoyo
$color-tertiary: #f3742b;     // Naranja oscuro - acentos adicionales
$color-accent: #0454b1;       // Azul - interacción, enlaces
```

**Decisión de diseño**: Se eligieron colores cálidos (amarillo, naranja) como primarios porque:
- Transmiten energía y positividad (importante para mayores que pueden sentirse inseguros)
- Tienen excelente contraste con fondo claro
- Son colores amigables y no amenazantes

**Colores semánticos:**
```scss
$color-success: #74eb05;      // Verde - operaciones exitosas
$color-error: #ff0000;        // Rojo - errores, advertencias serias
$color-warning: #fde800;      // Amarillo - advertencias moderadas
$color-info: #00cffd;         // Azul - información, sugerencias
```

**Colores de fondo y texto:**
```scss
$color-bg-light: #fff6df;     // Fondo principal (amarillo muy claro)
$color-text-dark: #030303;    // Texto oscuro (casi negro)
$color-text-light: #fdfdfd;   // Texto claro (casi blanco)
```

**Escala de grises neutrales:**
```scss
// Gradación del 50 (más claro) al 900 (más oscuro)
$color-gray-50:  #fafafa;     // Prácticamente blanco
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

#### **2. Tipografía**

**Familias de fuentes:**
```scss
// Font-stack seguro (funciona offline)
$font-primary: -apple-system, blinkmacsystemfont, 'Segoe UI', 
               roboto, 'Helvetica Neue', arial, sans-serif;
$font-secondary: 'Georgia', 'Times New Roman', serif;
$font-mono: 'Fira Code', 'Courier New', monospace;
```

**Decisión de diseño**: Se usan fuentes del sistema porque:
- Cargan al instante (no requieren descargar)
- Están optimizadas para cada SO
- Mejor rendimiento en dispositivos móviles (importante para mayores)

**Tamaños (escala modular con ratio 1.25):**
```scss
$font-size-xs:    0.75rem;        // 12px - etiquetas pequeñas
$font-size-sm:    0.875rem;       // 14px - texto pequeño
$font-size-base:  1rem;           // 16px - tamaño base (recomendado WCAG)
$font-size-lg:    1.25rem;        // 20px - párrafos principales
$font-size-xl:    1.5625rem;      // 25px - subtítulos
$font-size-2xl:   1.95313rem;     // 31px - títulos
$font-size-3xl:   2.44141rem;     // 39px - títulos grandes
$font-size-4xl:   3.05176rem;     // 49px - títulos muy grandes
$font-size-5xl:   3.81470rem;     // 61px - títulos gigantes
```

**Decisión de diseño**: 
- Base en 16px (WCAG AA recomienda mínimo 12px, 16px es óptimo para legibilidad)
- Escala 1.25 proporciona progresión clara pero no extrema
- Tamaños máximos (4xl, 5xl) para títulos principales accesibles

**Pesos:**
```scss
$font-weight-light:     300;  // Raramente usado
$font-weight-regular:   400;  // Texto normal
$font-weight-medium:    500;  // Sutilmente enfatizado
$font-weight-semibold:  600;  // Títulos, énfasis fuerte
$font-weight-bold:      700;  // Énfasis máximo
```

**Alturas de línea:**
```scss
$line-height-tight:    1.2;      // Títulos - compacto
$line-height-normal:   1.5;      // Párrafos - estándar WCAG
$line-height-relaxed:  1.75;     // Textos largos - más espaciado
$line-height-loose:    2;        // Muy espaciado (para accesibilidad)
```

**Decisión de diseño**: 
- 1.5 es el estándar WCAG para legibilidad
- Títulos usan 1.2 para compactación visual
- Textos largos usan 1.75+ para reducir fatiga visual (importante para mayores)

#### **3. Espaciado**

```scss
// Escala base: 4px (múltiplos de 0.25rem)
$spacing-1:  0.25rem;     // 4px
$spacing-2:  0.5rem;      // 8px
$spacing-3:  0.75rem;     // 12px
$spacing-4:  1rem;        // 16px - espaciado estándar
$spacing-5:  1.25rem;     // 20px
$spacing-6:  1.5rem;      // 24px
$spacing-8:  2rem;        // 32px - separaciones grandes
$spacing-12: 3rem;        // 48px - muy grande
$spacing-16: 4rem;        // 64px - secciones
// ... hasta $spacing-40: 10rem (160px)
```

**Decisión de diseño**:
- Base en 4px mantiene alineación de pixel perfecto
- Números pares (1,2,3,4,6,8...) = predictible y fácil de recordar
- Valores grandes ($spacing-16+) para separaciones de secciones
- Múltiplos de 4 facilitan cálculos mentales

#### **4. Breakpoints**

```scss
$breakpoint-sm:   640px;    // Móvil grande
$breakpoint-md:   768px;    // Tablet
$breakpoint-lg:   1024px;   // Desktop
$breakpoint-xl:   1280px;   // Desktop grande
$breakpoint-2xl:  1536px;   // Desktop muy grande
```

**Uso con mixin:**
```scss
@include respond-to(lg) {
  // Estilos solo para desktop
}
```

**Decisión de diseño**:
- Mobile-first: estilos para móvil primero, luego agregar para pantallas grandes
- 768px es ancho tablet común (iPad)
- 1024px es ancho desktop mínimo
- Espacios de 256px = margen suficiente para cambios significativos

#### **5. Sombras**

```scss
$shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

**Uso:**
```scss
.card { @include elevation(md); }  // Aplica $shadow-md
```

**Decisión de diseño**:
- Usa rgba para opacidad (funciona en cualquier fondo)
- Intensidad progresiva crea profundidad visual
- Importante para "botones destacados" (Ley de Jakob)

#### **6. Bordes y Radios**

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
$radius-full:  9999px;      // Círculo perfecto
```

**Decisión de diseño**:
- $radius-md (8px) es el "estándar" para botones y tarjetas
- Ofrece suficiente redondeamiento sin ser extremo
- $radius-full para avatares y elementos circulares

#### **7. Transiciones**

```scss
$transition-fast:  150ms;    // Hover, pequeños cambios
$transition-base:  300ms;    // Defecto para la mayoría
$transition-slow:  500ms;    // Cambios complejos

// Easing functions
$easing-in-out:    cubic-bezier(0.4, 0, 0.2, 1);
$easing-out:       cubic-bezier(0.0, 0, 0.2, 1);
$easing-in:        cubic-bezier(0.4, 0, 1, 1);
```

**Decisión de diseño**:
- $transition-base (300ms) es óptimo: perceptible pero no lento
- in-out es más "natural" que linear
- Importante para accesibilidad: incluir `@media (prefers-reduced-motion: reduce)`

#### **8. Tamaños Especiales**

```scss
// Tamaños de botón (altura mínima WCAG AAA)
$button-height-sm:   2rem;        // 32px
$button-height-md:   2.5rem;      // 40px
$button-height-lg:   3rem;        // 48px - RECOMENDADO
$button-height-xl:   3.5rem;      // 56px - máxima accesibilidad

// Z-index para capas
$z-dropdown:        1000;
$z-modal-backdrop:  1300;
$z-modal:           1400;
$z-notification:    1700;
```

**Decisión de diseño**:
- 48px mínimo (Ley de Fitts): reduce errores de toque en móvil
- Z-index con espacios de 100 = flexibilidad para nuevas capas
- Importante para mayores: botones grandes = menos frustración

### Cómo usar Design Tokens

**Regla fundamental: NUNCA hardcodear valores**

```scss
// ✗ MAL
.button { background-color: #f8d770; padding: 16px; margin: 20px; }

// ✓ BIEN
.button { 
  background-color: $color-primary; 
  padding: $spacing-4; 
  margin: $spacing-5; 
}
```

### Ventajas de Design Tokens

1. **Mantenibilidad**: Cambiar color en un lugar = cambio global
2. **Consistencia**: Todos usan los mismos valores
3. **Accesibilidad**: Tokens se crean pensando en WCAG
4. **Escalabilidad**: Fácil agregar nuevos tokens
5. **Documentación**: El nombre del token comunica intención

---

## 1.5 Mixins y Funciones Reutilizables

Los mixins son fragmentos de código SCSS reutilizables que eliminan repetición y mantienen consistencia.

### Mixins Principales

#### **1. Responsive Media Queries**

```scss
// Uso
@include respond-to(lg) {
  .container { width: 1000px; }
}

// Genera
@media (min-width: 1024px) {
  .container { width: 1000px; }
}
```

**Ventajas**: No hay que recordar los valores de breakpoint, nomenclatura consistente.

#### **2. Flexbox Simplificado**

```scss
// Usa
.hero { @include flex(center, center, column); }

// Genera
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
```

**Parámetros**:
- `$justify`: flex-start, flex-end, center, space-between, space-around
- `$align`: flex-start, flex-end, center, baseline, stretch
- `$direction`: row, column, row-reverse, column-reverse

#### **3. Grid Simplificado**

```scss
// Usa
.cards { @include grid(3, $spacing-4); }

// Genera
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-4;
}
```

#### **4. Transiciones Estándar**

```scss
// Usa
button { @include transition(color, $transition-fast); }

// Genera
button { transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1); }
```

#### **5. Sombras (Elevación)**

```scss
// Usa
.card { @include elevation(lg); }

// Genera
.card { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
```

#### **6. Focus Visible (Accesibilidad)**

```scss
// Usa
a { @include focus-visible; }

// Genera (cuando se enfoca por teclado)
a:focus-visible {
  outline: 2px solid $color-accent;
  outline-offset: 2px;
  box-shadow: $shadow-focus;
}
```

**Importante para accesibilidad**: Proporciona borde visible en navegación por teclado.

#### **7. Truncate de Texto**

```scss
// Una línea
.title { @include truncate(); }

// Múltiples líneas
.description { @include truncate(3); }
```

**Genera**:
```scss
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

#### **8. Botones Accesibles**

```scss
// Usa
button { @include button-accessible(lg); }

// Genera
button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 48px;      // $button-height-lg
  min-width: 48px;   // Área mínima WCAG AAA
  padding: 0 24px;   // $spacing-6
  border-radius: 8px; // $radius-md
  cursor: pointer;
  // ... más estilos
}
```

**Importante**: Tamaño mínimo 48x48px recomendado por WCAG AAA.

#### **9. Screen Reader Only (sr-only)**

```scss
// Usa
.skip-nav { @include sr-only; }

// Genera
.skip-nav {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  // ... más estilos para ocultar visualmente
  // Pero mantiene accesibilidad para lectores de pantalla
}
```

#### **10. Prefers Reduced Motion**

```scss
// Usa
.animation {
  animation: slide 300ms;
  
  @include reduced-motion {
    animation: none;
  }
}

// Respeta preferencia de usuarios con movilidad limitada
```

#### **11. Container Centrado**

```scss
// Usa
.wrapper { @include container; }

// Genera
.wrapper {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;    // Responsive
  padding-right: 16px;
}
```

### Combinación de Mixins

Los mixins se pueden combinar para crear componentes complejos rápidamente:

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

### Reglas para usar Mixins

1. **Usa mixins para DRY**: Si escribes el mismo CSS 2+ veces, crea un mixin
2. **Nombra claramente**: El nombre debe indicar qué hace
3. **Documenta parámetros**: Especifica qué parámetros acepta
4. **Evita nesting profundo**: Máximo 3 niveles
5. **Reutiliza mixins existentes**: Antes de crear uno nuevo

---

## 1.6 ViewEncapsulation en Angular

Angular proporciona diferentes estrategias de encapsulación de estilos para componentes.

### Opciones de ViewEncapsulation

#### **1. Emulated (Por defecto)**

```typescript
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button>Click</button>`,
  styles: [`.button { color: blue; }`],
  encapsulation: ViewEncapsulation.Emulated  // Por defecto
})
export class ButtonComponent {}
```

**Qué hace**: 
- Angular agrega atributos único a cada elemento
- Los estilos solo afectan ese componente
- Simula shadow DOM sin usar Shadow DOM real

**Generado en HTML**:
```html
<app-button _ngcontent-ng-c12345>
  <button _ngcontent-ng-c12345>Click</button>
</app-button>
```

**Ventajas**:
- ✓ Aislamiento: estilos no se filtran entre componentes
- ✓ Compatible con todos los navegadores
- ✓ Rendimiento predecible

**Desventajas**:
- ✗ No se comparte CSS entre componentes fácilmente
- ✗ Código CSS duplicado si muchos componentes usan estilos similares

#### **2. None (Estilos globales)**

```typescript
@Component({
  selector: 'app-button',
  template: `<button class="btn">Click</button>`,
  styles: [`.btn { color: blue; }`],
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {}
```

**Qué hace**:
- Los estilos se aplican globalmente
- No hay encapsulación
- Cualquier componente puede acceder al CSS

**Ventajas**:
- ✓ Reutilización de CSS
- ✓ Menos duplicación
- ✓ Más control global

**Desventajas**:
- ✗ Conflictos entre componentes
- ✗ Nombres de clase pueden sobreescribirse

#### **3. ShadowDom (Shadow DOM real)**

```typescript
@Component({
  selector: 'app-button',
  template: `<button>Click</button>`,
  styles: [`.button { color: blue; }`],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ButtonComponent {}
```

**Qué hace**:
- Usa Shadow DOM real (HTML5)
- Aislamiento completo
- Mejor rendimiento en algunos casos

**Desventajas**:
- ✗ No compatible con IE11 (si es necesario)
- ✗ Variables CSS no se heredan bien
- ✗ Más complejo de debuggear

### Estrategia Elegida: ViewEncapsulation.Emulated

**Recomendación**: Usar **ViewEncapsulation.Emulated** (por defecto) por estas razones:

1. **Compatibilidad**: Funciona en todos los navegadores
2. **Mantenibilidad**: Los estilos de cada componente están claros
3. **Globalidad**: Los design tokens en `styles.scss` se heredan
4. **Accesibilidad**: Variables CSS globales funcionan bien

### Cómo escribir estilos en componentes

**Enfoque 1: Archivo CSS separado**

```typescript
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],  // Archivo separado
  encapsulation: ViewEncapsulation.Emulated
})
export class CardComponent {}
```

**card.component.scss**:
```scss
// Acceso a variables globales
.card {
  padding: $spacing-4;          // ✓ Funciona (desde styles.scss)
  border-radius: $radius-md;    // ✓ Funciona
  @include elevation(md);       // ✓ Funciona
}
```

**Ventajas**:
- ✓ Código organizado
- ✓ Fácil de mantener
- ✓ Reutilizar componentes en otros proyectos

**Enfoque 2: CSS inline**

```typescript
@Component({
  selector: 'app-button',
  template: `<button>Click</button>`,
  styles: [`
    button {
      background-color: var(--color-primary);  // CSS variable
      padding: 16px;
      border-radius: 8px;
    }
  `]
})
export class ButtonComponent {}
```

**Desventajas**:
- ✗ Menos legible
- ✗ Difícil de mantener con mucho CSS
- ✓ Útil para componentes muy pequeños

### Acceso a Variables desde Componentes

Las variables SCSS definidas en `styles.scss` están disponibles en todos los componentes:

```scss
// styles.scss define
$color-primary: #f8d770;
$spacing-4: 1rem;

// component.scss puede usar
.button {
  background-color: $color-primary;  // ✓ Funciona
  padding: $spacing-4;               // ✓ Funciona
}
```

**Importante**: No necesita importar, están disponibles automáticamente.

### Jerarquía de especificidad en Angular

```
1. Estilos globales (styles.scss)        - Especificidad baja
2. Estilos de componente                 - Especificidad media
3. Estilos inline (style="...")          - Especificidad alta
4. !important                            - Especificidad máxima
```

**Regla**: Usar siempre styles.scss para valores base, estilos de componente solo para variaciones.

### Variables CSS (CSS Custom Properties)

Se pueden usar variables CSS para temas dinámicos:

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

**Ventaja**: Se pueden cambiar en tiempo de ejecución con JavaScript.

---

## Resumen de Decisiones Arquitectónicas

| Aspecto | Decisión | Razón |
|---------|----------|-------|
| **Arquitectura CSS** | ITCSS | Escalabilidad, mantenibilidad |
| **Metodología de nombrado** | BEM | Claridad, prevención de conflictos |
| **Organización** | 6 niveles ITCSS | Especificidad creciente |
| **Tipografía base** | 16px | WCAG AA (legibilidad óptima) |
| **Tamaño botón mínimo** | 48px | WCAG AAA (accesibilidad) |
| **Breakpoints** | 5 puntos | Cobertura tablet a desktop grande |
| **ViewEncapsulation** | Emulated | Compatibilidad + aislamiento |
| **Color primario** | Amarillo #f8d770 | Cálido, accesible, positivo |
| **Línea altura base** | 1.5 | WCAG recomendado |

---

# Sección 2: HTML Semántico y Estructura

---

## 2.1 Elementos Semánticos Utilizados

El HTML semántico utiliza elementos que tienen significado inherente, no solo visual. Esto es especialmente importante para usuarios que utilizan lectores de pantalla (screen readers) - una tecnología muy utilizada por usuarios mayores con problemas de visión.

### Elementos Semánticos Principales

#### **&lt;header&gt;** - Encabezado de la aplicación

**Propósito**: Contiene el logo, navegación principal y elementos de utilidad (búsqueda, usuario, accesibilidad).

**Cuándo usarlo**: En el componente `app-header`, debe aparecer al inicio de cada página.

**Ejemplo**:

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

**Impacto en accesibilidad**: Los lectores de pantalla reconocen automáticamente que el header es el inicio de la página.

---

#### **&lt;nav&gt;** - Navegación

**Propósito**: Agrupa enlaces de navegación. Hay dos tipos en nuestro proyecto:
1. Navegación principal (en el header)
2. Navegación secundaria (footer)

**Cuándo usarlo**: Cuando agrupes múltiples enlaces para navegación.

**Ejemplo en nuestro proyecto**:

```html
<!-- Navegación principal -->
<nav class="app-header__nav" aria-label="Navegación principal">
  <ul class="app-header__nav-list">
    <li><a href="/lecciones">Lecciones</a></li>
    <li><a href="/simuladores">Simuladores</a></li>
  </ul>
</nav>

<!-- Navegación en footer -->
<nav class="app-footer__nav" aria-label="Enlaces del footer">
  <ul class="app-footer__nav-list">
    <li><a href="/">Inicio</a></li>
    <li><a href="/lecciones">Lecciones</a></li>
  </ul>
</nav>
```

**Atributo aria-label**: Proporciona una etiqueta descriptiva para usuarios de lectores de pantalla. Permite diferenciar entre múltiples &lt;nav&gt; en la misma página.

**Impacto en accesibilidad**: Los usuarios de lectores de pantalla pueden saltarse directamente a la navegación o saber de qué se trata.

---

#### **&lt;main&gt;** - Contenido Principal

**Propósito**: Contiene el contenido principal único de la página (no incluye headers, footers, sidebars).

**Cuándo usarlo**: Una vez por página, como contenedor principal (componente `app-main`).

**Ejemplo en nuestro proyecto**:

```html
<main class="app-main">
  <!-- Aquí va el contenido único de cada página -->
  <ng-content></ng-content>
</main>
```

**Impacto en accesibilidad**: Los lectores de pantalla pueden saltar directamente al contenido principal sin tener que leer el header.

---

#### **&lt;aside&gt;** - Contenido Secundario

**Propósito**: Contenido tangencialmente relacionado (sidebar con filtros, widgets, navegación secundaria).

**Cuándo usarlo**: Componente `app-sidebar` - para contenido adicional pero no esencial.

**Ejemplo en nuestro proyecto**:

```html
<aside class="app-sidebar">
  <!-- Filtros, widgets, navegación secundaria -->
  <ng-content></ng-content>
</aside>
```

**Impacto en accesibilidad**: Los usuarios saben que este contenido es secundario y pueden optar por saltárselo.

---

#### **&lt;footer&gt;** - Pie de Página

**Propósito**: Contiene información de la aplicación, enlaces legales, redes sociales, copyright.

**Cuándo usarlo**: Una vez por página, al final (componente `app-footer`).

**Ejemplo en nuestro proyecto**:

```html
<footer class="app-footer">
  <div class="app-footer__container">
    <!-- Secciones del footer -->
    <section class="app-footer__section">
      <h2 class="app-footer__section-title">TecnoMayores</h2>
      <p>Descripción...</p>
    </section>
    
    <section class="app-footer__section">
      <h3 class="app-footer__section-title">Enlaces Rápidos</h3>
      <nav><ul><!-- enlaces --></ul></nav>
    </section>
  </div>
</footer>
```

**Impacto en accesibilidad**: Los usuarios saben que están al final de la página y pueden acceder rápidamente a información legal.

---

#### **&lt;section&gt;** - Secciones de Contenido

**Propósito**: Agrupa contenido relacionado temáticamente.

**Cuándo usarlo**: Cuando agrupes párrafos, listas, o contenido relacionado en un tema.

**Ejemplo en nuestro proyecto**:

```html
<!-- En el footer, agrupamos secciones temáticas -->
<section class="app-footer__section">
  <h3 class="app-footer__section-title">Enlaces Legales</h3>
  <nav>
    <ul>
      <li><a href="/terminos">Términos de servicio</a></li>
      <li><a href="/privacidad">Política de privacidad</a></li>
    </ul>
  </nav>
</section>
```

**Impacto en accesibilidad**: Las secciones comunican al navegador la estructura temática del contenido.

---

#### **&lt;article&gt;** - Artículos Independientes

**Propósito**: Contenido independiente y reutilizable (blog post, lección, comentario).

**Cuándo usarlo**: Cuando el contenido podría existir independientemente del resto de la página.

**Ejemplo (futuro, en listado de lecciones)**:

```html
<article class="lesson-card">
  <header class="lesson-card__header">
    <h2 class="lesson-card__title">Cómo enviar un email</h2>
  </header>
  <p class="lesson-card__description">Aprende paso a paso cómo enviar tu primer email...</p>
  <footer class="lesson-card__footer">
    <span class="lesson-card__duration">5 minutos</span>
  </footer>
</article>
```

---

### Estructura Jerárquica Completa

```
<body>
  ├── <header>              <!-- Encabezado con navegación -->
  ├── <main>                <!-- Contenido principal único -->
  │   ├── <section>         <!-- Secciones de contenido -->
  │   │   ├── <article>     <!-- Artículos individuales -->
  │   │   └── <form>        <!-- Formularios -->
  │   └── <aside>           <!-- Contenido secundario (opcional) -->
  └── <footer>              <!-- Pie de página -->
```

---

## 2.2 Jerarquía de Headings (Encabezados)

Los headings (h1-h6) son extremadamente importantes para accesibilidad. Los lectores de pantalla utilizan los headings para navegar por la página.

### Reglas de Jerarquía

1. **Un solo H1 por página** - Representa el título principal de la página
2. **No saltar niveles** - Pasar de H1 a H3 es confuso
3. **H2 para secciones principales** - Divisiones mayores de contenido
4. **H3 para subsecciones** - Subdivisiones dentro de H2
5. **H4-H6 son raros** - Úsalos solo si tienes mucha profundidad

### Diagrama de Jerarquía en Aplicación

```
H1: "Lecciones" (título de la página)
  ├── H2: "Dispositivos Móviles" (categoría)
  │   ├── H3: "Cómo encender el móvil" (lección)
  │   ├── H3: "Cómo hacer una llamada" (lección)
  │   └── H3: "Cómo enviar un mensaje" (lección)
  │
  ├── H2: "Redes Sociales" (categoría)
  │   ├── H3: "Facebook Básico" (lección)
  │   ├── H3: "WhatsApp Básico" (lección)
  │   └── H3: "Llamadas de Video" (lección)
  │
  └── H2: "Seguridad en Internet" (categoría)
      ├── H3: "Contraseñas seguras" (lección)
      └── H3: "Reconocer estafas" (lección)
```

### Implementación en Nuestro Proyecto

**Página de inicio** (inicio.component.html):
```html
<main class="app-main">
  <h1>Bienvenido a TecnoMayores</h1>
  
  <section>
    <h2>Aprende a tu ritmo</h2>
    <p>Elige una lección y comienza...</p>
  </section>
  
  <section>
    <h2>Lecciones Populares</h2>
    <article>
      <h3>Cómo enviar un email</h3>
      <p>Aprende los pasos básicos...</p>
    </article>
  </section>
</main>
```

**Página de listado de lecciones** (lecciones.component.html):
```html
<main class="app-main">
  <h1>Todas las Lecciones</h1>
  
  <section>
    <h2>Dispositivos Móviles</h2>
    <ul class="lesson-list">
      <li>
        <article class="lesson-card">
          <h3>Encender y apagar el móvil</h3>
          <p>Aprende los primeros pasos...</p>
        </article>
      </li>
    </ul>
  </section>
</main>
```

### Errores Comunes a Evitar

```html
<!-- ❌ MALO: Salta de H1 a H3 -->
<h1>Mi Página</h1>
<h3>Subtítulo</h3>  <!-- Debería ser H2 -->

<!-- ❌ MALO: Múltiples H1 en la misma página -->
<h1>Título Principal</h1>
<section>
  <h1>Otra sección</h1>  <!-- Solo debe haber un H1 -->
</section>

<!-- ✅ CORRECTO: Jerarquía apropiada -->
<h1>Título Principal</h1>
<section>
  <h2>Sección 1</h2>
  <h3>Subsección 1.1</h3>
</section>
<section>
  <h2>Sección 2</h2>
</section>
```

---

## 2.3 Estructura de Formularios

Los formularios son críticos en esta aplicación (login, registro, contacto). Una estructura semántica adecuada es esencial para accesibilidad.

### Elementos Clave

#### **&lt;form&gt;** - Contenedor del Formulario

```html
<form method="POST" action="/login" class="login-form__form">
  <!-- Campos del formulario aquí -->
</form>
```

**Atributos importantes**:
- `method`: GET (para búsquedas) o POST (para datos sensibles)
- `action`: URL a donde se envía el formulario
- `novalidate`: Si usas validación con JavaScript (como en Angular)

---

#### **&lt;fieldset&gt;** - Agrupa Campos Relacionados

**Propósito**: Agrupar campos relacionados temáticamente.

**Cuándo usarlo**: 
- Credenciales de login (email + password)
- Información personal (nombre + apellido + edad)
- Opciones de configuración

```html
<fieldset class="login-form__fieldset">
  <legend class="login-form__legend">Credenciales de Acceso</legend>
  
  <!-- Campos email y password aquí -->
</fieldset>

<fieldset class="login-form__fieldset">
  <legend class="login-form__legend">Recuerda Tu Cuenta</legend>
  
  <!-- Checkbox de "recuerda mis datos" aquí -->
</fieldset>
```

---

#### **&lt;legend&gt;** - Describe el Fieldset

**Propósito**: Proporciona una etiqueta para el &lt;fieldset&gt;.

**Impacto en accesibilidad**: Los lectores de pantalla leen la leyenda al entrar en un fieldset.

```html
<fieldset>
  <legend>Información Personal</legend>
  <!-- Los campos saben que pertenecen a "Información Personal" -->
</fieldset>
```

---

#### **&lt;label&gt;** - Etiqueta de Campo

**Propósito**: Asocia texto descriptivo con un campo de input.

**Dos formas de asociar (ambas válidas)**:

**Opción 1: Atributos for/id (recomendado)**
```html
<label for="email-input">Correo Electrónico</label>
<input id="email-input" type="email" name="email">
```

**Opción 2: Label envuelve el input**
```html
<label>
  Correo Electrónico
  <input type="email" name="email">
</label>
```

**En nuestro proyecto usamos Opción 1** en el componente `form-input`:

```html
<label [for]="inputId" class="form-input__label">
  <span class="form-input__label-text">{{ label }}</span>
  <span *ngIf="required" class="form-input__required-indicator">*</span>
</label>

<input [id]="inputId" [type]="inputType" ...>
```

**Impacto en accesibilidad**: 
- Los usuarios saben qué campo es cuál
- Hacer clic en el label enfoca el input
- El área clickeable es más grande

---

### Componente FormInput - Estructura Completa

Nuestro componente `app-form-input` implementa un campo de formulario accesible y reutilizable:

```html
<!-- COMPONENTE FORM-INPUT -->
<div class="form-input">
  
  <!-- 1. LABEL con indicador de requerido -->
  <label [for]="inputId" class="form-input__label">
    <span class="form-input__label-text">{{ label }}</span>
    <span *ngIf="required" class="form-input__required-indicator">*</span>
  </label>

  <!-- 2. INPUT con validación -->
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

**Características de accesibilidad**:
- Label asociado con `for`/`id`
- Indicador visual de requerido (asterisco)
- Mensaje de error con `role="alert"` para lectores de pantalla
- Texto de ayuda para instrucciones adicionales

---

### Componente LoginForm - Estructura Completa

```html
<form class="login-form__form" [formGroup]="loginFormGroup" (ngSubmit)="onSubmit()">
  
  <!-- FIELDSET 1: Credenciales -->
  <fieldset class="login-form__fieldset">
    <legend class="login-form__legend">Credenciales de Acceso</legend>
    
    <app-form-input
      [label]="'Correo Electrónico'"
      [inputType]="'email'"
      [inputName]="'email'"
      [required]="true"
      [errorMessage]="getEmailErrorMessage()"
      [hasError]="isFieldInvalid('email')"
      [helpText]="'Introduce tu correo electrónico registrado'"
      (valueChange)="onEmailChange($event)">
    </app-form-input>

    <app-form-input
      [label]="'Contraseña'"
      [inputType]="'password'"
      [inputName]="'password'"
      [required]="true"
      [errorMessage]="'La contraseña es obligatoria'"
      [hasError]="isFieldInvalid('password')"
      [helpText]="'Contraseña de al menos 8 caracteres'"
      (valueChange)="onPasswordChange($event)">
    </app-form-input>
  </fieldset>

  <!-- FIELDSET 2: Opciones adicionales -->
  <fieldset class="login-form__fieldset">
    <legend class="login-form__legend">Recuerda Tu Cuenta</legend>
    
    <label class="login-form__checkbox">
      <input type="checkbox" formControlName="rememberMe">
      <span>Recuerda mis datos en este dispositivo</span>
    </label>
  </fieldset>

  <!-- BOTÓN DE ENVÍO -->
  <button type="submit" [disabled]="loginFormGroup.invalid">
    Iniciar Sesión
  </button>
</form>
```

**Características de estructura**:
- Dos fieldsets agrupan campos relacionados
- Legends describen cada fieldset
- Componente form-input reutilizable para cada campo
- Validación integrada en Angular (reactive forms)
- Botón submit solo habilitado cuando el formulario es válido

---

### Mejores Prácticas Implementadas

| Práctica | Implementación | Beneficio |
|----------|----------------|-----------|
| **Labels asociados** | `for`/`id` | Área clickeable más grande |
| **Fieldsets y legends** | Agrupación temática | Estructura clara |
| **Indicadores visuales** | Asterisco para requeridos | Usuario sabe qué es obligatorio |
| **Mensajes de error** | `role="alert"` | Lectores de pantalla lo leen |
| **Validación en tiempo real** | Componente form-input | Feedback inmediato |
| **Texto de ayuda** | Debajo de cada campo | Instrucciones claras |
| **Contraste** | Colores WCAG AA | Visible para usuarios con baja visión |
| **Tamaño de campo** | Altura mínima 48px | Fácil de tocar en móviles |

---

## Resumen - Decisiones de Accesibilidad Fase 2

| Componente | Decisión | Razón |
|------------|----------|-------|
| **Header** | Navegación principal + utilidades | Acceso rápido a funciones |
| **Main** | Proyección de contenido | Reutilizable, flexible |
| **Footer** | Secciones temáticas con nav | Organizado, accesible |
| **FormInput** | Componente reutilizable | DRY, consistencia |
| **LoginForm** | Fieldsets + Legends | Estructura semántica clara |
| **Jerarquía H1-H6** | Un H1, no saltar niveles | Navegación por lectores de pantalla |
| **Elementos semánticos** | header, nav, main, section, article, aside, footer | Significado inherente |

---

# Sección 3: Sistema de Componentes UI - Fase 3

---

## 3.1 Componentes Implementados

La Fase 3 introduce un sistema completo de componentes UI reutilizables que forman los "bloques de construcción" de la aplicación. Cada componente tiene variantes, tamaños y estados completamente implementados.

### 1. **app-button** (Componente de Botón)

**Ubicación**: `src/app/components/shared/button/`

**Propósito**: Botón interactivo reutilizable con múltiples variantes y tamaños para diferentes contextos.

**Variantes disponibles**:
- `variant="primary"` - Acción principal (color amarillo/dorado)
- `variant="secondary"` - Acción secundaria (color azul accent)
- `variant="ghost"` - Acción neutral, sin fondo (solo borde)
- `variant="danger"` - Acción destructiva (color rojo)

**Tamaños disponibles**:
- `size="sm"` - Pequeño (36px de altura)
- `size="md"` - Mediano por defecto (48px de altura)
- `size="lg"` - Grande (56px de altura)

**Estados que maneja**:
- **:hover** - Cambio de color + elevación de sombra + transformación translateY(-2px)
- **:focus** - Outline de 3px en color accent
- **:focus-visible** - Outline visible para navegación con teclado
- **:active** - Escala reducida (0.95) para feedback de clic
- **[disabled]** - Opacidad 0.6 + cursor no-drop

**Propiedades del componente**:
```typescript
@Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
@Input() size: 'sm' | 'md' | 'lg' = 'md';
@Input() disabled: boolean = false;
@Input() type: 'button' | 'submit' | 'reset' = 'button';
@Output() click = new EventEmitter<void>();
```

**Ejemplo de uso**:
```html
<!-- Botón primario grande -->
<app-button variant="primary" size="lg" (click)="onSubmit()">
  Guardar
</app-button>

<!-- Botón peligroso, deshabilitado -->
<app-button variant="danger" [disabled]="isDeleting">
  Eliminar
</app-button>

<!-- Botón fantasma pequeño -->
<app-button variant="ghost" size="sm" (click)="cancel()">
  Cancelar
</app-button>
```

**Accesibilidad**:
- ✓ Outline focus visible de 3px
- ✓ Area mínima 48x48px (Ley de Fitts)
- ✓ Contraste WCAG AA
- ✓ Navegación con teclado (Tab, Enter)
- ✓ Estados claros y diferenciables

---

### 2. **app-card** (Componente de Tarjeta)

**Ubicación**: `src/app/components/shared/card/`

**Propósito**: Contenedor visual para mostrar contenido relacionado (imagen, título, descripción, acciones).

**Variantes disponibles**:
- `variant="vertical"` - Imagen arriba, contenido abajo (por defecto)
- `variant="horizontal"` - Imagen a la izquierda, contenido a la derecha

**Tamaños disponibles**:
- Responsive: Se adapta automáticamente a pantalla (100% ancho en móvil)

**Estados que maneja**:
- **:hover** - Elevación de sombra + transformación translateY(-4px) para feedback
- **:normal** - Sombra sutil, sin transformación

**Propiedades del componente**:
```typescript
@Input() title: string = '';
@Input() description: string = '';
@Input() image?: string;
@Input() variant: 'vertical' | 'horizontal' = 'vertical';
```

**Ejemplo de uso**:
```html
<!-- Card vertical con botón -->
<app-card 
  title="Aprende HTML"
  description="Guía completa de HTML5 desde cero"
  image="/assets/html-course.jpg"
  variant="vertical"
>
  <app-button variant="primary" size="sm">
    Leer más
  </app-button>
</app-card>

<!-- Card horizontal en listado -->
<app-card 
  title="JavaScript Avanzado"
  description="Domina async/await, promises y programación funcional"
  image="/assets/javascript-course.jpg"
  variant="horizontal"
>
  <app-button variant="secondary" size="sm">
    Comenzar
  </app-button>
</app-card>
```

**Accesibilidad**:
- ✓ Elemento semántico `<article>`
- ✓ Estructura clara (h3 para título)
- ✓ Imagen con alt text
- ✓ Contraste de colores WCAG AA
- ✓ Responsive en todos los tamaños de pantalla

---

### 3. **app-form-textarea** (Componente de Área de Texto)

**Ubicación**: `src/app/components/shared/form-textarea/`

**Propósito**: Campo de entrada para múltiples líneas de texto con validación y mensajes de error.

**Variantes disponibles**:
- Versión base sin variantes visuales

**Tamaños disponibles**:
- `[rows]="4"` - Altura personalizable
- min-height: 120px

**Estados que maneja**:
- **:focus** - Borde color accent + sombra azul
- **:focus-visible** - Outline de 3px
- **:disabled** - Opacidad 0.6
- **[error]** - Borde rojo + fondo rojo tenue

**Propiedades del componente**:
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

**Ejemplo de uso**:
```html
<!-- Textarea básico -->
<app-form-textarea
  label="Descripción"
  placeholder="Escribe tu descripción aquí..."
  [rows]="5"
  [required]="true"
  [(ngModel)]="description"
></app-form-textarea>

<!-- Textarea con error y hint -->
<app-form-textarea
  label="Comentarios"
  placeholder="Comparte tus comentarios..."
  [rows]="4"
  hint="Máximo 500 caracteres"
  error="Este campo es requerido"
></app-form-textarea>
```

**Accesibilidad**:
- ✓ Label asociado con `for`/`id`
- ✓ Indicador de requerido (asterisco rojo)
- ✓ Mensajes de error con `role="alert"`
- ✓ Resize vertical permitido
- ✓ ControlValueAccessor para Reactive Forms

---

### 4. **app-form-select** (Componente de Dropdown)

**Ubicación**: `src/app/components/shared/form-select/`

**Propósito**: Dropdown para seleccionar una opción de una lista.

**Variantes disponibles**:
- Versión base sin variantes

**Tamaños disponibles**:
- Altura: 48px

**Estados que maneja**:
- **:hover** - Borde color accent
- **:focus** - Sombra azul + outline
- **option:checked** - Fondo azul, texto blanco
- **[disabled]** - Opacidad 0.6
- **[error]** - Borde rojo + fondo rojo tenue

**Propiedades del componente**:
```typescript
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

@Input() label: string = '';
@Input() options: SelectOption[] = [];
@Input() placeholder: string = 'Selecciona una opción';
@Input() required: boolean = false;
@Input() error?: string;
@Input() hint?: string;
@Input() value: string | number = '';
@Output() change = new EventEmitter<string | number>();
```

