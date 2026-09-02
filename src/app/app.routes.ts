import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';

import { Login } from './pages/authentication/login/login';

import { Register } from './pages/authentication/register/register';

import { ForgotPassword } from './pages/authentication/forgot-password/forgot-password';

import { ResetPassword } from './pages/authentication/reset-password/reset-password';

import { Home } from './pages/home/home';

import { MiAula } from './pages/mi-aula/mi-aula';

import { MomentComponent } from './pages/tellus-learning/moment/moment';

import { ActivityComponent } from './pages/tellus-learning/activity/activity';

import { Laboratorios } from './pages/laboratorios/laboratorios';

import { Matematicas } from './pages/laboratorios/matematicas/matematicas';

import { Ciencias } from './pages/laboratorios/ciencias/ciencias';

import { Ingenieria } from './pages/laboratorios/ingenieria/ingenieria';

import { Arte } from './pages/laboratorios/arte/arte';

import { Tecnologia } from './pages/laboratorios/tecnologia/tecnologia';

import { PublicVerificationComponent } from './pages/public-verification/public-verification.component';


export const routes: Routes = [

  // ==========================================================
  // REDIRECCIÓN INICIAL
  // ==========================================================

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },


  // ==========================================================
  // PÚBLICO
  // ==========================================================

  {
    path: 'landing',
    component: Landing,
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'register',
    component: Register,
  },

  {
    path: 'forgot-password',
    component: ForgotPassword,
  },

  {
    path: 'reset-password',
    component: ResetPassword,
  },


  // ==========================================================
  // HOME
  // ==========================================================

  {
    path: 'home',
    component: Home,
  },


  // ==========================================================
  // TELLUS LEARNING
  // ==========================================================

  {
    path: 'mi-aula',
    component: MiAula,
  },

  {
    path: 'experiencia/:experienceId/momento/:momentId',
    component: MomentComponent,
  },

  // ----------------------------------------------------------
  // ACTIVIDADES TELLUS
  // ----------------------------------------------------------

  {
    path: 'experiencia/:experienceId/actividad/:activityId',
    component: ActivityComponent,
  },


  // ==========================================================
  // BIBLIOTECA VIVA
  // ==========================================================

  {
    path: 'biblioteca-viva',

    loadChildren: () =>
      import(
        './pages/biblioteca-viva/biblioteca-viva.routes'
      )
        .then(
          m => m.routes
        ),
  },


  // ==========================================================
  // LABORATORIOS
  // ==========================================================

  {
    path: 'laboratorios',
    component: Laboratorios,
  },

  {
    path: 'matematicas',
    component: Matematicas,
  },

  {
    path: 'ciencias',
    component: Ciencias,
  },

  {
    path: 'ingenieria',
    component: Ingenieria,
  },

  {
    path: 'arte',
    component: Arte,
  },

  {
    path: 'tecnologia',
    component: Tecnologia,
  },


  // ==========================================================
  // VERIFICACIÓN PÚBLICA
  // ==========================================================

  {
    path: 'verificar/:uuid',
    component: PublicVerificationComponent,
  },


  // ==========================================================
  // WILDCARD
  // ==========================================================

  {
    path: '**',
    redirectTo: 'home',
  },

];