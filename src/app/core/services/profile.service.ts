import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { UserProfile } from '../models/user-profile.model';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  readonly profile$ = this.profileSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(true);
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.authService.user$.subscribe(async (user) => {
      this.loadingSubject.next(true);

      if (!user) {
        console.warn('❌ ProfileService: No hay usuario autenticado');
        this.profileSubject.next(null);
        this.loadingSubject.next(false);
        return;
      }

      try {
        // Intentar obtener el perfil existente
        let profile = await this.userService.getUser(user.uid);

        // 🔥 Si no existe perfil, crearlo (solo en desarrollo)
        if (!profile) {
          console.warn('⚠️ ProfileService: Perfil no encontrado, creando uno automáticamente...');

          const isLocalhost =
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1';

          // En desarrollo, crear perfil de administrador
          if (isLocalhost) {
            profile = {
              uid: user.uid,
              name: user.displayName || 'Administrador Desarrollo',
              email: user.email || 'admin@tellus.dev',
              role: 'admin',
              photoURL: user.photoURL || '',
              active: true,
              createdAt: new Date()
            } as UserProfile;

            // Guardar en Firestore
            await setDoc(doc(db, 'users', user.uid), profile);
            console.log('✅ ProfileService: Perfil de administrador creado en Firestore');
          } else {
            // En producción, no crear automáticamente (debe existir)
            console.warn('⚠️ ProfileService: Perfil no encontrado en producción');
            this.profileSubject.next(null);
            this.loadingSubject.next(false);
            return;
          }
        }

        console.log('✅ ProfileService: Perfil cargado:', profile);
        this.profileSubject.next(profile);

      } catch (error) {
        console.error('❌ ProfileService: Error cargando perfil:', error);
        this.profileSubject.next(null);
      } finally {
        this.loadingSubject.next(false);
      }
    });
  }

  get currentProfile(): UserProfile | null {
    return this.profileSubject.value;
  }
}