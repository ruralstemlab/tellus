import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  UserCredential
} from 'firebase/auth';

import { auth } from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // ============================
  // REGISTRO
  // ============================
  async register(email: string, password: string): Promise<UserCredential> {
    return await createUserWithEmailAndPassword(auth, email, password);
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
  // USUARIO AUTENTICADO
  // ============================
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // ============================
  // USUARIO ACTUAL
  // ============================
  getCurrentUser() {
    return auth.currentUser;
  }

}