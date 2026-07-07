import { Routes } from '@angular/router';

import { Landing } from './pages/landing/landing';

import { Login } from './pages/authentication/login/login';
import { Register } from './pages/authentication/register/register';
import { ForgotPassword } from './pages/authentication/forgot-password/forgot-password';
import { ResetPassword } from './pages/authentication/reset-password/reset-password';

import { Home } from './pages/home/home';

import { Laboratorios } from './pages/laboratorios/laboratorios';

import { Matematicas } from './pages/laboratorios/matematicas/matematicas';
import { Ciencias } from './pages/laboratorios/ciencias/ciencias';
import { Ingenieria } from './pages/laboratorios/ingenieria/ingenieria';
import { Arte } from './pages/laboratorios/arte/arte';
import { Tecnologia } from './pages/laboratorios/tecnologia/tecnologia';

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

  {
    path: '**',
    redirectTo: ''
  }

];