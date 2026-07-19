import { Injectable } from '@angular/core';
import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { Observable, from, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vote } from '../models/vote.model';
import { ProjectService } from './project.service';
import { AuthService } from '../auth/auth.service'; // ✅ Ruta corregida
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private collectionName = 'project_votes';

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  async getUserVote(projectId: string, userId: string): Promise<Vote | null> {
    const docId = `${projectId}_${userId}`;
    const ref = doc(db, this.collectionName, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      id: snap.id,
      projectId: data['projectId'],
      userId: data['userId'],
      rating: data['rating'],
      createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(),
    } as Vote;
  }

  async vote(projectId: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('La calificación debe estar entre 1 y 5');
    }

    const user = await firstValueFrom(this.authService.user$);
    if (!user) throw new Error('Usuario no autenticado');
    const userId = user.uid;
    const docId = `${projectId}_${userId}`;

    await runTransaction(db, async (transaction) => {
      const voteRef = doc(db, this.collectionName, docId);
      const voteSnap = await transaction.get(voteRef);
      const existingVote = voteSnap.exists() ? voteSnap.data()['rating'] : null;

      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await transaction.get(projectRef);
      if (!projectSnap.exists()) {
        throw new Error('Proyecto no encontrado');
      }
      const projectData = projectSnap.data();
      const currentRating = projectData['rating'] || 0;
      const currentCount = projectData['ratingCount'] || 0;

      let newRating = currentRating;
      let newCount = currentCount;

      if (existingVote !== null) {
        if (currentCount > 0) {
          const sumDiff = rating - existingVote;
          const newSum = (currentRating * currentCount) + sumDiff;
          newRating = newSum / currentCount;
        } else {
          newRating = rating;
        }
      } else {
        newCount = currentCount + 1;
        const newSum = (currentRating * currentCount) + rating;
        newRating = newSum / newCount;
      }

      transaction.set(voteRef, {
        projectId,
        userId,
        rating,
        createdAt: new Date(),
      });

      transaction.update(projectRef, {
        rating: newRating,
        ratingCount: newCount,
        updatedAt: new Date(),
      });
    });
  }

  getUserVotes(userId: string): Observable<Vote[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    );
    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectId: data['projectId'],
            userId: data['userId'],
            rating: data['rating'],
            createdAt: data['createdAt']?.toDate ? data['createdAt'].toDate() : new Date(),
          } as Vote;
        })
      )
    );
  }
}