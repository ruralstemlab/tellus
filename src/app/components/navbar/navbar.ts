import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AboutModal } from '../about-modal/about-modal';
import { Modal } from '../../services/modal';
import { AuthService } from '../../core/auth/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AboutModal
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  modal = inject(Modal);

  menuItems: MenuItem[] = [

    {
      icon: '🏠',
      label: 'Inicio',
      route: '/home'
    },

    {
      icon: '🤖',
      label: 'Gaian',
      route: '/gaian'
    },

    {
      icon: '👨‍🏫',
      label: 'Mi Aula',
      route: '/mi-aula'
    },

    {
      icon: '🧪',
      label: 'Laboratorios',
      route: '/laboratorios'
    },

    {
      icon: '📚',
      label: 'Biblioteca Viva',
      route: '/biblioteca'
    }

  ];

  constructor(
    private authService: AuthService
  ) {}

  openAbout(): void {
    this.modal.open('about');
  }

  async logout(): Promise<void> {

    try {

      await this.authService.logout();

    } catch (error) {

      console.error('Error al cerrar sesión:', error);

    }

  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

}