import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';

import { ProfileService } from '../services/profile.service';

export const adminGuard: CanActivateFn = () => {

  const profileService = inject(ProfileService);
  const router = inject(Router);

  return profileService.loading$.pipe(

    // Espera a que el perfil termine de cargarse
    filter(loading => !loading),

    take(1),

    map(() => {

      const profile = profileService.currentProfile;

      // Solo los administradores pueden ingresar
      if (profile?.role === 'admin') {
        return true;
      }

      // Cualquier otro usuario será redireccionado
      router.navigate(['/biblioteca-viva']);

      return false;

    })

  );

};