# 📚 DOCUMENTACIÓN COMPLETA - SISTEMA DE ROUTING

**Proyecto:** Autoescuela DGT - Aplicación de Lecciones  
**Fecha:** 15 de enero de 2026  
**Versión:** 1.0  
**Tecnología:** Angular 17+ (Standalone Components)

---

## 📋 TABLA DE CONTENIDOS

1. [Mapa de Rutas](#mapa-de-rutas)
2. [Estrategia de Lazy Loading](#estrategia-de-lazy-loading)
3. [Route Guards](#route-guards)
4. [Resolvers](#resolvers)
5. [Breadcrumbs Dinámicos](#breadcrumbs-dinámicos)
6. [Navegación Programática](#navegación-programática)
7. [Chunks Generados en Build](#chunks-generados-en-build)
8. [Arquitectura del Sistema](#arquitectura-del-sistema)

---

## 🗺️ MAPA DE RUTAS

### Tabla Completa de Rutas

| Path | Descripción | Parámetros | Lazy | Guards | Resolver | Breadcrumb |
|------|-------------|------------|------|--------|----------|------------|
| `/` | Redirección a home | - | No | - | - | - |
| `/home` | Página de inicio | - | No | - | - | 'Inicio' |
| `/lecciones` | Catálogo de lecciones | - | No | - | - | 'Lecciones' |
| `/lecciones/:id` | Detalle de lección | `id` | No | - | `leccionResolver` | 'Detalle de Lección' |
| `/login` | Formulario de acceso | - | No | - | - | 'Acceso de Usuario' |
| `/about` | Información de la app | - | No | - | - | 'Acerca de' |
| `/usuario` | Área de usuario (layout) | - | **SÍ** | `authGuard` | - | 'Mi Cuenta' |
| `/usuario/perfil` | Perfil de usuario | - | **SÍ** | `authGuard` | - | 'Mi Perfil' |
| `/usuario/progreso` | Progreso en lecciones | - | **SÍ** | `authGuard` | - | 'Mi Progreso' |
| `/usuario/certificados` | Certificados obtenidos | - | **SÍ** | `authGuard` | - | 'Mis Certificados' |
| `/style-guide` | Guía de estilos (dev) | - | No | - | - | 'Guía de Estilos' |
| `/client` | Página cliente (dev) | - | No | - | - | 'Cliente' |
| `/dev/navigation-demo` | Demo navegación | - | No | - | - | 'Demo Navegación' |
| `/**` | Página 404 | - | No | - | - | - |

**Total de rutas:** 14 rutas configuradas  
**Rutas principales:** 6 (home, lecciones, lecciones/:id, login, about, usuario)  
**Rutas hijas:** 3 (perfil, progreso, certificados)  
**Rutas de desarrollo:** 3  
**Ruta wildcard:** 1 (404)

---

## 🚀 ESTRATEGIA DE LAZY LOADING

### Configuración Global

**Archivo:** `frontend/src/app/app.config.ts`

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules) // 🚀 Precarga automática
    )
  ]
};
```

### Módulo Lazy Loaded: Área de Usuario

**Configuración en app.routes.ts:**

```typescript
{
  path: 'usuario',
  component: UserLayout,
  canActivate: [authGuard],
  loadChildren: () => import('./pages/user/user.routes').then(m => m.USER_ROUTES),
  data: { breadcrumb: 'Mi Cuenta' }
}
```

**Archivo de rutas lazy:** `frontend/src/app/pages/user/user.routes.ts`

```typescript
export const USER_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'perfil' },
  {
    path: 'perfil',
    component: UserPerfil,
    canDeactivate: [pendingChangesGuard],
    data: { breadcrumb: 'Mi Perfil' }
  },
  {
    path: 'progreso',
    component: UserProgreso,
    data: { breadcrumb: 'Mi Progreso' }
  },
  {
    path: 'certificados',
    component: UserCertificados,
    data: { breadcrumb: 'Mis Certificados' }
  }
];
```

### ¿Cómo Funciona?

1. **Carga inicial:** Solo se descarga `main.*.js` (bundle principal sin área usuario)
2. **Primera navegación a /usuario:** 
   - Si `PreloadAllModules` ya precargó: navegación instantánea
   - Si no: descarga `user-routes.*.js` bajo demanda
3. **Navegaciones posteriores:** Instantáneas (módulo ya en memoria)

### Ventajas de PreloadAllModules

✅ **Primera carga rápida:** Bundle inicial reducido  
✅ **Precarga en segundo plano:** Módulos lazy descargados después de la carga inicial  
✅ **Navegación fluida:** Módulos listos cuando usuario navega  
✅ **Balance óptimo:** Entre performance inicial y UX posterior

### Desventajas y Alternativas

❌ **Consume ancho de banda:** Descarga módulos que quizá nunca se usen  
🔄 **Alternativa:** `NoPreloading` (solo bajo demanda)  
🔄 **Alternativa:** Custom preloading strategy (selectiva)

---

## 🔒 ROUTE GUARDS

### 1. authGuard (CanActivateFn)

**Propósito:** Proteger rutas que requieren autenticación

**Archivo:** `frontend/src/app/guards/auth.guard.ts`

**Implementación:**

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn) {
    return true; // ✅ Usuario autenticado: acceso permitido
  }

  // ❌ No autenticado: redirigir a login con returnUrl
  console.warn(`🔒 Acceso denegado a ${state.url}. Redirigiendo a login...`);
  
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

**Rutas protegidas:**
- `/usuario` (y todas sus rutas hijas)

**Flujo completo:**

```
1. Usuario no autenticado intenta acceder a /usuario/perfil
   ↓
2. authGuard detecta isLoggedIn = false
   ↓
3. Redirige a /login?returnUrl=%2Fusuario%2Fperfil
   ↓
4. Usuario hace login exitoso
   ↓
5. LoginComponent lee returnUrl desde queryParams
   ↓
6. Redirige a /usuario/perfil (URL original)
```

**Ejemplo de uso en LoginComponent:**

```typescript
export class Login implements OnInit {
  private returnUrl: string = '/home';

  ngOnInit(): void {
    // Leer returnUrl desde queryParams
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
  }

  onLoginSubmit(credentials): void {
    const success = this.authService.login(credentials.email, credentials.password);
    
    if (success) {
      this.router.navigateByUrl(this.returnUrl); // ✅ Vuelve a URL original
    }
  }
}
```

---

### 2. pendingChangesGuard (CanDeactivateFn)

**Propósito:** Prevenir salida de formularios con cambios sin guardar

**Archivo:** `frontend/src/app/guards/pending-changes.guard.ts`

**Interfaz FormComponent:**

```typescript
export interface FormComponent {
  form: FormGroup;
}
```

**Implementación del Guard:**

```typescript
export const pendingChangesGuard: CanDeactivateFn<FormComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Si el formulario NO tiene cambios, permitir salida
  if (!component.form || !component.form.dirty) {
    return true;
  }

  // Formulario con cambios: solicitar confirmación
  const confirmMessage = 
    '⚠️ Hay cambios sin guardar en el formulario.\n\n' +
    '¿Estás seguro de que quieres salir?\n' +
    'Los cambios se perderán.';

  return confirm(confirmMessage);
};
```

**Rutas protegidas:**
- `/usuario/perfil` (formulario de edición de perfil)

**Ejemplo de componente que implementa FormComponent:**

```typescript
export class UserPerfil implements FormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      phone: ['']
    });
  }

  onSave(): void {
    if (this.form.valid) {
      // Guardar datos...
      this.form.markAsPristine(); // ✅ Marcar como guardado
    }
  }
}
```

**Flujo de protección:**

```
1. Usuario edita formulario en /usuario/perfil
   ↓
