import { Routes } from '@angular/router';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Home } from './pages/home/home';
import { Client } from './pages/client/client';
import { Lecciones } from './pages/lecciones/lecciones';
import { Login } from './pages/login/login';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'style-guide',
    component: StyleGuide
  },
  {
    path: 'client',
    component: Client
  },
  {
    path: 'lecciones',
    component: Lecciones
  },
  {
    path: 'login',
    component: Login
  }
];
