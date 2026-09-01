import {
  MOVIMIENTO_PARABOLICO_MOCK,
} from './movimiento-parabolico.mock';

import {
  AGUA_TERRITORIO_MOCK,
} from './agua-territorio.mock';

/**
 * ============================================================
 * TELLUS LEARNING
 * REGISTRO CENTRAL DE EXPERIENCIAS
 * ============================================================
 *
 * Todas las experiencias disponibles para Tellus Learning
 * se registran aquí.
 *
 * Este registro permite que Tellus sea escalable:
 *
 * - Movimiento Parabólico
 * - Agua en nuestro territorio
 *
 * En el futuro podrán agregarse nuevas experiencias
 * sin modificar el motor principal de Tellus Learning.
 * ============================================================
 */

export const EXPERIENCE_REGISTRY = {

  [MOVIMIENTO_PARABOLICO_MOCK.experience.id]:
    MOVIMIENTO_PARABOLICO_MOCK,

  [AGUA_TERRITORIO_MOCK.experience.id]:
    AGUA_TERRITORIO_MOCK,

} as const;


/**
 * ============================================================
 * OBTENER UNA EXPERIENCIA
 * ============================================================
 */

export function getExperienceById(
  experienceId: string,
) {

  return EXPERIENCE_REGISTRY[
    experienceId as keyof typeof EXPERIENCE_REGISTRY
  ] ?? null;

}


/**
 * ============================================================
 * OBTENER TODAS LAS EXPERIENCIAS
 * ============================================================
 */

export function getAllExperiences() {

  return Object.values(
    EXPERIENCE_REGISTRY
  );

}