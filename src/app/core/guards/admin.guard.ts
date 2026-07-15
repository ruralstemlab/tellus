import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { ProfileService } from '../services/profile.service';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);

  /**
   * --------------------------------------------------------
   * 🛠 DEVELOPER MODE
   * --------------------------------------------------------
   * Durante el desarrollo local siempre permitirá
   * acceder al Panel de Administración.
   *
   * NO afecta la versión en producción.
   * --------------------------------------------------------
   */
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  if (isLocalhost) {

    console.log('🛠 Developer Mode activo');

    return true;

  }

  /**
   * --------------------------------------------------------
   * PRODUCCIÓN
   * --------------------------------------------------------
   */

  const authService = inject(AuthService);
  const profileService = inject(ProfileService);

  return combineLatest([
    authService.authReady$,
    profileService.loading$,
    profileService.profile$
  ]).pipe(

    filter(([authReady, loading]) => authReady && !loading),

    take(1),

    map(([_, __, profile]) => {

      console.log('Perfil detectado:', profile);

      if (profile?.role === 'admin') {

        return true;

      }

      router.navigate(['/biblioteca-viva']);

      return false;

    })

  );

};