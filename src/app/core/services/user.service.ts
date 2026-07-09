import { Injectable } from '@angular/core';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import {
  db
} from '../../../environments/firebase.config';

import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {}

  async getUser(uid: string): Promise<UserProfile | null> {

    const ref = doc(db, 'users', uid);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {

      return null;

    }

    return snapshot.data() as UserProfile;

  }

}