import { Routes } from '@angular/router';

// ============================================================================
// PÁGINAS PRINCIPALES
// ============================================================================
import { Home } from './pages/home/home';
import { Lecciones } from './pages/lecciones/lecciones';
import { Simuladores } from './pages/simuladores/simuladores';
import { LeccionDetalle } from './pages/leccion-detalle/leccion-detalle';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';

// ============================================================================
// PRODUCTOS (FASE 5 - Sistema HTTP)
// ============================================================================
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';

// ============================================================================
// ÁREA DE USUARIO (Layout - las rutas hijas se cargan lazy)
// ============================================================================
import { UserLayout } from './pages/user/user-layout';

// ============================================================================
// GUARDS
// ============================================================================
import { authGuard } from './guards/auth.guard';

// ============================================================================
// RESOLVERS
// ============================================================================
import { leccionResolver } from './resolvers/leccion.resolver';

// ============================================================================
// PÁGINAS ESPECIALES
// ============================================================================
import { StyleGuide } from './pages/style-guide/style-guide';
import { Client } from './pages/client/client';
import { NotFound } from './pages/not-found/not-found';
import { NavigationDemo } from './components/navigation-demo/navigation-demo';

/**
 * Configuración de rutas de la aplicación
 *
 * ESTRUCTURA:
 * - Redirect de raíz a /home
 * - 5+ rutas principales (Home, Lecciones, Login, About, Usuario)
 * - Rutas con parámetros dinámicos (/lecciones/:id)
 * - Rutas hijas anidadas (área de usuario con perfil, progreso, certificados)
 * - Ruta wildcard ** para páginas 404
 *
 * LAZY LOADING (FASE 4 - Tarea 3):
 * - Área de usuario cargada con loadChildren para reducir bundle inicial
 * - PreloadAllModules configurado en app.config.ts
 *
 * ROUTE GUARDS (FASE 4 - Tarea 4):
 * - authGuard protege área de usuario (requiere login)
 * - pendingChangesGuard en perfil de usuario (detecta cambios sin guardar)
 *
 * RESOLVERS (FASE 4 - Tarea 5):
 * - leccionResolver precarga datos antes de activar detalle
 * - Manejo de errores con redirección automática
 *
 * BREADCRUMBS (FASE 4 - Tarea 6):
 * - data.breadcrumb en cada ruta para generación dinámica
 * - BreadcrumbService construye breadcrumbs automáticamente
 *
 * Según especificaciones FASE_4.md - Tareas 1-6
 */
