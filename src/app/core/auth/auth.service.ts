import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential,
  User,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Observable del usuario autenticado (puede ser null)
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private router: Router) {
    // Escuchar cambios de autenticación
    onAuthStateChanged(auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // ============================
  // REGISTRO (con displayName)
  // ============================
  async register(email: string, password: string, displayName: string): Promise<UserCredential> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Guardar el nombre en el perfil de Firebase Auth
    await updateProfile(credential.user, { displayName });
    // El observable se actualizará automáticamente por onAuthStateChanged
    return credential;
  }

  // ============================
  // LOGIN
  // ============================
  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  // ============================
  // RECUPERAR CONTRASEÑA
  // ============================
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  // ============================
  // CERRAR SESIÓN
  // ============================
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Regresa al portal principal Rural STEAM Lab
      window.location.href = 'https://ruralsteamlab.com';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // ============================
  // USUARIO ACTUAL (sincrónico)
  // ============================
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // ============================
  // OBTENER NOMBRE DEL USUARIO (displayName o email)
  // ============================
  getUserDisplayName(): string {
    const user = auth.currentUser;
    if (!user) return 'Invitado';
    return user.displayName || user.email?.split('@')[0] || 'Usuario';
  }
}