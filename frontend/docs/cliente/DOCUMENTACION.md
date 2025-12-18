# Documentación Técnica - Frontend Cliente

## Índice

1. [Manipulación del DOM en Angular](#manipulación-del-dom-en-angular)
2. [Sistema de Eventos](#sistema-de-eventos)
3. [Componentes Interactivos](#componentes-interactivos)
4. [Theme Switcher](#theme-switcher)
5. [Arquitectura de Eventos](#arquitectura-de-eventos)
6. [Compatibilidad de Navegadores](#compatibilidad-de-navegadores)

---

## Manipulación del DOM en Angular

### Acceso a elementos del DOM

Para acceder a elementos del DOM en los componentes de Angular, se utilizan las directivas `@ViewChild` y `ElementRef`. Este enfoque permite referenciar elementos HTML directamente desde el código TypeScript del componente.

**Implementación básica:**

```typescript
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  template: `<div #miDiv>Contenido inicial</div>`
})
export class EjemploComponent implements AfterViewInit {
  @ViewChild('miDiv', { static: false }) miDiv: ElementRef;

  ngAfterViewInit() {
    console.log(this.miDiv.nativeElement);
  }
}
```

**Puntos clave:**
- `@ViewChild` permite acceder al elemento referenciado con una variable de plantilla (precedida por `#`)
- `ElementRef` contiene la referencia al elemento nativo del DOM
- Se debe usar el hook `ngAfterViewInit` para garantizar que el DOM esté completamente inicializado antes de acceder a los elementos

### Modificación dinámica de propiedades y estilos

Para modificar estilos y propiedades de forma segura y compatible con múltiples plataformas, se utiliza el servicio `Renderer2` en lugar de manipular directamente `nativeElement`.

**Ejemplo de implementación:**

```typescript
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  template: `
    <div #miDiv>Contenido inicial</div>
    <button (click)="cambiarEstilo()">Cambiar</button>
  `
})
export class EjemploComponent {
  @ViewChild('miDiv', { static: false }) miDiv: ElementRef;

  constructor(private renderer: Renderer2) {}

  cambiarEstilo() {
    this.renderer.setStyle(this.miDiv.nativeElement, 'color', 'red');
    this.renderer.setStyle(this.miDiv.nativeElement, 'fontSize', '20px');
  }

  cambiarPropiedad() {
    this.renderer.setProperty(this.miDiv.nativeElement, 'innerText', 'Texto modificado');
  }
}
```

**Métodos principales de Renderer2:**
- `setStyle(elemento, 'propiedad', 'valor')` - Modifica estilos CSS
- `setProperty(elemento, 'propiedad', 'valor')` - Cambia propiedades del elemento
- `addClass(elemento, 'clase')` - Añade una clase CSS
- `removeClass(elemento, 'clase')` - Elimina una clase CSS

### Creación y eliminación de elementos

Para crear y eliminar elementos del DOM de forma programática, también se utiliza `Renderer2`:

```typescript
import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-ejemplo',
  template: `
    <div #contenedor></div>
    <button (click)="crearElemento()">Crear</button>
    <button (click)="eliminarElemento()">Eliminar</button>
  `
})
export class EjemploComponent {
  @ViewChild('contenedor', { static: false }) contenedor: ElementRef;

  constructor(private renderer: Renderer2) {}

  crearElemento() {
    const nuevoDiv = this.renderer.createElement('div');
    this.renderer.setProperty(nuevoDiv, 'innerText', 'Nuevo elemento creado');
    this.renderer.setStyle(nuevoDiv, 'backgroundColor', 'lightblue');
    this.renderer.setStyle(nuevoDiv, 'padding', '10px');
    this.renderer.appendChild(this.contenedor.nativeElement, nuevoDiv);
  }

  eliminarElemento() {
    const primerHijo = this.contenedor.nativeElement.firstChild;
    if (primerHijo) {
      this.renderer.removeChild(this.contenedor.nativeElement, primerHijo);
    }
  }
}
```

**Métodos para DOM dinámico:**
- `createElement('tag')` - Crea un nuevo elemento HTML
- `appendChild(parent, child)` - Inserta un elemento como hijo
- `removeChild(parent, child)` - Elimina un elemento hijo

---

## Sistema de Eventos

Angular implementa un sistema de eventos basado en el DOM estándar pero adaptado a su arquitectura de componentes. Los eventos se manejan mediante event binding, que permite escuchar eventos nativos del navegador y ejecutar métodos del componente en respuesta.

### Event Binding en componentes

El event binding se define en las plantillas usando paréntesis alrededor del nombre del evento:

```typescript
<button (click)="onClick()">Haz clic aquí</button>
```

En el componente:

```typescript
onClick() {
  console.log('Botón clickeado');
}
```

Para acceder al objeto evento nativo se usa la variable especial `$event`:

```typescript
<input (keyup)="onKeyUp($event)">

onKeyUp(event: KeyboardEvent) {
  console.log(event.key);
}
```

Angular proporciona pseudoeventos para simplificar el manejo, como `(keyup.enter)` que solo se dispara al presionar la tecla Enter.

### Tipos de eventos soportados

Angular soporta todos los eventos estándar del DOM:

**Eventos de teclado:**
- `(keydown)` - Se dispara al presionar una tecla
- `(keyup)` - Se dispara al soltar una tecla
- `(keyup.enter)` - Se dispara solo al presionar Enter
- `(keydown.escape)` - Se dispara solo al presionar Escape

**Eventos de ratón:**
- `(click)` - Click simple
- `(dblclick)` - Doble click
- `(mouseenter)` - El ratón entra en el elemento
- `(mouseleave)` - El ratón sale del elemento
- `(mousedown)` - Botón del ratón presionado
- `(mouseup)` - Botón del ratón soltado

**Eventos de foco:**
- `(focus)` - El elemento recibe el foco
- `(blur)` - El elemento pierde el foco

**Ejemplo de uso:**

```typescript
<input (focus)="onFocus()" (blur)="onBlur()">

onFocus() {
  console.log('Input con foco');
}

onBlur() {
  console.log('Input perdió foco');
}
```

### Prevención de comportamientos predeterminados

Para evitar que el navegador ejecute su comportamiento predeterminado en respuesta a un evento, se utiliza `event.preventDefault()`:

```typescript
<form (submit)="onSubmit($event)">
  <button type="submit">Enviar</button>
</form>

onSubmit(event: Event) {
  event.preventDefault();
  console.log('Formulario enviado sin recarga');
}
```

### Control de propagación de eventos

Los eventos en el DOM se propagan hacia arriba por defecto (bubbling). Para detener esta propagación:

```typescript
onClick(event: MouseEvent) {
  event.stopPropagation();
  console.log('Click manejado sin propagación a elementos padres');
}
```

---

## Componentes Interactivos

En esta aplicación se han implementado varios componentes interactivos que responden a las acciones del usuario de forma dinámica.

### Menú hamburguesa

El menú hamburguesa se implementa con un estado booleano `isOpen` que controla su visibilidad:

**Características:**
- Toggle del menú mediante click en el botón hamburguesa
- Cierre automático al hacer click fuera del menú
- Animaciones CSS para transiciones suaves

**Implementación:**

```typescript
export class MenuComponent {
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen) {
      this.isOpen = false;
    }
  }
}
```

En el template:

```html
<button (click)="toggleMenu()">☰</button>
<nav [class.open]="isOpen">
  <!-- Contenido del menú -->
</nav>
```

### Modales

Los modales permiten mostrar contenido superpuesto sobre la página principal:

**Características:**
- Apertura y cierre mediante botones
- Cierre al presionar la tecla ESC
- Cierre al hacer click en el fondo oscuro (backdrop)
- Bloqueo del scroll de la página mientras está abierto

**Implementación:**

```typescript
export class ModalComponent {
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    if (this.isOpen) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
```

En el template:

```html
<div *ngIf="isOpen" class="modal-backdrop" (click)="onBackdropClick($event)">
  <div class="modal-content">
    <button class="close" (click)="close()">×</button>
    <!-- Contenido del modal -->
  </div>
</div>
```

### Tabs (Pestañas)

Las pestañas permiten organizar el contenido en diferentes secciones accesibles mediante botones:

**Características:**
- Navegación entre pestañas mediante click
- Indicación visual de la pestaña activa
- Contenido dinámico según la pestaña seleccionada

**Implementación:**

```typescript
export class TabsComponent {
  activeTab: string = 'detalles';

  selectTab(tabName: string) {
    this.activeTab = tabName;
  }
}
```

En el template:

```html
<div class="tabs">
  <button 
    [class.tab--active]="activeTab === 'detalles'"
    (click)="selectTab('detalles')">
    Detalles
  </button>
  <button 
    [class.tab--active]="activeTab === 'ajustes'"
    (click)="selectTab('ajustes')">
    Ajustes
  </button>
</div>

<div class="tab-content">
  <div *ngIf="activeTab === 'detalles'">
    <!-- Contenido de detalles -->
  </div>
  <div *ngIf="activeTab === 'ajustes'">
    <!-- Contenido de ajustes -->
  </div>
</div>
```

### Tooltips

Los tooltips muestran información adicional al pasar el ratón sobre un elemento:

**Características:**
- Aparición al hacer hover o mediante eventos de ratón
- Posicionamiento dinámico
- Control de visibilidad mediante estado

**Implementación con CSS puro:**

```html
<div class="tooltip-container">
  <span class="tooltip-trigger">Elemento</span>
  <span class="tooltip">Información adicional</span>
</div>
```

```css
.tooltip {
  display: none;
  position: absolute;
}

.tooltip-container:hover .tooltip {
  display: block;
}
```

**Implementación con eventos en Angular:**

```typescript
export class TooltipComponent {
  showTooltip = false;

  onMouseEnter() {
    this.showTooltip = true;
  }

  onMouseLeave() {
    this.showTooltip = false;
  }
}
```

```html
<div class="tooltip-container"
     (mouseenter)="onMouseEnter()"
     (mouseleave)="onMouseLeave()">
  <span>Elemento</span>
  <span *ngIf="showTooltip" class="tooltip">Información adicional</span>
</div>
```

---

## Theme Switcher

El theme switcher permite a los usuarios cambiar entre modo claro y modo oscuro, respetando sus preferencias y guardándolas para futuras visitas.

### Detección de preferencias del sistema

Angular puede detectar las preferencias de tema del sistema operativo del usuario usando la API `matchMedia`:

```typescript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
console.log(prefersDark.matches); // true si el sistema prefiere modo oscuro
```

A nivel CSS, se puede usar la media query correspondiente:

```css
@media (prefers-color-scheme: dark) {
  /* Estilos para modo oscuro */
}
```

### Toggle entre tema claro y oscuro

La implementación del theme switcher se basa en:

1. **Variables CSS personalizadas** - Definición de paletas de colores para cada tema
2. **Clases de tema** - Aplicación de clases al elemento raíz (`html`)
3. **Estado reactivo** - Gestión del tema actual en un servicio o componente

**Estructura de variables CSS:**

```scss
// Variables para tema claro
:root {
  --bg-primary: #ffffff;
  --text-primary: #000000;
  --color-accent: #ff6b35;
}

// Variables para tema oscuro
:root.dark-theme {
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --color-accent: #ffa500;
}
```

**Implementación del servicio de tema:**

```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: 'light' | 'dark' = 'light';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  private applyTheme() {
    const htmlElement = document.documentElement;
    if (this.currentTheme === 'dark') {
      htmlElement.classList.add('dark-theme');
    } else {
      htmlElement.classList.remove('dark-theme');
    }
  }

  private saveTheme() {
    localStorage.setItem('theme', this.currentTheme);
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.currentTheme = savedTheme;
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme = prefersDark ? 'dark' : 'light';
    }
    this.applyTheme();
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
```

### Persistencia en localStorage

La preferencia del usuario se guarda en localStorage para mantenerla entre sesiones:

```typescript
// Guardar tema
localStorage.setItem('theme', 'dark');

// Recuperar tema
const savedTheme = localStorage.getItem('theme');
```

### Aplicación del tema al cargar

Al iniciar la aplicación, se sigue esta lógica para determinar el tema inicial:

1. Verificar si existe un tema guardado en localStorage
2. Si existe, aplicar ese tema
3. Si no existe, consultar la preferencia del sistema con `matchMedia`
4. Aplicar el tema correspondiente al elemento `<html>`

**Flujo de inicialización:**

```typescript
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // El servicio ya cargó el tema en su constructor
    console.log('Tema actual:', this.themeService.getCurrentTheme());
  }
}
```

---

## Arquitectura de Eventos

### Patrón unidireccional de datos

La arquitectura de eventos en esta aplicación Angular sigue el patrón unidireccional de flujo de datos, utilizando bindings de eventos nativos del DOM directamente en las plantillas de los componentes standalone.

**Características principales:**

- **Event Binding sintáctico**: Se utiliza la sintaxis `(eventName)="handler($event)"` donde `$event` proporciona acceso al objeto nativo del evento (como `KeyboardEvent` o `PointerEvent`)
- **Detección de cambios automática**: Zone.js detecta automáticamente los cambios sin necesidad de llamadas manuales
- **Componentes desacoplados**: Los componentes standalone no necesitan `@Output` para casos simples, promoviendo simplicidad
- **Estado reactivo**: Se utilizan signals y servicios inyectables para gestionar el estado

### Flujo de eventos

El flujo principal de eventos sigue esta secuencia:

```
Usuario → DOM Event (click/keydown)
      ↓
Template Binding (event)
      ↓
Component Handler ($event)
      ↓
Service/State Update (signals/RxJS)
      ↓
View Re-render (OnPush/Zone.js)
```

**Ejemplo práctico:**

```typescript
// Template
<button (click)="onButtonClick($event)">Click me</button>

// Component
onButtonClick(event: MouseEvent) {
  // 1. Prevenir comportamiento por defecto si es necesario
  event.preventDefault();
  
  // 2. Actualizar el estado
  this.someService.updateState();
  
  // 3. La vista se re-renderiza automáticamente
}
```

### Centralización de eventos complejos

Para flujos complejos, se centralizan los eventos en servicios inyectables que usan EventEmitter o RxJS Subjects, evitando acoplamiento directo entre componentes:

```typescript
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<CustomEvent>();
  
  emit(event: CustomEvent) {
    this.eventSubject.next(event);
  }
  
  on() {
    return this.eventSubject.asObservable();
  }
}
```

### Modificadores de eventos

Angular proporciona modificadores para filtrar eventos específicos, reduciendo lógica condicional:

- `(keyup.enter)` - Solo se dispara al presionar Enter
- `(click.alt)` - Solo se dispara con Alt+Click
- `(keydown.escape)` - Solo se dispara al presionar Escape
- `(keydown.shift.a)` - Combinaciones de teclas

**Ejemplo:**

```html
<input (keyup.enter)="onEnter()" (keydown.escape)="onCancel()">
```

### Buenas prácticas

1. **Usar Renderer2** para manipulaciones del DOM en lugar de acceso directo a `nativeElement`
2. **Prevenir memory leaks** desuscribiendo observables en `ngOnDestroy`
3. **Aplicar modificadores** de eventos para simplificar la lógica
4. **Centralizar lógica** compleja en servicios
5. **Usar HostListener** para eventos globales del documento

---

## Compatibilidad de Navegadores

### Tabla de compatibilidad para eventos utilizados

| Evento/Feature | Chrome | Firefox | Safari | Edge | Notas |
|---------------|--------|---------|--------|------|-------|
| `click` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `keydown/keyup` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `mouseenter/leave` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `focus/blur` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `matchMedia` | ✓ 9+ | ✓ 6+ | ✓ 5.1+ | ✓ 10+ | Para detección de tema |
| `localStorage` | ✓ 4+ | ✓ 3.5+ | ✓ 4+ | ✓ 8+ | Persistencia de tema |
| `prefers-color-scheme` | ✓ 76+ | ✓ 67+ | ✓ 12.1+ | ✓ 79+ | Media query para tema |
| `stopPropagation()` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |
| `preventDefault()` | ✓ Todas | ✓ Todas | ✓ Todas | ✓ Todas | Soporte completo |

### Consideraciones especiales

**Mobile Safari:**
- Los eventos táctiles pueden requerir `-webkit-` prefixes en algunos casos
- El `hover` en dispositivos táctiles se comporta diferente

**Internet Explorer 11:**
- No soporta `matchMedia` para `prefers-color-scheme`
- Requiere polyfills para algunas características modernas
- Se recomienda no soportarlo debido a su obsolescencia

**Recomendaciones:**
- Usar Angular 17+ que maneja automáticamente la mayoría de problemas de compatibilidad
- Probar en dispositivos móviles reales para eventos táctiles
- Implementar fallbacks para características modernas si es necesario soportar navegadores antiguos

---

## Resumen de Entregables

### Componentes interactivos implementados

1. **Menú hamburguesa** - Con apertura/cierre y click fuera
2. **Modales** - Con cierre mediante ESC y backdrop
3. **Tabs** - Sistema de pestañas con contenido dinámico
4. **Tooltips** - Información contextual al hover

### Theme Switcher

- Toggle funcional entre tema claro y oscuro
- Detección de preferencias del sistema
- Persistencia en localStorage
- Aplicación automática al cargar

### Documentación

- Arquitectura de eventos explicada
- Diagrama de flujo de eventos
- Tabla de compatibilidad de navegadores
- Ejemplos de código para cada característica

---

# Fase 2: Comunicación entre Componentes y Gestión de Estado

## Objetivos

Implementar comunicación entre componentes usando servicios y patrones reactivos, independizar la lógica de la presentación, crear un sistema de notificaciones y gestionar estados de carga de forma centralizada.

---

## Servicios de Comunicación

Los servicios de comunicación permiten compartir datos y notificaciones entre componentes hermanos o no relacionados mediante inyección de dependencias, evitando el uso excesivo de `@Input/@Output` en jerarquías complejas.

### Patrón Observable/Subject

Se implementa un servicio singleton con RxJS `BehaviorSubject` para estado reactivo global, donde los componentes se suscriben (`subscribe`) a cambios y emiten (`next()`) actualizaciones. Este patrón sigue el principio de flujo unidireccional de datos (unidirectional data flow), ideal para componentes standalone de Angular con signals complementarios.

### Creación de servicio para comunicación entre componentes hermanos

Para generar un servicio de comunicación, se utiliza Angular CLI:

```bash
ng generate service shared/communication
```

Se usa `BehaviorSubject` para mantener el último valor emitido, permitiendo suscripciones tardías:

```typescript
// shared/communication.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private notificationSubject = new BehaviorSubject<string>('');
  public notifications$ = this.notificationSubject.asObservable();

  sendNotification(message: string): void {
    this.notificationSubject.next(message);
  }
}
```

En componentes hermanos, se inyecta el servicio e implementa `OnDestroy` para limpiar suscripciones con `takeUntilDestroyed()` (Angular 16+).

### Uso en componentes

**Componente Emisor:**

```typescript
export class Hermano1Component {
  constructor(private commService: CommunicationService) {}
  
  onAction() {
    this.commService.sendNotification('Dato enviado desde Hermano 1');
  }
}
```

**Componente Receptor:**

```typescript
export class Hermano2Component implements OnInit {
  constructor(private commService: CommunicationService) {}
  
  ngOnInit() {
    this.commService.notifications$.subscribe(msg => 
      console.log('Recibido:', msg)
    );
  }
}
```

### Tipos de Subject y sus usos

| Tipo | Uso Recomendado | Ventajas |
|------|----------------|----------|
| `Subject` | Eventos únicos (clicks, logs) | No retiene valor |
| `BehaviorSubject` | Estado compartido (filtros, usuario) | Valor inicial + histórico |
| `ReplaySubject` | Historial limitado de emisiones | Para logs/notificaciones |

**Ejemplo de servicio de estado global:**

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private themeSubject = new BehaviorSubject<string>('light');
  
  public user$ = this.userSubject.asObservable();
  public theme$ = this.themeSubject.asObservable();
  
  setUser(user: User) {
    this.userSubject.next(user);
  }
  
  setTheme(theme: string) {
    this.themeSubject.next(theme);
  }
}
```

### Prevención de memory leaks

Para evitar fugas de memoria, es crucial dejar de escuchar los observables cuando el componente se destruye. Hay varias estrategias:

**Usando takeUntilDestroyed (Angular 16+):**

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent {
  constructor(private service: CommunicationService) {
    this.service.notifications$
      .pipe(takeUntilDestroyed())
      .subscribe(msg => console.log(msg));
  }
}
```

**Usando AsyncPipe en templates:**

```html
<div *ngIf="notifications$ | async as msg">
  {{ msg }}
</div>
```

---

## Separación de Responsabilidades

La separación de responsabilidades (SRP - Single Responsibility Principle) organiza el código donde los componentes manejan solo UI y eventos, mientras que los servicios encapsulan lógica de negocio, datos y APIs. Esto mejora testabilidad, reutilización y mantenimiento.

### Extracción de lógica de negocio a servicios

Se deben mover cálculos, validaciones y llamadas HTTP de componentes a servicios dedicados:

```typescript
// data/user.service.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active)),
      catchError(this.handleError)
    );
  }

  private handleError(err: any) {
    return throwError(() => new Error('Error cargando usuarios'));
  }
}
```

### Componentes de presentación

Los componentes se limitan a templates, signals locales y handlers que llaman servicios. Se evita lógica compleja en el archivo TypeScript del componente:

```typescript
@Component({
  selector: 'app-user-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
      <button (click)="onSelect(user)">Seleccionar</button>
    </div>
  `
})
export class UserListComponent {
  users$ = this.userService.getUsers();
  selectedUser = signal<User | null>(null);

  constructor(private userService: UserService) {}

  onSelect(user: User) {
    this.selectedUser.set(user);
    this.userService.selectUser(user.id); // Delega lógica
  }
}
```

**Características de componentes "dumb":**
- Solo templates y bindings
- Signals locales para estado de UI
- Handlers que delegan a servicios
- Sin llamadas HTTP directas
- Sin validaciones complejas
- Sin estado global

### Servicios "smart"

Los servicios manejan:
- Estado global (BehaviorSubject)
- Caching de datos
- Validaciones de negocio
- Orquestación de múltiples APIs
- Transformación de datos

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public items$ = this.cartItems.asObservable();

  addItem(item: CartItem) {
    const current = this.cartItems.value;
    this.cartItems.next([...current, item]);
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce((sum, item) => sum + item.price, 0);
  }

  clearCart() {
    this.cartItems.next([]);
  }
}
```

### Estructura de carpetas recomendada

```
src/app/
├── features/
│   ├── user/
│   │   ├── user.component.ts
│   │   ├── user.component.html
│   │   ├── user.component.scss
│   │   └── user.service.ts
│   └── product/
│       ├── product.component.ts
│       └── product.service.ts
├── shared/
│   ├── services/
│   │   ├── loading.service.ts
│   │   ├── toast.service.ts
│   │   └── communication.service.ts
│   └── components/
│       ├── spinner/
│       └── toast/
└── core/
    ├── interceptors/
    └── guards/
```

---

## Sistema de Notificaciones (Toasts)

El sistema de toasts usa un servicio centralizado con `BehaviorSubject` para emitir mensajes tipados, un componente overlay que se suscribe automáticamente y se auto-elimina tras un timeout configurable.

### Servicio centralizado de notificaciones

**Definición del servicio:**

```typescript
// shared/toast.service.ts
export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms, default 5000
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();

  show(message: string, type: ToastMessage['type'], duration = 5000): void {
    this.toastSubject.next({ message, type, duration });
  }

  success(message: string, duration = 4000) { 
    this.show(message, 'success', duration); 
  }
  
  error(message: string, duration = 8000) { 
    this.show(message, 'error', duration); 
  }
  
  info(message: string, duration = 3000) { 
    this.show(message, 'info', duration); 
  }
  
  warning(message: string, duration = 6000) { 
    this.show(message, 'warning', duration); 
  }
}
```

### Componente Toast

El componente se suscribe automáticamente al servicio y gestiona la visualización y auto-cierre:

```typescript
// shared/toast.component.ts
@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="toast()" 
         class="toast" 
         [class]="toast()!.type"
         [@fadeInOut] 
         (click)="dismiss()">
      <span>{{ toast()!.message }}</span>
      <button class="close-btn" (click)="dismiss()">×</button>
    </div>
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnDestroy {
  toast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(msg => {
      this.dismiss(); // Cancela timeout anterior
      this.toast.set(msg);

      if (msg?.duration && msg.duration > 0) {
        this.timeoutId = setTimeout(() => {
          this.toast.set(null);
        }, msg.duration);
      }
    });
  }

  dismiss() {
    this.toast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  ngOnDestroy() {
    this.dismiss();
  }
}
```

### Estilos diferenciados por tipo

```scss
// toast.component.scss
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 16px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 300px;
  max-width: 500px;

  &.success {
    background: #4caf50;
  }

  &.error {
    background: #f44336;
  }

  &.info {
    background: #2196f3;
  }

  &.warning {
    background: #ff9800;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    
    &:hover {
      opacity: 0.8;
    }
  }
}
```

### Uso en componentes

```typescript
export class MyComponent {
  constructor(private toast: ToastService) {}

  onSuccess() {
    this.toast.success('¡Operación exitosa!', 3000);
  }

  onError() {
    this.toast.error('Error de validación');
  }

  onInfo() {
    this.toast.info('Información importante', 5000);
  }

  onWarning() {
    this.toast.warning('Advertencia: revisa los datos');
  }
}
```

Para que funcione en toda la aplicación, incluir el componente en `app.component.html`:

```html
<app-toast />
<router-outlet />
```

### Configuración de auto-dismiss

El auto-dismiss se configura mediante la propiedad `duration` en milisegundos:

```typescript
// Sin auto-dismiss (persistente hasta click)
this.toast.error('Error crítico', 0);

// Duración corta para feedback inmediato
this.toast.success('Guardado', 2000);

// Duración dinámica basada en longitud del mensaje
const duration = message.length * 50 + 2000;
this.toast.info(message, duration);
```

---

## Gestión de Estados de Carga

La gestión de loading states usa un servicio global con `BehaviorSubject` para spinner overlay y signals locales por operación asíncrona. Se combina con `finalize()` de RxJS para cleanup garantizado.

### Servicio LoadingService

```typescript
// shared/loading.service.ts
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  private requestCount = 0;
  private timeoutId: any = null;

  show(): void {
    this.requestCount++;
    this.loadingSubject.next(this.requestCount > 0);
    
    // Timeout de seguridad para evitar spinners eternos
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      console.warn('Loading timeout - forzando cierre del spinner');
      this.forceHide();
    }, 10000); // 10 segundos
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }
  }

  private forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
```

### Componente Spinner global

```typescript
// shared/spinner.component.ts
@Component({
  selector: 'app-spinner',
  template: `
    <div *ngIf="isLoading$ | async" class="spinner-overlay">
      <div class="spinner"></div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
    }

    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  isLoading$ = this.loadingService.isLoading$;

  constructor(private loadingService: LoadingService) {}
}
```

Incluir en `app.component.html`:

```html
<app-spinner />
```

### Loading local en botones

Para estados de carga específicos en botones o formularios:

```typescript
export class MyComponent {
  isSaving = signal(false);

