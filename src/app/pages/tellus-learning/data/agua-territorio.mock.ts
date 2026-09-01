import {
  Activity,
  Experience,
  Moment,
} from '../models';

// ============================================================
// TELLUS LEARNING
// EXPERIENCIA: AGUA EN NUESTRO TERRITORIO
// ============================================================
//
// Experiencia STEAM con enfoque territorial.
//
// El estudiante asume el papel de investigador y descubre,
// mediante una secuencia de misiones, cómo interactúan:
//
// clima
// precipitación
// fuentes hídricas
// almacenamiento
// distribución
// consumo
// territorio
//
// ============================================================


// ============================================================
// IDENTIDAD
// ============================================================

const MOCK_TIMESTAMP =
  '2026-09-01T00:00:00.000Z';

export const AGUA_TERRITORIO_ID =
  'agua-territorio';


// ============================================================
// EXPERIENCIA
// ============================================================

export const AGUA_TERRITORIO_EXPERIENCE: Experience = {

  id: AGUA_TERRITORIO_ID,

  title:
    'Agua en nuestro territorio',

  subtitle:
    'Una misión para comprender, cuidar y transformar',

  description:
    'Explora el agua de tu territorio, investiga por qué puede cambiar su disponibilidad y utiliza la ciencia, las matemáticas y la tecnología para comprender el problema y construir posibles soluciones.',

  subject:
    'Ciencias Naturales',

  gradeLevel:
    '8.º a 11.º',

  curriculumArea:
    'Ciencias Naturales, Física, Matemáticas y Tecnología',

  purpose:
    'Fortalecer el pensamiento sistémico mediante el estudio del agua como un fenómeno natural, científico, tecnológico y social relacionado con el territorio.',

  challenge:
    'Investigar por qué puede disminuir la disponibilidad de agua en una comunidad y utilizar observaciones, mediciones, datos y modelos para proponer alternativas de solución.',


  // ==========================================================
  // OBJETIVOS
  // ==========================================================

  learningObjectives: [

    {
      id: 'agua-objetivo-sistema',

      description:
        'Reconocer el agua como un sistema en el que interactúan factores naturales, tecnológicos y sociales.',
    },

    {
      id: 'agua-objetivo-clima',

      description:
        'Relacionar variables climáticas y meteorológicas con la disponibilidad de agua.',
    },

    {
      id: 'agua-objetivo-medicion',

      description:
        'Utilizar mediciones, unidades y datos para estudiar fenómenos relacionados con el agua.',
    },

    {
      id: 'agua-objetivo-modelacion',

      description:
        'Construir explicaciones y modelos sencillos de situaciones relacionadas con almacenamiento, flujo y consumo de agua.',
    },

    {
      id: 'agua-objetivo-pensamiento-sistemico',

      description:
        'Analizar relaciones entre diferentes elementos de una problemática territorial y formular hipótesis de solución.',
    },

    {
      id: 'agua-objetivo-comunicacion',

      description:
        'Comunicar resultados, evidencias y propuestas utilizando lenguaje científico y representaciones gráficas.',
    },

  ],


  // ==========================================================
  // DISEÑO PEDAGÓGICO
  // ==========================================================

  structureType:
    'lineal',

  approaches: [

    'investigativa',
    'experimental',
    'colaborativa',
    'reflexiva',
    'ludica',

  ],


  // ==========================================================
  // TECNOLOGÍA
  // ==========================================================

  techRequirement:
    'dispositivo',

  difficulty:
    'intermedio',

  estimatedDurationMinutes:
    420,


  // ==========================================================
  // IDENTIDAD VISUAL DE LA EXPERIENCIA
  // ==========================================================

  thumbnailUrl:
    '/assets/tellus/experiences/agua-territorio/thumbnail.webp',

  coverUrl:
    '/assets/tellus/experiences/agua-territorio/cover.webp',


  // ==========================================================
  // ESTADO
  // ==========================================================

  status:
    'pilot',

  createdBy:
    'Rural STEAM Lab',

  createdAt:
    MOCK_TIMESTAMP,

  updatedAt:
    MOCK_TIMESTAMP,

  publishedAt:
    MOCK_TIMESTAMP,

};


// ============================================================
// MOMENTOS
// ============================================================

