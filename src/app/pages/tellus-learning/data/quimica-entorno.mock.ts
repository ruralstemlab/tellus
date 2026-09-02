import { AGUA_TERRITORIO_MOCK } from './agua-territorio.mock';

/**
 * ============================================================
 * TELLUS LEARNING
 * EXPERIENCIA — QUÍMICA EN NUESTRO ENTORNO
 * ============================================================
 */

export const QUIMICA_ENTORNO_MOCK = {

  ...AGUA_TERRITORIO_MOCK,

  experience: {
    ...AGUA_TERRITORIO_MOCK.experience,

    id: 'quimica-entorno',

    title: 'Química en nuestro entorno',

    subtitle:
      'Descubre la química que está presente en la vida cotidiana.',

    description:
      'Explora sustancias, transformaciones y fenómenos químicos presentes en nuestro entorno.',

    subject:
      'Química',

    curriculumArea:
      'Ciencias Naturales y Química',

    purpose:
      'Comprender fenómenos químicos cotidianos mediante observación, experimentación y análisis de evidencias.',

    challenge:
      'Investigar un fenómeno químico del entorno y construir una explicación basada en evidencias.',
  },

  moments:
    AGUA_TERRITORIO_MOCK.moments.map(
      (moment, index) => ({
        ...moment,

        id: `quimica-entorno-momento-${index + 1}`,

        experienceId: 'quimica-entorno',

        order: index + 1,

        title: [
          '¿Dónde está la química?',
          'Explora la materia de tu entorno',
          '¿Qué crees que está ocurriendo?',
          'Experimenta y observa',
          'Construye una explicación',
          'Analiza las evidencias',
          'Conecta la química con tu mundo',
        ][index],

        subtitle: [
          'Una pregunta nace de lo cotidiano',
          'Observa sustancias y transformaciones',
          'Formula una explicación inicial',
          'Experimenta y registra observaciones',
          'Relaciona observaciones y conceptos',
          'Interpreta los resultados',
          'Reflexiona sobre lo aprendido',
        ][index],

        activityIds: [],

        resourceIds: [],
      })
    ),

  activities: [],

};