  constructor(
    private userService: UserService,
    private toast: ToastService
  ) {}

  save() {
    this.isSaving.set(true);

    this.userService.saveUser(this.user).subscribe({
      next: () => {
        this.toast.success('Usuario guardado');
        this.isSaving.set(false);
      },
      error: (err) => {
        this.toast.error('Error al guardar');
        this.isSaving.set(false);
      }
    });
  }
}
```

En el template:

```html
<button [disabled]="isSaving()" (click)="save()">
  {{ isSaving() ? 'Guardando...' : 'Guardar' }}
</button>
```

### Uso con RxJS finalize

Para garantizar que el estado de carga se limpie siempre, usar el operador `finalize`:

```typescript
// user.service.ts
saveUser(user: User): Observable<User> {
  this.loadingService.show();
  
  return this.http.post<User>('/api/users', user).pipe(
    tap(() => this.toast.success('Usuario guardado')),
    finalize(() => this.loadingService.hide())
  );
}
```

### HttpInterceptor para loading automático

Para aplicar loading automático a todas las peticiones HTTP:

```typescript
// interceptors/loading.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.show();
  
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

Registrar en `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([loadingInterceptor])
    )
  ]
};
```

---

## Arquitectura de Servicios

### Diagrama jerárquico

La arquitectura de servicios sigue un patrón jerárquico con servicios de dominio específicos que consumen servicios HTTP y emiten a servicios reactivos:

