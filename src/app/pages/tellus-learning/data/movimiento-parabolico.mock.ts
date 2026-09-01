import {
  Activity,
  Experience,
  Moment,
} from '../models';

/**
 * ============================================================
 * TELLUS LEARNING
 * EXPERIENCIA: MOVIMIENTO PARABÓLICO
 * ============================================================
 *
 * CICLO DE APRENDIZAJE
 *
 * 1. Motivación
 * 2. Exploración
 * 3. Predicción
 * 4. Experimentación
 * 5. Construcción
 * 6. Análisis y evaluación
 * 7. Reflexión
 *
 * El mismo MomentComponent sirve para todas las experiencias.
 *
 * La imagen del momento se define aquí, NO en moment.html.
 * ============================================================
 */


/* ============================================================
 * EXPERIENCIA
 * ============================================================ */

export const MOVIMIENTO_PARABOLICO_EXPERIENCE: Experience = {

  id: 'exp-movimiento-parabolico',

  title: 'Movimiento Parabólico',

  subtitle:
    'Investiga, experimenta y comprende el movimiento de los objetos en el aire.',

  description:
    'Una experiencia de aprendizaje en la que el estudiante observa, explora, predice, experimenta y construye explicaciones sobre el movimiento parabólico.',

  subject: 'Física',

  gradeLevel: '10° y 11°',

  curriculumArea: 'Mecánica',

  purpose:
    'Comprender el movimiento parabólico mediante la relación entre observación, predicción, experimentación, modelación y análisis de datos.',

  challenge:
    '¿Puedes explicar y predecir cómo cambia la trayectoria de un objeto lanzado al aire?',

  learningObjectives: [

    {
      id: 'obj-01',

      description:
        'Reconocer las características principales del movimiento parabólico.',
    },

    {
      id: 'obj-02',

      description:
        'Explorar la relación entre ángulo, velocidad, tiempo y alcance.',
    },

    {
      id: 'obj-03',

      description:
        'Formular predicciones e hipótesis sobre el movimiento de un proyectil.',
    },

    {
      id: 'obj-04',

      description:
        'Obtener y registrar datos mediante experimentación física y simulación.',
    },

    {
      id: 'obj-05',

      description:
        'Construir un modelo explicativo del movimiento parabólico.',
    },

    {
      id: 'obj-06',

      description:
        'Analizar datos experimentales y compararlos con modelos y predicciones.',
    },

    {
      id: 'obj-07',

      description:
        'Reflexionar sobre el aprendizaje y relacionarlo con nuevas situaciones.',
    },

  ],

  structureType: 'hibrida',

  approaches: [
    'experimental',
    'investigativa',
    'reflexiva',
    'ludica',
  ],

  techRequirement: 'dispositivo',

  difficulty: 'intermedio',

  estimatedDurationMinutes: 180,


  /*
   * Imagen principal de la experiencia.
   *
   * La misma ilustración puede utilizarse inicialmente
   * como miniatura y portada.
   */

  thumbnailUrl:
    '/assets/tellus-learning/movimiento-parabolico/momento-01-movimiento-parabolico.png',

  coverUrl:
    '/assets/tellus-learning/movimiento-parabolico/momento-01-movimiento-parabolico.png',


  status: 'published',

  createdBy: 'tellus',

  createdAt: null,

  updatedAt: null,

  publishedAt: null,
};


/* ============================================================
 * MOMENTOS
 * ============================================================ */