2. Form se marca como dirty (tiene cambios)
   ↓
3. Usuario intenta navegar a otra ruta (ej: click en "Mi Progreso")
   ↓
4. pendingChangesGuard detecta form.dirty = true
   ↓
5. Muestra confirm(): "Hay cambios sin guardar..."
   ↓
6. Si usuario cancela: permanece en perfil
   Si usuario acepta: navega y pierde cambios
```

---

### 3. AuthService (Simulado)

**Archivo:** `frontend/src/app/services/auth.service.ts`

**Funcionalidad:**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);
  private _currentUser = signal<{ name: string; email: string } | null>(null);

  get isLoggedIn(): boolean {
    return this._isLoggedIn();
  }

  login(email: string, password: string): boolean {
    // Simulación: cualquier credencial es válida
    if (email && password) {
      this._isLoggedIn.set(true);
      this._currentUser.set({ name: email.split('@')[0], email });
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this._isLoggedIn.set(false);
    this._currentUser.set(null);
    localStorage.removeItem('isLoggedIn');
  }
}
```

**Persistencia:** localStorage (en producción: JWT tokens, cookies HTTP-only)

---

## 🔄 RESOLVERS

### leccionResolver (Equivalente a productResolver)

**Propósito:** Precargar datos de lección antes de activar componente de detalle

