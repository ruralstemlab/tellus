import { Injectable } from '@angular/core';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../../../environments/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  async getCurrentProfile(): Promise<any> {

    const user = auth.currentUser;

    if (!user) {

      return null;

    }

    const ref = doc(

      db,

      'users',

      user.uid

    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {

      return null;

    }

    return snapshot.data();

  }

}