import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

import { Landing } from './pages/landing/landing';

import { Login } from './pages/authentication/login/login';
import { Register } from './pages/authentication/register/register';
import { ForgotPassword } from './pages/authentication/forgot-password/forgot-password';
import { ResetPassword } from './pages/authentication/reset-password/reset-password';

import { Home } from './pages/home/home';
import { MiAula } from './pages/mi-aula/mi-aula';

import { Laboratorios } from './pages/laboratorios/laboratorios';

import { Matematicas } from './pages/laboratorios/matematicas/matematicas';
import { Ciencias } from './pages/laboratorios/ciencias/ciencias';
import { Ingenieria } from './pages/laboratorios/ingenieria/ingenieria';
import { Arte } from './pages/laboratorios/arte/arte';
import { Tecnologia } from './pages/laboratorios/tecnologia/tecnologia';

// Importar el componente de verificación pública
import { PublicVerificationComponent } from './pages/public-verification/public-verification.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'landing',
    component: Landing
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'forgot-password',
    component: ForgotPassword
  },

  {
    path: 'reset-password',
    component: ResetPassword
  },

  {
    path: 'home',
    component: Home
  },

  // ===== MI AULA / TELLUS LEARNING =====
  {
    path: 'mi-aula',
    component: MiAula
  },

  // ===== BIBLIOTECA VIVA CON LAZY LOADING =====
  {
    path: 'biblioteca-viva',
    loadChildren: () =>
      import('./pages/biblioteca-viva/biblioteca-viva.routes')
        .then(m => m.routes)
  },

  {
    path: 'laboratorios',
    component: Laboratorios
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

  // ===== VERIFICACIÓN PÚBLICA DE CREDENCIALES =====
  // Debe estar antes del wildcard
  {
    path: 'verificar/:uuid',
    component: PublicVerificationComponent
  },

  // ===== WILDCARD =====
  // Siempre debe quedar al final
  {
    path: '**',
    redirectTo: 'home'
  }

];