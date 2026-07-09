import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AboutModal } from '../about-modal/about-modal';
import { Modal } from '../../services/modal';

import { AuthService } from '../../core/auth/auth.service';
import { UserService } from '../../core/services/user.service';

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
export class Navbar implements OnInit {

  modal = inject(Modal);

  private cdr = inject(ChangeDetectorRef);

  profile: any = null;

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

    private authService: AuthService,

    private userService: UserService

  ) {}

  async ngOnInit(): Promise<void> {

    try {

      this.profile = await this.userService.getCurrentProfile();

      console.log('===== PERFIL FIRESTORE =====');
      console.log(this.profile);

      this.cdr.detectChanges();

    } catch (error) {

      console.error('Error cargando perfil:', error);

    }

  }

  openAbout(): void {

    this.modal.open('about');

  }

  async logout(): Promise<void> {

    try {

      await this.authService.logout();

    } catch (error) {

      console.error(error);

    }

  }

  get currentUser() {

    return this.authService.getCurrentUser();

  }

  get userName(): string {

    if (this.profile?.name) {

      return this.profile.name;

    }

    const user = this.currentUser;

    if (!user) {

      return 'Invitado';

    }

    return user.displayName
      || user.email
      || 'Usuario';

  }

  get userRole(): string {

    if (!this.profile) {

      return 'Usuario';

    }

    const role = String(this.profile.role ?? '')
      .trim()
      .toLowerCase();

    switch (role) {

      case 'teacher':
        return 'Profesor';

      case 'student':
        return 'Estudiante';

      case 'admin':
        return 'Administrador';

      default:
        return 'Usuario';

    }

  }

}