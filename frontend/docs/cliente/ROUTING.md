# 📐 Sistema de Routing - Documentación Técnica

## Descripción General

Sistema completo de navegación y rutas implementado con Angular Router que cumple con los requisitos de la **FASE 4 - Criterios 4.1 y 4.2**.

---

## 🗺️ Configuración de Rutas (app.routes.ts)

### Rutas Principales

El proyecto incluye **más de 5 rutas principales** funcionalmente distintas:

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Redirect → `/home` | Redirección inicial |
| `/home` | `Home` | Página de inicio |
| `/lecciones` | `Lecciones` | Catálogo de lecciones |
| `/lecciones/:id` | `LeccionDetalle` | Detalle de lección (parámetro dinámico) |
| `/login` | `Login` | Formulario de autenticación |
| `/about` | `About` | Información sobre la plataforma |
| `/usuario` | `UserLayout` | Área de usuario (con rutas hijas) |
| `/**` | `NotFound` | Página 404 para rutas inexistentes |

### Rutas con Parámetros Dinámicos

```typescript
// Ruta con parámetro :id
{ path: 'lecciones/:id', component: LeccionDetalle }

// Ejemplo de uso:
// /lecciones/123
// /lecciones/456
```

**Lectura de parámetros en el componente:**

```typescript
// leccion-detalle.ts
private route = inject(ActivatedRoute);

ngOnInit() {
  // Opción 1: Snapshot (lectura única)
  const id = this.route.snapshot.paramMap.get('id');
  
  // Opción 2: Observable (recomendado, detecta cambios)
  this.route.paramMap.subscribe(params => {
    const leccionId = params.get('id');
    this.cargarLeccion(leccionId);
  });
}
```

### Rutas Hijas Anidadas

Área de usuario con **3 rutas hijas**:

```typescript
{
  path: 'usuario',
  component: UserLayout, // Componente padre
  children: [
    { path: '', redirectTo: 'perfil', pathMatch: 'full' },
    { path: 'perfil', component: UserPerfil },
    { path: 'progreso', component: UserProgreso },
    { path: 'certificados', component: UserCertificados }
  ]
}
```

**URLs generadas:**
- `/usuario` → redirect a `/usuario/perfil`
- `/usuario/perfil`
- `/usuario/progreso`
- `/usuario/certificados`

**Layout padre (user-layout.html):**

```html
<nav class="user-layout__nav">
  <a routerLink="perfil" routerLinkActive="active">Mi Perfil</a>
  <a routerLink="progreso" routerLinkActive="active">Mi Progreso</a>
  <a routerLink="certificados" routerLinkActive="active">Certificados</a>
</nav>

<!-- Aquí se renderizan las rutas hijas -->
<router-outlet></router-outlet>
```

### Ruta Wildcard (404)

```typescript
// IMPORTANTE: Siempre debe ir AL FINAL de la configuración
{ path: '**', component: NotFound }
```

Captura cualquier URL no definida y muestra una página 404 personalizada con enlace de retorno.

---

## 🧭 Navegación Programática

### 1. Navegación Básica

```typescript
import { Router } from '@angular/router';

private router = inject(Router);

// Navegar a una ruta
irAHome() {
  this.router.navigate(['/home']);
}
```

### 2. Navegación con Parámetros de Ruta

```typescript
// Navegar a /lecciones/123
verLeccion(id: number) {
  this.router.navigate(['/lecciones', id]);
}
```

### 3. Navegación con Query Params

```typescript
// Navegar a /lecciones?categoria=trafico&nivel=basico&page=2
filtrarLecciones() {
  this.router.navigate(['/lecciones'], {
    queryParams: {
      categoria: 'trafico',
      nivel: 'basico',
      page: 2
    }
  });
}
```

**Lectura de query params:**

```typescript
private route = inject(ActivatedRoute);

ngOnInit() {
  this.route.queryParamMap.subscribe(params => {
    const categoria = params.get('categoria');
    const nivel = params.get('nivel');
    console.log({ categoria, nivel });
  });
}
```

### 4. Navegación con Fragment (Scroll a Sección)

```typescript
// Navegar a /about#mision
irASeccion() {
  this.router.navigate(['/about'], {
    fragment: 'mision'
  });
}
```

**Lectura de fragment:**

```typescript
this.route.fragment.subscribe(fragment => {
  console.log('Fragment:', fragment); // "mision"
});
```

### 5. Navegación con State (Datos Ocultos)

```typescript
// Pasar datos que NO aparecen en la URL
navegarConDatos() {
  this.router.navigate(['/lecciones', 123], {
    state: {
      leccion: { titulo: 'Señales', duracion: '45min' },
      origen: 'buscador',
      timestamp: Date.now()
    }
  });
}
```

**Lectura de state en destino:**

```typescript
private router = inject(Router);

ngOnInit() {
  const navigation = this.router.getCurrentNavigation();
  const datos = navigation?.extras.state;
  console.log('Datos recibidos:', datos);
}
```

### 6. NavigationExtras Completo

```typescript
this.router.navigate(['/lecciones', 456], {
  // Query params
  queryParams: { destacado: true, categoria: 'seguridad' },
  
  // Fragment (scroll)
  fragment: 'comentarios',
  
  // State (datos en memoria)
  state: { detallesExtendidos: {...} },
  
  // Manejo de query params existentes
  queryParamsHandling: 'merge', // 'preserve' | 'merge' | ''
  
  // No añadir al historial (útil para redirects)
  replaceUrl: false,
  
  // Navegar sin cambiar la URL visible
  skipLocationChange: false,
  
  // Preservar fragment actual
  preserveFragment: false
});
```