export const routes: Routes = [
  // =========================================================================
  // REDIRECT PRINCIPAL
  // =========================================================================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  // =========================================================================
  // RUTAS PRINCIPALES
  // =========================================================================

  // 1. HOME - Página de inicio (pública)
  {
    path: 'home',
    component: Home,
    data: { breadcrumb: 'Inicio' }
  },

  // 2. LECCIONES - Catálogo de lecciones (pública)
  {
    path: 'lecciones',
    component: Lecciones,
    data: { breadcrumb: 'Lecciones' }
  },

  // 2.5 SIMULADORES - Catálogo de simuladores (pública)
  {
    path: 'simuladores',
    component: Simuladores,
    data: { breadcrumb: 'Simuladores' }
  },

  // 3. LECCIÓN DETALLE - Ruta con parámetro dinámico :id + RESOLVER
  // Ejemplo: /lecciones/123
  {
    path: 'lecciones/:id',
    component: LeccionDetalle,
    resolve: { leccion: leccionResolver }, // 🔄 Precarga datos antes de activar
    data: { breadcrumb: 'Detalle de Lección' }
  },

  // 4. LOGIN - Formulario de inicio de sesión (pública)
  // Recibe returnUrl desde authGuard cuando redirige aquí
  {
    path: 'login',
    component: Login,
    data: { breadcrumb: 'Acceso de Usuario' }
  },

  // 5. ABOUT - Información sobre la plataforma (pública)
  {
    path: 'about',
    component: About,
    data: { breadcrumb: 'Acerca de' }
  },

  // =========================================================================
  // PRODUCTOS - SISTEMA HTTP (FASE 5 - Tareas 1 y 2)
  // =========================================================================

  /**
   * Rutas de productos para demostrar sistema HTTP completo
   *
   * CRUD COMPLETO:
   * - GET    /products       - Listado (ProductListComponent)
   * - GET    /products/:id   - Detalle (ProductDetailComponent)
   * - POST   /products       - Crear (ProductFormComponent)
   * - PUT    /products/:id   - Actualizar (ProductFormComponent)
   * - DELETE /products/:id   - Eliminar (ProductListComponent/DetailComponent)
   *
   * BACKEND SIMULADO:
   * - json-server en puerto 3000
   * - db.json con datos de productos
   * - Ejecutar: npm run api
   */

  // 6. PRODUCTS - Listado de productos
  {
    path: 'products',
    component: ProductListComponent,
    data: { breadcrumb: 'Productos' }
  },

  // 7. PRODUCTS NEW - Crear nuevo producto
  {
    path: 'products/new',
    component: ProductFormComponent,
    data: { breadcrumb: 'Nuevo Producto' }
  },

  // 8. PRODUCTS DETAIL - Ver detalle de un producto
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    data: { breadcrumb: 'Detalle de Producto' }
  },

  // 9. PRODUCTS EDIT - Editar producto existente
  {
    path: 'products/:id/edit',
    component: ProductFormComponent,
    data: { breadcrumb: 'Editar Producto' }
  },

  // =========================================================================
  // ÁREA DE USUARIO - LAZY LOADING + AUTH GUARD
  // =========================================================================

  /**
   * Área de usuario con lazy loading y protección de autenticación
   *
   * LAZY LOADING:
   * - loadChildren carga las rutas hijas solo cuando se navega a /usuario
   * - Reduce el tamaño del bundle inicial
   * - PreloadAllModules las precarga en background después de la carga inicial
   *
   * AUTH GUARD:
   * - canActivate: [authGuard] protege el acceso
   * - Si no está autenticado, redirige a /login?returnUrl=/usuario
   * - Después del login, vuelve a la URL original
   *
   * PENDING CHANGES GUARD:
   * - Aplicado en /usuario/perfil (ver user.routes.ts)
   * - Detecta cambios sin guardar en formulario
   * - Solicita confirmación antes de salir
   */
  {
    path: 'usuario',
    component: UserLayout,
    canActivate: [authGuard], // 🔒 Requiere autenticación
    loadChildren: () => import('./pages/user/user.routes').then(m => m.USER_ROUTES),
    data: { breadcrumb: 'Mi Cuenta' }
  },

  // =========================================================================
  // PÁGINAS AUXILIARES (desarrollo)
  // =========================================================================

  {
    path: 'style-guide',
    component: StyleGuide,
    data: { breadcrumb: 'Guía de Estilos' }
  },
  {
    path: 'client',
    component: Client,
    data: { breadcrumb: 'Cliente' }
  },

  // =========================================================================
  // RUTA DE DEMOSTRACIÓN - NAVEGACIÓN PROGRAMÁTICA (FASE 4 Tarea 2)
  // =========================================================================

  /**
   * Componente de demostración de navegación programática
   * Demuestra todos los ejemplos de FASE_4.md - Tarea 2
   * URL: /dev/navigation-demo
   */
  {
    path: 'dev/navigation-demo',
    component: NavigationDemo,
    data: { title: 'Demostración de Navegación Programática' }
  },

  // =========================================================================
  // RUTA WILDCARD 404 - SIEMPRE LA ÚLTIMA
  // =========================================================================

  /**
   * Captura cualquier ruta no definida y muestra página 404
   * IMPORTANTE: Debe ir siempre al final de la configuración
   */
  {
    path: '**',
    component: NotFound
  }
];
