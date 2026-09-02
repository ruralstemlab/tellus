import { AGUA_TERRITORIO_MOCK } from './agua-territorio.mock';

export const CIRCUITOS_ELECTRICOS_MOCK = {
  ...AGUA_TERRITORIO_MOCK,

  experience: {
    ...AGUA_TERRITORIO_MOCK.experience,

    id: 'circuitos-electricos',

    title: 'Circuitos eléctricos',

    subtitle: 'Explora, conecta y comprende cómo funciona la electricidad.',

    description:
      'Una experiencia para comprender los circuitos eléctricos mediante exploración, experimentación, medición y modelación.',

    subject: 'Física',

    curriculumArea:
      'Electricidad y Tecnología',

    purpose:
      'Comprender las relaciones entre corriente, voltaje, resistencia y configuración de circuitos mediante experiencias prácticas y simulación.',

    challenge:
      'Construir, analizar y explicar un circuito eléctrico relacionando sus variables y comportamiento.'
  },

  moments: [],

  activities: []
};