**Archivo:** `frontend/src/app/resolvers/leccion.resolver.ts`

**Implementación completa:**

```typescript
export const leccionResolver: ResolveFn<Leccion | null> = (route) => {
  const leccionService = inject(LeccionService);
  const router = inject(Router);
  
  // Obtener ID desde parámetros de ruta
  const id = route.paramMap.get('id');
  
  if (!id) {
    router.navigate(['/lecciones'], {
      state: { error: 'No se especificó el ID de la lección' }
    });
    return of(null);
  }

  console.log(`🔄 Resolviendo lección ${id}...`);

  // Llamar al servicio y manejar errores
  return leccionService.getLeccionById(id).pipe(
    catchError(err => {
      console.error(`❌ Error al cargar lección ${id}:`, err);
      
      // Redirigir a lista con mensaje de error
      router.navigate(['/lecciones'], {
        state: { 
          error: `No se pudo cargar la lección con ID ${id}. Puede que no exista.`
        }
      });
      
      return of(null); // No rompe la navegación
    })
  );
};
```

**Configuración en rutas:**

```typescript
{
  path: 'lecciones/:id',
  component: LeccionDetalle,
  resolve: { leccion: leccionResolver }, // 🔄 Precarga
  data: { breadcrumb: 'Detalle de Lección' }
}
```

**Lectura en componente:**

```typescript
export class LeccionDetalle implements OnInit {
  leccion = signal<Leccion | null>(null);

  ngOnInit() {
    this.route.data.subscribe(data => {
      const leccionData = data['leccion'] as Leccion | null;
      
      if (leccionData) {
        this.leccion.set(leccionData); // ✅ Datos precargados
      }
    });
  }
}
```

### Manejo de Errores

**Caso 1: ID no existe**
```
Usuario navega a /lecciones/999
↓
Resolver llama a getLeccionById('999')
↓
Servicio lanza error (no existe)
↓
catchError captura el error
↓
Redirige a /lecciones con mensaje en state
↓
Usuario ve lista con mensaje: "No se pudo cargar lección 999"
```

**Caso 2: Error de red**
```
Usuario navega a /lecciones/1
↓
Resolver llama a getLeccionById('1')
↓
Red falla (timeout, 500, etc.)
↓
catchError captura el error
↓
Redirige a /lecciones con mensaje en state
↓
Usuario ve mensaje de error de conexión
```

### Estado de Carga

**¿Cómo se muestra el loading?**

1. **Router retiene la vista anterior** mientras el resolver ejecuta
2. **Servicio simula latencia:** `delay(800ms)` en Observable
3. **Usuario ve:** Vista anterior hasta que datos están listos
4. **Beneficio:** No se muestra vista vacía/inconsistente

**Código del servicio:**

```typescript
getLeccionById(id: string): Observable<Leccion> {
  const leccion = this.lecciones.find(l => l.id === id);
  
  if (!leccion) {
    return throwError(() => new Error(`Lección ${id} no encontrada`))
      .pipe(delay(300));
  }
  
  return of(leccion).pipe(delay(800)); // Simula latencia de red
}
```

---

## 🍞 BREADCRUMBS DINÁMICOS

### Arquitectura del Sistema

**Componentes involucrados:**

1. **BreadcrumbService** - Construye breadcrumbs desde configuración de rutas
2. **BreadcrumbNav Component** - Renderiza breadcrumbs en UI
3. **app.routes.ts** - Configuración `data.breadcrumb` en cada ruta

### BreadcrumbService

**Archivo:** `frontend/src/app/services/breadcrumb.service.ts`

**Funcionamiento:**

```typescript
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {
    // Escuchar eventos de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs = []): Breadcrumb[] {
    // Recorre árbol de rutas recursivamente
    // Lee data.breadcrumb de cada ruta
    // Construye { label, url } acumulativamente
  }
}
```

**Flujo de actualización:**