```
┌─────────────────────────────────────────┐
│          Componentes (UI)               │
│  - Solo presentación                    │
│  - Event handlers                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Servicios de Dominio               │
│  - UserService                          │
│  - ProductService                       │
│  - LessonService                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Servicios Reactivos                │
│  - LoadingService                       │
│  - ToastService                         │
│  - CommunicationService                 │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Estado Global                      │
│  - BehaviorSubjects                     │
│  - Signals                              │
└─────────────────────────────────────────┘
```

### Flujo de comunicación

El flujo de datos sigue el patrón unidireccional:

```
Componente → Service → HTTP/Estado → Observable → Componente (actualización)
```

**Ejemplo completo:**

```typescript
// 1. Componente emite acción
export class UserListComponent {
  users$ = this.userService.getUsers();
  
  onDelete(id: number) {
    this.userService.deleteUser(id);
  }
}

// 2. Servicio procesa y actualiza estado
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  deleteUser(id: number) {
    this.loadingService.show();
    
    this.http.delete(`/api/users/${id}`).pipe(
      tap(() => {
        const current = this.usersSubject.value;
        this.usersSubject.next(current.filter(u => u.id !== id));
        this.toastService.success('Usuario eliminado');
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe();
  }
}

// 3. Componente recibe actualización automáticamente vía observable
```

