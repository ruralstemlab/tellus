import {
  MOVIMIENTO_PARABOLICO_MOCK,
} from './movimiento-parabolico.mock';

import {
  AGUA_TERRITORIO_MOCK,
} from './agua-territorio.mock';

import {
  CREADORES_STEAM_IA_MOCK,
} from './creadores-steam-ia.mock';

import {
  CIRCUITOS_ELECTRICOS_MOCK,
} from './circuitos-electricos.mock';

import {
  QUIMICA_ENTORNO_MOCK,
} from './quimica-entorno.mock';

import {
  Activity,
  Experience,
  Moment,
} from '../models';


/**
 * ============================================================
 * TELLUS LEARNING
 * REGISTRO CENTRAL DE EXPERIENCIAS
 * ============================================================
 *
 * Todas las experiencias disponibles para Tellus Learning
 * se registran aquí.
 *
 * Cada experiencia contiene:
 *
 * - experience
 * - moments
 * - activities
 *
 * El motor principal consulta este registro para determinar
 * qué contenido corresponde a cada experiencia.
 *
 * Las experiencias nuevas se agregan aquí sin modificar
 * el motor principal de Tellus Learning.
 * ============================================================
 */


/**
 * ============================================================
 * REGISTRO DE EXPERIENCIAS
 * ============================================================
 */

export const EXPERIENCE_REGISTRY = {

  /**
   * Física
   */
  [MOVIMIENTO_PARABOLICO_MOCK.experience.id]:
    MOVIMIENTO_PARABOLICO_MOCK,


  /**
   * Ciencias Naturales
   */
  [AGUA_TERRITORIO_MOCK.experience.id]:
    AGUA_TERRITORIO_MOCK,


  /**
   * Tecnología / Programación / IA
   */
  [CREADORES_STEAM_IA_MOCK.experience.id]:
    CREADORES_STEAM_IA_MOCK,


  /**
   * Física / Tecnología
   */
  [CIRCUITOS_ELECTRICOS_MOCK.experience.id]:
    CIRCUITOS_ELECTRICOS_MOCK,


  /**
   * Química / Ciencias Naturales
   */
  [QUIMICA_ENTORNO_MOCK.experience.id]:
    QUIMICA_ENTORNO_MOCK,

} as const;


/**
 * ============================================================
 * OBTENER UNA EXPERIENCIA
 * ============================================================
 */

export function getExperienceById(
  experienceId: string,
) {

  return (
    EXPERIENCE_REGISTRY[
      experienceId as keyof typeof EXPERIENCE_REGISTRY
    ]
    ?? null
  );

}


/**
 * ============================================================
 * OBTENER TODAS LAS EXPERIENCIAS
 * ============================================================
 */

export function getAllExperiences() {

  return Object.values(
    EXPERIENCE_REGISTRY,
  );

}


/**
 * ============================================================
 * OBTENER UN MOMENTO
 * ============================================================
 *
 * La búsqueda se realiza dentro de la experiencia indicada.
 *
 * Esto evita que MomentComponent tenga que conocer
 * experiencias particulares.
 * ============================================================
 */

export function getMomentById(
  experienceId: string,
  momentId: string,
): Moment | null {

  const experienceData =
    getExperienceById(
      experienceId,
    );

  if (!experienceData) {
    return null;
  }

  return (
    experienceData.moments.find(
      (
        moment: Moment,
      ) =>
        moment.id === momentId,
    )
    ?? null
  );

}


/**
 * ============================================================
 * OBTENER UNA ACTIVIDAD
 * ============================================================
 *
 * La búsqueda se realiza dentro de la experiencia indicada.
 *
 * Ejemplo:
 *
 * getActivityById(
 *   'exp-movimiento-parabolico',
 *   'act-motivacion-video',
 * )
 *
 * Esto permite que ActivityComponent sea completamente
 * independiente de Agua, Física, Química, etc.
 * ============================================================
 */

export function getActivityById(
  experienceId: string,
  activityId: string,
): Activity | null {

  const experienceData =
    getExperienceById(
      experienceId,
    );

  if (!experienceData) {
    return null;
  }

  return (
    experienceData.activities.find(
      (
        activity: Activity,
      ) =>
        activity.id === activityId,
    )
    ?? null
  );

}


/**
 * ============================================================
 * OBTENER ACTIVIDADES DE UN MOMENTO
 * ============================================================
 *
 * Recupera únicamente las actividades relacionadas
 * con el momento indicado.
 * ============================================================
 */

export function getActivitiesByMomentId(
  experienceId: string,
  momentId: string,
): Activity[] {

  const experienceData =
    getExperienceById(
      experienceId,
    );

  if (!experienceData) {
    return [];
  }

  const moment =
    experienceData.moments.find(
      (
        item: Moment,
      ) =>
        item.id === momentId,
    );

  if (!moment) {
    return [];
  }

  const activityIds =
    moment.activityIds ?? [];

  return experienceData.activities.filter(
    (
      activity: Activity,
    ) =>
      activityIds.includes(
        activity.id,
      ),
  );

}