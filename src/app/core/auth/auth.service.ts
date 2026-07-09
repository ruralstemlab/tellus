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

import {
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { BehaviorSubject, Observable } from 'rxjs';

import { auth, db } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User | null>(null);

  public user$: Observable<User | null> =
    this.userSubject.asObservable();

  constructor(
    private router: Router
  ) {

    onAuthStateChanged(auth, (user) => {

      this.userSubject.next(user);

    });

  }

  // ==========================================================
  // REGISTRO
  // ==========================================================

  async register(

    email: string,

    password: string,

    displayName: string,

    role: 'teacher' | 'student' | 'admin'

  ): Promise<UserCredential> {

    const credential =
      await createUserWithEmailAndPassword(

        auth,

        email,

        password

      );

    await updateProfile(

      credential.user,

      {

        displayName

      }

    );

    // Cambio 1: Recargar y emitir usuario inmediatamente
    await credential.user.reload();
    this.userSubject.next(credential.user);

    await setDoc(

      doc(db, 'users', credential.user.uid),

      {

        uid: credential.user.uid,

        name: displayName,

        email: email,

        role: role,

        photoURL: credential.user.photoURL || '',

        active: true,

        createdAt: serverTimestamp()

      }

    );

    return credential;

  }

  // ==========================================================
  // LOGIN
  // ==========================================================

  async login(

    email: string,

    password: string

  ): Promise<UserCredential> {

    // Cambio 2: Obtener credencial y emitir usuario
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    this.userSubject.next(credential.user);
    return credential;

  }

  // ==========================================================
  // RECUPERAR CONTRASEÑA
  // ==========================================================

  async resetPassword(

    email: string

  ): Promise<void> {

    await sendPasswordResetEmail(

      auth,

      email

    );

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