---

## Patrones de Comunicación Implementados

### 1. Observable/Subject Pattern

Usado para comunicación entre componentes hermanos y estado persistente:

```typescript
@Injectable({ providedIn: 'root' })
export class CommunicationService {
  private dataSubject = new BehaviorSubject<Data>(null);
  public data$ = this.dataSubject.asObservable();

  updateData(data: Data) {
    this.dataSubject.next(data);
  }
}
```

**Ventajas:**
- Desacoplamiento total entre componentes
- Estado reactivo y observable
- Múltiples suscriptores posibles

### 2. Servicio Singleton

Todos los servicios usan `providedIn: 'root'` para garantizar una única instancia:

```typescript
@Injectable({ providedIn: 'root' })
export class MyService { }
```

**Ventajas:**
- Estado compartido global
- Sin necesidad de providers en módulos
- Lazy loading automático
- Tree-shakeable

### 3. HttpInterceptor Pattern

Para funcionalidades transversales en peticiones HTTP:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

### 4. Signals + AsyncPipe

Para estado reactivo local sin suscripciones manuales:

```typescript
// En el componente
count = signal(0);
users$ = this.userService.getUsers();
```

```html
<!-- En el template -->
<div>{{ count() }}</div>
<div *ngFor="let user of users$ | async">{{ user.name }}</div>
```

---

## Buenas Prácticas de Separación de Responsabilidades

### Principios SOLID aplicados

**Single Responsibility Principle (SRP):**
- Cada servicio tiene una única responsabilidad
- Componentes solo manejan UI
- Servicios solo manejan lógica/datos

**Dependency Inversion Principle (DIP):**
- Componentes dependen de abstracciones (servicios)
- No de implementaciones concretas

### Comparación: Código malo vs código bueno

**Código malo (componente con lógica pesada):**

```typescript
// ❌ MAL - Componente con demasiada responsabilidad
export class UserListComponent {
  users: User[] = [];

  constructor(private http: HttpClient) {}

  getUsers() {
    this.http.get<User[]>('/api/users').subscribe(users => {
      // Lógica de negocio en el componente ❌
      this.users = users.filter(u => u.active && u.role === 'admin');
      this.users.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  deleteUser(id: number) {
    // Llamada HTTP directa en componente ❌
    this.http.delete(`/api/users/${id}`).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
      alert('Usuario eliminado'); // ❌
    });
  }
}
```

**Código bueno (separación correcta):**

```typescript
// ✅ BIEN - Servicio con lógica de negocio
@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toast: ToastService
  ) {}

  loadUsers() {
    this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active && u.role === 'admin')),
      map(users => users.sort((a, b) => a.name.localeCompare(b.name)))
    ).subscribe(users => this.usersSubject.next(users));
  }

  deleteUser(id: number) {
    return this.http.delete(`/api/users/${id}`).pipe(
      tap(() => {
        const current = this.usersSubject.value;
        this.usersSubject.next(current.filter(u => u.id !== id));
        this.toast.success('Usuario eliminado');
      })
    );
  }
}

// ✅ BIEN - Componente limpio, solo presentación
export class UserListComponent {
  users$ = this.userService.users$;

  constructor(private userService: UserService) {
    this.userService.loadUsers();
  }

  onDelete(id: number) {
    this.userService.deleteUser(id).subscribe();
  }
}
```

### Checklist de buenas prácticas

**Componentes:**
- [ ] No contienen llamadas HTTP directas
- [ ] No tienen lógica de negocio compleja
- [ ] Usan AsyncPipe para observables en templates
- [ ] Delegan todas las operaciones a servicios
- [ ] Solo manejan estado de UI local con signals

**Servicios:**
- [ ] Tienen una única responsabilidad clara
- [ ] Usan `providedIn: 'root'` para singleton
- [ ] Retornan observables, no se suscriben internamente
- [ ] Implementan manejo de errores
- [ ] Usan operadores RxJS para transformaciones

**Arquitectura:**
- [ ] Estructura de carpetas por features
- [ ] Servicios compartidos en carpeta `shared/`
- [ ] Componentes reutilizables en `shared/components/`
- [ ] Interceptors en `core/interceptors/`

---

## Resumen de Entregables - Fase 2

### Servicios implementados

1. **CommunicationService** - Comunicación entre componentes hermanos
2. **ToastService** - Sistema de notificaciones centralizado
3. **LoadingService** - Gestión de estados de carga global

### Componentes de infraestructura

1. **ToastComponent** - Notificaciones visuales con auto-dismiss
2. **SpinnerComponent** - Indicador de carga global

### Patrones aplicados

- Observable/Subject para comunicación reactiva
- Singleton pattern en servicios
- Separación de responsabilidades (SRP)
- Unidirectional data flow
- HttpInterceptor para funcionalidad transversal

### Características del sistema

- Notificaciones con 4 tipos (success, error, info, warning)
- Auto-dismiss configurable por tipo
- Loading states global y local
- Timeout de seguridad en spinner (10 segundos)
- Prevención de memory leaks con takeUntilDestroyed
- Uso de signals y AsyncPipe para reactividad

---

# Fase 3: Formularios Reactivos con Validación Completa

## Objetivos

Implementar formularios reactivos con validación completa, tanto síncrona como asíncrona, utilizando FormBuilder, validadores personalizados, FormArray para contenido dinámico y feedback visual de validación.

---

## Formularios Reactivos Básicos

Los formularios reactivos utilizan `FormBuilder` para declarar `FormGroup` y `FormControl` de forma programática, con validadores síncronos integrados que actualizan los errores de forma reactiva. Esta aproximación facilita el testing, la validación dinámica y la reutilización en comparación con los template-driven forms.

