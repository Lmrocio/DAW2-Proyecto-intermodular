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
12. [Documentación Adicional](#documentación-adicional)
13. [Cumplimiento de Criterios](#cumplimiento-de-criterios-fase-4)
14. [Licencia](#licencia)

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

Documentación completa disponible en: `frontend/docs/cliente/DOCUMENTACION.md`

---

