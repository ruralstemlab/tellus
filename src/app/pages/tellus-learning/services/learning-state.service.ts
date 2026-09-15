import {
  Injectable,
  computed,
  signal,
} from '@angular/core';

import {
  LearningState,
  MomentKey,
  LEARNING_STATE_VERSION,
  createEmptyLearningState,
} from '../models/learning-state.model';


// ============================================================
// TELLUS LEARNING — LEARNING STATE SERVICE
// ============================================================
//
// Fuente única de verdad para el estado del estudiante
// durante una experiencia de aprendizaje.
//
// Hoy persiste en localStorage (offline-first).
// Mañana persistirá en Firestore sin cambiar la API pública.
//
// ============================================================

@Injectable({
  providedIn: 'root',
})
export class LearningStateService {


  // ============================================================
  // CONFIGURACIÓN
  // ============================================================

  private readonly storagePrefix =
    'tellus.learning-state.';


  // ============================================================
  // ESTADO
  // ============================================================

  private readonly state =
    signal<LearningState | null>(null);


  /**
   * Estado actual (lectura reactiva).
   * Se puede consumir como computed o directamente con state().
   */
  readonly currentState =
    computed<LearningState | null>(
      () => this.state()
    );


  // ============================================================
  // API PÚBLICA
  // ============================================================

  /**
   * Carga el estado de una experiencia.
   * Si no existe, crea uno nuevo vacío.
   */
  load(
    experienceId: string
  ): LearningState {

    if (!experienceId) {
      const empty = createEmptyLearningState('');
      this.state.set(empty);
      return empty;
    }

    const existing =
      this.readFromStorage(
        experienceId
      );

    if (existing) {
      this.state.set(existing);
      return existing;
    }

    const fresh =
      createEmptyLearningState(
        experienceId
      );

    this.state.set(fresh);
    this.writeToStorage(fresh);

    return fresh;
  }


  /**
   * Devuelve el estado actual sin recargar.
   */
  get(): LearningState | null {
    return this.state();
  }


  /**
   * Actualiza (parcialmente) un momento específico.
   *
   * Ejemplo:
   *   stateService.patchMoment('exp-movimiento-parabolico', 'm1', {
   *     initialExplanation: 'Yo creo que...'
   *   });
   */
  patchMoment<T = any>(
    experienceId: string,
    momentKey: MomentKey,
    data: Partial<T>
  ): void {

    const current =
      this.state()
      ?? this.load(experienceId);

    const momentPrev =
      (current.moments[momentKey] as any) ?? {};

    const next: LearningState = {
      ...current,
      moments: {
        ...current.moments,
        [momentKey]: {
          ...momentPrev,
          ...data,
        },
      },
      updatedAt:
        new Date().toISOString(),
    };

    this.state.set(next);
    this.writeToStorage(next);
  }


  /**
   * Marca un momento como completado.
   */
  completeMoment(
    experienceId: string,
    momentKey: MomentKey
  ): void {

    this.patchMoment(
      experienceId,
      momentKey,
      {
        completedAt:
          new Date().toISOString(),
      }
    );
  }


  /**
   * Devuelve los datos de un momento.
   */
  getMoment<T = any>(
    momentKey: MomentKey
  ): T | null {

    const current =
      this.state();

    if (!current) {
      return null;
    }

    return (
      (current.moments[momentKey] as any)
      ?? null
    );
  }


  /**
   * Limpia el estado de una experiencia.
   */
  reset(
    experienceId: string
  ): void {

    if (!experienceId) {
      return;
    }

    this.clearStorage(
      experienceId
    );

    const fresh =
      createEmptyLearningState(
        experienceId
      );

    this.state.set(fresh);
    this.writeToStorage(fresh);
  }


  /**
   * Limpia TODA la caché del servicio.
   * Útil en logout.
   */
  resetAll(): void {

    if (
      typeof window === 'undefined'
      || !window.localStorage
    ) {
      return;
    }

    const keysToRemove: string[] = [];

    for (
      let i = 0;
      i < window.localStorage.length;
      i++
    ) {

      const key =
        window.localStorage.key(i);

      if (
        key &&
        key.startsWith(this.storagePrefix)
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key =>
      window.localStorage.removeItem(key)
    );

    this.state.set(null);
  }


  // ============================================================
  // PERSISTENCIA — localStorage (por ahora)
  // ============================================================

  private storageKey(
    experienceId: string
  ): string {
    return (
      this.storagePrefix +
      experienceId
    );
  }


  private readFromStorage(
    experienceId: string
  ): LearningState | null {

    if (
      typeof window === 'undefined'
      || !window.localStorage
    ) {
      return null;
    }

    try {

      const raw =
        window.localStorage.getItem(
          this.storageKey(experienceId)
        );

      if (!raw) {
        return null;
      }

      const parsed =
        JSON.parse(raw) as LearningState;

      // Migración de versión
      if (
        !parsed.version
        || parsed.version <
        LEARNING_STATE_VERSION
      ) {

        parsed.version =
          LEARNING_STATE_VERSION;

        parsed.moments =
          parsed.moments ?? {};
      }

      return parsed;

    } catch (error) {

      console.warn(
        '[LearningState] Error al leer storage:',
        error
      );

      return null;
    }
  }


  private writeToStorage(
    state: LearningState
  ): void {

    if (
      typeof window === 'undefined'
      || !window.localStorage
    ) {
      return;
    }

    try {

      window.localStorage.setItem(
        this.storageKey(state.experienceId),
        JSON.stringify(state)
      );

    } catch (error) {

      console.warn(
        '[LearningState] Error al escribir storage:',
        error
      );
    }
  }


  private clearStorage(
    experienceId: string
  ): void {

    if (
      typeof window === 'undefined'
      || !window.localStorage
    ) {
      return;
    }

    try {

      window.localStorage.removeItem(
        this.storageKey(experienceId)
      );

    } catch (error) {

      console.warn(
        '[LearningState] Error al limpiar storage:',
        error
      );
    }
  }

}