### Implementación de FormBuilder

Para utilizar formularios reactivos, es necesario importar `ReactiveFormsModule` y usar `FormBuilder` inyectado para crear grupos de controles.

**Configuración básica:**

```typescript
// user-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      age: [0, [Validators.required, Validators.min(18), Validators.max(100)]],
      password: ['', [
        Validators.required, 
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Formulario válido:', this.userForm.value);
    }
  }
}
```

### FormGroup y FormControl

`FormGroup` agrupa controles relacionados y permite acceder a ellos mediante `get('field')` o `controls.field`. Se puede usar `valueChanges` para validaciones dinámicas.

**Template con bindings reactivos:**

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div class="form-field">
    <input formControlName="name" placeholder="Nombre">
    <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched" 
         class="error">
      Nombre requerido (mínimo 2 caracteres)
    </div>
  </div>

  <div class="form-field">
    <input formControlName="email" type="email" placeholder="Email">
    <div *ngIf="userForm.get('email')?.errors?.['email']" class="error">
      Email inválido
    </div>
  </div>

  <div class="form-field">
    <input formControlName="age" type="number" placeholder="Edad">
    <div *ngIf="userForm.get('age')?.errors?.['min']" class="error">
      Edad mínima: 18 años
    </div>
  </div>

  <button type="submit" [disabled]="userForm.invalid">Guardar</button>
</form>
```

### Validadores síncronos integrados

Angular proporciona validadores built-in que retornan `null` cuando son válidos o un objeto de error cuando no lo son.

| Validador | Uso | Error retornado |
|-----------|-----|-----------------|
| `required` | `['', Validators.required]` | `{required: true}` |
| `minLength(n)` | `Validators.minLength(3)` | `{minlength: {requiredLength: 3, actualLength: 1}}` |
| `maxLength(n)` | `Validators.maxLength(50)` | `{maxlength: {requiredLength: 50, actualLength: 60}}` |
| `email` | `Validators.email` | `{email: true}` |
| `pattern(/regex/)` | `Validators.pattern(/^abc$/)` | `{pattern: {requiredPattern: '^abc$', actualValue: 'def'}}` |
| `min(n)` | `Validators.min(18)` | `{min: {min: 18, actual: 16}}` |
| `max(n)` | `Validators.max(100)` | `{max: {max: 100, actual: 120}}` |
| `requiredTrue` | `Validators.requiredTrue` | `{required: true}` |

**Helper para mensajes de error:**

```typescript
getErrorMessage(controlName: string): string {
  const control = this.userForm.get(controlName);
  if (!control) return '';
  
  if (control.errors?.['required']) {
    return `${controlName} es requerido`;
  }
  if (control.errors?.['email']) {
    return 'Email inválido';
  }
  if (control.errors?.['minlength']) {
    const minLength = control.errors['minlength'].requiredLength;
    return `Mínimo ${minLength} caracteres`;
  }
  if (control.errors?.['min']) {
    return `Valor mínimo: ${control.errors['min'].min}`;
  }
  return '';
}
```

---

## Validadores Personalizados

Los validadores personalizados son funciones que reciben `AbstractControl` y retornan `null` (válido) o `{error: any}` (inválido). Se aplican a controles individuales o grupos para validación cross-field, integrándose reactivamente con FormBuilder.

### Validador de contraseña fuerte

Este validador comprueba que la contraseña cumpla con requisitos de seguridad: mayúsculas, minúsculas, números y caracteres especiales.

```typescript
// validators/password-strength.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const minLength = value.length >= 12;

    const errors: ValidationErrors = {};
    if (!hasUpper) errors['noUppercase'] = true;
    if (!hasLower) errors['noLowercase'] = true;
    if (!hasNumber) errors['noNumber'] = true;
    if (!hasSpecial) errors['noSpecial'] = true;
    if (!minLength) errors['minLength'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}
```

**Uso en el template:**

```html
<input formControlName="password" type="password">
<div *ngIf="userForm.get('password')?.errors as errors">
  <span *ngIf="errors['noUppercase']" class="error">
    Debe contener al menos una mayúscula
  </span>
  <span *ngIf="errors['noLowercase']" class="error">
    Debe contener al menos una minúscula
  </span>
  <span *ngIf="errors['noNumber']" class="error">
    Debe contener al menos un número
  </span>
  <span *ngIf="errors['noSpecial']" class="error">
    Debe contener al menos un carácter especial
  </span>
  <span *ngIf="errors['minLength']" class="error">
    Debe tener al menos 12 caracteres
  </span>
</div>
```

### Validador de confirmación de contraseña

Validación cross-field a nivel de FormGroup para asegurar que dos campos coincidan.

```typescript
// validators/password-match.validator.ts
export function passwordMatch(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;
    if (matchControl.errors && !matchControl.touched) return null;

    return control.value === matchControl.value ? null : { mismatch: true };
  };
}
```

**Uso en FormBuilder:**

```typescript
this.userForm = this.fb.group({
  password: ['', [Validators.required, passwordStrength()]],
  confirmPassword: ['', Validators.required]
}, { 
  validators: passwordMatch('password', 'confirmPassword') 
});
```

**Mostrar error en el template:**

```html
<input formControlName="confirmPassword" type="password">
<div *ngIf="userForm.errors?.['mismatch'] && 
            userForm.get('confirmPassword')?.touched" 
     class="error">
  Las contraseñas no coinciden
</div>
```

### Validadores de formato español

Validadores específicos para formatos españoles comunes:

```typescript
// validators/spanish-formats.validator.ts

// Validador de NIF español
export function nifValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nif = control.value?.toUpperCase();
    if (!nif) return null;
    
    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (!nifRegex.test(nif)) {
      return { invalidNif: true };
    }

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const position = parseInt(nif.substring(0, 8)) % 23;
    
    return letters[position] === nif[8] ? null : { invalidNif: true };
  };
}

// Validador de teléfono móvil español
export function telefonoValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^(6|7)[0-9]{8}$/.test(control.value) 
      ? null 
      : { invalidTelefono: true };
  };
}

// Validador de código postal español
export function codigoPostalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const cp = control.value.toString();
    
    if (!/^\d{5}$/.test(cp)) {
      return { invalidCP: true };
    }
    
    const provincia = parseInt(cp.substring(0, 2));
    if (provincia < 1 || provincia > 52) {
      return { invalidCP: true };
    }
    
    return null;
  };
}
```

**Uso en el formulario:**

```typescript
this.userForm = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  nif: ['', [Validators.required, nifValidator()]],
  telefono: ['', telefonoValidator()],
  cp: ['', codigoPostalValidator()],
  password: ['', [Validators.required, passwordStrength()]],
  confirmPassword: ['', Validators.required]
}, { 
  validators: passwordMatch('password', 'confirmPassword') 
});
```

**Mensajes de error en el template:**

```html
<input formControlName="nif" placeholder="12345678Z">
<div *ngIf="userForm.get('nif')?.errors?.['invalidNif'] && 
            userForm.get('nif')?.touched" 
     class="error">
  NIF inválido (formato: 12345678Z con letra válida)
</div>

<input formControlName="telefono" placeholder="600123456">
<div *ngIf="userForm.get('telefono')?.errors?.['invalidTelefono']" 
     class="error">
  Teléfono inválido (debe empezar por 6 o 7 y tener 9 dígitos)
</div>

<input formControlName="cp" placeholder="28001">
<div *ngIf="userForm.get('cp')?.errors?.['invalidCP']" 
     class="error">
  Código postal inválido (5 dígitos, provincia 01-52)
</div>
```

### Validadores cross-field avanzados

Los validadores cross-field se aplican al FormGroup completo, permitiendo validaciones que dependen de múltiples campos.

```typescript
// validators/cross-field.validators.ts

// Validar que el total sea mayor a un mínimo
export function totalMinimo(min: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value || 0;
    const quantity = group.get('quantity')?.value || 0;
    const total = price * quantity;

    return total >= min 
      ? null 
      : { totalMinimo: { min, actual: total } };
  };
}

// Validar que una edad sea mayor que otra
export function edadMayor(controlName: string, minAgeControl: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const ageControl = group.get(minAgeControl);

    if (!control?.value || !ageControl?.value) return null;
    
    return parseInt(control.value) > parseInt(ageControl.value) 
      ? null 
      : { edadMenor: true };
  };
}

// Validar que al menos uno de varios campos tenga valor
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => !!group.get(field)?.value);
    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}

