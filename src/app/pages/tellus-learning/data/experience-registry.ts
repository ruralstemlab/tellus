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
 * - Creadores STEAM con IA
 * - Circuitos eléctricos
 * - Química en nuestro entorno
 *
 * En el futuro podrán agregarse nuevas experiencias
 * sin modificar el motor principal de Tellus Learning.
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
 *
 * Busca una experiencia por su identificador.
 *
 * Ejemplo:
 *
 * getExperienceById('agua-territorio')
 *
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
 *
 * Devuelve todas las experiencias registradas.
 *
 * Mi Aula utiliza esta función para construir
 * dinámicamente las rutas de aprendizaje.
 *
 * ============================================================
 */

export function getAllExperiences() {

  return Object.values(
    EXPERIENCE_REGISTRY
  );

}