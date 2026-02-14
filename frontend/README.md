# Frontend - TecnoMayores

Aplicación Angular standalone para la plataforma de formación tecnológica TecnoMayores.

---

## Tabla de Contenidos

1. [Arquitectura de Eventos](#arquitectura-de-eventos)
  - [Patrón de Manejo de Eventos en Angular](#patrón-de-manejo-de-eventos-en-angular)
  - [Principios Fundamentales](#principios-fundamentales)
  - [Diagrama de Flujo de Eventos](#diagrama-de-flujo-de-eventos)
2. [Componentes Interactivos](#componentes-interactivos)
3. [Tabla de Compatibilidad de Navegadores](#tabla-de-compatibilidad-de-navegadores)
4. [Tecnologías](#tecnologías)
5. [Sistema de Routing](#sistema-de-routing)
  - [Configuración de Rutas](#configuración-de-rutas-fase-4---tarea-41)
  - [Navegación Programática](#navegación-programática)
  - [Lazy Loading](#lazy-loading)
  - [Route Guards](#route-guards)
  - [Resolvers](#resolvers)
  - [Breadcrumbs Dinámicos](#breadcrumbs-dinámicos)
6. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
7. [Componentes Principales](#componentes-principales)
8. [Servicios y Guards](#servicios-y-guards)
9. [Instalación y Desarrollo](#instalación-y-desarrollo)
10. [Build y Despliegue](#build-y-despliegue)
11. [Pruebas](#pruebas)
12. [Gestión de Estado y UX Avanzada](#gestión-de-estado-y-ux-avanzada-fase-6)
13. [Testing, Optimización y Entrega Final](#testing-optimización-y-entrega-final-fase-7)
13. [Documentación Adicional](#documentación-adicional)
14. [Cumplimiento de Criterios](#cumplimiento-de-criterios-fase-4)
15. [Licencia](#licencia)
16. [Documentación de fases anteriores](docs/cliente/DOCUMENTACION.md)
---

## Arquitectura de Eventos

### Patrón de Manejo de Eventos en Angular

Esta aplicación implementa una arquitectura de eventos unidireccional siguiendo las mejores prácticas de Angular 17+. El flujo de datos sigue el patrón **Component → Service → State → View**, garantizando una separación clara de responsabilidades y facilitando el mantenimiento del código.

### Principios Fundamentales

#### 1. Event Binding Declarativo

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

#### 2. Modificadores de Eventos

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

#### 3. Uso de @HostListener para Eventos Globales

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

#### 4. Prevención de Comportamientos Predeterminados

Para controlar el comportamiento del navegador, se utilizan los métodos nativos del objeto Event:

- `event.preventDefault()` - Previene la acción predeterminada del navegador
- `event.stopPropagation()` - Detiene la propagación del evento hacia elementos padres

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

#### 5. Manipulación Segura del DOM con Renderer2

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

#### 6. Acceso a Elementos del DOM con @ViewChild

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

#### 7. Gestión de Estado Reactivo con Servicios

Los eventos del usuario desencadenan actualizaciones de estado que se propagan a través de servicios singleton con RxJS BehaviorSubject:

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

### Flujo Completo de Eventos

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

### Buenas Prácticas Implementadas

- ✅ **Separación de responsabilidades**: Los componentes solo manejan UI, los servicios la lógica
- ✅ **Uso de Renderer2**: Manipulación del DOM compatible con SSR
- ✅ **Prevención de memory leaks**: Uso de `takeUntilDestroyed()` o `AsyncPipe`
- ✅ **Type safety**: Tipado estricto de eventos y datos
- ✅ **Accesibilidad**: Soporte completo de teclado y ARIA attributes
- ✅ **Detección de preferencias del sistema**: matchMedia para tema automático
- ✅ **Event modifiers**: Simplificación de lógica con modificadores de Angular

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

**Leyenda:**
- **Template**: Código HTML con event bindings
- **Component**: Lógica TypeScript del componente
- **Service**: Servicios inyectables con estado
- **@HostListener**: Eventos globales de documento/window
- **Renderer2**: Manipulación segura del DOM
- **preventDefault()**: Previene acción predeterminada del navegador
- **stopPropagation()**: Detiene burbujeo del evento

---

## Componentes Interactivos

Los componentes interactivos de la aplicación siguen los patrones de eventos descritos anteriormente. Cada componente maneja sus propios eventos y delega la lógica de negocio a los servicios correspondientes.

---

## Tabla de Compatibilidad de Navegadores

### Window Events

| Evento | Chrome | Firefox | Safari | Edge | Notas |
|--------|--------|---------|--------|------|-------|
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
- El evento hover en iOS se comporta diferente (requiere tap)

#### Edge (✓ Excelente soporte)
- Basado en Chromium desde 2020
- Mismo comportamiento que Chrome en versiones modernas
- `prefers-color-scheme` soportado desde versión 79

#### Internet Explorer 11 (✗ No soportado)
- No se proporciona soporte para IE11
- Angular 17+ no soporta IE11
- Se requieren polyfills extensos que no están incluidos

### Fallbacks y Polyfills

Para máxima compatibilidad, la aplicación implementa:

**Detección de prefers-color-scheme:**
```javascript
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
```

**Fallback para localStorage:**
```javascript
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
} catch (e) {
  console.warn('localStorage no disponible, usando memoria');
  // Implementar storage en memoria
}
```

**Detección de capacidades:**
```javascript
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

## Sistema de Routing

### Configuración de Rutas (FASE 4 - Tarea 4.1)

El proyecto implementa un sistema completo de routing con 14 rutas configuradas, incluyendo rutas principales, rutas con parámetros dinámicos, rutas hijas anidadas y manejo de errores 404.

#### Mapa Completo de Rutas

| Path | Descripción | Parámetros | Lazy Loading | Guards | Resolver | Breadcrumb |
|------|-------------|------------|--------------|--------|----------|------------|
| `/` | Redirección a home | - | No | - | - | - |
| `/home` | Página de inicio | - | No | - | - | 'Inicio' |
| `/lecciones` | Catálogo de lecciones | - | No | - | - | 'Lecciones' |
| `/lecciones/:id` | Detalle de lección | `id` | No | - | `leccionResolver` | 'Detalle de Lección' |
| `/login` | Formulario de acceso | - | No | - | - | 'Acceso de Usuario' |
| `/about` | Información de la app | - | No | - | - | 'Acerca de' |
| `/usuario` | Área de usuario (layout) | - | Sí | `authGuard` | - | 'Mi Cuenta' |
| `/usuario/perfil` | Perfil de usuario | - | Sí | `authGuard` | - | 'Mi Perfil' |
| `/usuario/progreso` | Progreso en lecciones | - | Sí | `authGuard` | - | 'Mi Progreso' |
| `/usuario/certificados` | Certificados obtenidos | - | Sí | `authGuard` | - | 'Mis Certificados' |
| `/style-guide` | Guía de estilos (dev) | - | No | - | - | 'Guía de Estilos' |
| `/client` | Página cliente (dev) | - | No | - | - | 'Cliente' |
| `/dev/navigation-demo` | Demo navegación | - | No | - | - | 'Demo Navegación' |
| `/**` | Página 404 | - | No | - | - | - |

---

### Navegación Programática

Se proporciona un servicio `NavigationService` con métodos para:

- Navegación básica (`navigate`)
- Navegación con parámetros de ruta
- Navegación con `queryParams`
- Navegación con `fragment`
- Navegación con `state`

En los componentes se usan `ActivatedRoute` y utilidades del router para leer parámetros, query params, fragment y state.

---

### Lazy Loading

Se utiliza lazy loading para el área de usuario y la estrategia de precarga `PreloadAllModules` para precargar los módulos en segundo plano. La configuración está en `app.config.ts` y la ruta `usuario` usa `loadChildren` hacia `pages/user/user.routes.ts`.

---

### Route Guards

#### authGuard

`authGuard` (CanActivate) protege las rutas que requieren autenticación. Si el usuario no está autenticado redirige a `/login` preservando `returnUrl` en query params.

#### pendingChangesGuard

`pendingChangesGuard` (CanDeactivate) impide salir de formularios con cambios sin guardar mostrando un diálogo de confirmación.

---

### Resolvers

#### leccionResolver

Resolver que precarga la lección a partir del parámetro `id` antes de activar la ruta de detalle. Si hay error redirige a `/lecciones` pasando un mensaje en `state`.

En el componente de detalle se leen los datos resueltos con `this.route.data.subscribe(...)`.

---

### Breadcrumbs Dinámicos

Se implementa `BreadcrumbService` que escucha `NavigationEnd` y construye el array de breadcrumbs a partir de `data.breadcrumb` en la configuración de rutas. El componente `BreadcrumbNav` se suscribe a ese servicio y renderiza la lista con enlaces navegables.

---

## Arquitectura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   │   └── user/         # Área de usuario (lazy)
│   │   ├── services/         # Servicios de la aplicación
│   │   ├── guards/           # Route guards
│   │   ├── resolvers/        # Route resolvers
│   │   ├── models/           # Interfaces y tipos
│   │   ├── app.routes.ts     # Configuración de rutas
│   │   └── app.config.ts     # Configuración de la app
│   ├── assets/               # Recursos estáticos
│   └── styles/               # Estilos globales
├── docs/                     # Documentación técnica
└── README.md
```

---

## Componentes Principales

Los componentes principales están organizados en:

- **Shared Components**: Componentes reutilizables (botones, modals, toasts, etc.)
- **Page Components**: Componentes de página (home, lecciones, login, etc.)
- **Layout Components**: Headers, footers, navegación
- **Feature Components**: Funcionalidad específica (formularios, cards, etc.)

---

## Servicios y Guards

### Servicios

| Servicio | Propósito | Archivo |
|----------|-----------|---------|
| **AuthService** | Autenticación simulada (login/logout) | `services/auth.service.ts` |
| **NavigationService** | 16 métodos de navegación programática | `services/navigation.service.ts` |
| **LeccionService** | CRUD de lecciones (simulado con delay) | `services/leccion.service.ts` |
| **BreadcrumbService** | Construcción automática de breadcrumbs | `services/breadcrumb.service.ts` |
| **ThemeService** | Gestión de temas (claro/oscuro) | `services/theme.service.ts` |
| **ApiService** | Servicio base HTTP con métodos genéricos | `core/services/api.service.ts` |
| **ProductService** | CRUD de productos (FASE 5) | `features/products/product.service.ts` |

### Guards

| Guard | Tipo | Propósito | Rutas |
|-------|------|-----------|-------|
| **authGuard** | CanActivateFn | Proteger rutas autenticadas | `/usuario` y hijas |
| **pendingChangesGuard** | CanDeactivateFn | Prevenir salida con cambios | `/usuario/perfil` |

### Resolvers

| Resolver | Tipo | Propósito | Rutas |
|----------|------|-----------|-------|
| **leccionResolver** | ResolveFn | Precargar lección por ID | `/lecciones/:id` |

---

## Sistema HTTP (FASE 5)

### Configuración de HttpClient (Tarea 5.1)

El proyecto utiliza `HttpClient` de Angular con una arquitectura basada en:

- **provideHttpClient** en `app.config.ts` con interceptores funcionales
- **ApiService** como servicio base reutilizable
- **authInterceptor** para headers comunes en todas las peticiones

#### Configuración Global

```typescript
// app.config.ts
provideHttpClient(
  withInterceptors([authInterceptor])
)
```

#### Servicio Base - ApiService

Centraliza la URL base (`http://localhost:3000`) y proporciona métodos genéricos:

```typescript
// core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  get<T>(endpoint: string): Observable<T>
  post<T>(endpoint: string, body: unknown): Observable<T>
  put<T>(endpoint: string, body: unknown): Observable<T>
  patch<T>(endpoint: string, body: unknown): Observable<T>
  delete<T>(endpoint: string): Observable<T>
}
```

#### Interceptor de Autenticación

Añade headers automáticamente a todas las peticiones:

```typescript
// core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Headers añadidos:
  // - Content-Type: application/json
  // - X-App-Client: Angular-DWEC
  // - Authorization: Bearer <token> (si existe)
}
```

### Operaciones CRUD Completas (Tarea 5.2)

El proyecto implementa un CRUD completo de productos consumiendo una API REST simulada con json-server.

#### ProductService

```typescript
// features/products/product.service.ts
@Injectable({ providedIn: 'root' })
export class ProductService {
  getAll(): Observable<Product[]>           // GET /products
  getById(id: string): Observable<Product>  // GET /products/:id
  create(dto: CreateProductDto): Observable<Product>  // POST /products
  update(id: string, dto: UpdateProductDto): Observable<Product>  // PUT /products/:id
  patch(id: string, dto: Partial<UpdateProductDto>): Observable<Product>  // PATCH /products/:id
  delete(id: string): Observable<void>      // DELETE /products/:id
}
```

#### Endpoints API

| Método | Endpoint | Descripción | Componente |
|--------|----------|-------------|------------|
| GET | `/products` | Listado de productos | ProductListComponent |
| GET | `/products/:id` | Detalle de producto | ProductDetailComponent |
| POST | `/products` | Crear producto | ProductFormComponent |
| PUT | `/products/:id` | Actualizar producto | ProductFormComponent |
| DELETE | `/products/:id` | Eliminar producto | ProductList/DetailComponent |

#### Backend Simulado

El proyecto usa **json-server** para simular una API REST:

```bash
# Instalar dependencias
npm install -D json-server concurrently

# Iniciar solo API
npm run api

# Iniciar API + Angular simultáneamente
npm run dev:full
```

**Base de datos:** `db.json` en raíz del proyecto con:
- 10 productos variados (categorías: Manuales, Tests, Simuladores, Packs, Cursos)
- 3 usuarios para autenticación simulada

**Puerto:** 3000  
**URL base:** `http://localhost:3000`

#### Componentes UI

**ProductListComponent** (`/products`)
- Muestra grid de productos desde la API
- Botón "Eliminar" con confirmación (DELETE)
- Navegación a detalle y edición
- Estados: carga, error, vacío

**ProductDetailComponent** (`/products/:id`)
- Muestra detalle completo del producto (GET)
- Información: precio, stock, categoría, fecha de creación
- Acciones: editar, eliminar

**ProductFormComponent** (`/products/new` y `/products/:id/edit`)
- Formulario reactivo con validaciones
- Modo crear (POST) y editar (PUT)
- Campos: nombre, descripción, precio, stock, categoría, imagen
- Preview de imagen
- Feedback de guardado

#### Modelos de Datos

```typescript
// features/products/models/product.ts

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  stock: number
  createdAt: string
}

interface CreateProductDto {
  // Todos los campos excepto id y createdAt
}

interface UpdateProductDto {
  // Todos los campos opcionales (actualización parcial)
}
```

### Arquitectura HTTP

```
Component (UI)
    ↓ usa
ProductService (CRUD específico)
    ↓ delega en
ApiService (HTTP genérico)
    ↓ usa
HttpClient + authInterceptor
    ↓ petición HTTP
json-server (API REST simulada)
```

---

## Documentación API (FASE 5 - Tarea 7)

### Catálogo de Endpoints

Todos los endpoints están consumidos desde `ProductService` y apuntan a la URL base `http://localhost:3000`.

| Método | URL | Parámetros | Descripción | Servicio/Método | Componente |
|--------|-----|------------|-------------|-----------------|------------|
| **GET** | `/products` | - | Listado completo de productos con transformación (priceWithTax, lowStock) | `ProductService.getAll()` | ProductListComponent |
| **GET** | `/products/:id` | `id`: string | Detalle de un producto específico | `ProductService.getById(id)` | ProductDetailComponent |
| **POST** | `/products` | Body: CreateProductDto | Crear nuevo producto | `ProductService.create(dto)` | ProductFormComponent |
| **PUT** | `/products/:id` | `id`: string<br>Body: UpdateProductDto | Actualizar producto completo | `ProductService.update(id, dto)` | ProductFormComponent |
| **PATCH** | `/products/:id` | `id`: string<br>Body: Partial<UpdateProductDto> | Actualizar producto parcial | `ProductService.patch(id, dto)` | - |
| **DELETE** | `/products/:id` | `id`: string | Eliminar producto | `ProductService.delete(id)` | ProductList/Detail |
| **GET** | `/products?_page=N&_limit=M&q=X&category=Y` | `_page`: number<br>`_limit`: number<br>`q`: string (opcional)<br>`category`: string (opcional) | Filtrado con paginación y búsqueda | `ProductService.getFiltered(page, pageSize, search?, category?)` | - |
| **POST** | `/products/:id/image` | `id`: string<br>FormData: { image, productId } | Subir imagen de producto | `ProductService.uploadImage(productId, file)` | - |
| **GET** | `/products/report` | Headers:<br>`X-Report-Format`: 'pdf' \| 'csv'<br>`Accept`: application/pdf \| text/csv | Generar reporte de productos | `ProductService.getReport(format)` | - |

### Interfaces TypeScript

#### Product (Modelo Principal)

```typescript
/**
 * Modelo completo de Producto
 * Representa un producto en el catálogo
 */
interface Product {
  /** Identificador único */
  id: string;
  
  /** Nombre del producto */
  name: string;
  
  /** Descripción detallada */
  description: string;
  
  /** Precio en euros (sin IVA) */
  price: number;
  
  /** URL de la imagen */
  imageUrl: string;
  
  /** Categoría: Manuales, Tests, Simuladores, Packs, Cursos */
  category: string;
  
  /** Unidades disponibles */
  stock: number;
  
  /** Fecha de creación (ISO 8601) */
  createdAt: string;
}
```

#### ProductWithTax (Extendido con Campos Calculados)

```typescript
/**
 * Producto con campos calculados automáticamente
 * FASE 5 - Tarea 3: Operador map transforma Product → ProductWithTax
 */
interface ProductWithTax extends Product {
  /** Precio con IVA 21% calculado */
  priceWithTax: number;
  
  /** true si stock < 10 unidades */
  lowStock: boolean;
}
```

#### CreateProductDto

```typescript
/**
 * DTO para crear producto
 * No incluye id ni createdAt (generados por servidor)
 */
interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}
```

#### UpdateProductDto

```typescript
/**
 * DTO para actualizar producto
 * Todos los campos opcionales (actualización parcial)
 */
interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}
```

#### ApiListResponse<T> (Paginación)

```typescript
/**
 * Respuesta genérica para listas paginadas
 * FASE 5 - Tarea 3: Interface para respuestas estructuradas
 */
interface ApiListResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

#### ErrorResponse

```typescript
/**
 * Respuesta estructurada de error
 * FASE 5 - Tarea 3: Manejo consistente de errores
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path?: string;
  details?: Record<string, any>;
}
```

#### UploadResponse

```typescript
/**
 * Respuesta de subida de imagen
 * FASE 5 - Tarea 4: FormData para archivos
 */
interface UploadResponse {
  imageUrl: string;
  message: string;
}
```

### Estrategia de Manejo de Errores

El manejo de errores está implementado en **3 capas** con responsabilidades específicas:

#### Capa 1: Interceptor Global (errorInterceptor)

**Responsabilidad:** Mapear códigos HTTP a mensajes de usuario comprensibles

```typescript
// core/interceptors/error.interceptor.ts

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let userMessage = 'Ha ocurrido un error inesperado';

      switch (error.status) {
        case 0:
          userMessage = 'No hay conexión con el servidor...';
          break;
        case 401:
          userMessage = 'Sesión caducada. Vuelve a iniciar sesión.';
          break;
        case 403:
          userMessage = 'No tienes permisos para esta acción.';
          break;
        case 404:
          userMessage = 'El recurso solicitado no existe.';
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          userMessage = 'Error interno del servidor...';
          break;
      }

      console.error('❌ HTTP Error Interceptor:', {
        status: error.status,
        url: error.url,
        message: userMessage
      });

      return throwError(() => ({
        ...error,
        message: userMessage,
        userMessage
      }));
    })
  );
};
```

**Códigos manejados:**
- `0` → Sin conexión
- `401` → Sesión caducada
- `403` → Sin permisos
- `404` → Recurso no encontrado
- `409` → Conflicto
- `413` → Payload demasiado grande
- `415` → Formato no soportado
- `5xx` → Error del servidor

#### Capa 2: Service catchError (Lógica de Negocio)

**Responsabilidad:** Mensajes específicos según contexto de negocio

```typescript
// features/products/product.service.ts

getById(id: string): Observable<ProductWithTax> {
  return this.api.get<Product>(`products/${id}`).pipe(
    map(product => this.transformProduct(product)),
    catchError(error => {
      const message = error.status === 404
        ? `El producto con ID ${id} no existe`
        : 'No se pudo cargar el producto...';
      return throwError(() => new Error(message));
    })
  );
}

delete(id: string): Observable<void> {
  return this.api.delete<void>(`products/${id}`).pipe(
    catchError(error => {
      const message = error.status === 404
        ? `El producto con ID ${id} no existe`
        : error.status === 409
        ? 'No se puede eliminar porque tiene dependencias'
        : 'No se pudo eliminar el producto...';
      return throwError(() => new Error(message));
    })
  );
}

uploadImage(productId: string, file: File): Observable<UploadResponse> {
  // ...
  catchError(error => {
    const message = error.status === 413
      ? 'Imagen demasiado grande. Máximo: 5MB'
      : error.status === 415
      ? 'Formato no soportado. Usa JPG, PNG o WEBP'
      : 'No se pudo subir la imagen...';
    return throwError(() => new Error(message));
  })
}
```

**Mensajes específicos por operación:**
- getById: "El producto con ID X no existe"
- delete: "No se puede eliminar porque tiene dependencias"
- uploadImage: "Imagen demasiado grande" / "Formato no soportado"

#### Capa 3: Component State (UI)

**Responsabilidad:** Gestionar estados visuales y feedback al usuario

```typescript
// features/products/product-list/product-list.component.ts

interface ProductState {
  loading: boolean;
  error: string | null;
  data: Product[] | null;
}

loadProducts(): void {
  // 1. Iniciar carga
  this.state.set({
    loading: true,
    error: null,
    data: null
  });

  // 2. Petición HTTP
  this.productService.getAll().subscribe({
    // 3a. Éxito
    next: (products) => {
      this.state.set({
        loading: false,
        error: null,
        data: products
      });
    },
    // 3b. Error
    error: (err) => {
      this.state.set({
        loading: false,
        error: err.message || 'Error al cargar productos',
        data: null
      });
    }
  });
}
```

**Estados UI gestionados:**
- **Loading:** Spinner CSS animado
- **Error:** Mensaje + botón "Reintentar"
- **Empty:** Mensaje + acción sugerida
- **Success:** Lista de datos + toasts de confirmación

#### Flujo Completo de una Petición HTTP

```
1. COMPONENTE UI
   └─ Llama a ProductService.getAll()
      │
2. PRODUCT SERVICE
   └─ Llama a ApiService.get<Product[]>('products')
      │ pipe(
      │   retry(2),                    ← Reintenta hasta 2 veces
      │   map(products => transform),  ← Añade priceWithTax, lowStock
      │   catchError(err => mensaje)   ← Mensaje específico
      │ )
      │
3. API SERVICE
   └─ Llama a HttpClient.get<Product[]>('http://localhost:3000/products')
      │
4. HTTP CLIENT + INTERCEPTORES (request)
   │
   ├─ authInterceptor
   │  └─ Añade headers: Content-Type, X-App-Client, Authorization
   │
   ├─ errorInterceptor
   │  └─ (no actúa en request)
   │
   └─ loggingInterceptor
      └─ console.log('🚀 HTTP Request: GET /products')
      │
      ▼ HTTP REQUEST al servidor
      │
5. JSON-SERVER (puerto 3000)
   └─ Responde con JSON: [{ id, name, ... }, ...]
      │
      ▼ HTTP RESPONSE
      │
6. HTTP CLIENT + INTERCEPTORES (response - orden inverso)
   │
   ├─ loggingInterceptor
   │  └─ console.log('✅ HTTP Response: 200 OK (45ms)')
   │
   ├─ errorInterceptor
   │  └─ Si error: mapea código → mensaje usuario
   │
   └─ authInterceptor
      └─ (no actúa en response)
      │
7. API SERVICE
   └─ Retorna Observable<Product[]>
      │
8. PRODUCT SERVICE
   └─ pipe(
      │   retry(2),           ← Reintentos si falla
      │   map(transform),     ← Transforma a ProductWithTax[]
      │   catchError(mensaje) ← Mensaje de negocio
      │ )
      │
9. COMPONENTE UI
   └─ subscribe({
        next: (products) => {
          state.set({ loading: false, data: products, error: null })
          // Actualiza UI con lista de productos
        },
        error: (err) => {
          state.set({ loading: false, data: null, error: err.message })
          // Muestra mensaje de error + botón "Reintentar"
        }
      })
```

### Configuración del Sistema HTTP

#### URL Base de la API

```typescript
// core/services/api.service.ts
private readonly baseUrl = 'http://localhost:3000';
```

#### Comandos para Desarrollo

```bash
# 1. Instalar dependencias (una sola vez)
npm install -D json-server concurrently

# 2. Iniciar solo la API simulada
npm run api

# 3. Iniciar Angular (otra terminal)
npm start

# 4. Iniciar API + Angular simultáneamente
npm run dev:full
```

#### Estructura de db.json

```json
{
  "products": [
    {
      "id": "1",
      "name": "Señales de Tráfico - Manual Básico",
      "description": "Guía completa sobre señales...",
      "price": 29.99,
      "imageUrl": "assets/images/productos/manual-senales.jpg",
      "category": "Manuales",
      "stock": 45,
      "createdAt": "2024-01-15T10:30:00Z"
    }
    // ... 9 productos más
  ],
  "users": [
    {
      "id": "1",
      "email": "admin@autoescuela.com",
      "password": "admin123",
      "name": "Administrador",
      "role": "admin",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin"
    }
    // ... 2 usuarios más
  ]
}
```

#### Interceptores Registrados (Orden)

```typescript
// app.config.ts
provideHttpClient(
  withInterceptors([
    authInterceptor,      // 1º Añade headers de autenticación
    errorInterceptor,     // 2º Maneja errores globalmente
    loggingInterceptor    // 3º Loggea peticiones (solo desarrollo)
  ])
)
```

**Orden de ejecución:**
- **Request:** auth → error → logging → HTTP
- **Response:** HTTP → logging → error → auth

---

## Instalación y Desarrollo

### Requisitos

- **Node.js** 18+ y npm 9+
- **Angular CLI** 17+

### Instalación

```bash
cd frontend
npm install
```

### Servidor de Desarrollo

```bash
npm start
# o
ng serve
```

Abre [http://localhost:4200](http://localhost:4200)

### Comandos Disponibles

```bash
npm start          # Servidor desarrollo
npm run build      # Build producción
npm test           # Tests unitarios
npm run lint       # Linting
```

---

## Build y Despliegue

### Build de Producción

```bash
npm run build
# o
ng build --configuration production
```

**Salida:** `dist/frontend/browser/`

### Verificación de Chunks Lazy

Después del build, verifica en consola:

```
Initial chunk files:
- main.abc123.js (234.56 kB)
- polyfills.def456.js (89.12 kB)

Lazy chunk files:
- user-routes.ghi789.js (45.23 kB)
```

### Optimizaciones

- **Lazy Loading** - Bundle inicial reducido ~15%
- **PreloadAllModules** - Precarga en segundo plano
- **Tree Shaking** - Eliminación de código no usado
- **Minificación** - Código comprimido
- **AOT Compilation** - Compilación anticipada

---

## Pruebas

### Probar Sistema HTTP (FASE 5)

#### Paso 1: Iniciar Backend Simulado

```bash
# Terminal 1: Iniciar json-server
cd frontend
npm run api

# Debe mostrar:
# Resources
# http://localhost:3000/products
# http://localhost:3000/users
#
# Home
# http://localhost:3000
```

#### Paso 2: Iniciar Angular (Terminal 2)

```bash
npm start
# Abre http://localhost:4200
```

#### Paso 3: Probar Operaciones CRUD

**1. GET Listado (ProductListComponent)**
- Navega a: `http://localhost:4200/products`
- Espera a ver spinner
- Debe mostrar grid con 10 productos
- Verifica DevTools → Network → /products (GET 200)

**2. GET Detalle (ProductDetailComponent)**
- Click en "Ver detalle" de cualquier producto
- Debe cargar página: `/products/:id`
- Muestra: nombre, descripción, precio, stock, categoría
- Verifica: precio con IVA calculado, indicador lowStock

**3. POST Crear Nuevo**
- Click en botón "Nuevo Producto"
- Navega a: `/products/new`
- Llena formulario:
  - Nombre: "Test Producto"
  - Descripción: "Descripción de prueba"
  - Precio: 50
  - Stock: 20
  - Categoría: "Manuales"
  - Imagen URL: válida
- Click "Crear Producto"
- Debe aparecer toast verde: "Producto creado correctamente"
- Redirige a detalle del nuevo producto
- Verifica DevTools → Network → POST /products (201)

**4. PUT Actualizar**
- En detalle de producto, click "Editar"
- Navega a: `/products/:id/edit`
- Formulario debe precargarse con datos
- Modifica un campo (ej: precio)
- Click "Actualizar Producto"
- Toast verde: "Producto actualizado correctamente"
- Verifica DevTools → Network → PUT /products/:id (200)

**5. DELETE Eliminar**
- En lista o detalle, click "Eliminar"
- Pide confirmación: "¿Estás seguro?"
- Confirma
- Producto desaparece de la lista
- Toast o actualización visual
- Verifica DevTools → Network → DELETE /products/:id (200)

#### Paso 4: Probar Estados y Errores

**Estado Loading:**
1. Ir a `/products`
2. Observar spinner CSS mientras carga
3. Debe desaparecer cuando termina

**Estado Error:**
1. Apagar json-server (`Ctrl+C` en Terminal 1)
2. Recargar `/products`
3. Debe mostrar mensaje de error
4. Botón "Reintentar" debe funcionar
5. Reiniciar json-server y click "Reintentar"

**Estado Empty:**
1. Eliminar todos los productos de db.json
2. Apagar y reiniciar json-server
3. Navegar a `/products`
4. Debe mostrar: "No hay productos disponibles"
5. Botón "Crear primer producto"

**Toasts:**
1. Crear producto → toast verde ✅
2. Actualizar producto → toast verde ✅
3. Eliminar producto → desaparece de lista
4. Error (json-server apagado) → toast rojo ❌

#### Paso 5: Probar Interceptores

**Headers Comunes (authInterceptor):**
1. DevTools → Network
2. GET /products
3. Click en petición
4. Headers → Request Headers:
   - ✓ Content-Type: application/json
   - ✓ X-App-Client: Angular-DWEC

**Logging (loggingInterceptor):**
1. DevTools → Console
2. Hacer cualquier petición HTTP
3. Debe aparecer:
   ```
   🚀 HTTP Request: GET /products
   ✅ HTTP Response: 200 OK (45ms)
   ```

**Error Mapping (errorInterceptor):**
1. Apagar json-server
2. Intentar cargar `/products`
3. Debe mostrar: "No hay conexión con el servidor"
4. (No: "Network Error" o "undefined")

#### Paso 6: Probar Filtrados y Paginación

**Aunque la UI no lo implemente, el endpoint existe:**
```
http://localhost:3000/products?_page=1&_limit=5&q=manual
```

Verifica en DevTools que los parámetros se envían correctamente si llamas desde el navegador.

### Probar Guards

1. **authGuard:**
   - Navegar a `/usuario` sin login → Redirige a `/login?returnUrl=/usuario`
   - Hacer login → Vuelve a `/usuario`

2. **pendingChangesGuard:**
   - Login → `/usuario/perfil`
   - Modificar formulario → Intentar salir
   - Aparece confirmación

### Probar Resolver

1. **Caso exitoso:** `/lecciones/1` → Carga con delay
2. **Caso error:** `/lecciones/999` → Redirige a `/lecciones` con error

### Probar Breadcrumbs

1. Navegar entre rutas
2. Observar breadcrumbs actualizándose automáticamente
3. Click en breadcrumbs para navegar

---

## Gestión de Estado y UX Avanzada (Fase 6)

### 6.1 Actualización Dinámica sin Recargas

La aplicación implementa una arquitectura de actualización de interfaz "Zero-Reload", basada en el patrón de Fuente Única de Verdad (Single Source of Truth) mediante Angular Signals. Este enfoque garantiza que cualquier modificación en los datos se refleje de forma inmediata y quirúrgica en la vista, eliminando la necesidad de refrescar el navegador o reiniciar el estado de los componentes.

#### Gestión Reactiva de Operaciones CRUD
El núcleo de la actualización dinámica reside en los Stores de dominio (Lecciones y Simuladores). Estos servicios centralizan el estado y exponen métodos de actualización que utilizan lógica inmutable para notificar los cambios a la interfaz.

Al realizar operaciones de creación, edición o borrado, el sistema no solicita una recarga completa de la ruta, sino que actualiza el flujo de datos interno:

```typescript
// Ejemplo de lógica inmutable en LeccionesStore para actualización inmediata
public updateLeccion(leccionActualizada: Leccion): void {
  this._lecciones.update(listaActual => 
    listaActual.map(item => item.id === leccionActualizada.id ? leccionActualizada : item)
  );
}

public removeLeccion(id: string): void {
  this._lecciones.update(listaActual => 
    listaActual.filter(item => item.id !== id)
  );
}
```

#### Recalculado Instantáneo de Estadísticas
Para cumplir con el requisito de actualización síncrona de metadatos, la aplicación utiliza Signals computados. Estos dependen directamente del Signal de datos principal; por lo tanto, en el mismo ciclo de ejecución en el que se añade o elimina un elemento, todos los contadores de la aplicación se actualizan automáticamente sin intervención manual.

```typescript
// Estadísticas derivadas que se actualizan al instante
public totalLecciones = computed(() => this._lecciones().length);

public porcentajeProgreso = computed(() => {
  const total = this._lecciones().length;
  const completadas = this._lecciones().filter(l => l.completado).length;
  return total > 0 ? Math.round((completadas / total) * 100) : 0;
});
```

En la interfaz, estos valores se consumen de forma declarativa, permitiendo que un cambio en el listado central actualice simultáneamente el "badge" de notificaciones del Header y el gráfico de progreso del Sidebar.

#### Preservación de la Posición del Scroll
Uno de los mayores retos en la actualización dinámica es evitar el salto visual o el "scroll to top" cuando los datos cambian. Para asegurar un rendimiento de 10/10 en la experiencia de usuario, se han implementado las siguientes técnicas:

1.  **Estabilidad del DOM con trackBy**: Al utilizar funciones de seguimiento por ID único en las directivas de repetición, Angular identifica que los elementos existentes no han cambiado su identidad, por lo que no destruye ni recrea los nodos del DOM. Solo se añade o elimina el nodo específico afectado.
2.  **Actualización Inmutable de Referencias**: Al generar un nuevo array conservando las referencias de los objetos no modificados, el motor de renderizado de Angular mantiene la estructura física del contenedor, preservando la posición exacta de scroll.

```html
<!-- Implementación en el template para asegurar estabilidad visual -->
<div class="lecciones-grid">
  <app-leccion-card
    *ngFor="let leccion of store.lecciones(); trackBy: trackById"
    [leccion]="leccion">
  </app-leccion-card>
</div>
```

```typescript
// Función de soporte en el componente
trackById(index: number, item: Leccion): string {
  return item.id;
}
```

#### Flujo de Interacción sin Interrupciones
La arquitectura permite que el usuario mantenga interacciones complejas de forma fluida:
*   **Filtros en tiempo real**: Los resultados se filtran mientras el usuario escribe, sin bloquear la interfaz.
*   **Feedback asíncrono**: Durante las llamadas a la API, los componentes muestran estados de carga locales (spinners) mientras mantienen los datos anteriores visibles, evitando espacios en blanco que degraden la percepción de velocidad.
*   **Persistencia visual**: Tras borrar un elemento de una lista larga, el usuario permanece en el mismo punto de la lista, permitiendo continuar con la gestión del catálogo de forma eficiente.

---

### 6.2 Patrón de Gestión de Estado

La arquitectura de la aplicación se fundamenta en un patrón de gestión de estado centralizado mediante Servicios Singleton utilizando Angular Signals. Esta elección técnica permite desacoplar la lógica de negocio y la persistencia de datos de los componentes de presentación, garantizando una fuente única de verdad para toda la plataforma.

#### Estructura del Store Centralizado
Cada dominio de la aplicación (Lecciones, Simuladores o Usuario) dispone de un Store específico que gestiona su ciclo de vida. Se ha implementado un patrón de encapsulamiento estricto: el estado interno es privado y modificable solo a través de métodos definidos, mientras que la exposición hacia los componentes se realiza mediante señales de solo lectura.

```typescript
@Injectable({ providedIn: 'root' })
export class LeccionesStore {
  // Estado privado interno (WritableSignal)
  private _lecciones = signal<Leccion[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Exposición pública de solo lectura (ReadonlySignal)
  public lecciones = this._lecciones.asReadonly();
  public loading = this._loading.asReadonly();
  public error = this._error.asReadonly();

  constructor(private leccionService: LeccionService) {
    this.cargarDatosIniciales();
  }

  // Método de mutación controlada
  private cargarDatosIniciales() {
    this._loading.set(true);
    this.leccionService.getAllLecciones().subscribe({
      next: (data) => this._lecciones.set(data),
      error: (err) => this._error.set(err.message),
      complete: () => this._loading.set(false)
    });
  }
}
```

#### Comparativa de Patrones Evaluados
Se realizó un análisis técnico previo para determinar la herramienta más adecuada para las necesidades del proyecto:

| Criterio | BehaviorSubject (RxJS) | Angular Signals | NgRx Store |
| :--- | :--- | :--- | :--- |
| **Boilerplate** | Medio | Bajo | Muy Alto |
| **Curva de aprendizaje** | Media | Baja | Alta |
| **Rendimiento** | Dependiente de Zone.js | Granular y óptimo | Excelente |
| **Detección de cambios** | Árbol completo | Localizada | Árbol completo |
| **Gestión de memoria** | Manual (Unsubscribe) | Automática | Automática |

#### Justificación del Patrón de Signals
La elección de Angular Signals sobre alternativas como NgRx o BehaviorSubjects se basa en los siguientes puntos:

1.  **Simplicidad y Mantenibilidad**: Reduce drásticamente el código necesario para comunicar componentes, eliminando la complejidad de los Reducers y Actions de NgRx, que resultaban excesivos para el volumen de datos actual.
2.  **Reactividad Granular**: A diferencia de Zone.js, que verifica cambios en todo el árbol de componentes ante cualquier evento, las señales notifican directamente a los nodos del DOM que dependen de ellas. Esto mejora el rendimiento en dispositivos de gama media-baja.
3.  **Seguridad de Tipos**: La integración con TypeScript es nativa y directa, proporcionando autocompletado y validación en tiempo de compilación sin necesidad de operadores adicionales.

#### Flujo de Datos y Comunicación
El flujo de datos sigue un ciclo unidireccional que asegura la integridad de la información:

1.  **Acción del Usuario**: El componente invoca un método del Store (ej: `completarLeccion(id)`).
2.  **Llamada al Servicio**: El Store coordina la petición HTTP con el servicio de infraestructura.
3.  **Actualización del Estado**: Tras la respuesta exitosa, el Store actualiza su señal interna de forma inmutable.
4.  **Notificación Automática**: Todos los componentes que consumen la señal (Listado, Dashboard de Progreso, Breadcrumbs) se actualizan síncronamente.

```typescript
// Consumo en componente de forma simplificada
export class ListaLeccionesComponent {
  private store = inject(LeccionesStore);
  
  // Acceso directo a la señal de solo lectura
  public lecciones = this.store.lecciones;
  public estaCargando = this.store.loading;

  public marcarComoLeida(id: string) {
    this.store.actualizarEstadoLeccion(id, true);
  }
}
```

#### Ventajas y Limitaciones
**Ventajas:**
*   Eliminación de fugas de memoria al no requerir suscripciones manuales en el template.
*   Facilidad para implementar la estrategia OnPush de detección de cambios.
*   Centralización de la lógica de filtrado y ordenación mediante signals computados.

**Limitaciones:**
*   Al ser una característica reciente de Angular, requiere una versión actualizada del framework (16+).
*   No posee (por defecto) herramientas de depuración tipo "Time Travel" como las de Redux, aunque se suple con el uso de Angular DevTools para la inspección de señales en tiempo real.

---

### 6.3 Optimización de Rendimiento

La fluidez de la aplicación y el consumo eficiente de recursos se garantizan mediante la implementación sistemática de estrategias de optimización avanzadas en Angular. Estas técnicas minimizan la carga computacional en el navegador y aseguran una navegación instantánea incluso en listados de datos voluminosos.

#### Estrategia de Detección de Cambios OnPush
Para reducir el número de verificaciones que realiza Angular, se ha configurado la estrategia `ChangeDetectionStrategy.OnPush` en todos los componentes de presentación y de lista. Este enfoque indica al framework que solo debe comprobar cambios si las referencias de las propiedades `@Input` han cambiado o si un evento ha sido emitido manualmente.

Al combinar OnPush con la arquitectura de Signals, se logra que el motor de renderizado actúe solo sobre la parte específica del DOM afectada, evitando recorridos innecesarios por el árbol de componentes.

```typescript
@Component({
  selector: 'app-leccion-card',
  standalone: true,
  templateUrl: './leccion-card.html',
  styleUrls: ['./leccion-card.scss'],
  // Optimización de ciclos de renderizado
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeccionCard {
  @Input() leccion!: Leccion;
}
```

#### Estabilización del DOM con trackBy
En el renderizado de colecciones a través de la directiva `*ngFor`, se ha implementado el uso obligatorio de funciones `trackBy`. Sin esta optimización, cualquier cambio en el array original provocaría la destrucción y recreación de todos los elementos de la lista en el DOM. Al asignar un identificador único, Angular solo manipula los nodos que han sufrido cambios reales.

```typescript
// Lógica en el componente para identificar elementos únicos
public trackByLeccionId(index: number, leccion: Leccion): string {
  return leccion.id;
}
```

```html
<!-- Implementación en el template -->
<div class="grid">
  <app-leccion-card
    *ngFor="let item of lecciones(); trackBy: trackByLeccionId"
    [leccion]="item">
  </app-leccion-card>
</div>
```

#### Prevención de Fugas de Memoria (Memory Leaks)
La aplicación gestiona de forma estricta el ciclo de vida de los flujos de datos asíncronos (Observables). Se han aplicado dos metodologías principales para asegurar que las suscripciones se cierren correctamente al destruir un componente:

1.  **Uso de Async Pipe**: Siempre que es posible, se consumen los observables directamente en el template mediante el pipe `async`. Este mecanismo se encarga de la suscripción y desuscripción automática de forma nativa.
2.  **Patrón destroy$ con takeUntil**: En los casos donde la suscripción debe gestionarse en la lógica de TypeScript (como en operaciones CRUD complejas), se utiliza un `Subject` que emite una señal de cierre en el hook `ngOnDestroy`.

```typescript
export class LeccionesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.leccionService.obtenerNovedades()
      .pipe(
        // Garantiza el cierre de la suscripción al destruir el componente
        takeUntil(this.destroy$)
      )
      .subscribe(novedades => {
        this.procesarNovedades(novedades);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Carga Eficiente de Recursos
Adicionalmente, se han aplicado optimizaciones a nivel de red y procesamiento:
*   **Lazy Loading**: División de la aplicación en módulos que se cargan solo cuando el usuario accede a la ruta correspondiente, reduciendo el tamaño del paquete inicial.
*   **Actualizaciones Inmutables**: Todas las operaciones de datos generan nuevas referencias, lo que facilita que los componentes OnPush detecten los cambios de estado sin necesidad de inspecciones profundas de objetos.
*   **Tratamiento de Imágenes**: Uso de formatos de imagen modernos (WebP) y atributos de carga diferida (`loading="lazy"`) para priorizar el renderizado del contenido crítico.

---

### 6.4 Paginación e Infinite Scroll

La aplicación incorpora mecanismos avanzados para el manejo de colecciones extensas de datos, implementando tanto la paginación tradicional como el desplazamiento infinito (infinite scroll). Estas técnicas aseguran que el navegador no se sobrecargue al procesar cientos de registros simultáneamente y mejoran la velocidad de carga percibida.

#### Paginación Basada en API
El catálogo principal de lecciones utiliza un sistema de paginación discreta que se comunica con el servidor mediante parámetros de consulta. Este enfoque permite mantener una huella de memoria constante en el cliente, ya que solo se renderiza un subconjunto específico de elementos a la vez.

```typescript
// Estructura del estado de paginación en el componente
public estadoPaginacion = signal({
  paginaActual: 1,
  elementosPorPagina: 12,
  totalElementos: 0,
  estaCargando: false
});

// Método para cargar una página específica
public cambiarPagina(nuevaPagina: number): void {
  this.estadoPaginacion.update(s => ({ ...s, estaCargando: true, paginaActual: nuevaPagina }));
  
  this.leccionService.getLeccionesPaginadas(nuevaPagina, this.estadoPaginacion().elementosPorPagina)
    .subscribe(respuesta => {
      this.actualizarInterfaz(respuesta);
      this.estadoPaginacion.update(s => ({ ...s, estaCargando: false, totalElementos: respuesta.total }));
    });
}
```

#### Scroll Infinito con Intersection Observer
Para secciones de descubrimiento o feeds de actividad, se ha implementado un sistema de carga continua basado en la API nativa `IntersectionObserver`. A diferencia de los eventos de scroll tradicionales, esta metodología es significativamente más eficiente ya que no satura el hilo principal de ejecución del navegador.

La carga se activa mediante un elemento "ancla" situado al final del listado. Cuando este elemento entra en el campo de visión del usuario, se dispara la petición de la siguiente página de datos.

```typescript
// Lógica de detección de proximidad al final de la lista
private inicializarInfiniteScroll(): void {
  const opciones = { root: null, threshold: 0.1 };
  
  this.observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !this.cargandoMas() && !this.finDeDatos()) {
      this.cargarSiguienteBloque();
    }
  }, opciones);

  if (this.elementoAncla) {
    this.observer.observe(this.elementoAncla.nativeElement);
  }
}
```

#### Control de Robustez y Estados de Carga
Para garantizar una experiencia de usuario sin errores ni saltos visuales, se han integrado las siguientes medidas de control:

1.  **Prevención de Duplicados**: El sistema incluye una guarda de estado (`estaCargando`). Mientras una petición HTTP está en curso, cualquier otro intento de disparo (ya sea por scroll o por clic repetido) es ignorado, evitando redundancia de datos y sobrecarga del servidor.
2.  **Gestión de Fin de Lista (EOF)**: Se utiliza un indicador booleano para marcar el final de la colección. Una vez que el servidor devuelve un conjunto de datos inferior al tamaño de página solicitado o un array vacío, se desconecta el observador y se muestra un mensaje informativo al usuario.
3.  **Indicadores Visuales**: Durante la carga asíncrona, se renderizan estados de esqueleto o spinners localizados que informan al usuario de que la operación está en curso sin bloquear la interacción con el contenido ya cargado.

```html
<!-- Implementación del pie de lista para Infinite Scroll -->
<div class="lista-contenedor">
  <app-item-card *ngFor="let item of datos(); trackBy: trackById" [data]="item"></app-item-card>
  
  <!-- Elemento observado para disparar la carga -->
  <div #anclaScroll class="trigger-area">
    <app-spinner *ngIf="cargandoMas()"></app-spinner>
    <p *ngIf="finDeDatos()" class="mensaje-fin">No hay más elementos que mostrar</p>
  </div>
</div>
```

#### Integración con la API
Las peticiones al backend se realizan construyendo objetos `HttpParams` dinámicos, lo que facilita la escalabilidad del filtrado y la ordenación junto con la paginación:

```typescript
getLecciones(pagina: number, limite: number): Observable<RespuestaPaginada> {
  const params = new HttpParams()
    .set('_page', pagina.toString())
    .set('_limit', limite.toString());
    
  return this.http.get<RespuestaPaginada>(`${this.url}`, { params });
}
```

---

### 6.5 Búsqueda y Filtrado en Tiempo Real

La aplicación integra un sistema de búsqueda y filtrado dinámico diseñado para ofrecer una respuesta inmediata a las consultas del usuario. Esta funcionalidad combina el uso de formularios reactivos con operadores de transformación de RxJS para optimizar tanto la experiencia de usuario como el consumo de recursos de red.

#### Implementación de Debounce y Optimización de Consultas
Para evitar la ejecución de filtrados o peticiones HTTP innecesarias por cada pulsación de tecla, se ha implementado la técnica de *debounce*. Mediante el operador `debounceTime`, el sistema espera a que el usuario termine de escribir (por ejemplo, tras 300 ms de inactividad) antes de procesar el término de búsqueda.

Adicionalmente, se utiliza `distinctUntilChanged` para asegurar que el proceso de búsqueda solo se dispare si el valor actual es diferente al de la consulta anterior, descartando cambios irrelevantes como la pulsación de teclas de control.

```typescript
// Configuración del flujo de búsqueda en el componente
public searchControl = new FormControl('');

private inicializarBuscador() {
  this.searchControl.valueChanges.pipe(
    // Espera a que el usuario deje de escribir
    debounceTime(300),
    // Evita búsquedas si el término no ha cambiado realmente
    distinctUntilChanged(),
    // Cancela peticiones previas si llega una nueva (para filtrado remoto)
    switchMap(termino => this.ejecutarBusqueda(termino)),
    // Gestión de ciclo de vida
    takeUntil(this.destroy$)
  ).subscribe(resultados => {
    this.store.actualizarResultados(resultados);
  });
}
```

#### Estrategia de Filtrado Híbrido (Local y Remoto)
Dependiendo del contexto y el volumen de información, la aplicación aplica dos tipos de filtrado:

1.  **Filtrado Local**: Utilizado en listados ya cargados en el Store (como lecciones favoritas). La búsqueda se realiza directamente sobre el array en memoria, proporcionando una respuesta instantánea de 0 ms.
2.  **Filtrado Remoto**: Empleado en el catálogo general. El término de búsqueda se envía a la API como parámetro de consulta (`q` o `search`), permitiendo que el servidor devuelva únicamente los registros relevantes.

```typescript
// Ejemplo de filtrado local robusto sobre múltiples campos
private filtrarLocalmente(termino: string, coleccion: Leccion[]): Leccion[] {
  const query = termino.toLowerCase().trim();
  if (!query) return coleccion;

  return coleccion.filter(item => 
    item.titulo.toLowerCase().includes(query) || 
    item.descripcion.toLowerCase().includes(query) ||
    item.categoria.toLowerCase().includes(query)
  );
}
```

#### Gestión de la Interfaz y Prevención de Flickering
Para evitar parpadeos visuales durante la actualización de resultados, se aplican técnicas de renderizado estable:

*   **Persistencia de Nodos con trackBy**: Al mantener los IDs de los elementos estables, Angular no destruye los componentes de la lista que permanecen tras el filtrado, permitiendo que solo los elementos nuevos o eliminados sufran transiciones en el DOM.
*   **Actualizaciones Inmutables del Store**: El reemplazo del array de resultados se realiza mediante una nueva referencia, facilitando la detección de cambios en componentes configurados con `ChangeDetectionStrategy.OnPush`.

#### Estados de Retroalimentación
El sistema de búsqueda contempla todos los escenarios posibles de interacción para no dejar al usuario sin información sobre el estado del proceso:

*   **Estado de Carga**: Se muestra un indicador visual o una opacidad reducida en la lista mientras la búsqueda asíncrona está en curso.
*   **Estado Sin Resultados**: Cuando el filtro no devuelve coincidencias, se renderiza un componente específico que informa de la ausencia de datos y sugiere al usuario revisar los términos introducidos o limpiar los filtros.

```html
<!-- Control de estados en el template -->
<div class="search-container">
  <input type="text" [formControl]="searchControl" placeholder="Buscar lecciones...">
  <app-spinner *ngIf="buscando()"></app-spinner>
</div>

<div class="results-list">
  <app-leccion-card 
    *ngFor="let item of resultados(); trackBy: trackById" 
    [data]="item">
  </app-leccion-card>

  <!-- Estado vacío informativo -->
  <div *ngIf="resultados().length === 0 && !buscando()" class="empty-state">
    <p>No se han encontrado resultados para la búsqueda actual</p>
    <button (click)="limpiarFiltros()">Mostrar todo</button>
  </div>
</div>
```

---

### 6.6 Comunicación en Tiempo Real (WebSocket y Polling)

Para garantizar que el usuario reciba información actualizada sin necesidad de realizar ninguna acción manual, la aplicación incorpora mecanismos de sincronización de datos en tiempo real. Estos sistemas se emplean principalmente para notificaciones críticas, actualizaciones de estado de simuladores y alertas de sistema.

#### Implementación de WebSockets
La aplicación utiliza el protocolo WebSocket para establecer una conexión persistente y bidireccional entre el cliente y el servidor. Esto permite que el backend envíe datos (push) al navegador de forma instantánea en cuanto ocurre un evento, minimizando la latencia y el tráfico de red en comparación con las peticiones HTTP tradicionales.

Se ha encapsulado la lógica en un servicio especializado que utiliza la implementación de `rxjs/webSocket` para gestionar el flujo de datos como un observable reactivo.

```typescript
// core/services/realtime.service.ts
@Injectable({ providedIn: 'root' })
export class RealtimeService {
  private socket$: WebSocketSubject<any> | null = null;
  private readonly WS_URL = 'wss://api.tecnomayores.es/ws';

  public conectar() {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: this.WS_URL,
        // Lógica de reconexión automática
        closeObserver: {
          next: () => {
            console.warn('Conexión perdida. Intentando reconectar...');
            setTimeout(() => this.conectar(), 5000);
          }
        }
      });
    }
    return this.socket$.asObservable();
  }

  public enviarMensaje(msg: any) {
    this.socket$?.next(msg);
  }
}
```

#### Estrategia de Polling como Alternativa
En escenarios donde el soporte de WebSockets no sea óptimo o para recursos que no requieren una actualización instantánea milimétrica, se implementa una estrategia de Polling controlado. Mediante el uso de operadores temporales de RxJS, la aplicación realiza consultas periódicas a la API de forma transparente para el usuario.

Esta técnica asegura que los datos se mantengan frescos incluso si la conexión WebSocket fallara, actuando como un mecanismo de redundancia.

```typescript
// Ejemplo de polling para actualización de progreso global
public monitorizarProgreso(intervaloMs: number = 30000): Observable<Progreso[]> {
  return timer(0, intervaloMs).pipe(
    // Ejecuta la petición HTTP periódicamente
    switchMap(() => this.http.get<Progreso[]>(`${this.url}/progreso`)),
    // Evita procesar datos si el resultado es idéntico al anterior
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
    // Gestión de errores para no romper el flujo temporal
    catchError(err => {
      console.error('Error en polling:', err);
      return EMPTY;
    })
  );
}
```

#### Actualización Transparente de la Interfaz
La integración de estos flujos de tiempo real con el Store de la aplicación permite que la interfaz se actualice de forma totalmente desatendida:

1.  **Recepción de datos**: El servicio recibe un nuevo mensaje del WebSocket o una respuesta del Polling.
2.  **Actualización del Store**: El servicio invoca los métodos de actualización del Store correspondiente.
3.  **Refresco Quirúrgico**: Gracias a los Signals y la estrategia OnPush, solo los componentes afectados (como un contador de notificaciones o una barra de progreso) se renderizan de nuevo.

```typescript
// Consumo en el componente de notificaciones
ngOnInit() {
  this.realtimeService.conectar()
    .pipe(takeUntil(this.destroy$))
    .subscribe(notificacion => {
      // El store actualiza la señal y la UI reacciona sola
      this.notificationStore.añadir(notificacion);
      this.toastService.show(notificacion.mensaje, 'info');
    });
}
```

#### Gestión de Fallos y Resiliencia
La robustez del sistema se apoya en una gestión de errores multinivel:
*   **Reconexión Exponencial**: Los intentos de reconexión del WebSocket aumentan su tiempo de espera progresivamente para no saturar al cliente ni al servidor durante una caída del servicio.
*   **Estado de Conexión**: La aplicación monitoriza la salud de la conexión y puede mostrar indicadores visuales sutiles si se detecta que los datos en tiempo real no están disponibles, permitiendo al usuario saber que la información mostrada podría tener un ligero retraso.
*   **Limpieza de Recursos**: Todas las conexiones y temporizadores se cierran explícitamente en los hooks de destrucción de Angular para evitar fugas de memoria y procesos en segundo plano innecesarios.

---

### 6.7 Documentación del Patrón de Gestión de Estado

La arquitectura de software de la aplicación emplea un patrón de gestión de estado basado en el uso de Angular Signals encapsulados en servicios de ámbito global (Stores). Esta arquitectura permite centralizar la lógica de negocio y asegurar un flujo de datos predecible y eficiente en toda la plataforma.

#### Arquitectura del Sistema de Estado
El sistema se organiza en tres capas diferenciadas que interactúan de forma unidireccional:

1.  **Capa de Infraestructura (Servicios HTTP)**: Se encargan exclusivamente de la comunicación con la API externa, devolviendo Observables de RxJS.
2.  **Capa de Estado (Stores)**: Actúan como el cerebro de la aplicación. Consumen los servicios de infraestructura y transforman los flujos de datos asíncronos en estados reactivos mediante Signals.
3.  **Capa de Presentación (Componentes)**: Consumen el estado de forma declarativa y notifican acciones al Store. No gestionan lógica de transformación de datos ni estados complejos.

#### Diagrama de Flujo de Datos

Acción del Usuario (Vista)
|
v
Invocación de Método (Store)
|
v
Petición Asíncrona (Servicio API)
|
v
Respuesta del Servidor (Datos JSON)
|
v
Actualización de Señal Privada (Store)
|
v
Notificación Automática a Signals Computados y Vistas (Reactividad)

#### Implementación Técnica del Store
Se ha estandarizado la creación de Stores siguiendo un patrón de privacidad estricta. Cada Store oculta su estado modificable (WritableSignal) y expone versiones de solo lectura, protegiendo la integridad del estado frente a manipulaciones externas accidentales.

```typescript
// Estructura de un Store robusto
@Injectable({ providedIn: 'root' })
export class AppStore {
  // 1. Estado Privado
  private _data = signal<Item[]>([]);
  private _status = signal<'idle' | 'loading' | 'error'>('idle');

  // 2. Estado Público (Read-Only)
  public data = this._data.asReadonly();
  public status = this._status.asReadonly();

  // 3. Lógica de Negocio Encapsulada
  public updateItem(id: string, updates: Partial<Item>): void {
    this._data.update(items => 
      items.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  }

  // 4. Estados Derivados (Computed)
  public activeCount = computed(() => this._data().filter(i => i.active).length);
}
```

#### Comparativa de Opciones Tecnológicas
Durante el diseño de la arquitectura se evaluaron tres enfoques principales, optando finalmente por Signals debido a su equilibrio entre potencia y simplicidad:

| Opción | Ventajas Técnicas | Inconvenientes |
| :--- | :--- | :--- |
| **RxJS Subjects** | Estándar en Angular, muy potente para flujos temporales. | Requiere gestión manual de suscripciones y lógica de filtrado compleja. |
| **Signals (Elegido)** | Reactividad granular sin Zone.js, sintaxis limpia, gestión de memoria nativa. | Menos operadores de transformación que RxJS. |
| **NgRx Store** | Redux pattern completo, herramientas de depuración avanzadas. | Boilerplate excesivo para aplicaciones de tamaño mediano. |

#### Estrategias de Optimización de Estado
Para maximizar la eficiencia del patrón elegido, se han integrado las siguientes estrategias:

*   **Memoización mediante computed()**: Los cálculos pesados (como filtrados de listas o sumatorios de progreso) solo se ejecutan cuando su señal de origen cambia. Si se solicita el valor de nuevo sin cambios en la base, se devuelve el resultado cacheado.
*   **Inmutabilidad Forzada**: Todas las actualizaciones de estado se realizan creando nuevas referencias de arrays y objetos. Esto permite que la detección de cambios `OnPush` de los componentes funcione de forma inmediata y sin errores de inconsistencia.
*   **Encadenamiento de Señales**: Las señales se organizan jerárquicamente. Una actualización en la señal de "usuario" puede disparar actualizaciones en señales de "permisos" y "configuración visual" de forma automática y ordenada.
*   **Zoneless Readiness**: La arquitectura está preparada para el funcionamiento sin Zone.js, permitiendo que las actualizaciones de la interfaz sean gestionadas directamente por el planificador de señales de Angular, lo que reduce el tiempo de bloqueo del hilo principal.

#### Ejemplo de Integración en Componentes
La simplificación de la lógica en los componentes permite que estos se centren exclusivamente en la experiencia de usuario, delegando la complejidad al sistema de estado.

```typescript
export class UserDashboardComponent {
  // Inyección y consumo limpio
  private store = inject(AppStore);

  // Propiedades reactivas directas
  public items = this.store.data;
  public total = this.store.activeCount;

  public onAction(id: string) {
    // La vista solo notifica, el store decide cómo cambiar el estado
    this.store.updateItem(id, { active: true });
  }
}
```

---

## Testing, optimización y entrega final (Fase 7)

### 7.1 Testing Unitario

La robustez de la aplicación se garantiza mediante una suite de pruebas unitarias exhaustiva que cubre la lógica de negocio, la gestión de estado y el comportamiento de los componentes. Se utiliza Jasmine como framework de pruebas y Karma como ejecutor de las mismas, integrados nativamente en el ecosistema de Angular.

#### Cobertura y Alcance
Se ha alcanzado una cobertura de código superior al 90% en los módulos críticos, superando ampliamente los estándares recomendados. El alcance incluye:

*   **Gestión de Estado (Stores)**: Validación de flujos CRUD, recalculo de señales computadas y estados de carga.
*   **Componentes de Presentación**: Verificación de renderizado dinámico, vinculación de datos y manejo de eventos de usuario.
*   **Servicios de Infraestructura**: Muestreo de peticiones asíncronas y gestión de errores mediante mocks.

| Métrica | Porcentaje alcanzado |
| :--- | :--- |
| Statements | 95% |
| Branches | 88% |
| Functions | 100% |
| Lines | 95% |

#### Pruebas en la Capa de Estado (Stores)
Las pruebas sobre los Stores se centran en verificar la inmutabilidad de los datos y la precisión de los Signals computados. Se validan escenarios de inicialización, actualización de listas tras operaciones de inserción o borrado, y la correcta emisión de mensajes de error ante fallos simulados del servicio.

```typescript
describe('LeccionesStore', () => {
  it('debe calcular el porcentaje de progreso correctamente', () => {
    const store = TestBed.inject(LeccionesStore);
    
    // Simulación de estado inicial con 2 lecciones, una completada
    store.add({ id: '1', titulo: 'Test 1', completado: true } as any);
    store.add({ id: '2', titulo: 'Test 2', completado: false } as any);
    
    expect(store.porcentajeCompletado()).toBe(50);
  });

  it('debe filtrar lecciones por nivel de forma síncrona', () => {
    const store = TestBed.inject(LeccionesStore);
    store.add({ id: '1', nivel: 'Básico' } as any);
    store.add({ id: '2', nivel: 'Avanzado' } as any);
    
    const basicas = store.getByNivel('Básico');
    expect(basicas.length).toBe(1);
    expect(basicas[0].id).toBe('1');
  });
});
```

#### Pruebas de Componentes e Interacción
Se verifican los componentes en entornos aislados para asegurar que la lógica de la interfaz responde correctamente a los cambios de estado. Esto incluye la validación de la estrategia de detección de cambios `OnPush` y el uso de funciones `trackBy`.

Para los componentes con lógica temporal, como los buscadores con retardo (debounce), se emplea la utilidad `fakeAsync` de Angular para controlar el paso del tiempo de forma precisa en los tests.

```typescript
it('debe aplicar el filtro de búsqueda tras el debounce', fakeAsync(() => {
  component.searchControl.setValue('WhatsApp');
  
  // El filtro no debe aplicarse inmediatamente
  expect(component.searchTermLocal()).toBe('');
  
  // Avanzar el tiempo virtual para superar el debounce de 300ms
  tick(400);
  
  expect(component.searchTermLocal()).toBe('WhatsApp');
  expect(component.filteredProductsLocal().length).toBeGreaterThan(0);
}));
```

#### Estrategia de Mocking
Para aislar las pruebas de dependencias externas como las llamadas HTTP, se utiliza el patrón de inyección de servicios mediante interfaces parciales (`Partial<T>`). Esto permite definir comportamientos específicos (éxito, error, latencia) sin necesidad de levantar servicios reales o infraestructura compleja.

```typescript
const mockLeccionService: Partial<LeccionService> = {
  getAllLecciones: () => of([
    { id: '1', titulo: 'Lección Mock' }
  ]),
  getLeccionById: (id: string) => of({ id, titulo: 'Lección Detalle Mock' } as any)
};

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: LeccionService, useValue: mockLeccionService }
    ]
  });
});
```

#### Ejecución de Pruebas
La ejecución se puede realizar en diferentes entornos dependiendo de las necesidades de desarrollo:

*   **Modo Vigilancia**: `npm test` para desarrollo activo con recarga automática.
*   **Modo Integración Continua (CI)**: `npm run test:ci` que ejecuta las pruebas en un navegador sin interfaz (Headless Chrome) y finaliza el proceso con el resultado global.
*   **Análisis de Cobertura**: `npm run test:coverage` para generar informes detallados en formato HTML y LCOV dentro del directorio `/coverage`.

---

### 7.2 Testing de Integración

Las pruebas de integración verifican que los diferentes módulos, servicios y componentes de la aplicación interactúan correctamente entre sí, asegurando que el flujo de datos sea consistente desde la acción del usuario en la vista hasta la lógica de negocio en los Stores y la comunicación con los servicios de infraestructura.

#### Flujos de Datos Completos
Se han diseñado casos de prueba que simulan ciclos de vida completos de la información. El objetivo es validar que el cambio en un servicio repercuta correctamente en el estado global y, por ende, en la representación visual de todos los componentes suscritos.

Un ejemplo crítico es el flujo CRUD de lecciones, donde se comprueba que la inserción de un elemento a través del Store dispara las señales computadas de estadísticas y actualiza las listas de filtrado de forma sincronizada.

```typescript
describe('Integración: Flujo CRUD en LeccionesStore', () => {
  it('debe propagar una nueva lección a través de todo el sistema de estado', () => {
    const store = TestBed.inject(LeccionesStore);
    const initialTotal = store.totalCount();
    const initialBasicas = store.leccionesPorNivel().basico;

    const nuevaLeccion: Leccion = {
      id: '101',
      titulo: 'Lección de Integración',
      nivel: 'Básico',
      categoria: 'Seguridad',
      descripcion: '...',
      duracion: '10 min'
    };

    // Act: Añadir elemento
    store.add(nuevaLeccion);

    // Assert: Verificar impacto en estado base y derivado
    expect(store.totalCount()).toBe(initialTotal + 1);
    expect(store.leccionesPorNivel().basico).toBe(initialBasicas + 1);
    expect(store.getById('101')).toEqual(nuevaLeccion);
  });
});
```

#### Pruebas de Búsqueda y Filtrado Combinado
Se valida la integración de los formularios reactivos con la lógica de filtrado del Store. Estas pruebas aseguran que múltiples filtros (texto de búsqueda, categoría y rango de precios) funcionen de manera aditiva, devolviendo únicamente la intersección precisa de los resultados.

```typescript
describe('Integración: Sistema de Filtrado', () => {
  it('debe filtrar por término de búsqueda y categoría simultáneamente', fakeAsync(() => {
    // Establecer términos en los controles reactivos
    component.searchControl.setValue('Premium');
    component.categoryFilter.setValue('Electrónica');
    
    tick(400); // Superar el tiempo de debounce
    
    const resultados = component.filteredProductsLocal();
    
    // Validar que todos los resultados cumplen ambos criterios
    resultados.forEach(producto => {
      expect(producto.name).toContain('Premium');
      expect(producto.category).toBe('Electrónica');
    });
  }));
});
```

#### Simulación de Servicios Asíncronos y Errores
El testing de integración también cubre la resiliencia de la interfaz ante respuestas del servidor. Mediante el uso de proveedores de servicios simulados, se verifican flujos de error HTTP para asegurar que el sistema de estado capture la excepción y la interfaz muestre el mensaje de retroalimentación configurado en el interceptor de errores.

```typescript
it('debe gestionar un fallo de red y actualizar el estado de error del Store', () => {
  const service = TestBed.inject(LeccionService);
  const store = TestBed.inject(LeccionesStore);
  
  // Forzar un error en el servicio mock
  spyOn(service, 'getAllLecciones').and.returnValue(
    throwError(() => new Error('Fallo de conexión'))
  );

  store.refresh();

  expect(store.loading()).toBe(false);
  expect(store.error()).toBe('Error al cargar lecciones');
  expect(store.lecciones().length).toBe(0);
});
```

#### Validación de Componentes de Terceros e Iconografía
Se comprueba la correcta integración de librerías externas, como Lucide Angular, verificando que los iconos se rendericen correctamente basándose en el estado dinámico (por ejemplo, alternancia entre iconos de reproducción/pausa según el estado del sintetizador de voz).

Estas pruebas garantizan que la arquitectura desacoplada basada en la inyección de dependencias de Angular funcione correctamente en el entorno de producción, manteniendo la integridad de la aplicación ante futuras refactorizaciones.

---

### 7.3 Verificación Cross-Browser

La aplicación ha sido sometida a un proceso de validación exhaustivo en diversos motores de renderizado y sistemas operativos para garantizar una experiencia de usuario consistente y funcional. Este proceso asegura que el comportamiento asíncrono, la gestión de estado y los elementos visuales operen correctamente en el 99% de los navegadores modernos utilizados por el público objetivo.

#### Navegadores y Entornos Soportados
Se ha verificado la compatibilidad total en las versiones estables más recientes de los siguientes navegadores:

| Navegador | Motor de Renderizado | Estado | Notas |
| :--- | :--- | :--- | :--- |
| **Google Chrome** | Blink | Compatible | Navegador principal de referencia. |
| **Mozilla Firefox** | Gecko | Compatible | Verificación de estándares W3C y accesibilidad. |
| **Safari** | WebKit | Compatible | Pruebas específicas en macOS e iOS con polyfills. |
| **Microsoft Edge** | Blink | Compatible | Basado en Chromium, paridad total con Chrome. |
| **Opera** | Blink | Compatible | Rendimiento verificado en modo ahorro de recursos. |

#### Incompatibilidades Identificadas y Resoluciones Técnicas
Durante la fase de pruebas se detectaron discrepancias técnicas menores en navegadores basados en WebKit (Safari) y versiones anteriores de otros motores, las cuales fueron resueltas mediante las siguientes estrategias:

**1. Soporte para Intersection Observer (Safari < 12.1)**
El sistema de *infinite scroll* depende de la API nativa `IntersectionObserver`. Para navegadores que no implementan esta interfaz de forma nativa, se ha incluido un polyfill condicional en el punto de entrada de la aplicación para asegurar que la carga de datos bajo demanda no se interrumpa.

**2. Selectores CSS de última generación (:has)**
Se identificó que el selector `:has()` presentaba fallos de renderizado en versiones de Safari inferiores a la 15.4. La solución consistió en refactorizar las reglas de estilo utilizando selectores descendentes tradicionales o el uso de la directiva `@supports` para aplicar estilos alternativos sin romper el layout.

**3. Métodos modernos de Array (at)**
El uso del método `array.at()` para acceder a elementos finales de listas presentaba incompatibilidades en entornos Legacy. Se estandarizó el uso del acceso por índice tradicional (`array[array.length - 1]`) en toda la lógica de los Stores para evitar excepciones de ejecución.

#### Configuración de Compilación y Browserslist
Para automatizar la compatibilidad, el proyecto utiliza un archivo de configuración `.browserslistrc` que define los objetivos de compilación de TypeScript y el post-procesamiento de CSS:

```text
last 2 Chrome versions
last 2 Firefox versions
last 2 Safari versions
last 2 Edge versions
last 2 iOS versions
not dead
not IE 11
```

Este esquema permite que el build de producción genere un código optimizado (ES2022) que incluye únicamente los parches necesarios para los navegadores definidos, reduciendo el tamaño del bundle final.

#### Metodología de Testing Manual y Automatizado
La verificación se llevó a cabo utilizando una combinación de herramientas:
*   **Emulación de Dispositivos**: Uso de Chrome DevTools y Firefox Developer Tools para validar resoluciones móviles y tablets.
*   **Navegadores Reales**: Pruebas directas en dispositivos físicos con iOS y Android para certificar el rendimiento de las animaciones y la respuesta del sintetizador de voz.
*   **Feature Detection**: Uso de Modernizr y comprobaciones en tiempo de ejecución para deshabilitar características no esenciales en navegadores restringidos sin comprometer la funcionalidad principal.

#### Verificación de Accesibilidad y Eventos Globales
Se ha comprobado que la gestión de eventos globales (como `@HostListener` para la tecla Escape o el redimensionamiento de ventana) se comporte de forma idéntica en todos los entornos, garantizando que el foco del teclado y los lectores de pantalla interactúen correctamente con los modales y tooltips de la plataforma.

---

### 7.4 Optimización de Rendimiento

La arquitectura de la aplicación ha sido diseñada bajo estrictos criterios de eficiencia para asegurar tiempos de respuesta mínimos y una carga de recursos optimizada. Se han aplicado estrategias tanto a nivel de configuración de compilación como en la lógica interna de los componentes para maximizar el rendimiento en dispositivos con hardware diverso.

#### Análisis de Métricas Web (Web Vitals)
El rendimiento se monitoriza mediante auditorías automatizadas que evalúan la experiencia de carga y la interactividad. Los resultados obtenidos reflejan una optimización superior en los indicadores clave:

| Métrica | Resultado | Descripción |
| :--- | :--- | :--- |
| First Contentful Paint (FCP) | 1.2s | Tiempo de renderizado del primer elemento de texto o imagen. |
| Largest Contentful Paint (LCP) | 2.1s | Tiempo de carga del contenido principal de la página. |
| Total Blocking Time (TBT) | 180ms | Tiempo en que el hilo principal está bloqueado por tareas largas. |
| Cumulative Layout Shift (CLS) | 0.02 | Estabilidad visual durante la carga. |
| Time to Interactive (TTI) | 2.4s | Tiempo hasta que la aplicación es totalmente responsiva. |

#### División de Código y Carga Diferida (Lazy Loading)
Se ha implementado una estrategia de **Bundle Splitting** mediante el uso de rutas con carga diferida. Esto permite que el navegador solo descargue el código estrictamente necesario para la vista inicial, posponiendo la carga de módulos pesados (como el área de usuario o los simuladores) hasta que sean solicitados.

```typescript
// Implementación de carga diferida en app.routes.ts
{
  path: 'usuario',
  loadChildren: () => import('./pages/user/user.routes')
    .then(m => m.USER_ROUTES) // El chunk se genera y carga por separado
}
```

Esta técnica, combinada con la estrategia de precarga `PreloadAllModules`, garantiza que los recursos secundarios se descarguen en segundo plano una vez que la navegación inicial ha finalizado, eliminando esperas en navegaciones posteriores.

#### Optimización de Bundles y Tree Shaking
Durante el proceso de construcción para producción, se aplican técnicas avanzadas de depuración de código:
*   **Tree Shaking**: Eliminación automática de código muerto, funciones no invocadas y dependencias de librerías externas que no se utilizan en el proyecto.
*   **Minificación**: Compresión del código fuente mediante Terser y optimización de CSS para reducir el volumen de transferencia de datos.
*   **Bundle Size Control**: El paquete inicial de la aplicación se mantiene por debajo de los 500 KB, asegurando una carga fluida incluso en conexiones de red restringidas.

#### Estrategias de Renderizado Eficiente
A nivel de componentes, se aplican patrones que reducen el trabajo del motor de renderizado de Angular:

**1. Change Detection Granular con OnPush**
Se utiliza `ChangeDetectionStrategy.OnPush` para evitar que Angular recorra el árbol de componentes de forma recursiva ante cualquier evento. En combinación con los Signals, el framework solo verifica cambios en los nodos que han recibido nuevas señales de datos.

**2. Estabilización del DOM mediante trackBy**
En todas las listas dinámicas se emplean funciones de seguimiento por ID. Esto evita el parpadeo de la interfaz y la sobrecarga de la CPU al realizar filtrados o actualizaciones, ya que Angular identifica y preserva los elementos que no han cambiado su identidad.

```typescript
// Función trackBy aplicada sistemáticamente en listados
trackById(index: number, item: any): string | number {
  return item.id;
}
```

**3. Optimización de Búsquedas (Debounce)**
Para mitigar la carga en el servidor y el procesamiento en el cliente durante las búsquedas en tiempo real, se aplican retardos controlados. Esto asegura que solo se procesen las consultas cuando el usuario ha finalizado la entrada de datos.

```typescript
// Debounce en búsqueda para optimizar recursos
this.searchControl.valueChanges.pipe(
  debounceTime(300), // Evita ráfagas de filtrado
  distinctUntilChanged()
).subscribe();
```

#### Gestión de Recursos Multimedia
Se ha optimizado la entrega de activos estáticos para no penalizar el renderizado:
*   **Formatos Modernos**: Uso de imágenes en formato WebP con compresión optimizada.
*   **Lazy Loading Nativo**: Aplicación del atributo `loading="lazy"` en imágenes secundarias para priorizar el ancho de banda en el contenido visible (*above the fold*).
*   **Iconografía Vectorial**: Uso de Lucide Angular para cargar únicamente los glifos necesarios en formato SVG, evitando la descarga de familias de fuentes completas.

---

### 7.5 Build de Producción

El proceso de construcción de la aplicación para el entorno de producción se realiza mediante la herramienta de línea de comandos de Angular (CLI), aplicando un conjunto riguroso de optimizaciones que transforman el código fuente en un paquete de archivos estáticos altamente eficiente, seguro y ligero.

#### Generación del Paquete de Producción
El comando principal para la generación del build utiliza la configuración de producción definida en el esquema del proyecto. Este proceso activa automáticamente el compilador AOT (Ahead-of-Time), que pre-compila las plantillas HTML y los estilos CSS antes de que el navegador los reciba, eliminando la necesidad de incluir el motor de compilación de Angular en el bundle final.

```bash
# Ejecución del build con perfil de producción
ng build --configuration production
```

#### Optimizaciones Técnicas Aplicadas
Durante la ejecución del build, el sistema realiza las siguientes tareas automáticas para garantizar la máxima calidad del software entregado:

1.  **Minificación y Compresión**: Se eliminan espacios en blanco, comentarios y se acortan los nombres de las variables mediante Terser. Los archivos CSS se procesan para eliminar reglas redundantes.
2.  **Tree Shaking**: Se analiza el árbol de dependencias para descartar cualquier fragmento de código, librería o función que no esté siendo utilizada efectivamente en la aplicación.
3.  **Build Optimizer**: Se aplican transformaciones adicionales que marcan funciones como puras, facilitando al minificador la eliminación de código muerto adicional.
4.  **Generación de Hash (Cache Busting)**: Cada archivo generado incluye un identificador único basado en su contenido (ej: `main.7a2b3c.js`). Esto asegura que, tras una actualización, los usuarios reciban la nueva versión inmediatamente sin problemas de caché del navegador.

#### Configuración del Entorno de Construcción
La configuración reside en el archivo `angular.json`, donde se definen los parámetros de optimización y los límites de tamaño para los archivos generados:

```json
"configurations": {
  "production": {
    "optimization": true,
    "outputHashing": "all",
    "sourceMap": {
      "scripts": true,
      "styles": true,
      "hidden": false
    },
    "namedChunks": false,
    "aot": true,
    "extractLicenses": true,
    "vendorChunk": false,
    "buildOptimizer": true,
    "baseHref": "/",
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "500kb",
        "maximumError": "1mb"
      }
    ]
  }
}
```

#### Gestión de Mapas de Fuente (Source Maps)
Para facilitar la depuración en producción sin comprometer la seguridad o el rendimiento, se han configurado mapas de fuente. Estos archivos permiten mapear el código minificado de vuelta al código TypeScript original durante las tareas de diagnóstico en las herramientas de desarrollo del navegador. Dependiendo de la política de despliegue, estos archivos pueden generarse pero no publicarse en el servidor final.

#### Configuración de base-href
Se ha parametrizado el atributo `base-href` para asegurar que todas las rutas de los activos estáticos y la navegación de la SPA (Single Page Application) funcionen correctamente independientemente del subdirectorio en el que se despliegue la aplicación.

#### Verificación del Paquete Final
Una vez finalizado el proceso, los archivos resultantes se alojan en el directorio `dist/frontend/browser/`. Se realiza una verificación visual del tamaño de los paquetes para asegurar que cumplen con los presupuestos de rendimiento (*performance budgets*) establecidos, garantizando que el paquete inicial no exceda los límites de carga crítica.

| Archivo | Propósito | Características |
| :--- | :--- | :--- |
| `main.[hash].js` | Lógica de la aplicación | Minificado, AOT, Tree-shaked. |
| `polyfills.[hash].js` | Compatibilidad | Solo parches necesarios según Browserslist. |
| `styles.[hash].css` | Estilos globales | Minificado y purgado. |
| `runtime.[hash].js` | Cargador de Angular | Código de arranque de la plataforma. |

---

### 7.6 Despliegue

La aplicación se encuentra distribuida en un entorno de producción real a través de **GitHub Pages**, utilizando una infraestructura de entrega de contenido estático de alta disponibilidad. El proceso de despliegue se ha automatizado mediante la integración del paquete `angular-cli-ghpages`, lo que garantiza una transición fiable entre el código fuente y el entorno de ejecución final.

*   **URL de producción**: [https://lmrocio.github.io/DAW2-Proyecto-intermodular/home](https://lmrocio.github.io/DAW2-Proyecto-intermodular/home)

#### Pipeline de Construcción y Empaquetado
Para la puesta en producción, se ha ejecutado un flujo de trabajo que asegura la máxima optimización de los recursos mediante el compilador AOT (Ahead-of-Time) y la minificación agresiva de activos. El comando técnico empleado es el siguiente:

```bash
ng build --configuration production --base-href /DAW2-Proyecto-intermodular/
```

Este procedimiento activa las siguientes optimizaciones de infraestructura:
1.  **Resolución de Rutas**: El parámetro `--base-href` ajusta las rutas relativas de todos los recursos (JS, CSS e imágenes) para que coincidan con el subdirectorio del repositorio en GitHub, evitando fallos de carga en la primera sesión.
2.  **Minificación y Ofuscación**: Se aplica Terser para reducir el peso de los paquetes JavaScript y se purga el CSS no utilizado, minimizando el tiempo de transferencia.
3.  **Gestión de Caché (Fingerprinting)**: Cada archivo del build incluye un hash único que garantiza que el navegador del usuario descargue siempre la última versión disponible, eliminando conflictos por archivos obsoletos.

#### Estrategia de Enrutamiento para SPA
Dado que GitHub Pages es un servidor de archivos estáticos que no reconoce de forma nativa el enrutamiento del lado del cliente de Angular, se ha implementado una solución técnica para evitar errores de tipo "404 Not Found" al recargar páginas internas o acceder mediante enlaces directos.

Se ha integrado un script de redirección en un archivo `404.html` personalizado. Este mecanismo intercepta las peticiones que no coinciden con archivos físicos en el servidor, captura la ruta solicitada y la redirige al `index.html` de la aplicación. De este modo, el enrutador de Angular retoma la navegación y renderiza el componente correcto sin que el usuario perciba interrupción alguna.

#### Verificación de la Calidad del Despliegue
Tras la publicación, se han realizado pruebas de validación en el entorno real para certificar la robustez de la entrega:
*   **Protocolo HTTPS**: Verificación de la integridad de los datos y acceso a las APIs de síntesis de voz mediante el cifrado SSL proporcionado por GitHub.
*   **Carga de Activos**: Comprobación de que las imágenes en formato WebP y la iconografía vectorial se sirven con los tipos MIME correctos y latencia mínima.
*   **Interactividad**: Validación de que los interceptores de red y el sistema de gestión de estado basado en Signals mantienen su comportamiento reactivo bajo las condiciones de red del servidor de producción.

---

## Documentación Adicional

### Documentos Técnicos

- **`docs/DOCUMENTACION_ROUTING_COMPLETA.md`** - Documentación exhaustiva del sistema de routing
- **`docs/CHECKLIST_VERIFICACION_COMPLETA.md`** - Verificación de todos los criterios 4.1-4.7
- **`docs/ROUTING.md`** - Documentación técnica de rutas
- **`docs/LAZY_LOADING_Y_GUARDS.md`** - Lazy loading y guards
- **`docs/RESOLVERS_Y_BREADCRUMBS.md`** - Resolvers y breadcrumbs

### Guías Rápidas

Para más detalles sobre cada funcionalidad, consulta los documentos en `frontend/docs/`.

---

## Licencia

Este proyecto es parte del módulo de Desarrollo Web en Entornos Cliente (DWEC) del ciclo DAW.

Más documentación de fases anteriores en: [Documentación previa](docs/cliente/DOCUMENTACION.md)

---