// Validar rango de fechas
export function dateRange(startField: string, endField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startField)?.value;
    const end = group.get(endField)?.value;

    if (!start || !end) return null;

    const startDate = new Date(start);
    const endDate = new Date(end);

    return endDate > startDate 
      ? null 
      : { invalidRange: true };
  };
}
```

**Uso completo:**

```typescript
this.orderForm = this.fb.group({
  price: [0, [Validators.required, Validators.min(0)]],
  quantity: [1, [Validators.required, Validators.min(1)]],
  phone: [''],
  email: [''],
  startDate: ['', Validators.required],
  endDate: ['', Validators.required]
}, {
  validators: [
    totalMinimo(100),
    atLeastOneRequired('phone', 'email'),
    dateRange('startDate', 'endDate')
  ]
});
```

---

## Validadores Asíncronos

Los validadores asíncronos retornan `Observable<ValidationErrors | null>` o `Promise<ValidationErrors | null>`. Se ejecutan después de los validadores síncronos y son ideales para consultas a APIs, con debounce para optimizar las llamadas.

### Validador de email único

Este validador simula una consulta a la API para verificar si el email ya está registrado.

```typescript
// validators/async.validators.ts
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AsyncValidatorsService {
  // Simulación de emails ya registrados
  private registeredEmails = [
    'admin@example.com',
    'user@test.com',
    'test@demo.com'
  ];

  emailUnique(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      // Simula debounce + llamada API
      return timer(500).pipe(
        switchMap(() => this.checkEmailExists(control.value)),
        map(exists => exists ? { emailTaken: true } : null),
        catchError(() => of(null)) // Error de red no bloquea
      );
    };
  }

  private checkEmailExists(email: string): Observable<boolean> {
    // Simula latencia de API (800ms)
    return of(this.registeredEmails.includes(email.toLowerCase()))
      .pipe(/* delay se puede añadir aquí */);
  }
}
```

### Validador de username disponible

Similar al anterior, pero para verificar disponibilidad de nombres de usuario:

```typescript
usernameAvailable(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;
    
    if (!username || username.length < 3) return of(null);

    return timer(300).pipe(
      switchMap(() => this.checkUsernameExists(username)),
      map(exists => exists ? { usernameTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

private checkUsernameExists(username: string): Observable<boolean> {
  // Simulación de usernames ocupados
  const taken = ['admin', 'user', 'test', 'demo'];
  return of(taken.includes(username.toLowerCase()));
}
```

### Validador de NIF único

Para verificar que un NIF no esté ya registrado en el sistema:

```typescript
nifUnique(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(500).pipe(
      switchMap(() => this.checkNifExists(control.value)),
      map(exists => exists ? { nifTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

private checkNifExists(nif: string): Observable<boolean> {
  // Simulación
  const registered = ['12345678Z', '87654321X'];
  return of(registered.includes(nif.toUpperCase()));
}
```

### Uso en FormBuilder

Los validadores asíncronos se configuran en un objeto aparte, junto con la opción `updateOn`:

```typescript
constructor(
  private fb: FormBuilder,
  private asyncValidators: AsyncValidatorsService
) {
  this.userForm = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.asyncValidators.emailUnique()],
      updateOn: 'blur' // Solo valida al salir del campo
    }],
    username: ['', {
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: [this.asyncValidators.usernameAvailable()],
      updateOn: 'blur'
    }],
    nif: ['', {
      validators: [Validators.required, nifValidator()],
      asyncValidators: [this.asyncValidators.nifUnique()],
      updateOn: 'blur'
    }]
  });
}
```

### Template con estados de loading

Es importante mostrar feedback visual durante la validación asíncrona:

```html
<div class="form-field">
  <label>Email</label>
  <input formControlName="email" type="email" placeholder="email@ejemplo.com">
  
  <div *ngIf="email?.pending" class="loading">
    Verificando email...
  </div>
  
  <div *ngIf="email?.errors?.['emailTaken'] && !email?.pending && email?.touched" 
       class="error">
    Este email ya está registrado
  </div>
  
  <div *ngIf="email?.errors?.['email'] && email?.touched" 
       class="error">
    Formato de email inválido
  </div>
</div>

<div class="form-field">
  <label>Nombre de usuario</label>
  <input formControlName="username" placeholder="usuario123">
  
  <div *ngIf="username?.pending" class="loading">
    Comprobando disponibilidad...
  </div>
  
  <div *ngIf="username?.errors?.['usernameTaken'] && !username?.pending && username?.touched" 
       class="error">
    Nombre de usuario no disponible
  </div>
</div>

<div class="form-field">
  <label>NIF</label>
  <input formControlName="nif" placeholder="12345678Z">
  
  <div *ngIf="nif?.pending" class="loading">
    Verificando NIF...
  </div>
  
  <div *ngIf="nif?.errors?.['nifTaken'] && !nif?.pending && nif?.touched" 
       class="error">
    Este NIF ya está registrado
  </div>
</div>
```

**Helpers en el componente:**

```typescript
get email() { return this.userForm.get('email'); }
get username() { return this.userForm.get('username'); }
get nif() { return this.userForm.get('nif'); }
```

### Configuración de updateOn

| Opción | Efecto | Recomendado para |
|--------|--------|------------------|
| `'change'` | Valida en cada cambio (default) | Validaciones síncronas rápidas |
| `'blur'` | Valida al salir del campo | Validadores asíncronos |
| `'submit'` | Solo valida al enviar | Performance crítico |

**Estilos CSS para estados:**

```scss
.form-field {
  .loading {
    color: #2196f3;
    font-style: italic;
    font-size: 0.875rem;
    margin-top: 4px;
  }

  .error {
    color: #f44336;
    font-size: 0.875rem;
    margin-top: 4px;
  }

  input.ng-pending {
    border-color: #ff9800;
    border-style: dashed;
  }

  input.ng-invalid.ng-touched {
    border-color: #f44336;
  }

  input.ng-valid.ng-touched {
    border-color: #4caf50;
  }
}
```

---

## FormArray para Contenido Dinámico

`FormArray` permite gestionar colecciones dinámicas de `FormGroup` o `FormControl`, ideal para listas de direcciones, teléfonos o líneas de factura. Cada elemento tiene sus propios validadores y se puede añadir o eliminar en tiempo de ejecución.

### Definición de FormArray

```typescript
// invoice-form.component.ts
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-invoice-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      customer: ['', Validators.required],
      phones: this.fb.array([]),
      addresses: this.fb.array([]),
      items: this.fb.array([])
    });

    // Añadir elementos iniciales
    this.addPhone();
    this.addAddress();
    this.addItem();
  }

  // Getters para acceder a los FormArrays
  get phones(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  // Métodos para teléfonos
  private newPhone(): FormGroup {
    return this.fb.group({
      tipo: ['movil', [Validators.required]],
      numero: ['', [Validators.required, telefonoValidator()]]
    });
  }

  addPhone(): void {
    if (this.phones.length < 5) { // Límite máximo
      this.phones.push(this.newPhone());
    }
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  // Métodos para direcciones
  private newAddress(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      floor: [''],
      city: ['', Validators.required],
      zip: ['', [Validators.required, codigoPostalValidator()]]
    });
  }

  addAddress(): void {
    this.addresses.push(this.newAddress());
  }

  removeAddress(index: number): void {
    if (this.addresses.length > 1) { // Mantener al menos una
      this.addresses.removeAt(index);
    }
  }

  // Métodos para items de factura
  private newItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  // Cálculo de total
  getTotal(): number {
    return this.items.value
      .reduce((acc: number, item: any) => 
        acc + (item.quantity * item.price), 0
      );
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Formulario:', this.form.value);
  }
}
```

### Template con agregar/eliminar dinámico

```html
<!-- invoice-form.component.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  
  <!-- Cliente -->
  <section>
    <h3>Datos del Cliente</h3>
    <input formControlName="customer" placeholder="Nombre del cliente">
    <div *ngIf="form.get('customer')?.invalid && form.get('customer')?.touched" 
         class="error">
      El nombre del cliente es requerido
    </div>
  </section>

  <!-- Teléfonos -->
  <section>
    <h3>Teléfonos</h3>
    <div formArrayName="phones">
      <div *ngFor="let phoneGroup of phones.controls; let i = index" 
           [formGroupName]="i" 
           class="array-item">
        
        <select formControlName="tipo">
          <option value="movil">Móvil</option>
          <option value="fijo">Fijo</option>
          <option value="trabajo">Trabajo</option>
        </select>
        
        <input formControlName="numero" placeholder="600123456">
        
        <button type="button" 
                (click)="removePhone(i)" 
                *ngIf="phones.length > 1"
                class="btn-remove">
          Eliminar
        </button>

        <div *ngIf="phoneGroup.get('numero')?.invalid && 
                    phoneGroup.get('numero')?.touched" 
             class="error">
          Teléfono inválido
        </div>
      </div>
    </div>
    
    <button type="button" 
            (click)="addPhone()" 
            [disabled]="phones.length >= 5"
            class="btn-add">
      Añadir teléfono
    </button>
  </section>

  <!-- Direcciones -->
  <section>
    <h3>Direcciones</h3>
    <div formArrayName="addresses">
      <div *ngFor="let addressGroup of addresses.controls; let i = index" 
           [formGroupName]="i" 
           class="array-item address-item">
        
        <input formControlName="street" placeholder="Calle">
        <input formControlName="number" placeholder="Número">
        <input formControlName="floor" placeholder="Piso (opcional)">
        <input formControlName="city" placeholder="Ciudad">
        <input formControlName="zip" placeholder="Código Postal">
        
        <button type="button" 
                (click)="removeAddress(i)" 
                *ngIf="addresses.length > 1"
                class="btn-remove">
          Eliminar dirección
        </button>

        <div *ngIf="addressGroup.invalid && addressGroup.touched" 
             class="error">
          Complete todos los campos obligatorios de la dirección
        </div>
      </div>
    </div>
    
    <button type="button" 
            (click)="addAddress()" 
            class="btn-add">
      Añadir dirección
    </button>
  </section>

  <!-- Items de factura -->
  <section>
    <h3>Items de Factura</h3>
    <div formArrayName="items">
      <div *ngFor="let itemGroup of items.controls; let i = index" 
           [formGroupName]="i" 
           class="array-item item-row">
        
        <input formControlName="description" 
               placeholder="Descripción" 
               class="description">
        
        <input formControlName="quantity" 
               type="number" 
               min="1" 
               placeholder="Cant."
               class="quantity">
        
        <input formControlName="price" 
               type="number" 
               min="0" 
               step="0.01" 
               placeholder="Precio"
               class="price">
        
        <span class="subtotal">
          {{ (itemGroup.get('quantity')?.value * itemGroup.get('price')?.value) | currency:'EUR' }}
        </span>
        
        <button type="button" 
                (click)="removeItem(i)" 
                *ngIf="items.length > 1"
                class="btn-remove">
          Eliminar
        </button>

        <div *ngIf="itemGroup.invalid && itemGroup.touched" 
             class="error">
          Cantidad mínima: 1, Precio mínimo: 0
        </div>
      </div>
    </div>
    
    <button type="button" 
            (click)="addItem()" 
            class="btn-add">
      Añadir item
    </button>
    
    <div class="total">
      <strong>Total: {{ getTotal() | currency:'EUR':'symbol' }}</strong>
    </div>
  </section>

  <!-- Botón de envío -->
  <button type="submit" 
          [disabled]="form.invalid"
          class="btn-submit">
    Guardar Factura
  </button>
