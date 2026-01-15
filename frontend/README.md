# Frontend - TecnoMayores

**Aplicación Angular standalone** para la plataforma de formación tecnológica TecnoMayores.

---

## Tabla de Contenidos

1. [Arquitectura de Eventos](#arquitectura-de-eventos)
2. [Diagrama de Flujo de Eventos](#diagrama-de-flujo-de-eventos)
3. [Componentes Interactivos](#componentes-interactivos)
4. [Tabla de Compatibilidad de Navegadores](#tabla-de-compatibilidad-de-navegadores)
5. [Tecnologías](#tecnologías)
6. [Instalación](#instalación)

---

## Arquitectura de Eventos

### Patrón de Manejo de Eventos en Angular

Esta aplicación implementa una **arquitectura de eventos unidireccional** siguiendo las mejores prácticas de Angular 17+. El flujo de datos sigue el patrón **Component → Service → State → View**, garantizando una separación clara de responsabilidades y facilitando el mantenimiento del código.

#### Principios Fundamentales

**1. Event Binding Declarativo**

Angular utiliza una sintaxis declarativa para vincular eventos del DOM directamente en las plantillas mediante paréntesis `(evento)="handler($event)"`. Este enfoque proporciona:

- **Type safety**: Los eventos mantienen sus tipos nativos (KeyboardEvent, MouseEvent, etc.)
- **Detección automática de cambios**: Zone.js rastrea automáticamente las modificaciones sin llamadas manuales
- **Sintaxis clara**: Los bindings son explícitos y fáciles de rastrear en el código

**Ejemplo de Event Binding:**

```typescript
// Template (HTML)
<button (click)="onSave($event)">Guardar</button>
<input (keydown.enter)="onSearch($event)" (focus)="onFocus()" (blur)="onBlur()">

// Component (TypeScript)
onSave(event: MouseEvent): void {
  event.preventDefault();
  this.lessonService.saveProgress(this.lessonId);
}

onSearch(event: KeyboardEvent): void {
  const query = (event.target as HTMLInputElement).value;
  this.performSearch(query);
}
```

**2. Modificadores de Eventos**

Angular proporciona modificadores sintácticos que simplifican el manejo de eventos específicos, reduciendo la necesidad de lógica condicional:

- `(keydown.enter)` - Detecta solo la tecla Enter
- `(keydown.escape)` - Detecta solo la tecla Escape
- `(keydown.arrowup)` - Detecta flecha arriba
- `(keydown.arrowdown)` - Detecta flecha abajo
- `(click.shift)` - Detecta click con tecla Shift presionada

**Ejemplo en el proyecto:**

```typescript
// accordion.component.ts - Navegación por teclado
<button 
  (click)="toggleItem(item.id)"
  (keydown)="onKeyDown($event, item.id, i)">
  {{ item.title }}
</button>

onKeyDown(event: KeyboardEvent, itemId: string, index: number): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.toggleItem(itemId, event);
      break;
    case 'ArrowDown':
      event.preventDefault();
      this.focusItem(index + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      this.focusItem(index - 1);
      break;
    case 'Home':
      event.preventDefault();
      this.focusItem(0);
      break;
    case 'End':
      event.preventDefault();
      this.focusItem(this.items.length - 1);
      break;
  }
}
```

**3. Uso de @HostListener para Eventos Globales**

Para eventos que deben escucharse a nivel de documento o ventana (como cerrar modales con ESC o reajustar layouts en resize), se utiliza el decorador `@HostListener`:

```typescript
// modal.component.ts
import { HostListener } from '@angular/core';

export class Modal {
  // Cerrar modal con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.close();
    }
  }

  // Detectar clicks fuera del modal
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen || !this.closeOnBackdrop) return;
    
    const clickedInside = this.modalContent.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.close();
    }
  }

  // Reajustar posición del modal en resize
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    if (!this.isOpen) return;
    
    const window = event.target as Window;
    this.adjustModalPosition(window.innerWidth, window.innerHeight);
  }
}
```

**4. Prevención de Comportamientos Predeterminados**

Para controlar el comportamiento del navegador, se utilizan los métodos nativos del objeto Event:

- **`event.preventDefault()`** - Previene la acción predeterminada del navegador
- **`event.stopPropagation()`** - Detiene la propagación del evento hacia elementos padres

**Casos de uso en el proyecto:**

```typescript
// 1. Prevenir recarga en formularios
onSubmit(event: Event): void {
  event.preventDefault();
  this.processForm();
}

// 2. Evitar cierre del modal al hacer click en su contenido
onContentClick(event: MouseEvent): void {
  event.stopPropagation(); // El click no llega al backdrop
}

// 3. Prevenir scroll al navegar con flechas en accordion
onKeyDown(event: KeyboardEvent): void {
  if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.preventDefault(); // Evita scroll de página
    this.navigateItems(event.key);
  }
}

// 4. Eliminar tag sin propagar el evento
removeTag(event: MouseEvent, tagText: string): void {
  event.stopPropagation(); // No activa click del contenedor padre
  this.removeTagElement(tagText);
}
```

**5. Manipulación Segura del DOM con Renderer2**

Angular proporciona el servicio `Renderer2` para manipular el DOM de forma segura, compatible con SSR (Server-Side Rendering) y evitando accesos directos a `nativeElement`:

```typescript
import { Renderer2, ElementRef } from '@angular/core';

export class ToastComponent {
  constructor(private renderer: Renderer2) {}

  // Crear elementos dinámicamente
  createToastElement(message: ToastMessage): void {
    const toastEl = this.renderer.createElement('div');
    this.renderer.addClass(toastEl, 'toast');
    this.renderer.addClass(toastEl, `toast--${message.type}`);
    this.renderer.setAttribute(toastEl, 'role', 'alert');
    
    const messageEl = this.renderer.createElement('span');
    const messageText = this.renderer.createText(message.text);
    this.renderer.appendChild(messageEl, messageText);
    this.renderer.appendChild(toastEl, messageEl);
    this.renderer.appendChild(this.toastContainer, toastEl);
  }

  // Modificar estilos
  updateStyles(element: HTMLElement): void {
    this.renderer.setStyle(element, 'opacity', '1');
    this.renderer.setStyle(element, 'transform', 'translateY(0)');
  }

  // Eliminar elementos
  removeElement(element: HTMLElement): void {
    this.renderer.removeChild(this.toastContainer, element);
  }
}
```

**6. Acceso a Elementos del DOM con @ViewChild**

Para referenciar elementos del DOM en el componente, se utiliza `@ViewChild` combinado con `ElementRef`:

```typescript
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';

export class TabsComponent implements AfterViewInit {
  @ViewChild('tabList', { static: false }) tabList!: ElementRef;
  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  ngAfterViewInit(): void {
    // Acceder al DOM solo después de que la vista esté inicializada
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  focusTab(index: number): void {
    const buttons = this.tabList.nativeElement.querySelectorAll('button');
    if (buttons[index]) {
      buttons[index].focus();
    }
  }
}
```

**7. Gestión de Estado Reactivo con Servicios**

Los eventos del usuario desencadenan actualizaciones de estado que se propagan a través de servicios singleton con RxJS `BehaviorSubject`:

```typescript
// theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$: Observable<Theme> = this.themeSubject.asObservable();

  toggleTheme(): void {
    const newTheme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.themeSubject.next(newTheme);
    this.applyThemeToDocument(newTheme);
    this.saveToLocalStorage(newTheme);
  }

  // Detectar cambios del sistema operativo
  watchSystemPreference(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (event) => {
      if (!this.getSavedTheme()) {
        const newTheme = event.matches ? 'dark' : 'light';
        this.themeSubject.next(newTheme);
      }
    });
  }
}
```

#### Flujo Completo de Eventos

El flujo de un evento típico en la aplicación sigue esta secuencia:

```
Usuario interactúa con UI (click, keydown, etc.)
         ↓
Template detecta evento con Event Binding
         ↓
Se ejecuta el handler del componente
         ↓
El componente delega la lógica a un servicio
         ↓
El servicio actualiza el estado (BehaviorSubject)
         ↓
Los componentes suscritos reciben la actualización
         ↓
Angular re-renderiza las vistas afectadas
```

**Ejemplo completo:**

```typescript
// 1. Usuario hace click en botón de favoritos
<button (click)="toggleFavorite(lesson, $event)">❤️</button>

// 2. Handler en el componente
toggleFavorite(lesson: Lesson, event: MouseEvent): void {
  event.stopPropagation(); // No activar click de la card
  this.lessonService.toggleFavorite(lesson.id);
}

// 3. Servicio actualiza el estado
toggleFavorite(lessonId: number): void {
  const lessons = this.lessonsSubject.value;
  const updated = lessons.map(l => 
    l.id === lessonId ? { ...l, isFavorite: !l.isFavorite } : l
  );
  this.lessonsSubject.next(updated);
  this.toast.success('Favorito actualizado');
}

// 4. Vista se actualiza automáticamente
lessons$ = this.lessonService.lessons$; // En el componente
```

#### Buenas Prácticas Implementadas

1. **Separación de responsabilidades**: Los componentes solo manejan UI, los servicios la lógica
2. **Uso de Renderer2**: Manipulación del DOM compatible con SSR
3. **Prevención de memory leaks**: Uso de `takeUntilDestroyed()` o AsyncPipe
4. **Type safety**: Tipado estricto de eventos y datos
5. **Accesibilidad**: Soporte completo de teclado y ARIA attributes
6. **Detección de preferencias del sistema**: matchMedia para tema automático
7. **Event modifiers**: Simplificación de lógica con modificadores de Angular

---

## Diagrama de Flujo de Eventos

### Flujo 1: Formulario con preventDefault

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario presiona "Enter" en formulario de login             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Template: <form (ngSubmit)="onSubmit($event)">             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Component: onSubmit(event: Event) {                         │
│   event.preventDefault(); // ← Previene recarga de página   │
│   this.authService.login(this.credentials);                 │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Service: Envía petición HTTP y actualiza estado             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Toast: Muestra "Login exitoso" o mensaje de error          │
└─────────────────────────────────────────────────────────────┘
```

### Flujo 2: Modal con stopPropagation y ESC

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario hace click en backdrop del modal                    │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Template: <div class="backdrop" (click)="onBackdropClick()">│
│             <div class="content"                             │
│                  (click)="onContentClick($event)"> ←─┐       │
│             </div>                                    │       │
│           </div>                                      │       │
└────────────────────┬──────────────────────────────────┘       │
                     ↓                                          │
┌─────────────────────────────────────────────────────────────┐│
│ Component: onContentClick(event: MouseEvent) {              ││
│   event.stopPropagation(); // ← Detiene propagación ────────┘│
│ }                                                             │
│                                                               │
│ onBackdropClick() {                                          │
│   this.close(); // Solo se ejecuta si click en backdrop      │
│ }                                                             │
└────────────────────┬──────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ @HostListener('document:keydown.escape')                    │
│ onEscapePress() {                                            │
│   if (this.isOpen) this.close();                            │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Modal se cierra con animación                               │
│ Scroll del body se restaura                                 │
│ Foco vuelve al elemento anterior                            │
└─────────────────────────────────────────────────────────────┘
```

### Flujo 3: Navegación por Teclado en Accordion

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario presiona "ArrowDown" en accordion                   │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Template: <button (keydown)="onKeyDown($event, id, index)"> │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Component: onKeyDown(event, id, index) {                    │
│   switch (event.key) {                                      │
│     case 'ArrowDown':                                        │
│       event.preventDefault(); // ← Previene scroll          │
│       this.focusItem(index + 1);                            │
│       break;                                                 │
│   }                                                          │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ focusItem(index) {                                          │
│   const buttons = this.accordionContainer                   │
│     .nativeElement.querySelectorAll('button');              │
│   buttons[index].focus(); // ← Foco en siguiente elemento   │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
```

### Flujo 4: Creación Dinámica de Toast con Renderer2

```
┌─────────────────────────────────────────────────────────────┐
│ Usuario realiza acción que genera notificación             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ Component: this.toastService.success('¡Guardado!');         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ToastService: Emite mensaje via BehaviorSubject             │
│ this.toastSubject.next({ message, type, duration });        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ ToastComponent: Suscripción recibe el mensaje               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ createToastElement(toast) {                                 │
│   const toastEl = renderer.createElement('div'); ←─┐        │
│   renderer.addClass(toastEl, 'toast');              │        │
│   const messageEl = renderer.createElement('span'); │        │
│   const text = renderer.createText(toast.message);  │        │
│   renderer.appendChild(messageEl, text);            │        │
│   renderer.appendChild(toastEl, messageEl);         │        │
│   renderer.appendChild(container, toastEl); ←───────┘        │
│ }                                                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│ setTimeout(() => {                                          │
│   renderer.removeChild(container, toastEl); ← Auto-cierre   │
│ }, duration);                                               │
└─────────────────────────────────────────────────────────────┘
```

### Leyenda

- **Template**: Código HTML con event bindings
- **Component**: Lógica TypeScript del componente
- **Service**: Servicios inyectables con estado
- **@HostListener**: Eventos globales de documento/window
- **Renderer2**: Manipulación segura del DOM
- **preventDefault()**: Previene acción predeterminada del navegador
- **stopPropagation()**: Detiene burbujeo del evento

---

## Componentes Interactivos

### Tabla de Componentes con Eventos Asignados

| Componente | Eventos Implementados | Uso | Características Especiales |
|------------|----------------------|-----|---------------------------|
| **Modal** | `(click)` en botones, `@HostListener('document:keydown.escape')`, `@HostListener('document:click')`, `@HostListener('window:resize')` | Diálogos y ventanas emergentes | Focus trap, prevención de scroll, cierre con backdrop |
| **Accordion** | `(click)`, `(keydown)` con ArrowUp/Down/Home/End | Secciones colapsables | Navegación completa por teclado, ARIA roles |
| **Tabs** | `(click)`, `(keydown)` con ArrowLeft/Right/Home/End, `(focus)` | Pestañas de contenido | Indicador visual activo, roles ARIA |
| **Tooltip** | `(mouseenter)`, `(mouseleave)`, `(focusin)`, `(focusout)` | Información contextual | Posicionamiento dinámico, delay configurable |
| **Header** | `(click)` en menú, `@HostListener('document:keydown.escape')`, `@HostListener('window:resize')` | Navegación principal | Menú hamburguesa responsive, cierre automático |
| **Toast** | Creación/eliminación dinámica con Renderer2 | Notificaciones temporales | Auto-cierre configurable, 4 tipos (success/error/info/warning) |
| **Spinner** | Observable con `isLoading$` | Indicador de carga | Timeout de seguridad, overlay global |
| **Theme Switcher** | `(click)`, `(keydown)` | Toggle tema claro/oscuro | Detección de preferencias del sistema, persistencia localStorage |
| **Alert** | `(click)` en cerrar, creación dinámica de tags | Alertas y badges | Tipos diferenciados, tags eliminables |
| **Forms** | `(ngSubmit)`, `(focus)`, `(blur)`, validación async | Login/Registro | preventDefault, validadores personalizados |

### Ejemplos de Código por Componente

#### Modal - Focus Trap Completo

```typescript
@HostListener('document:keydown.tab', ['$event'])
onTabPress(event: KeyboardEvent): void {
  if (!this.isOpen) return;

  this.updateFocusableElements();
  const shiftPressed = event.shiftKey;
  const currentIndex = this.focusableElements.indexOf(document.activeElement as HTMLElement);

  let nextIndex: number;
  if (shiftPressed) {
    nextIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
  } else {
    nextIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1;
  }

  event.preventDefault();
  this.focusableElements[nextIndex].focus();
}
```

#### Accordion - Navegación por Teclado

```typescript
onKeyDown(event: KeyboardEvent, itemId: string, index: number): void {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.toggleItem(itemId, event);
      break;
    case 'ArrowDown':
      event.preventDefault();
      this.focusItem(index + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      this.focusItem(index - 1);
      break;
    case 'Home':
      event.preventDefault();
      this.focusItem(0);
      break;
    case 'End':
      event.preventDefault();
      this.focusItem(this.items.length - 1);
      break;
  }
}
```

#### Theme Service - Detección de Sistema

```typescript
watchSystemPreference(callback: (prefersDark: boolean) => void): void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Listener para cambios en tiempo real del sistema operativo
  const listener = (event: MediaQueryListEvent) => {
    if (!this.getSavedTheme()) {
      const newTheme: Theme = event.matches ? 'dark' : 'light';
      this.setTheme(newTheme);
      callback(event.matches);
    }
  };

  mediaQuery.addEventListener('change', listener);
}
```

---

## Tabla de Compatibilidad de Navegadores

### Eventos y Features Implementados

| Evento/Característica | Chrome | Firefox | Safari | Edge | Notas |
|-----------------------|--------|---------|--------|------|-------|
| **Eventos Básicos** |
| `click` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo, incluyendo móvil |
| `dblclick` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| **Eventos de Teclado** |
| `keydown` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Todos los modificadores soportados |
| `keyup` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Todos los modificadores soportados |
| `keydown.enter` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Modificador de Angular |
| `keydown.escape` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en modales y tooltips |
| `keydown.tab` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Para focus trap en modales |
| `keydown.arrowup` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Navegación en accordion |
| `keydown.arrowdown` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Navegación en accordion |
| `keydown.arrowleft` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Navegación en tabs |
| `keydown.arrowright` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Navegación en tabs |
| **Eventos de Mouse** |
| `mouseenter` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en tooltips |
| `mouseleave` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en tooltips |
| `mousedown` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `mouseup` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| **Eventos de Foco** |
| `focus` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en formularios y tabs |
| `blur` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en formularios y tabs |
| `focusin` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en tooltips (bubbling) |
| `focusout` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en tooltips (bubbling) |
| **Eventos de Formulario** |
| `submit` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Con preventDefault |
| `change` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Formularios reactivos |
| `input` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Validación en tiempo real |
| **APIs Web** |
| `matchMedia()` | ✓ 9+ | ✓ 6+ | ✓ 5.1+ | ✓ 10+ | Detección de media queries |
| `prefers-color-scheme` | ✓ 76+ | ✓ 67+ | ✓ 12.1+ | ✓ 79+ | Media query para tema oscuro |
| `matchMedia.addEventListener` | ✓ 14+ | ✓ 55+ | ✓ 14+ | ✓ 79+ | Escuchar cambios de tema |
| `localStorage` | ✓ 4+ | ✓ 3.5+ | ✓ 4+ | ✓ 8+ | Persistencia de preferencias |
| `sessionStorage` | ✓ 4+ | ✓ 3.5+ | ✓ 4+ | ✓ 8+ | Estado temporal |
| **Métodos de Event** |
| `preventDefault()` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Prevenir comportamiento por defecto |
| `stopPropagation()` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Detener burbujeo de eventos |
| `stopImmediatePropagation()` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Detener todos los listeners |
| **Window Events** |
| `window:resize` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Usado en modal y tooltip |
| `window:scroll` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Detección de scroll |
| `document:click` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Click fuera de componentes |

### Consideraciones Especiales por Navegador

#### Chrome/Chromium (✓ Excelente soporte)
- Todas las características funcionan sin polyfills
- `prefers-color-scheme` soportado desde versión 76
- Mejor rendimiento con Zone.js

#### Firefox (✓ Excelente soporte)
- Todas las características funcionan correctamente
- `prefers-color-scheme` soportado desde versión 67
- Excelente soporte de accesibilidad ARIA

#### Safari/WebKit (✓ Buen soporte)
- `prefers-color-scheme` soportado desde versión 12.1
- Algunos eventos táctiles pueden requerir `-webkit-` prefix
- El evento `hover` en iOS se comporta diferente (requiere tap)

#### Edge (✓ Excelente soporte)
- Basado en Chromium desde 2020
- Mismo comportamiento que Chrome en versiones modernas
- `prefers-color-scheme` soportado desde versión 79

#### Internet Explorer 11 (✗ No soportado)
- **No se proporciona soporte para IE11**
- Angular 17+ no soporta IE11
- Se requieren polyfills extensos que no están incluidos

### Fallbacks y Polyfills

Para máxima compatibilidad, la aplicación implementa:

1. **Detección de `prefers-color-scheme`:**
```typescript
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
```

2. **Fallback para localStorage:**
```typescript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.warn('localStorage no disponible, usando memoria');
  // Implementar storage en memoria
}
```

3. **Detección de capacidades:**
```typescript
const supportsTouch = 'ontouchstart' in window;
const supportsPointer = 'PointerEvent' in window;
```

### Testing en Navegadores

La aplicación ha sido probada en:
- ✓ Chrome 120+ (Desktop y Android)
- ✓ Firefox 121+ (Desktop)
- ✓ Safari 17+ (macOS e iOS)
- ✓ Edge 120+ (Desktop)

**Recomendaciones de versiones mínimas:**
- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+

---

## Tecnologías

- **Angular 17.3.12** - Framework principal con arquitectura standalone
- **TypeScript 5.5.4** - Lenguaje de programación
- **RxJS 7.8.1** - Programación reactiva
- **SCSS** - Preprocesador CSS
- **Signals** - Sistema de reactividad de Angular
- **Renderer2** - Manipulación segura del DOM

---

## Instalación

### Prerrequisitos

- Node.js 20.x o superior
- npm 10.x o superior

### Pasos

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm start

# Build de producción
npm run build

# Ejecutar tests
npm test
```

### Scripts Disponibles

```json
{
  "start": "ng serve --open",
  "build": "ng build",
  "build:prod": "ng build --configuration production",
  "test": "ng test",
  "lint": "ng lint"
}
```

---

## Licencia

Este proyecto es parte del módulo de Desarrollo Web en Entornos Cliente (DWEC) del ciclo DAW.

---

**Documentación completa disponible en:** `frontend/docs/cliente/DOCUMENTACION.md`

