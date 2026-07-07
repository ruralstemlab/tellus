import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AboutModal } from '../about-modal/about-modal';
import { Modal } from '../../services/modal';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    AboutModal
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  modal = inject(Modal);

  constructor(
    private authService: AuthService
  ) {}

  // ==========================
  // Acerca de Tellus
  // ==========================
  openAbout(): void {

    this.modal.open('about');

  }

  // ==========================
  // Cerrar sesión
  // ==========================
  async logout(): Promise<void> {

    try {

      await this.authService.logout();

    } catch (error) {

      console.error('Error al cerrar sesión:', error);

    }

  }

  // ==========================
  // Usuario autenticado
  // ==========================
  get currentUser() {
    return this.authService.getCurrentUser();
  }

}