import { Routes } from '@angular/router';
import { UserPerfil } from './user-perfil';
import { UserProgreso } from './user-progreso';
import { UserCertificados } from './user-certificados';
import { pendingChangesGuard } from '../../guards/pending-changes.guard';

/**
 * Rutas del área de usuario (lazy loaded)
 * según FASE_4.md - Tarea 3
 *
 * Estas rutas se cargan solo cuando el usuario navega a /usuario
 * Esto reduce el tamaño del bundle inicial
 */
export const USER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'perfil'
  },
  {
    path: 'perfil',
    component: UserPerfil,
    canDeactivate: [pendingChangesGuard], // Protege salida con cambios sin guardar
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

