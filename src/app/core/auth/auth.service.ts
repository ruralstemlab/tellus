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

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  auth,
  db
} from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Usuario autenticado de Firebase Authentication.
   */
  private userSubject = new BehaviorSubject<User | null>(null);

  readonly user$: Observable<User | null> =
    this.userSubject.asObservable();

  /**
   * Indica cuándo Firebase terminó de restaurar la sesión.
   */
  private authReadySubject = new BehaviorSubject<boolean>(false);

  readonly authReady$: Observable<boolean> =
    this.authReadySubject.asObservable();

  constructor(
    private router: Router
  ) {

    onAuthStateChanged(auth, (user) => {

      this.userSubject.next(user);

      this.authReadySubject.next(true);

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

    await credential.user.reload();

    this.userSubject.next(credential.user);

    await setDoc(

      doc(db, 'users', credential.user.uid),

      {

        uid: credential.user.uid,

        name: displayName,

        email,

        role,

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

    const credential =
      await signInWithEmailAndPassword(

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

  // ==========================================================
  // CERRAR SESIÓN
  // ==========================================================

  async logout(): Promise<void> {

    try {

      await signOut(auth);

      this.userSubject.next(null);

      window.location.href = 'https://ruralsteamlab.com';

    }

    catch (error) {

      console.error('Error al cerrar sesión:', error);

    }

  }

}