export const AGUA_TERRITORIO_MOMENTS: Moment[] = [

  // ==========================================================
  // MOMENTO 1 — MOTIVACIÓN
  // ==========================================================

  {

    id:
      'agua-motivacion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      1,

    title:
      '¿Y si mañana no hubiera agua?',

    subtitle:
      'Una misión comienza con una pregunta',

    description:
      'Observa el territorio, descubre una problemática real y formula tu primera hipótesis sobre lo que puede estar ocurriendo con el agua.',

    type:
      'motivacion',

    // ========================================================
    // IMAGEN DEL MOMENTO
    // ========================================================

    image:
      '/assets/tellus-learning/agua/momento-01-territorio.png',

    objectiveIds: [

      'agua-objetivo-sistema',

      'agua-objetivo-clima',

      'agua-objetivo-pensamiento-sistemico',

    ],

    activityIds: [

      'agua-motivacion-mision',

      'agua-motivacion-territorio',

      'agua-motivacion-contexto',

      'agua-motivacion-el-nino',

      'agua-motivacion-datos',

      'agua-motivacion-sistema',

      'agua-motivacion-hipotesis',

    ],

    resourceIds: [

      'agua-recurso-escena-territorio',

      'agua-recurso-foto-velez',

      'agua-recurso-video-el-nino',

      'agua-recurso-datos-ideam',

      'agua-recurso-mapa-territorio',

      'agua-recurso-contexto-velez',

      'agua-recurso-infografia-sistema',

    ],

    estimatedDurationMinutes:
      45,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 2 — EXPLORACIÓN
  // ==========================================================

  {

    id:
      'agua-exploracion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      2,

    title:
      'Explora el agua de tu territorio',

    subtitle:
      '¿De dónde viene el agua que utilizamos?',

    description:
      'Investiga las fuentes, recorridos, usos y formas de almacenamiento del agua en tu territorio.',

    type:
      'exploracion',

    objectiveIds: [

      'agua-objetivo-sistema',

      'agua-objetivo-clima',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      60,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 3 — PREDICCIÓN
  // ==========================================================

  {

    id:
      'agua-prediccion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      3,

    title:
      'Atrévete a predecir',

    subtitle:
      '¿Qué crees que ocurrirá?',

    description:
      'Formula predicciones sobre el comportamiento del agua antes de comprobarlas mediante mediciones y experimentos.',

    type:
      'prediccion',

    objectiveIds: [

      'agua-objetivo-modelacion',

      'agua-objetivo-pensamiento-sistemico',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      45,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 4 — EXPERIMENTACIÓN
  // ==========================================================

  {

    id:
      'agua-experimentacion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      4,

    title:
      'Pongámosle números al agua',

    subtitle:
      'Medir para comprender',

    description:
      'Experimenta con volumen, capacidad, caudal y otras variables para descubrir cómo se comporta el agua.',

    type:
      'experimentacion',

    objectiveIds: [

      'agua-objetivo-medicion',

      'agua-objetivo-modelacion',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      90,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 5 — CONSTRUCCIÓN
  // ==========================================================

  {

    id:
      'agua-construccion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      5,

    title:
      'Construye una solución',

    subtitle:
      'Diseña, prueba y mejora',

    description:
      'Utiliza lo aprendido para diseñar una alternativa relacionada con el almacenamiento, distribución o uso responsable del agua.',

    type:
      'construccion',

    objectiveIds: [

      'agua-objetivo-modelacion',

      'agua-objetivo-pensamiento-sistemico',

      'agua-objetivo-comunicacion',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      90,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 6 — ANÁLISIS Y EVALUACIÓN
  // ==========================================================

  {

    id:
      'agua-analisis',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      6,

    title:
      'Los datos cuentan la historia',

    subtitle:
      'Analiza antes de decidir',

    description:
      'Compara resultados, interpreta datos y evalúa las hipótesis y soluciones construidas durante la experiencia.',

    type:
      'analisis_evaluacion',

    objectiveIds: [

      'agua-objetivo-medicion',

      'agua-objetivo-modelacion',

      'agua-objetivo-comunicacion',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      60,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // MOMENTO 7 — REFLEXIÓN
  // ==========================================================

  {

    id:
      'agua-reflexion',

    experienceId:
      AGUA_TERRITORIO_ID,

    order:
      7,

    title:
      'Ahora eres parte de la solución',

    subtitle:
      'Lo que aprendiste puede transformar tu territorio',

    description:
      'Reflexiona sobre lo aprendido y comunica cómo podrías contribuir al cuidado y uso responsable del agua.',

    type:
      'reflexion',

    objectiveIds: [

      'agua-objetivo-pensamiento-sistemico',

      'agua-objetivo-comunicacion',

    ],

    activityIds: [],

    resourceIds: [],

    estimatedDurationMinutes:
      30,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },

];


// ============================================================
// ACTIVIDADES — MOMENTO 1
// ============================================================

export const AGUA_TERRITORIO_ACTIVITIES: Activity[] = [

  // ==========================================================
  // ACTIVIDAD 1
  // ==========================================================

  {

    id:
      'agua-motivacion-mision',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      1,

    title:
      '¿Y si mañana no hubiera agua?',

    description:
      'Comienza tu misión como investigador del agua de tu territorio.',

    type:
      'reflection',

    objectiveIds: [

      'agua-objetivo-pensamiento-sistemico',

    ],

    resourceIds: [

      'agua-recurso-escena-territorio',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        false,

    },

    content: {

      type:
        'reflection',

      data: {

        instructions:
          'Observa la escena, imagina que la disponibilidad de agua de tu comunidad comienza a disminuir y formula una primera explicación.',

        questions: [

          {

            id:
              'agua-pregunta-mision',

            text:
              '¿Qué crees que podría estar ocurriendo con el agua de nuestro territorio?',

          },

        ],

        minWords:
          5,

        maxWords:
          100,

      },

    },

    estimatedDurationMinutes:
      5,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 2
  // ==========================================================

  {

    id:
      'agua-motivacion-territorio',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      2,

    title:
      'Explora nuestro territorio',

    description:
      'Observa una representación del territorio y busca pistas relacionadas con el agua.',

    type:
      'open',

    objectiveIds: [

      'agua-objetivo-sistema',

    ],

    resourceIds: [

      'agua-recurso-escena-territorio',

      'agua-recurso-foto-velez',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        false,

    },

    content: {

      type:
        'reflection',

      data: {

        instructions:
          'Observa cuidadosamente. Identifica los elementos del territorio que podrían estar relacionados con la disponibilidad de agua.',

        questions: [

          {

            id:
              'agua-observacion-territorio',

            text:
              '¿Qué elementos del paisaje podrían influir en la disponibilidad de agua?',

          },

        ],

        minWords:
          5,

        maxWords:
          120,

      },

    },

    estimatedDurationMinutes:
      7,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 3
  // ==========================================================

  {

    id:
      'agua-motivacion-contexto',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      3,

    title:
      'Una historia que también ocurre aquí',

    description:
      'Conoce el contexto de disponibilidad y abastecimiento de agua en Vélez.',

    type:
      'open',

    objectiveIds: [

      'agua-objetivo-sistema',

    ],

    resourceIds: [

      'agua-recurso-contexto-velez',

      'agua-recurso-mapa-territorio',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        false,

    },

    content: {

      type:
        'reflection',

      data: {

        instructions:
          'Conoce el contexto y relaciona la situación del territorio con la pregunta inicial de la misión.',

        questions: [

          {

            id:
              'agua-contexto-velez',

            text:
              '¿Qué relación encuentras entre el territorio y la disponibilidad de agua?',

          },

        ],

        minWords:
          5,

        maxWords:
          120,

      },

    },

    estimatedDurationMinutes:
      7,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 4
  // EL NIÑO
  // ==========================================================

  {

    id:
      'agua-motivacion-el-nino',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      4,

    title:
      'Cuando el clima cambia',

    description:
      'Descubre qué relación puede existir entre El Niño, la lluvia y la disponibilidad de agua.',

    type:
      'video',

    objectiveIds: [

      'agua-objetivo-clima',

    ],

    resourceIds: [

      'agua-recurso-video-el-nino',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        true,

    },

    content: {

      type:
        'video',

      data: {

        videoUrl:
          '/assets/tellus/experiences/agua-territorio/motivacion/video-el-nino.mp4',

        thumbnailUrl:
          '/assets/tellus/experiences/agua-territorio/motivacion/video-el-nino.webp',

        durationSeconds:
          180,

        guidingQuestions: [

          '¿Qué cambios produce El Niño?',

          '¿Qué relación puede existir con la lluvia?',

          '¿Cómo podría afectar la disponibilidad de agua?',

        ],

      },

    },

    estimatedDurationMinutes:
      8,

    isOptional:
      false,

    published:
      false,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 5
  // DATOS
  // ==========================================================

  {

    id:
      'agua-motivacion-datos',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      5,

    title:
      'Los datos cuentan una historia',

    description:
      'Observa información climática y busca patrones que puedan ayudar a explicar el problema.',

    type:
      'data_analysis',

    objectiveIds: [

      'agua-objetivo-clima',

      'agua-objetivo-medicion',

    ],

    resourceIds: [

      'agua-recurso-datos-ideam',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        true,

    },

    content: {

      type:
        'data_analysis',

      data: {

        instructions:
          'Observa los datos disponibles y busca cambios o patrones relacionados con la precipitación.',

        questions: [

          {

            id:
              'agua-datos-patron',

            type:
              'long_answer',

            text:
              '¿Qué patrón observas en los datos?',

            points:
              0,

          },

          {

            id:
              'agua-datos-explicacion',

            type:
              'long_answer',

            text:
              '¿Cómo podrían relacionarse esos cambios con la disponibilidad de agua?',

            points:
              0,

          },

        ],

        dataSources: [

          'agua-recurso-datos-ideam',

        ],

      },

    },

    estimatedDurationMinutes:
      8,

    isOptional:
      false,

    published:
      false,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 6
  // ==========================================================

  {

    id:
      'agua-motivacion-sistema',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      6,

    title:
      'El agua es un sistema',

    description:
      'Descubre cómo clima, fuentes hídricas, infraestructura y consumo pueden estar relacionados.',

    type:
      'open',

    objectiveIds: [

      'agua-objetivo-sistema',

      'agua-objetivo-pensamiento-sistemico',

    ],

    resourceIds: [

      'agua-recurso-infografia-sistema',

    ],

    config: {

      requiresSubmission:
        false,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        true,

    },

    content: {

      type:
        'reflection',

      data: {

        instructions:
          'Observa la representación del sistema del agua y piensa en las relaciones entre sus elementos.',

        questions: [

          {

            id:
              'agua-sistema-relaciones',

            text:
              '¿Qué elementos crees que están conectados entre sí? Explica una relación.',

          },

        ],

        minWords:
          10,

        maxWords:
          150,

      },

    },

    estimatedDurationMinutes:
      7,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },


  // ==========================================================
  // ACTIVIDAD 7
  // ==========================================================

  {

    id:
      'agua-motivacion-hipotesis',

    experienceId:
      AGUA_TERRITORIO_ID,

    momentId:
      'agua-motivacion',

    order:
      7,

    title:
      'Tu primera hipótesis',

    description:
      'Ahora piensa como un investigador: ¿qué factores podrían explicar el problema?',

    type:
      'reflection',

    objectiveIds: [

      'agua-objetivo-pensamiento-sistemico',

    ],

    config: {

      requiresSubmission:
        true,

      requiredForCompletion:
        true,

      graded:
        false,

      allowsMultipleAttempts:
        true,

    },

    content: {

      type:
        'reflection',

      data: {

        instructions:
          'Formula una primera hipótesis. No necesitas tener la respuesta correcta todavía. Tu hipótesis será puesta a prueba durante la experiencia.',

        questions: [

          {

            id:
              'agua-hipotesis',

            text:
              '¿Por qué crees que puede disminuir la disponibilidad de agua en una comunidad?',

          },

          {

            id:
              'agua-factor-principal',

            text:
              '¿Cuál consideras que podría ser el factor más importante? Explica por qué.',

          },

        ],

        minWords:
          15,

        maxWords:
          200,

      },

    },

    estimatedDurationMinutes:
      8,

    isOptional:
      false,

    published:
      true,

    createdAt:
      MOCK_TIMESTAMP,

    updatedAt:
      MOCK_TIMESTAMP,

  },

];


// ============================================================
// MOCK CENTRAL
// ============================================================

export const AGUA_TERRITORIO_MOCK = {

  experience:
    AGUA_TERRITORIO_EXPERIENCE,

  moments:
    AGUA_TERRITORIO_MOMENTS,

  activities:
    AGUA_TERRITORIO_ACTIVITIES,

} as const;