import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { db } from '../../../environments/firebase.config';
import { UserProfile } from '../models/user-profile.model';

export interface UserData {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  institution?: string;
  active: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private collectionName = 'users';

  getUsers(): Observable<UserData[]> {
    const ref = collection(db, this.collectionName);
    return from(getDocs(ref)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          return {
            uid: docSnap.id,
            name: data['name'] || '',
            email: data['email'] || '',
            role: data['role'] || 'student',
            institution: data['institution'] || '',
            active: data['active'] ?? true,
            createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(),
          } as UserData;
        });
      })
    );
  }

  async getUser(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, this.collectionName, uid);
    const docSnap = await getDoc(ref);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      uid: docSnap.id,
      name: data['name'] || '',
      email: data['email'] || '',
      role: data['role'] || 'student',
      photoURL: data['photoURL'] || '',
      active: data['active'] ?? true,
      createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(),
    } as UserProfile;
  }

  getDevelopersCount(): Observable<number> {
    const ref = collection(db, this.collectionName);
    const q = query(ref, where('role', 'in', ['student', 'teacher']));
    return from(getDocs(q)).pipe(map((snapshot) => snapshot.size));
  }

  getInstitutionsCount(): Observable<number> {
    return this.getUsers().pipe(
      map((users) => {
        const institutions = users
          .map((u) => u.institution)
          .filter((inst) => inst && inst.trim() !== '');
        return new Set(institutions).size;
      })
    );
  }
}