import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Matematicas } from './pages/matematicas/matematicas';
import { Ciencias } from './pages/ciencias/ciencias';
import { Ingenieria } from './pages/ingenieria/ingenieria';
import { Arte } from './pages/arte/arte';
import { Tecnologia } from './pages/tecnologia/tecnologia';

export const routes: Routes = [
  {
    path: '',
    component: Landing
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'matematicas',
    component: Matematicas
  },
  {
    path: 'ciencias',
    component: Ciencias
  },
  {
    path: 'ingenieria',
    component: Ingenieria
  },
  {
    path: 'arte',
    component: Arte
  },
  {
    path: 'tecnologia',
    component: Tecnologia
  },
  {
    path: '**',
    redirectTo: ''
  }
];