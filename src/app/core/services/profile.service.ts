import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';

import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  /**
   * Perfil del usuario autenticado.
   */
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);

  /**
   * Observable público del perfil.
   */
  readonly profile$ = this.profileSubject.asObservable();

  /**
   * Indica si el perfil aún se está cargando.
   */
  private loadingSubject = new BehaviorSubject<boolean>(true);

  /**
   * Observable público del estado de carga.
   */
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(

    private authService: AuthService,

    private userService: UserService

  ) {

    this.initialize();

  }

  /**
   * Inicializa automáticamente el perfil
   * cuando Firebase Authentication cambia de estado.
   */
  private initialize(): void {

    this.authService.user$.subscribe(async (user) => {

      this.loadingSubject.next(true);

      if (!user) {

        this.profileSubject.next(null);

        this.loadingSubject.next(false);

        return;

      }

      try {

        const profile = await this.userService.getUser(user.uid);

        this.profileSubject.next(profile);

      }

      catch (error) {

        console.error('Error cargando perfil:', error);

        this.profileSubject.next(null);

      }

      finally {

        this.loadingSubject.next(false);

      }

    });

  }

  /**
   * Perfil actual almacenado en memoria.
   */
  get currentProfile(): UserProfile | null {

    return this.profileSubject.value;

  }

}