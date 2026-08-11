import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly profileSubject =
    new BehaviorSubject<UserProfile | null>(null);

  readonly profile$ = this.profileSubject.asObservable();

  private readonly loadingSubject =
    new BehaviorSubject<boolean>(true);

  readonly loading$ = this.loadingSubject.asObservable();

  /**
   * Perfil actualmente cargado.
   *
   * Se mantiene como propiedad pública porque otros componentes
   * de la aplicación, como Biblioteca Viva, lo utilizan de forma
   * síncrona.
   */
  get currentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.authService.user$.subscribe({
      next: async (user) => {
        this.loadingSubject.next(true);

        // No hay usuario autenticado
        if (!user) {
          this.profileSubject.next(null);
          this.loadingSubject.next(false);
          return;
        }

        try {
          // Buscar users/{uid} en Firestore
          const profile = await this.userService.getUser(user.uid);

          if (!profile) {
            console.warn(
              'ProfileService: No existe perfil en Firestore para el usuario:',
              user.uid,
            );

            this.profileSubject.next(null);
            return;
          }

          // Actualizar el BehaviorSubject.
          // Esto también actualiza currentProfile.
          this.profileSubject.next(profile);
        } catch (error) {
          console.error(
            'ProfileService: Error al cargar el perfil:',
            error,
          );

          this.profileSubject.next(null);
        } finally {
          this.loadingSubject.next(false);
        }
      },

      error: (error) => {
        console.error(
          'ProfileService: Error en la suscripción de autenticación:',
          error,
        );

        this.profileSubject.next(null);
        this.loadingSubject.next(false);
      },
    });
  }
}