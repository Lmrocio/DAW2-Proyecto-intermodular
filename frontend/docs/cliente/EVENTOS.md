# Documentación de Eventos y Componentes Interactivos - ClienteFase1

## Índice

1. [Arquitectura de Eventos en Angular](#1-arquitectura-de-eventos-en-angular)
2. [Manipulación del DOM](#2-manipulación-del-dom)
3. [Componentes Interactivos](#3-componentes-interactivos)
4. [Theme Switcher](#4-theme-switcher)
5. [Diagrama de Flujo de Eventos](#5-diagrama-de-flujo-de-eventos)
6. [Tabla de Compatibilidad de Navegadores](#6-tabla-de-compatibilidad-de-navegadores)

---

## 1. Arquitectura de Eventos en Angular

### 1.1 Patrón de Flujo Unidireccional

La arquitectura de eventos en esta aplicación Angular sigue el **patrón unidireccional de datos**, utilizando bindings de eventos nativos del DOM directamente en las plantillas de componentes standalone.

```
Usuario → DOM Event → Template Binding → Component Handler → Service/State → View Re-render
```

### 1.2 Event Binding

Los eventos se capturan con la sintaxis `(eventName)="handler($event)"`:

```html
<!-- Click básico -->
<button (click)="onClick()">Hacer clic</button>

<!-- Con acceso al objeto evento -->
<input (keyup)="onKeyUp($event)">

<!-- Pseudoeventos de Angular -->
<input (keyup.enter)="onEnter()">
<button (keydown.escape)="onEscape()">
```

### 1.3 Tipos de Eventos Implementados

| Tipo | Eventos | Uso en la App |
|------|---------|---------------|
| **Mouse** | `click`, `dblclick`, `mouseenter`, `mouseleave` | Botones, Cards, Tooltips |
| **Teclado** | `keydown`, `keyup`, `keydown.escape`, `keyup.enter` | Modal (ESC), Tabs, Accordion |
| **Focus** | `focus`, `blur` | Inputs, Tooltips accesibles |
| **Formulario** | `submit`, `change`, `input` | Login form |

### 1.4 Prevención de Comportamiento por Defecto

```typescript
onSubmit(event: Event): void {
  event.preventDefault(); // Previene recarga de página
  // Lógica del formulario
}

onClick(event: MouseEvent): void {
  event.stopPropagation(); // Detiene propagación hacia padres
}
```

---

## 2. Manipulación del DOM

### 2.1 ViewChild y ElementRef

Acceso seguro a elementos del DOM usando decoradores de Angular:

```typescript
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({...})
export class MiComponente implements AfterViewInit {
  @ViewChild('miElemento', { static: false }) miElemento!: ElementRef;

  ngAfterViewInit(): void {
    // Acceso al elemento nativo
    console.log(this.miElemento.nativeElement);
  }
}
```

### 2.2 Renderer2 para Manipulación Segura

Usamos `Renderer2` para operaciones DOM compatibles con SSR y diferentes plataformas:

```typescript
import { Renderer2 } from '@angular/core';

constructor(private renderer: Renderer2) {}

// Cambiar estilos
this.renderer.setStyle(elemento, 'color', 'red');

// Añadir/quitar clases
this.renderer.addClass(elemento, 'mi-clase');
this.renderer.removeClass(elemento, 'mi-clase');

// Crear elementos
const nuevoDiv = this.renderer.createElement('div');
this.renderer.appendChild(contenedor, nuevoDiv);

// Eliminar elementos
this.renderer.removeChild(padre, hijo);
```

### 2.3 Implementación en Componentes

#### Modal - Ejemplo de Manipulación DOM

```typescript
// modal.ts
@ViewChild('modalContainer') modalContainer!: ElementRef;

open(): void {
  this.isOpen = true;
  this.renderer.setStyle(document.body, 'overflow', 'hidden');
  this.renderer.addClass(this.modalContainer.nativeElement, 'modal--visible');
}

close(): void {
  this.renderer.removeClass(this.modalContainer.nativeElement, 'modal--visible');
  this.renderer.removeStyle(document.body, 'overflow');
  this.isOpen = false;
}
```

---

## 3. Componentes Interactivos

### 3.1 Menú Hamburguesa

**Ubicación:** `components/layout/header/header.ts`

**Funcionalidades:**
- Toggle de apertura/cierre con estado `menuOpen`
- Cierre con tecla ESC usando `@HostListener`
- Cierre al hacer click fuera (overlay)
- Cierre al redimensionar ventana (responsive)
- Bloqueo de scroll del body cuando está abierto

```typescript
@HostListener('document:keydown.escape')
onEscapePress(): void {
  if (this.menuOpen) {
    this.closeMenu();
  }
}
```

### 3.2 Modal

**Ubicación:** `components/shared/modal/`

**Funcionalidades:**
- Apertura/cierre controlado por `isOpen`
- Cierre con tecla ESC (`closeOnEsc`)
- Cierre al click en backdrop (`closeOnBackdrop`)
- Animaciones de entrada/salida
- Gestión de foco para accesibilidad
- Bloqueo de scroll del body

**Uso:**
```html
<app-modal 
  [isOpen]="showModal" 
  [title]="'Mi Modal'"
  [size]="'md'"
  (closed)="onModalClose()"
>
  <p>Contenido del modal</p>
  <div modal-footer>
    <app-button (click)="showModal = false">Cerrar</app-button>
  </div>
</app-modal>
```

### 3.3 Tabs

**Ubicación:** `components/shared/tabs/`

**Funcionalidades:**
- Navegación por teclado (flechas, Home, End)
- Estados activo y deshabilitado
- Múltiples variantes visuales (default, pills, underline)
- Roles ARIA para accesibilidad

**Uso:**
```html
<app-tabs 
  [tabs]="misTabs" 
  [activeTabId]="'tab1'"
  [variant]="'pills'"
  (tabChange)="onTabChange($event)"
>
  <div *ngIf="activeTab === 'tab1'">Contenido Tab 1</div>
  <div *ngIf="activeTab === 'tab2'">Contenido Tab 2</div>
</app-tabs>
```

### 3.4 Accordion

**Ubicación:** `components/shared/accordion/`

**Funcionalidades:**
- Expansión/colapso con animación
- Modo single o múltiple (`allowMultiple`)
- Navegación por teclado completa
- Estados expandido y deshabilitado

**Uso:**
```html
<app-accordion 
  [items]="accordionItems"
  [allowMultiple]="false"
  (itemToggle)="onAccordionToggle($event)"
>
</app-accordion>
```

### 3.5 Tooltip

**Ubicación:** `components/shared/tooltip/`

**Funcionalidades:**
- Activación por hover y focus
- Delay configurable antes de mostrar
- Posicionamiento (top, bottom, left, right)
- Cierre con ESC

**Uso:**
```html
<app-tooltip 
  [text]="'Información adicional'" 
  [position]="'top'"
  [delay]="200"
>
  <button>Hover sobre mí</button>
</app-tooltip>
```

---

## 4. Theme Switcher

### 4.1 Servicio de Tema

**Ubicación:** `services/theme.service.ts`

El servicio gestiona el tema de la aplicación siguiendo las especificaciones de ClienteFase1:

#### Detección de Preferencia del Sistema

```typescript
systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
```

#### Toggle entre Temas

```typescript
toggleTheme(): void {
  const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
  this.setTheme(newTheme);
}
```

#### Persistencia en localStorage

```typescript
private saveToLocalStorage(theme: Theme): void {
  localStorage.setItem('tecnomayores-theme', theme);
}
```

#### Inicialización al Cargar

```typescript
private initializeTheme(): void {
  // 1. Leer localStorage
  const savedTheme = this.getSavedTheme();
  
  if (savedTheme) {
    // 2. Si hay valor guardado, usarlo
    this.setTheme(savedTheme);
  } else {
    // 3. Si no, detectar preferencia del sistema
    const systemTheme = this.systemPrefersDark() ? 'dark' : 'light';
    this.setTheme(systemTheme);
  }
}
```

### 4.2 Componente Theme Switcher

**Ubicación:** `components/shared/theme-switcher/`

Toggle visual con:
- Iconos de sol/luna
- Animación de deslizamiento
- Texto descriptivo
- Accesibilidad completa (role="switch", aria-checked)

### 4.3 Variables CSS de Tema

**Ubicación:** `styles/00-settings/_theme.scss`

```scss
:root, .theme-light {
  --color-bg-primary: #fff6df;
  --color-text-primary: #030303;
  // ...más variables
}

.theme-dark {
  --color-bg-primary: #1a1a2e;
  --color-text-primary: #f0f0f0;
  // ...más variables
}
```

---

## 5. Diagrama de Flujo de Eventos

### 5.1 Flujo General de Eventos

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE EVENTOS ANGULAR                      │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────┐     ┌───────────────┐     ┌──────────────────┐
  │ Usuario  │────▶│  DOM Event    │────▶│ Template Binding │
  │ (click)  │     │ (MouseEvent)  │     │ (click)="fn()"   │
  └──────────┘     └───────────────┘     └────────┬─────────┘
                                                  │
                                                  ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                    COMPONENT HANDLER                          │
  │  onClick(event: MouseEvent) {                                │
  │    event.preventDefault();  // Opcional                      │
  │    this.state = newValue;   // Actualizar estado            │
  │    this.service.update();   // Llamar servicio              │
  │  }                                                           │
  └──────────────────────────────────────────────────────────────┘
                                                  │
                    ┌─────────────────────────────┴─────────────┐
                    │                                           │
                    ▼                                           ▼
        ┌───────────────────┐                    ┌──────────────────────┐
        │ Service/State     │                    │ Component State      │
        │ (ThemeService)    │                    │ (isOpen, activeTab)  │
        └─────────┬─────────┘                    └──────────┬───────────┘
                  │                                         │
                  └─────────────────┬───────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │   VIEW UPDATE    │
                         │ (Change Detection)│
                         └──────────────────┘
```

### 5.2 Flujo de Theme Switcher

```
┌────────────┐     ┌─────────────┐     ┌───────────────┐
│ Usuario    │────▶│ Click en    │────▶│ ThemeSwitcher │
│ hace click │     │ toggle      │     │ component     │
└────────────┘     └─────────────┘     └───────┬───────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │ ThemeService     │
                                    │ toggleTheme()    │
                                    └────────┬─────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
              ▼                              ▼                              ▼
   ┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
   │ localStorage     │          │ document         │          │ BehaviorSubject  │
   │ setItem()        │          │ classList.add()  │          │ next(theme)      │
   └──────────────────┘          └──────────────────┘          └──────────────────┘
                                             │
                                             ▼
                                  ┌──────────────────┐
                                  │ CSS Variables    │
                                  │ se actualizan    │
                                  └──────────────────┘
```

---

## 6. Tabla de Compatibilidad de Navegadores

### 6.1 Eventos del DOM

| Evento | Chrome | Firefox | Safari | Edge | IE11 |
|--------|--------|---------|--------|------|------|
| `click` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `keydown` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `keyup` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `focus` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blur` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mouseenter` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `mouseleave` | ✅ | ✅ | ✅ | ✅ | ✅ |

### 6.2 APIs Utilizadas

| API | Chrome | Firefox | Safari | Edge | IE11 |
|-----|--------|---------|--------|------|------|
| `matchMedia` | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 12+ | ✅ 10+ |
| `localStorage` | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 12+ | ✅ 8+ |
| `classList` | ✅ 8+ | ✅ 3.6+ | ✅ 5.1+ | ✅ 12+ | ✅ 10+ |
| `CSS Custom Properties` | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ | ❌ |
| `prefers-color-scheme` | ✅ 76+ | ✅ 67+ | ✅ 12.1+ | ✅ 79+ | ❌ |

### 6.3 Notas de Compatibilidad

- **IE11**: No soporta CSS Custom Properties. Se requiere fallback con variables SCSS compiladas.
- **prefers-color-scheme**: Navegadores antiguos ignorarán esta media query y usarán el tema por defecto (claro).
- **Angular 21**: Requiere navegadores modernos (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+).

---

## 7. Resumen de Entregables ClienteFase1

| Requisito | Estado | Ubicación |
|-----------|--------|-----------|
| Componentes interactivos con eventos | ✅ | `components/shared/` |
| Theme switcher funcional | ✅ | `services/theme.service.ts`, `components/shared/theme-switcher/` |
| Menú mobile con apertura/cierre | ✅ | `components/layout/header/` |
| Modal con cierre ESC | ✅ | `components/shared/modal/` |
| Accordion | ✅ | `components/shared/accordion/` |
| Tabs | ✅ | `components/shared/tabs/` |
| Tooltip | ✅ | `components/shared/tooltip/` |
| Documentación de eventos | ✅ | `docs/cliente/EVENTOS.md` |

