import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, from, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vote } from '../models/vote.model';
import { AuthService } from '../auth/auth.service';
import { db } from '../../../environments/firebase.config';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private readonly collectionName = 'project_votes';

  constructor(private authService: AuthService) {}

  private voteDocumentId(projectId: string, userId: string): string {
    return `${projectId}_${userId}`;
  }

  private toVote(id: string, data: Record<string, any>): Vote {
    return {
      id,
      projectId: data['projectId'],
      userId: data['userId'],
      rating: Number(data['rating'] ?? 0),
      createdAt: data['createdAt']?.toDate
        ? data['createdAt'].toDate()
        : new Date(),
    } as Vote;
  }

  /**
   * Returns the signed-in user's vote for a project.
   * With the current Firestore rules, reading a missing vote document can
   * produce permission-denied; that case is treated as no vote yet.
   */
  async getUserVote(projectId: string, userId: string): Promise<Vote | null> {
    if (!projectId?.trim() || !userId?.trim()) return null;

    const ref = doc(
      db,
      this.collectionName,
      this.voteDocumentId(projectId, userId)
    );

    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data();
      if (data['userId'] !== userId || data['projectId'] !== projectId) {
        return null;
      }
      return this.toVote(snap.id, data);
    } catch (error: any) {
      // Existing rules may deny get on a nonexistent document because
      // resource.data is unavailable. Do not suppress unrelated errors.
      if (error?.code === 'permission-denied') return null;
      throw error;
    }
  }

  /**
   * Saves one vote per user/project. Re-voting updates the same document.
   * The project aggregate is adjusted by the difference, so ratingCount
   * does not increase when the user changes their rating.
   *
   * Note: the current rules do not make these two writes atomic. For strict
   * concurrency-safe aggregates, the rules must allow the vote-document read
   * required by a Firestore transaction or the aggregate should be calculated
   * server-side.
   */
  async vote(projectId: string, rating: number): Promise<void> {
    if (!projectId?.trim()) {
      throw new Error('El identificador del proyecto es obligatorio.');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('La calificación debe ser un número entero entre 1 y 5.');
    }

    const user = await firstValueFrom(this.authService.user$);
    if (!user) throw new Error('Usuario no autenticado.');

    const userId = user.uid;
    const voteId = this.voteDocumentId(projectId, userId);
    const voteRef = doc(db, this.collectionName, voteId);
    const projectRef = doc(db, 'projects', projectId);

    // The project must exist and be published before it can be rated.
    const projectSnap = await getDoc(projectRef);
    if (!projectSnap.exists()) throw new Error('Proyecto no encontrado.');

    const projectData = projectSnap.data();
    if (projectData['status'] !== 'published') {
      throw new Error('Solo se pueden votar aplicaciones publicadas.');
    }

    // With the existing rules, a missing vote's get may be denied. Treat
    // that specific situation as the first vote; setDoc then attempts create.
    let existingRating: number | null = null;
    try {
      const voteSnap = await getDoc(voteRef);
      if (voteSnap.exists()) {
        const existingData = voteSnap.data();
        if (
          existingData['userId'] !== userId ||
          existingData['projectId'] !== projectId
        ) {
          throw new Error('El documento de voto no corresponde a este usuario y proyecto.');
        }
        const storedRating = Number(existingData['rating']);
        if (Number.isFinite(storedRating)) existingRating = storedRating;
      }
    } catch (error: any) {
      if (error?.code !== 'permission-denied') throw error;
      // No readable vote document under the current rules: proceed as first vote.
    }

    const currentRating = Number(projectData['rating'] ?? 0);
    const currentCount = Number(projectData['ratingCount'] ?? 0);
    let newCount = currentCount;
    let newRating = rating;

    if (existingRating !== null && currentCount > 0) {
      const currentSum = currentRating * currentCount;
      newRating = (currentSum - existingRating + rating) / currentCount;
    } else if (existingRating !== null) {
      // Defensive fallback if the existing aggregate is inconsistent.
      newCount = 1;
      newRating = rating;
    } else {
      newCount = currentCount + 1;
      newRating = ((currentRating * currentCount) + rating) / newCount;
    }

    // Deterministic document ID means a changed decision targets the same vote.
    await setDoc(voteRef, {
      projectId,
      userId,
      rating,
      createdAt: new Date(),
    });

    // Allowed by the current projects rule: allow update: if signedIn().
    await updateDoc(projectRef, {
      rating: newRating,
      ratingCount: newCount,
      updatedAt: new Date(),
    });
  }

  getUserVotes(userId: string): Observable<Vote[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId)
    );

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map((voteDoc) => this.toVote(voteDoc.id, voteDoc.data()))
      )
    );
  }
}
