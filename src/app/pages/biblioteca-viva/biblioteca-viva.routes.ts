import { Routes } from '@angular/router';
import { BibliotecaViva } from './biblioteca-viva';
import { ParticiparComponent } from './components/participar/participar';
import { GaleriaComponent } from './components/galeria/galeria';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: BibliotecaViva
  },
  {
    path: 'participar',
    component: ParticiparComponent
  },
  {
    path: 'proyectos',
    component: GaleriaComponent
  },
  {
    path: 'admin',
    component: AdminDashboardComponent
  },
  {
    path: 'admin/revision',
    component: AdminPanelComponent
  }
];