export const MOVIMIENTO_PARABOLICO_MOMENTS: Moment[] = [

  /* ==========================================================
   * MOMENTO 1 — MOTIVACIÓN
   * ========================================================== */

  {
    id: 'moment-motivacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 1,

    title:
      '¿Hasta dónde puede llegar un lanzamiento?',

    subtitle:
      'Una trayectoria comienza con una pregunta',

    description:
      'Observa el movimiento de un objeto lanzado al aire y descubre cómo el ángulo, la velocidad y la gravedad pueden cambiar su trayectoria.',

    type: 'motivacion',


    /*
     * IMAGEN DEL MOMENTO 1
     *
     * Archivo:
     * public/assets/tellus-learning/movimiento-parabolico/
     * momento-01-movimiento-parabolico.png
     */

    image:
      '/assets/tellus-learning/movimiento-parabolico/momento-01-movimiento-parabolico.png',


    objectiveIds: [
      'obj-01',
    ],

    activityIds: [
      'act-motivacion-video',
    ],

    estimatedDurationMinutes: 15,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 2 — EXPLORACIÓN
   * ========================================================== */

  {
    id: 'moment-exploracion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 2,

    title:
      'Exploración',

    subtitle:
      'Experimenta libremente',

    description:
      'Explora cómo cambian las trayectorias al modificar diferentes variables.',

    type: 'exploracion',

    /*
     * Se deja sin imagen específica por ahora.
     * Cuando tengamos la ilustración del momento 2,
     * solamente se agrega aquí.
     */

    objectiveIds: [
      'obj-02',
    ],

    activityIds: [
      'act-exploracion-simulador',
    ],

    estimatedDurationMinutes: 20,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 3 — PREDICCIÓN
   * ========================================================== */

  {
    id: 'moment-prediccion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 3,

    title:
      'Predicción',

    subtitle:
      'Formula una hipótesis',

    description:
      'Antes de experimentar, formula una predicción y explica qué esperas que ocurra.',

    type: 'prediccion',

    objectiveIds: [
      'obj-03',
    ],

    activityIds: [
      'act-prediccion-preinforme',
    ],

    estimatedDurationMinutes: 20,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 4 — EXPERIMENTACIÓN
   * ========================================================== */

  {
    id: 'moment-experimentacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 4,

    title:
      'Experimentación',

    subtitle:
      'Pon a prueba tus ideas',

    description:
      'Realiza experimentos físicos y utiliza herramientas digitales para contrastar tus predicciones.',

    type: 'experimentacion',

    objectiveIds: [
      'obj-04',
    ],

    activityIds: [
      'act-experimentacion-laboratorio',
      'act-experimentacion-road-to-glory',
    ],

    estimatedDurationMinutes: 45,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 5 — CONSTRUCCIÓN
   * ========================================================== */

  {
    id: 'moment-construccion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 5,

    title:
      'Construcción',

    subtitle:
      'Construye el modelo',

    description:
      'Organiza tus ideas y construye una explicación del movimiento observado.',

    type: 'construccion',

    objectiveIds: [
      'obj-05',
    ],

    activityIds: [
      'act-construccion-modelo',
    ],

    estimatedDurationMinutes: 25,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 6 — ANÁLISIS Y EVALUACIÓN
   * ========================================================== */

  {
    id: 'moment-analisis-evaluacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 6,

    title:
      'Análisis y evaluación',

    subtitle:
      'Compara y comprende',

    description:
      'Analiza los datos obtenidos, compara tus resultados y evalúa tus explicaciones.',

    type: 'analisis_evaluacion',

    objectiveIds: [
      'obj-06',
    ],

    activityIds: [
      'act-analisis-datos',
    ],

    estimatedDurationMinutes: 30,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * MOMENTO 7 — REFLEXIÓN
   * ========================================================== */

  {
    id: 'moment-reflexion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 7,

    title:
      'Reflexión',

    subtitle:
      'Cierra el ciclo',

    description:
      'Reflexiona sobre lo aprendido, contrasta tus ideas iniciales y conecta el conocimiento con nuevas situaciones.',

    type: 'reflexion',

    objectiveIds: [
      'obj-07',
    ],

    activityIds: [
      'act-reflexion-final',
    ],

    estimatedDurationMinutes: 25,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },

];


/* ============================================================
 * ACTIVIDADES
 * ============================================================ */

export const MOVIMIENTO_PARABOLICO_ACTIVITIES: Activity[] = [

  /* ==========================================================
   * 1. MOTIVACIÓN
   * ========================================================== */

  {
    id: 'act-motivacion-video',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-motivacion',

    order: 1,

    title:
      'Observa el fenómeno',

    description:
      'Observa el recurso inicial y responde qué crees que determina la trayectoria de un objeto lanzado al aire.',

    type: 'questionnaire',

    objectiveIds: [
      'obj-01',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'questionnaire',

      data: {

        questions: [

          {
            id: 'q-motivacion-01',

            type: 'long_answer',

            text:
              '¿Qué factores crees que determinan la trayectoria de un objeto lanzado al aire?',

            points: 0,

            hint:
              'Piensa en la velocidad, el ángulo, la gravedad y otras variables que puedan influir.',
          },

        ],

      },

    },

    estimatedDurationMinutes: 15,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 2. EXPLORACIÓN
   * ========================================================== */

  {
    id: 'act-exploracion-simulador',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-exploracion',

    order: 1,

    title:
      'Explora la trayectoria',

    description:
      'Experimenta libremente con las variables del movimiento y observa cómo cambia la trayectoria.',

    type: 'simulation',

    objectiveIds: [
      'obj-02',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: false,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: true,

      simulatorId:
        'exploracion-movimiento-parabolico',

      settings: {

        allowFreeExploration: true,

      },

    },

    content: {

      type: 'simulation',

      data: {

        simulatorId:
          'exploracion-movimiento-parabolico',

        instructions:
          'Modifica el ángulo y la velocidad inicial. Observa cómo cambia la trayectoria, el alcance y la altura máxima.',

        config: {

          allowAngleChange: true,

          allowVelocityChange: true,

          showTrajectory: true,

          showDistance: true,

          showTime: true,

          showMaxHeight: true,

        },

      },

    },

    estimatedDurationMinutes: 20,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 3. PREDICCIÓN
   * ========================================================== */

  {
    id: 'act-prediccion-preinforme',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-prediccion',

    order: 1,

    title:
      'Formula tu predicción',

    description:
      'Antes de realizar el experimento, registra qué crees que ocurrirá.',

    type: 'preinforme',

    objectiveIds: [
      'obj-03',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: false,

    },

    content: {

      type: 'preinforme',

      data: {

        instructions:
          'Formula una hipótesis y realiza una predicción sobre el comportamiento del proyectil.',

        fields: [

          {
            id: 'hypothesis',

            label: 'Hipótesis',

            type: 'text',

            placeholder:
              'Escribe qué crees que ocurrirá y por qué.',

            required: true,

            hint:
              'Relaciona tus ideas con las variables del movimiento.',
          },

          {
            id: 'predictedDistance',

            label: 'Distancia prevista',

            type: 'number',

            unit: 'm',

            required: true,

            hint:
              'Escribe la distancia que esperas obtener.',
          },

          {
            id: 'predictedTime',

            label: 'Tiempo previsto',

            type: 'number',

            unit: 's',

            required: true,

            hint:
              'Escribe el tiempo de vuelo que esperas obtener.',
          },

          {
            id: 'factors',

            label: 'Factores que podrían influir',

            type: 'text',

            placeholder:
              'Ejemplo: ángulo, velocidad inicial, gravedad...',

            required: true,
          },

        ],

      },

    },

    estimatedDurationMinutes: 20,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 4. LABORATORIO FÍSICO
   * ========================================================== */

  {
    id: 'act-experimentacion-laboratorio',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-experimentacion',

    order: 1,

    title:
      'Laboratorio físico',

    description:
      'Realiza los ensayos, registra los datos y observa el comportamiento real del proyectil.',

    type: 'lab_physical',

    objectiveIds: [
      'obj-04',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'lab_physical',

      data: {

        instructions:
          'Realiza varios lanzamientos manteniendo controladas las condiciones del experimento. Registra cuidadosamente cada ensayo.',

        trialsConfig: {

          minTrials: 3,

          maxTrials: 5,

          defaultTrials: 3,

        },

        fields: [

          {
            id: 'ball',

            label: 'Objeto utilizado',

            type: 'text',

            required: true,

            hint:
              'Identifica el objeto utilizado en el lanzamiento.',
          },

          {
            id: 'distance',

            label: 'Distancia',

            type: 'number',

            unit: 'm',

            required: true,
          },

          {
            id: 'time',

            label: 'Tiempo',

            type: 'number',

            unit: 's',

            required: true,
          },

          {
            id: 'angle',

            label: 'Ángulo',

            type: 'number',

            unit: '°',

            required: true,
          },

          {
            id: 'observations',

            label: 'Observaciones',

            type: 'text_observation',

            required: false,

            hint:
              'Registra cualquier situación relevante durante el ensayo.',
          },

        ],

      },

    },

    estimatedDurationMinutes: 30,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 5. ROAD TO GLORY
   * ========================================================== */

  {
    id: 'act-experimentacion-road-to-glory',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-experimentacion',

    order: 2,

    title:
      'Road to Glory',

    description:
      'Experimenta virtualmente con el lanzamiento de proyectiles y compara los resultados con el laboratorio físico.',

    type: 'simulation',

    objectiveIds: [
      'obj-02',
      'obj-04',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: false,

      requiredForCompletion: false,

      graded: false,

      allowsMultipleAttempts: true,

      simulatorId:
        'road-to-glory',

      settings: {

        allowFreeExploration: true,

        saveResults: true,

        compareWithPhysicalLab: true,

      },

    },

    content: {

      type: 'simulation',

      data: {

        simulatorId:
          'road-to-glory',

        instructions:
          'Utiliza Road to Glory para experimentar con diferentes condiciones de lanzamiento. Observa los resultados y compáralos con tus datos experimentales.',

        config: {

          showTrajectory: true,

          showDistance: true,

          showTime: true,

          showMaxHeight: true,

          allowAngleChange: true,

          allowVelocityChange: true,

        },

      },

    },

    estimatedDurationMinutes: 15,

    isOptional: true,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 6. CONSTRUCCIÓN
   * ========================================================== */

  {
    id: 'act-construccion-modelo',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-construccion',

    order: 1,

    title:
      'Construye tu modelo',

    description:
      'Explica con tus propias palabras cómo se comporta el movimiento parabólico.',

    type: 'questionnaire',

    objectiveIds: [
      'obj-05',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'questionnaire',

      data: {

        questions: [

          {
            id: 'q-construccion-01',

            type: 'long_answer',

            text:
              'Construye una explicación del movimiento parabólico utilizando lo observado en la exploración y en el laboratorio.',

            points: 0,

            hint:
              'Relaciona el movimiento horizontal y vertical con la trayectoria observada.',
          },

        ],

      },

    },

    estimatedDurationMinutes: 25,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 7. ANÁLISIS Y EVALUACIÓN
   * ========================================================== */

  {
    id: 'act-analisis-datos',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-analisis-evaluacion',

    order: 1,

    title:
      'Analiza tus resultados',

    description:
      'Compara tus datos experimentales con tus predicciones y con los resultados de la simulación.',

    type: 'data_analysis',

    objectiveIds: [
      'obj-06',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: true,

      maxScore: 100,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'data_analysis',

      data: {

        instructions:
          'Analiza los resultados obtenidos y determina qué tan cercanos fueron a tus predicciones.',

        questions: [

          {
            id: 'q-analisis-01',

            type: 'long_answer',

            text:
              '¿Qué diferencias encuentras entre tus predicciones y los resultados experimentales?',

            points: 25,
          },

          {
            id: 'q-analisis-02',

            type: 'long_answer',

            text:
              '¿Qué relación observaste entre el ángulo de lanzamiento y el alcance horizontal?',

            points: 25,
          },

          {
            id: 'q-analisis-03',

            type: 'long_answer',

            text:
              '¿Qué factores pueden explicar las diferencias entre el experimento físico y la simulación?',

            points: 25,
          },

          {
            id: 'q-analisis-04',

            type: 'long_answer',

            text:
              '¿Qué evidencia respalda actualmente tu explicación del movimiento parabólico?',

            points: 25,
          },

        ],

        dataSources: [

          'act-prediccion-preinforme',

          'act-experimentacion-laboratorio',

          'act-experimentacion-road-to-glory',

        ],

      },

    },

    estimatedDurationMinutes: 30,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  /* ==========================================================
   * 8. REFLEXIÓN
   * ========================================================== */

  {
    id: 'act-reflexion-final',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-reflexion',

    order: 1,

    title:
      'Cierra el ciclo',

    description:
      'Compara lo que pensabas al comienzo con lo que ahora comprendes.',

    type: 'reflection',

    objectiveIds: [
      'obj-07',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'reflection',

      data: {

        instructions:
          'Mira hacia atrás en todo el ciclo de aprendizaje y explica qué cambió en tu forma de comprender el fenómeno.',

        questions: [

          {
            id: 'q-reflexion-01',

            text:
              '¿Qué pensabas inicialmente sobre el movimiento parabólico y qué comprendes ahora?',

            required: true,
          },

          {
            id: 'q-reflexion-02',

            text:
              '¿Qué descubrimiento o resultado cambió más tu explicación?',

            required: true,
          },

          {
            id: 'q-reflexion-03',

            text:
              '¿Qué nueva pregunta te gustaría investigar después de esta experiencia?',

            required: true,
          },

        ],

        minWords: 30,

        maxWords: 300,

      },

    },

    estimatedDurationMinutes: 25,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },

];


/* ============================================================
 * MOCK COMPLETO
 * ============================================================ */

export const MOVIMIENTO_PARABOLICO_MOCK = {

  experience:
    MOVIMIENTO_PARABOLICO_EXPERIENCE,

  moments:
    MOVIMIENTO_PARABOLICO_MOMENTS,

  activities:
    MOVIMIENTO_PARABOLICO_ACTIVITIES,

};