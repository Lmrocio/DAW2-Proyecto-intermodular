import { Routes } from '@angular/router';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Home } from './pages/home/home';
import { Client } from './pages/client/client';

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
  }
];