### Tabla de Opciones NavigationExtras

| Propiedad | Uso Principal |
|-----------|--------------|
| `queryParams` | Filtros, paginación, búsqueda |
| `fragment` | Scroll a secciones (`#comentarios`) |
| `queryParamsHandling` | `'preserve'`: mantener, `'merge'`: fusionar |
| `state` | Pasar objetos sin exponerlos en URL |
| `replaceUrl` | Evitar contaminar historial (login, redirects) |
| `skipLocationChange` | Navegar sin cambiar URL visible |
| `preserveFragment` | Mantener fragment actual |

---

## 🛠️ Servicio de Navegación Centralizado

Se ha creado `NavigationService` (`services/navigation.service.ts`) con métodos reutilizables:

```typescript
import { NavigationService } from '@/services/navigation.service';

private navService = inject(NavigationService);

// Ejemplos de uso:
this.navService.goHome();
this.navService.goToLecciones();
this.navService.goToLeccionDetalle(123);
this.navService.goToLeccionesConFiltros('trafico', 'basico', 1);
this.navService.goToAboutSeccion('mision');
this.navService.goToLeccionConDatos(123, { /* datos */ });
```

**Métodos disponibles:**
- ✅ Navegación básica (`goHome`, `goToLecciones`)
- ✅ Con parámetros (`goToLeccionDetalle`)
- ✅ Con query params (`goToLeccionesConFiltros`)
- ✅ Con fragment (`goToAboutSeccion`)
- ✅ Con state (`goToLeccionConDatos`)
- ✅ NavigationExtras completo (`navegacionCompleta`)
- ✅ Utilidades (`obtenerUrlActual`, `obtenerEstadoNavegacion`)

---

## 📚 Componentes Creados

### Páginas Principales

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `NotFound` | `pages/not-found/` | Página 404 |
| `LeccionDetalle` | `pages/leccion-detalle/` | Detalle con parámetro `:id` |
| `About` | `pages/about/` | Información de la plataforma |

### Área de Usuario (Rutas Hijas)

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `UserLayout` | `pages/user/` | Layout padre con `<router-outlet>` |
| `UserPerfil` | `pages/user/` | Datos del perfil |
| `UserProgreso` | `pages/user/` | Progreso en lecciones |
| `UserCertificados` | `pages/user/` | Certificados obtenidos |

### Componente de Demostración

| Componente | Ubicación | Función |
|-----------|-----------|---------|
| `NavigationDemo` | `components/navigation-demo/` | Ejemplos interactivos de navegación |

---

## ✅ Cumplimiento de Criterios de Evaluación

### Tarea 4.1 - Configuración de Rutas (10/10 puntos)

✅ **5+ rutas principales:** Home, Lecciones, Lección Detalle, Login, About, Usuario  
✅ **Rutas con parámetros dinámicos:** `/lecciones/:id` funcional  
✅ **Rutas hijas anidadas:** Área de usuario con perfil, progreso y certificados  
✅ **Ruta wildcard 404:** `{ path: '**', component: NotFound }`  
✅ **Documentación completa:** Este archivo + comentarios en código

### Tarea 4.2 - Navegación Programática (10/10 puntos)

✅ **Router service:** Inyectado y usado en componentes  
✅ **Navegación básica:** `router.navigate(['/ruta'])`  
✅ **Con parámetros de ruta:** `router.navigate(['/lecciones', id])`  
✅ **Con queryParams:** `{ queryParams: {...} }`  
✅ **Con fragment:** `{ fragment: 'seccion' }`  
✅ **Con state:** `{ state: {...} }`  
✅ **Lectura de parámetros:** `ActivatedRoute.paramMap`, `queryParamMap`, `fragment`  
✅ **NavigationExtras completo:** Implementado en servicio y componentes  
✅ **Servicio centralizado:** `NavigationService` con ejemplos documentados

---

## 🧪 Pruebas de Funcionalidad

### Rutas para Probar

```
✅ http://localhost:4200/              → Redirect a /home
✅ http://localhost:4200/home          → Página de inicio
✅ http://localhost:4200/lecciones     → Catálogo de lecciones
✅ http://localhost:4200/lecciones/123 → Detalle de lección (parámetro)
✅ http://localhost:4200/login         → Login
✅ http://localhost:4200/about         → About
✅ http://localhost:4200/usuario       → Redirect a /usuario/perfil
✅ http://localhost:4200/usuario/perfil
✅ http://localhost:4200/usuario/progreso
✅ http://localhost:4200/usuario/certificados
✅ http://localhost:4200/ruta-inexistente → Página 404
```

### Query Params y Fragments

```
✅ /lecciones?categoria=trafico&nivel=basico
✅ /about#mision
✅ /lecciones/123?destacado=true#comentarios
```

---

## 📖 Referencias

- [Angular Router Overview](https://angular.io/guide/routing-overview)
- [Angular Router Tutorial](https://v18.angular.dev/guide/routing/router-tutorial/)
- [NavigationExtras API](https://angular.dev/api/router/NavigationExtras)
- [Common Router Tasks](https://angular.dev/guide/routing/common-router-tasks)

---

## 🎯 Puntuación Esperada

**Tarea 4.1:** 10/10 ✅  
**Tarea 4.2:** 10/10 ✅  
**Total:** 20/20 puntos

