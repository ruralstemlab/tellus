import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { AboutModal } from '../about-modal/about-modal';
import { Modal } from '../../services/modal';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

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
export class Navbar implements OnInit, OnDestroy {

  modal = inject(Modal);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private profileService = inject(ProfileService);

  // Datos del usuario (se actualizan desde el observable)
  profile: UserProfile | null = null;
  userName = 'Invitado';
  userRole = 'Usuario';

  // Menú fijo
  menuItems: MenuItem[] = [
    { icon: '🏠', label: 'Inicio', route: '/home' },
    { icon: '🤖', label: 'Gaian', route: '/gaian' },
    { icon: '👨‍🏫', label: 'Mi Aula', route: '/mi-aula' },
    { icon: '🧪', label: 'Laboratorios', route: '/laboratorios' },
    { icon: '📚', label: 'Biblioteca Viva', route: '/biblioteca-viva' }
  ];

  // Para limpiar suscripciones
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Suscribirse al perfil del usuario (reactivo)
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        this.profile = profile;
        if (profile) {
          this.userName = profile.name || 'Usuario';
          this.userRole = this.mapRole(profile.role);
        } else {
          // No hay usuario autenticado o perfil no cargado
          this.userName = 'Invitado';
          this.userRole = 'Usuario';
        }
        // Forzar detección de cambios (por si es necesario)
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Mapeo de roles (igual que en Home, pero en inglés)
  private mapRole(role: 'teacher' | 'student' | 'admin' | string): string {
    const map: Record<string, string> = {
      teacher: 'Profesor',
      student: 'Estudiante',
      admin: 'Administrador'
    };
    return map[role] || 'Usuario';
  }

  openAbout(): void {
    this.modal.open('about');
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      // El logout ya redirige según lo definido en AuthService
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}