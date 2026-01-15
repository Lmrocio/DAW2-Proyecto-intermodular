import { Routes } from '@angular/router';

// ============================================================================
// PÁGINAS PRINCIPALES
// ============================================================================
import { Home } from './pages/home/home';
import { Lecciones } from './pages/lecciones/lecciones';
import { LeccionDetalle } from './pages/leccion-detalle/leccion-detalle';
import { Login } from './pages/login/login';
import { About } from './pages/about/about';

// ============================================================================
// ÁREA DE USUARIO (Rutas hijas anidadas)
// ============================================================================
import { UserLayout } from './pages/user/user-layout';
import { UserPerfil } from './pages/user/user-perfil';
import { UserProgreso } from './pages/user/user-progreso';
import { UserCertificados } from './pages/user/user-certificados';

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
 * Según especificaciones FASE_4.md - Tarea 1
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

  // 1. HOME - Página de inicio
  {
    path: 'home',
    component: Home
  },

  // 2. LECCIONES - Catálogo de lecciones
  {
    path: 'lecciones',
    component: Lecciones
  },

  // 3. LECCIÓN DETALLE - Ruta con parámetro dinámico :id
  // Ejemplo: /lecciones/123
  {
    path: 'lecciones/:id',
    component: LeccionDetalle
  },

  // 4. LOGIN - Formulario de inicio de sesión
  {
    path: 'login',
    component: Login
  },

  // 5. ABOUT - Información sobre la plataforma
  {
    path: 'about',
    component: About
  },

  // =========================================================================
  // RUTAS HIJAS ANIDADAS - ÁREA DE USUARIO
  // =========================================================================

  /**
   * Área de usuario con rutas hijas
   * - /usuario -> redirect a /usuario/perfil
   * - /usuario/perfil -> Información del perfil
   * - /usuario/progreso -> Progreso en lecciones
   * - /usuario/certificados -> Certificados obtenidos
   */
  {
    path: 'usuario',
    component: UserLayout, // Layout padre con <router-outlet>
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'perfil'
      },
      {
        path: 'perfil',
        component: UserPerfil
      },
      {
        path: 'progreso',
        component: UserProgreso
      },
      {
        path: 'certificados',
        component: UserCertificados
      }
    ]
  },

  // =========================================================================
  // PÁGINAS AUXILIARES (desarrollo)
  // =========================================================================

  {
    path: 'style-guide',
    component: StyleGuide
  },
  {
    path: 'client',
    component: Client
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