```
1. Usuario navega a /usuario/perfil
   ↓
2. Router emite NavigationEnd
   ↓
3. BreadcrumbService escucha el evento
   ↓
4. buildBreadcrumbs() recorre árbol de rutas
   ↓
5. Lee data.breadcrumb de /usuario y /usuario/perfil
   ↓
6. Construye array: [
     { label: 'Mi Cuenta', url: '/usuario' },
     { label: 'Mi Perfil', url: '/usuario/perfil' }
   ]
   ↓
7. Emite nuevo array en breadcrumbs$
   ↓
8. BreadcrumbNav actualiza vista automáticamente
```

### BreadcrumbNav Component

**Archivo:** `frontend/src/app/components/shared/breadcrumb-nav/`

**Template:**

```html
<nav class="breadcrumb-nav" aria-label="breadcrumb">
  <ol class="breadcrumb-nav__list">
    <!-- Siempre "Inicio" primero -->
    <li class="breadcrumb-nav__item">
      <a routerLink="/home" class="breadcrumb-nav__link">🏠 Inicio</a>
      <span class="breadcrumb-nav__separator">›</span>
    </li>

    <!-- Breadcrumbs dinámicos -->
    <li *ngFor="let crumb of breadcrumbs; let last = last">
      <!-- Enlaces navegables (excepto el último) -->
      <a *ngIf="!last" [routerLink]="crumb.url">{{ crumb.label }}</a>
      
      <!-- Texto plano para página actual -->
      <span *ngIf="last" aria-current="page">{{ crumb.label }}</span>
    </li>
  </ol>
</nav>
```

### Configuración en Rutas

**Todas las rutas tienen data.breadcrumb:**

```typescript
{ path: 'home', component: Home, data: { breadcrumb: 'Inicio' } },
{ path: 'lecciones', component: Lecciones, data: { breadcrumb: 'Lecciones' } },
{ path: 'lecciones/:id', component: LeccionDetalle, data: { breadcrumb: 'Detalle de Lección' } },
{ path: 'usuario', ..., data: { breadcrumb: 'Mi Cuenta' } },
// etc...
```

### Ejemplos de Breadcrumbs Generados

| Navegación | Breadcrumbs visuales |
|------------|---------------------|
| `/home` | `🏠 Inicio` |
| `/lecciones` | `🏠 Inicio › Lecciones` |
| `/lecciones/123` | `🏠 Inicio › Lecciones › Detalle de Lección` |
| `/usuario/perfil` | `🏠 Inicio › Mi Cuenta › Mi Perfil` |
| `/usuario/progreso` | `🏠 Inicio › Mi Cuenta › Mi Progreso` |

**Accesibilidad:**
- ✅ `aria-label="breadcrumb"` en nav
- ✅ `aria-current="page"` en último item
- ✅ Semantic HTML (`<nav>`, `<ol>`, `<li>`)
- ✅ Todos navegables excepto el último

---

## 🧭 NAVEGACIÓN PROGRAMÁTICA

### NavigationService

**Archivo:** `frontend/src/app/services/navigation.service.ts`

**Métodos implementados (16 total):**

```typescript
@Injectable({ providedIn: 'root' })
export class NavigationService {
  // Navegación básica
  goHome() { this.router.navigate(['/']); }
  goToLecciones() { this.router.navigate(['/lecciones']); }

  // Con parámetros de ruta
  goToLeccionDetalle(id: number | string) {
    this.router.navigate(['/lecciones', id]);
  }

  // Con queryParams
  goToLeccionesConFiltros(categoria?: string, nivel?: string) {
    this.router.navigate(['/lecciones'], {
      queryParams: { categoria, nivel }
    });
  }

  // Con fragment (scroll a sección)
  goToAboutSeccion(seccion: string) {
    this.router.navigate(['/about'], { fragment: seccion });
  }

  // Con state (datos ocultos en URL)
  goToLeccionConDatos(id: number, datos: any) {
    this.router.navigate(['/lecciones', id], {
      state: { leccion: datos, origen: 'buscador' }
    });
  }

  // NavigationExtras completo
  navegacionCompleta(id: number) {
    this.router.navigate(['/lecciones', id], {
      queryParams: { destacado: true },
      fragment: 'comentarios',
      state: { origen: 'demo' },
      replaceUrl: false
    });
  }
}
```

### Lectura de Parámetros

**En LeccionDetalle:**

```typescript
ngOnInit() {
  // Parámetros de ruta
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
  });

  // Query params
  this.route.queryParamMap.subscribe(params => {
    const categoria = params.get('categoria');
  });

  // Fragment
  this.route.fragment.subscribe(fragment => {
    console.log(fragment); // "comentarios"
  });

  // State
  const navigation = this.router.getCurrentNavigation();
  const state = navigation?.extras.state;
}
```