</form>
```

### Estilos para FormArray

```scss
// invoice-form.component.scss
.array-item {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;

  input, select {
    flex: 1;
    min-width: 0;
  }

  &.item-row {
    .description { flex: 3; }
    .quantity { flex: 1; max-width: 80px; }
    .price { flex: 1; max-width: 100px; }
    .subtotal {
      flex: 1;
      max-width: 100px;
      font-weight: 500;
      text-align: right;
    }
  }

  .btn-remove {
    flex-shrink: 0;
    background: #f44336;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #d32f2f;
    }
  }
}

.btn-add {
  margin-top: 8px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #388e3c;
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
}

.total {
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: right;
  font-size: 1.25rem;
}
```

---

## Mostrar Errores Según Estado del Campo

Para mejorar la experiencia del usuario, los errores solo deben mostrarse cuando el campo ha sido tocado (`touched`) o modificado (`dirty`), evitando "pantallas rojas" al cargar el formulario.

### Mostrar errores tras touched/dirty

```html
<div class="form-field">
  <input formControlName="email" type="email" placeholder="Email">
  
  <div *ngIf="email?.invalid && (email?.touched || email?.dirty)" 
       class="error">
    <span *ngIf="email?.errors?.['required']">
      El email es obligatorio
    </span>
    <span *ngIf="email?.errors?.['email']">
      Formato de email inválido
    </span>
  </div>
</div>
```

**Helper en el componente:**

```typescript
get email() { 
  return this.form.get('email');
}
```

### Deshabilitar submit si formulario inválido

El botón de envío debe estar deshabilitado cuando el formulario es inválido o hay validaciones asíncronas en curso:

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <!-- campos del formulario -->
  
  <button type="submit" 
          [disabled]="form.invalid || form.pending"
          class="btn-submit">
    {{ form.pending ? 'Validando...' : 'Enviar' }}
  </button>
</form>
```

### Loading durante validación asíncrona

Aprovecha la propiedad `pending` del control para mostrar feedback visual:

```html
<div class="form-field">
  <input formControlName="username" placeholder="Usuario">
  
  <div *ngIf="username?.pending" class="loading">
    <span class="spinner"></span>
    Comprobando disponibilidad...
  </div>
  
  <div *ngIf="username?.errors?.['usernameTaken'] && 
              username?.touched && 
              !username?.pending" 
       class="error">
    Nombre de usuario no disponible
  </div>
</div>
```

**Helper:**

```typescript
get username() {
  return this.form.get('username');
}
```

### Feedback visual con clases de Angular

Angular aplica automáticamente clases CSS según el estado del campo:

| Clase | Condición |
|-------|-----------|
| `ng-untouched` | Campo no ha sido tocado |
| `ng-touched` | Campo ha sido tocado |
| `ng-pristine` | Campo no ha sido modificado |
| `ng-dirty` | Campo ha sido modificado |
| `ng-valid` | Campo es válido |
| `ng-invalid` | Campo es inválido |
| `ng-pending` | Validación asíncrona en curso |

**Estilos CSS usando estas clases:**

```scss
input {
  border: 2px solid #e0e0e0;
  padding: 10px;
  border-radius: 4px;
  transition: border-color 0.3s;

  &.ng-touched.ng-invalid,
  &.ng-dirty.ng-invalid {
    border-color: #f44336;
  }

  &.ng-touched.ng-valid,
  &.ng-dirty.ng-valid {
    border-color: #4caf50;
  }

  &.ng-pending {
    border-color: #ff9800;
    border-style: dashed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
}

.error {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

.loading {
  color: #2196f3;
  font-size: 0.875rem;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid #2196f3;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Marcar todos los campos como touched en submit

Cuando el usuario intenta enviar el formulario inválido, marcar todos los campos como touched para mostrar todos los errores:

```typescript
onSubmit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.toastService.error('Por favor, corrige los errores del formulario');
    return;
  }

  // Procesar formulario válido
  console.log('Formulario válido:', this.form.value);
  this.toastService.success('Formulario enviado correctamente');
}
```

---

## Catálogo de Validadores Implementados

### Tabla resumen de validadores

| Nombre | Tipo | Nivel | Descripción | Uso típico |
|--------|------|-------|-------------|------------|
| `Validators.required` | Síncrono | Campo | Campo obligatorio | Todos los campos requeridos |
| `Validators.email` | Síncrono | Campo | Formato de email | Campo email |
| `Validators.minLength(n)` | Síncrono | Campo | Longitud mínima | Password, username, textos |
| `Validators.maxLength(n)` | Síncrono | Campo | Longitud máxima | Textos con límite |
| `Validators.min(n)` | Síncrono | Campo | Valor numérico mínimo | Edad, cantidad, precio |
| `Validators.max(n)` | Síncrono | Campo | Valor numérico máximo | Edad, cantidad, descuento |
| `Validators.pattern(regex)` | Síncrono | Campo | Patrón regex | Formatos específicos |
| `Validators.requiredTrue` | Síncrono | Campo | Checkbox debe estar marcado | Términos y condiciones |
| `passwordStrength()` | Personalizado | Campo | Mayúscula, minúscula, número, especial, 12+ chars | Password |
| `nifValidator()` | Personalizado | Campo | NIF español válido (formato + letra) | Campo NIF |
| `telefonoValidator()` | Personalizado | Campo | Teléfono móvil español (6/7 + 8 dígitos) | Teléfonos |
| `codigoPostalValidator()` | Personalizado | Campo | CP español (5 dígitos, provincia 01-52) | Dirección |
| `passwordMatch(a, b)` | Cross-field | FormGroup | Verifica que dos campos coincidan | Password y confirmación |
| `totalMinimo(n)` | Cross-field | FormGroup | Total de operación >= n | Pedidos, facturas |
| `atLeastOneRequired(...)` | Cross-field | FormGroup | Al menos uno de varios campos | Teléfono o email |
| `dateRange(start, end)` | Cross-field | FormGroup | Fecha fin > fecha inicio | Rangos de fechas |
| `minAge(n)` | Personalizado | Campo | Edad mínima desde fecha | Fecha de nacimiento |
| `emailUnique()` | Asíncrono | Campo | Email no registrado (API) | Registro de usuario |
| `usernameAvailable()` | Asíncrono | Campo | Username disponible (API) | Registro de usuario |
| `nifUnique()` | Asíncrono | Campo | NIF no registrado (API) | Registro de usuario |

### Ejemplos de uso por categoría

**Validadores básicos:**

```typescript
name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
age: [0, [Validators.required, Validators.min(18), Validators.max(100)]],
email: ['', [Validators.required, Validators.email]],
terms: [false, Validators.requiredTrue]
```

**Validadores personalizados:**

```typescript
password: ['', [Validators.required, passwordStrength()]],
nif: ['', [Validators.required, nifValidator()]],
telefono: ['', [Validators.required, telefonoValidator()]],
cp: ['', [Validators.required, codigoPostalValidator()]]
```

**Validadores cross-field:**

```typescript
this.form = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required],
  phone: [''],
  email: [''],
  startDate: [''],
  endDate: ['']
}, {
  validators: [
    passwordMatch('password', 'confirmPassword'),
    atLeastOneRequired('phone', 'email'),
    dateRange('startDate', 'endDate')
  ]
});
```

**Validadores asíncronos:**

```typescript
email: ['', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [this.asyncValidators.emailUnique()],
  updateOn: 'blur'
}],
username: ['', {
  validators: [Validators.required, Validators.minLength(3)],
  asyncValidators: [this.asyncValidators.usernameAvailable()],
  updateOn: 'blur'
}]
```

---

## Guía de Uso de FormArray

### Casos de uso documentados

FormArray es ideal para:
- Lista de teléfonos de contacto
- Múltiples direcciones (envío, facturación)
- Items de factura o pedido
- Lista de beneficiarios
- Experiencia laboral o educativa
- Documentos adjuntos

### Flujo completo de implementación

**1. Definir en el FormGroup principal:**

```typescript
this.form = this.fb.group({
  customer: ['', Validators.required],
  phones: this.fb.array([]),  // FormArray vacío
  addresses: this.fb.array([])
});
```

**2. Crear getter para acceso tipo seguro:**

```typescript
get phones(): FormArray {
  return this.form.get('phones') as FormArray;
}
```

**3. Método para crear nuevo elemento:**

```typescript
private newPhone(): FormGroup {
  return this.fb.group({
    tipo: ['movil', Validators.required],
    numero: ['', [Validators.required, telefonoValidator()]]
  });
}
```

**4. Métodos públicos para añadir y eliminar:**

```typescript
addPhone(): void {
  if (this.phones.length < 5) {
    this.phones.push(this.newPhone());
  }
}