---

## 📦 CHUNKS GENERADOS EN BUILD

### Comando de Build

```bash
cd frontend
npm run build
# o
ng build --configuration production
```

### Resultado Esperado

```
Initial chunk files | Names         |  Raw size
main.abc123.js      | main          |  234.56 kB
polyfills.def456.js | polyfills     |   89.12 kB

Lazy chunk files    | Names         |  Raw size
user-routes.ghi789.js | user-routes |   45.23 kB

                    | Initial total |  323.68 kB
                    | Lazy total    |   45.23 kB
```

### Análisis de Chunks

**main.abc123.js** (234.56 kB)
- Home component
- Lecciones component
- LeccionDetalle component
- Login component
- About component
- NotFound component
- NavigationService
- BreadcrumbService
- Guards (authGuard, pendingChangesGuard)
- Resolvers (leccionResolver)

**user-routes.ghi789.js** (45.23 kB) - LAZY
- UserLayout component
- UserPerfil component
- UserProgreso component
- UserCertificados component
- Formularios y lógica del área usuario

**Reducción:** ~15% del bundle inicial (sin lazy sería 368.91 kB)

### Verificación en DevTools

```
1. Abrir DevTools → Network → Filtrar por JS
2. Recargar aplicación
3. Observar: solo main.js + polyfills.js descargan
4. Navegar a /usuario
5. Observar: user-routes.js descarga (o ya precargado)
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Diagrama de Rutas

```
/
├── home
├── lecciones
│   └── :id (resolver: leccionResolver)
├── login
├── about
├── usuario (lazy + authGuard)
│   ├── perfil (pendingChangesGuard)
│   ├── progreso
│   └── certificados
├── style-guide
├── client
├── dev/navigation-demo
└── ** (404)
```

### Flujo de Navegación con Resolver + Guard

```
Usuario navega a /usuario/perfil
        ↓
  authGuard verifica autenticación
        ↓
  ¿Autenticado?
  ├─ NO → Redirige a /login?returnUrl=/usuario/perfil
  └─ SÍ → Continúa
        ↓
  Lazy loading carga user-routes.js (si no está)
        ↓
  Activa UserLayout (padre)
        ↓
  Activa UserPerfil (hijo)
        ↓
  Usuario edita formulario
        ↓
  Intenta salir
        ↓
  pendingChangesGuard detecta cambios
        ↓
  Muestra confirm()
  ├─ Cancela → Permanece en perfil
  └─ Acepta → Navega (pierde cambios)
```

### Stack Tecnológico

```
Angular 17+ (Standalone Components)
    ↓
Router (sin NgModule)
    ↓
provideRouter + withPreloading(PreloadAllModules)
    ↓
Guards funcionales (CanActivateFn, CanDeactivateFn)
    ↓
Resolvers funcionales (ResolveFn)
    ↓
RxJS Observables (BehaviorSubject, filter, catchError)
    ↓
Signals (estado reactivo)
```

---

## 📝 NOTAS TÉCNICAS

### Decisiones de Diseño

1. **Standalone Components:** Todo el proyecto usa arquitectura standalone (sin NgModules)
2. **Functional Guards:** Guards como funciones (no clases con interfaces)
3. **Signals:** Estado reactivo con signals (Angular 17+)
4. **Simulación:** AuthService simula backend (en producción: JWT, API real)
5. **Nomenclatura:** "Lecciones" en lugar de "Productos" (contexto autoescuela)

### Limitaciones Conocidas

- **AuthService simulado:** No hay backend real, solo localStorage
- **Confirmación nativa:** `confirm()` en vez de modal estilizado
- **Sin tests:** No hay tests unitarios/e2e (fuera de scope)
- **SCSS sin imports:** Para evitar conflictos, algunos SCSS usan valores directos

### Mejoras Futuras

- [ ] Integrar backend real con JWT
- [ ] Modal personalizado para pendingChangesGuard
- [ ] Tests unitarios de guards y resolvers
- [ ] Estrategia de precarga personalizada (en vez de PreloadAllModules)
- [ ] Breadcrumbs con nombres dinámicos (ej: "Lección: Señales de Tráfico")
- [ ] Animaciones entre transiciones de rutas

---