removePhone(index: number): void {
  if (this.phones.length > 1) {
    this.phones.removeAt(index);
  }
}
```

**5. Template con iteración:**

```html
<div formArrayName="phones">
  <div *ngFor="let phoneGroup of phones.controls; let i = index" 
       [formGroupName]="i">
    <input formControlName="numero">
    <button type="button" (click)="removePhone(i)">Eliminar</button>
  </div>
</div>
<button type="button" (click)="addPhone()">Añadir teléfono</button>
```

### Validación en FormArray

**Validar cada elemento:**

```html
<div *ngIf="phoneGroup.get('numero')?.invalid && 
            phoneGroup.get('numero')?.touched" 
     class="error">
  Teléfono inválido
</div>
```

**Validar el array completo:**

```typescript
get hasMinimumPhones(): boolean {
  return this.phones.length >= 1;
}
```

```html
<div *ngIf="!hasMinimumPhones && form.touched" class="error">
  Debe proporcionar al menos un teléfono
</div>
```

### Límites y restricciones

```typescript
// Máximo de elementos
addPhone(): void {
  if (this.phones.length >= 5) {
    this.toastService.warning('Máximo 5 teléfonos permitidos');
    return;
  }
  this.phones.push(this.newPhone());
}

// Mínimo de elementos
removePhone(index: number): void {
  if (this.phones.length <= 1) {
    this.toastService.warning('Debe mantener al menos un teléfono');
    return;
  }
  this.phones.removeAt(index);
}
```

---

## Ejemplos de Validación Asíncrona

### Flujo completo de validación asíncrona

**1. Servicio de validación (simulación de API):**

```typescript
// services/validation.service.ts
@Injectable({ providedIn: 'root' })
export class ValidationService {
  private usedEmails = ['admin@example.com', 'user@test.com'];
  private usedUsernames = ['admin', 'user', 'test'];

  checkEmailUnique(email: string): Observable<boolean> {
    // Simula latencia de red
    return of(!this.usedEmails.includes(email.toLowerCase()))
      .pipe(delay(800));
  }

  checkUsernameAvailable(username: string): Observable<boolean> {
    return of(!this.usedUsernames.includes(username.toLowerCase()))
      .pipe(delay(600));
  }
}
```

**2. Validador asíncrono con debounce:**

```typescript
// validators/async.validators.ts
export function emailUnique(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    // Debounce de 500ms antes de llamar al servicio
    return timer(500).pipe(
      switchMap(() => validationService.checkEmailUnique(control.value)),
      map(isUnique => isUnique ? null : { emailTaken: true }),
      catchError(() => of(null)) // Error de red no bloquea el formulario
    );
  };
}

export function usernameAvailable(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) return of(null);

    return timer(300).pipe(
      switchMap(() => validationService.checkUsernameAvailable(control.value)),
      map(isAvailable => isAvailable ? null : { usernameTaken: true }),
      catchError(() => of(null))
    );
  };
}
```

**3. Uso en FormBuilder con updateOn:**

```typescript
constructor(
  private fb: FormBuilder,
  private validationService: ValidationService
) {
  this.form = this.fb.group({
    email: ['', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailUnique(this.validationService)],
      updateOn: 'blur' // Solo valida al salir del campo
    }],
    username: ['', {
      validators: [Validators.required, Validators.minLength(3)],
      asyncValidators: [usernameAvailable(this.validationService)],
      updateOn: 'blur'
    }]
  });
}
```

**4. Template con estados de loading y error:**

```html
<div class="form-field">
  <label>Email</label>
  <input formControlName="email" type="email" placeholder="email@example.com">
  
  <!-- Estado: validando -->
  <div *ngIf="email?.pending" class="loading">
    <span class="spinner"></span>
    Comprobando email...
  </div>
  
  <!-- Estado: error -->
  <div *ngIf="email?.errors?.['emailTaken'] && 
              !email?.pending && 
              (email?.touched || email?.dirty)" 
       class="error">
    Este email ya está registrado
  </div>
  
  <div *ngIf="email?.errors?.['email'] && email?.touched" 
       class="error">
    Formato de email inválido
  </div>
</div>

<div class="form-field">
  <label>Nombre de usuario</label>
  <input formControlName="username" placeholder="usuario123">
  
  <div *ngIf="username?.pending" class="loading">
    <span class="spinner"></span>
    Comprobando disponibilidad...
  </div>
  
  <div *ngIf="username?.errors?.['usernameTaken'] && 
              !username?.pending && 
              username?.touched" 
       class="error">
    Nombre de usuario no disponible
  </div>
</div>

<!-- Botón de envío -->
<button type="submit" 
        [disabled]="form.invalid || form.pending"
        class="btn-submit">
  {{ form.pending ? 'Validando...' : 'Guardar' }}
</button>
```

### Ventajas de esta implementación

1. **Debounce automático**: Evita múltiples llamadas mientras el usuario escribe
2. **updateOn: 'blur'**: Solo valida al salir del campo, reduciendo llamadas innecesarias
3. **Manejo de errores**: `catchError` evita que errores de red bloqueen el formulario
4. **Feedback visual claro**: Estados pending, error y success bien diferenciados
5. **Optimización**: Timer + switchMap cancelan peticiones previas si el usuario sigue escribiendo

---

## Resumen de Entregables - Fase 3

### Formularios implementados

1. **Formulario de registro** - Completo con datos personales, cuenta y dirección
2. **Formulario de factura** - Con FormArray para items dinámicos
3. **Formulario de contacto** - Con múltiples teléfonos (FormArray)

### Validadores personalizados síncronos

1. `passwordStrength()` - Comprueba requisitos de seguridad
2. `nifValidator()` - Valida NIF español con letra de control
3. `telefonoValidator()` - Teléfono móvil español
4. `codigoPostalValidator()` - Código postal español con provincia
5. `passwordMatch()` - Cross-field para confirmación
6. `atLeastOneRequired()` - Cross-field para campos opcionales
7. `dateRange()` - Cross-field para rangos de fechas
8. `minAge()` - Edad mínima desde fecha de nacimiento

### Validadores asíncronos

1. `emailUnique()` - Verifica email no registrado
2. `usernameAvailable()` - Verifica disponibilidad de username
3. `nifUnique()` - Verifica NIF no registrado

Todos con:
- Debounce para optimizar llamadas
- Manejo de errores de red
- updateOn: 'blur' para mejor UX

### FormArray implementado

- Teléfonos adicionales con tipo y número
- Direcciones múltiples con todos los campos
- Items de factura con cálculo de totales
- Límites máximos y mínimos configurables

### Feedback visual completo

- Estados: valid, invalid, pending, touched, dirty
- Clases CSS automáticas de Angular
- Mensajes de error específicos por tipo
- Indicadores de loading durante validaciones asíncronas
- Botón submit deshabilitado según estado
- Estilos diferenciados por estado (verde/rojo/amarillo)

### Documentación

- Catálogo completo de validadores con tabla resumen
- Guía de uso de FormArray con ejemplos
- Ejemplos completos de validación asíncrona
- Buenas prácticas y patrones recomendados

---

*Documentación técnica generada para el proyecto de desarrollo web. Última actualización: Diciembre 2025*

