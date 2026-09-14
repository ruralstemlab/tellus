import {
  Activity,
  Experience,
  Moment,
} from '../models';


// ============================================================
// EXPERIENCIA
// ============================================================

export const MOVIMIENTO_PARABOLICO_EXPERIENCE: Experience = {

  id: 'exp-movimiento-parabolico',

  title: 'Movimiento Parabólico',

  subtitle:
    'Investiga, experimenta y comprende el movimiento de los objetos en el aire.',

  description:
    'Experiencia de aprendizaje para comprender el movimiento parabólico mediante observación, exploración, predicción, experimentación, construcción, análisis y reflexión.',

  subject: 'Física',

  gradeLevel: '10° y 11°',

  curriculumArea: 'Mecánica',

  purpose:
    'Comprender el movimiento parabólico mediante la relación entre velocidad inicial, ángulo, gravedad, tiempo, altura y alcance.',

  challenge:
    '¿Puedes explicar y predecir la trayectoria de un objeto lanzado al aire?',

  learningObjectives: [

    {
      id: 'obj-01',
      description:
        'Reconocer las características principales del movimiento parabólico.',
    },

    {
      id: 'obj-02',
      description:
        'Explorar la relación entre velocidad inicial, ángulo y trayectoria.',
    },

    {
      id: 'obj-03',
      description:
        'Formular predicciones e hipótesis sobre el movimiento de un proyectil.',
    },

    {
      id: 'obj-04',
      description:
        'Obtener y registrar datos mediante experimentación y simulación.',
    },

    {
      id: 'obj-05',
      description:
        'Construir un modelo explicativo del movimiento parabólico.',
    },

    {
      id: 'obj-06',
      description:
        'Analizar y comparar resultados experimentales y teóricos.',
    },

    {
      id: 'obj-07',
      description:
        'Reflexionar sobre el aprendizaje y formular nuevas preguntas.',
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


// ============================================================
// MOMENTOS
// ============================================================

export const MOVIMIENTO_PARABOLICO_MOMENTS: Moment[] = [

  // ==========================================================
  // MOMENTO 1 — MOTIVACIÓN
  // ==========================================================

  {
    id: 'moment-motivacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 1,

    title: 'Motivación',

    subtitle: 'Despierta tu curiosidad',

    description:
      'Observa el fenómeno y conecta el movimiento parabólico con situaciones de la vida cotidiana.',

    type: 'motivacion',

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


  // ==========================================================
  // MOMENTO 2 — EXPLORACIÓN
  // ==========================================================

  {
    id: 'moment-exploracion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 2,

    title: 'Exploración',

    subtitle: 'Experimenta libremente',

    description:
      'Explora cómo cambia una trayectoria cuando modificas diferentes variables.',

    type: 'exploracion',

    image:
      '/assets/tellus-learning/movimiento-parabolico/momento-02-movimiento-parabolico.png',

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


  // ==========================================================
  // MOMENTO 3 — PREDICCIÓN
  // ==========================================================

  {
    id: 'moment-prediccion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 3,

    title: 'Predicción',

    subtitle: 'Formula una hipótesis',

    description:
      'Antes de realizar el experimento, formula una hipótesis y predice qué ocurrirá.',

    type: 'prediccion',

    image:
      '/assets/tellus-learning/movimiento-parabolico/momento-03-movimiento-parabolico.png',

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


  // ==========================================================
  // MOMENTO 4 — EXPERIMENTACIÓN
  // ==========================================================

  {
    id: 'moment-experimentacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 4,

    title: 'Experimentación',

    subtitle: 'Pon a prueba tus ideas',

    description:
      'Realiza el laboratorio y utiliza Road to Glory para contrastar tus predicciones.',

    type: 'experimentacion',

    image:
      '/assets/tellus-learning/movimiento-parabolico/momento-04-movimiento-parabolico.png',

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


  // ==========================================================
  // MOMENTO 5 — CONSTRUCCIÓN
  // ==========================================================

  {
    id: 'moment-construccion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 5,

    title: 'Construcción',

    subtitle: 'Construye el modelo',

    description:
      'Analiza un ejemplo resuelto y posteriormente enfrenta nuevos problemas contextualizados para aplicar el modelo del movimiento parabólico.',

    type: 'construccion',

    image:
      '/assets/tellus-learning/movimiento-parabolico/momento-05-movimiento-parabolico.png',

    objectiveIds: [
      'obj-05',
    ],

    activityIds: [
      'act-construccion-ejemplo-resuelto',
      'act-construccion-desafio',
    ],

    estimatedDurationMinutes: 35,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },


  // ==========================================================
  // MOMENTO 6 — ANÁLISIS Y EVALUACIÓN
  // ==========================================================

  {
    id: 'moment-analisis-evaluacion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 6,

    title: 'Análisis y evaluación',

    subtitle: 'Compara y comprende',

    description:
      'Compara tus predicciones con los resultados obtenidos y analiza las diferencias.',

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


  // ==========================================================
  // MOMENTO 7 — REFLEXIÓN
  // ==========================================================

  {
    id: 'moment-reflexion',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    order: 7,

    title: 'Reflexión',

    subtitle: 'Cierra el ciclo',

    description:
      'Reflexiona sobre lo aprendido y relaciona el conocimiento construido con nuevas situaciones.',

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


// ============================================================
// ACTIVIDADES
// ============================================================

export const MOVIMIENTO_PARABOLICO_ACTIVITIES: Activity[] = [

  // ==========================================================
  // 1. MOTIVACIÓN
  // ==========================================================

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
      'Observa el fenómeno del movimiento parabólico y responde las preguntas iniciales.',

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
              'Piensa en la velocidad, el ángulo y la gravedad.',

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


  // ==========================================================
  // 2. EXPLORACIÓN
  // ==========================================================

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
      'Experimenta con las variables del movimiento parabólico y observa cómo cambia la trayectoria.',

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

        allowAngleChange: true,

        allowVelocityChange: true,

        showTrajectory: true,

        showDistance: true,

        showTime: true,

        showMaxHeight: true,

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


  // ==========================================================
  // 3. PREDICCIÓN
  // ==========================================================

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
      'Registra tu hipótesis antes de realizar el experimento.',

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

            label:
              'Hipótesis',

            type:
              'text',

            placeholder:
              'Escribe qué crees que ocurrirá y por qué.',

            required:
              true,

          },

          {
            id: 'predictedDistance',

            label:
              'Distancia prevista',

            type:
              'number',

            unit:
              'm',

            required:
              true,

          },

          {
            id: 'predictedTime',

            label:
              'Tiempo previsto',

            type:
              'number',

            unit:
              's',

            required:
              true,

          },

          {
            id: 'factors',

            label:
              'Factores que podrían influir',

            type:
              'text',

            placeholder:
              'Ejemplo: ángulo, velocidad inicial, gravedad...',

            required:
              true,

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


  // ==========================================================
  // 4. EXPERIMENTACIÓN — LABORATORIO
  // ==========================================================

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
          'Realiza varios lanzamientos y registra cuidadosamente los datos de cada ensayo.',

        trialsConfig: {

          minTrials: 3,

          maxTrials: 5,

          defaultTrials: 3,

        },

        fields: [

          {
            id: 'object',

            label:
              'Objeto utilizado',

            type:
              'text',

            required:
              true,

          },

          {
            id: 'distance',

            label:
              'Distancia',

            type:
              'number',

            unit:
              'm',

            required:
              true,

          },

          {
            id: 'time',

            label:
              'Tiempo',

            type:
              'number',

            unit:
              's',

            required:
              true,

          },

          {
            id: 'angle',

            label:
              'Ángulo',

            type:
              'number',

            unit:
              '°',

            required:
              true,

          },

          {
            id: 'observations',

            label:
              'Observaciones',

            type:
              'text_observation',

            required:
              false,

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


  // ==========================================================
  // 5. EXPERIMENTACIÓN — ROAD TO GLORY
  // ==========================================================

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
      'Experimenta virtualmente con diferentes condiciones de lanzamiento.',

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

      },

    },

    content: {

      type: 'simulation',

      data: {

        simulatorId:
          'road-to-glory',

        instructions:
          'Utiliza Road to Glory para experimentar con diferentes condiciones de lanzamiento y compara los resultados con el laboratorio físico.',

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


  // ==========================================================
  // 6. CONSTRUCCIÓN — EJEMPLO RESUELTO
  // ==========================================================

  {
    id: 'act-construccion-ejemplo-resuelto',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-construccion',

    order: 1,

    title:
      'Ejemplo resuelto: el cohete de agua',

    description:
      'Observa y analiza paso a paso la solución de un problema de movimiento parabólico.',

    type: 'questionnaire',

    objectiveIds: [
      'obj-05',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: false,

      requiredForCompletion: true,

      graded: false,

      allowsMultipleAttempts: false,

      settings: {

        activityKind:
          'worked_example',

        imageUrl:
          '/assets/tellus-learning/movimiento-parabolico/momento-05-movimiento-parabolico-ejercicios-resuelto-2.png',

        imageAlt:
          'Ejemplo resuelto del cohete de agua.',

      },

    },

    content: {

      type: 'questionnaire',

      data: {

        questions: [

          {
            id: 'q-construccion-ejemplo-01',

            type: 'short_answer',

            text:
              '¿Cuál es la velocidad inicial utilizada en el ejemplo del cohete de agua?',

            points: 0,

          },

          {
            id: 'q-construccion-ejemplo-02',

            type: 'short_answer',

            text:
              '¿Qué magnitudes se calculan en el ejemplo?',

            points: 0,

          },

          {
            id: 'q-construccion-ejemplo-03',

            type: 'long_answer',

            text:
              'Explica con tus palabras cómo se relacionan el tiempo de vuelo, la altura máxima y el alcance horizontal.',

            points: 0,

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


  // ==========================================================
  // 7. CONSTRUCCIÓN — DESAFÍO
  // ==========================================================

  {
    id: 'act-construccion-desafio',

    experienceId:
      MOVIMIENTO_PARABOLICO_EXPERIENCE.id,

    momentId:
      'moment-construccion',

    order: 2,

    title:
      'Tu turno de resolver: desafío',

    description:
      'Resuelve cinco situaciones contextualizadas aplicando el modelo del movimiento parabólico.',

    type: 'questionnaire',

    objectiveIds: [
      'obj-05',
      'obj-06',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: true,

      autoEvaluate: true,

      maxScore: 100,

      allowsMultipleAttempts: true,

      maxAttempts: 5,

      settings: {

        activityKind:
          'contextual_challenge',

        imageUrl:
          '/assets/tellus-learning/movimiento-parabolico/momento-05-movimiento-parabolico-ejericicos-propuestos.png',

        imageAlt:
          'Desafío de cinco problemas de movimiento parabólico.',

        totalProblems: 5,

      },

    },

    content: {

      type: 'questionnaire',

      data: {

        questions: [

          {
            id: 'q-desafio-01',

            type: 'multiple_choice',

            text:
              'Béisbol: un jugador golpea una pelota con una velocidad inicial de 25 m/s formando un ángulo de 40° con la horizontal. ¿Cuál es aproximadamente la altura máxima que alcanza la pelota?',

            options: [
              '13,2 m',
              '16,4 m',
              '20,1 m',
              '25,6 m',
            ],

            correctIndex: 0,

            points: 20,

            feedback: {

              correct:
                'Correcto. La altura máxima se obtiene con h = (v₀·senθ)² / 2g ≈ (25·sen40°)² / 19,6 ≈ 13,2 m.',

              incorrect:
                'Todavía no. Recuerda usar únicamente la componente vertical de la velocidad: h = (v₀·senθ)² / 2g.',

            },

          },

          {
            id: 'q-desafio-02',

            type: 'multiple_choice',

            text:
              'Baloncesto: un jugador lanza el balón desde una altura de 2,0 m con una velocidad de 8 m/s y un ángulo de 50°. La canasta está a 4,5 m de distancia horizontal y tiene una altura de 3,05 m. ¿El balón pasa por la canasta según el modelo ideal?',

            options: [
              'Sí, pasa por la canasta.',
              'No, pasa por encima.',
              'No, pasa por debajo.',
              'No se puede determinar con la información dada.',
            ],

            correctIndex: 1,

            points: 20,

            feedback: {

              correct:
                'Correcto. Al calcular la altura del balón cuando x = 4,5 m se obtiene aproximadamente 3,61 m, que es mayor que la altura de la canasta (3,05 m). Por eso pasa por encima.',

              incorrect:
                'Todavía no. Calcula primero el tiempo cuando x = 4,5 m con la componente horizontal y luego evalúa la altura con la componente vertical.',

            },

          },

          {
            id: 'q-desafio-03',

            type: 'multiple_choice',

            text:
              'Fútbol: un jugador realiza un pase con velocidad inicial de 18 m/s y un ángulo de 35°. ¿Cuál es aproximadamente el alcance horizontal del balón si se lanza y cae al mismo nivel?',

            options: [
              '22,5 m',
              '31,7 m',
              '38,6 m',
              '46,2 m',
            ],

            correctIndex: 1,

            points: 20,

            feedback: {

              correct:
                'Correcto. El alcance horizontal se obtiene con R = v₀²·sen(2θ) / g ≈ 18²·sen70° / 9,8 ≈ 31,1 m ≈ 31,7 m.',

              incorrect:
                'Todavía no. Recuerda que el alcance usa el ángulo doble: R = v₀²·sen(2θ) / g.',

            },

          },

          {
            id: 'q-desafio-04',

            type: 'multiple_choice',

            text:
              'Cohete de agua: se lanza desde el suelo con una velocidad inicial de 22 m/s formando un ángulo de 60°. ¿Cuál es aproximadamente el tiempo total de vuelo?',

            options: [
              '1,94 s',
              '2,83 s',
              '3,88 s',
              '4,50 s',
            ],

            correctIndex: 2,

            points: 20,

            feedback: {

              correct:
                'Correcto. El tiempo de vuelo se obtiene con t = 2·v₀·senθ / g ≈ 2·22·sen60° / 9,8 ≈ 3,88 s.',

              incorrect:
                'Todavía no. El tiempo total de vuelo es el doble del tiempo que tarda en alcanzar la altura máxima: t = 2·v₀·senθ / g.',

            },

          },

          {
            id: 'q-desafio-05',

            type: 'multiple_choice',

            text:
              'Voleibol: un jugador envía el balón con una velocidad inicial de 15 m/s y un ángulo de 30°. La red tiene una altura de 2,43 m y está a 9 m del punto de lanzamiento. ¿El balón logra pasar por encima de la red según el modelo ideal?',

            options: [
              'Sí, pasa por encima.',
              'No, golpea la red.',
              'No, pasa por debajo.',
              'Se necesita mayor velocidad inicial.',
            ],

            correctIndex: 0,

            points: 20,

            feedback: {

              correct:
                'Correcto. Al calcular la altura del balón cuando x = 9 m se obtiene aproximadamente 2,85 m, que es mayor que la altura de la red (2,43 m). Por eso pasa por encima.',

              incorrect:
                'Todavía no. Calcula el tiempo cuando x = 9 m y evalúa la altura del balón en ese instante.',

            },

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


  // ==========================================================
  // 8. ANÁLISIS Y EVALUACIÓN
  // ==========================================================

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
      'Compara tus predicciones, resultados experimentales y resultados de simulación.',

    type: 'data_analysis',

    objectiveIds: [
      'obj-06',
    ],

    resourceIds: [],

    config: {

      requiresSubmission: true,

      requiredForCompletion: true,

      graded: true,

      autoEvaluate: false,

      maxScore: 100,

      allowsMultipleAttempts: true,

      maxAttempts: 2,

    },

    content: {

      type: 'data_analysis',

      data: {

        instructions:
          'Analiza los resultados obtenidos y compara tus predicciones con la evidencia.',

        questions: [

          {
            id:
              'q-analisis-01',

            type:
              'long_answer',

            text:
              '¿Qué diferencias encuentras entre tus predicciones y los resultados experimentales?',

            points:
              25,

          },

          {
            id:
              'q-analisis-02',

            type:
              'long_answer',

            text:
              '¿Qué relación observaste entre el ángulo de lanzamiento y el alcance horizontal?',

            points:
              25,

          },

          {
            id:
              'q-analisis-03',

            type:
              'long_answer',

            text:
              '¿Qué factores pueden explicar las diferencias entre el experimento físico y la simulación?',

            points:
              25,

          },

          {
            id:
              'q-analisis-04',

            type:
              'long_answer',

            text:
              '¿Qué evidencia respalda actualmente tu explicación del movimiento parabólico?',

            points:
              25,

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


  // ==========================================================
  // 9. REFLEXIÓN
  // ==========================================================

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
      'Compara tus ideas iniciales con lo que ahora comprendes.',

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
          'Reflexiona sobre todo el proceso de aprendizaje.',

        questions: [

          {
            id:
              'q-reflexion-01',

            text:
              '¿Qué pensabas inicialmente sobre el movimiento parabólico y qué comprendes ahora?',

            required:
              true,

          },

          {
            id:
              'q-reflexion-02',

            text:
              '¿Qué resultado cambió más tu forma de explicar el fenómeno?',

            required:
              true,

          },

          {
            id:
              'q-reflexion-03',

            text:
              '¿Qué nueva pregunta te gustaría investigar después de esta experiencia?',

            required:
              true,

          },

        ],

        minWords:
          30,

        maxWords:
          300,

      },

    },

    estimatedDurationMinutes: 25,

    isOptional: false,

    published: true,

    createdAt: null,

    updatedAt: null,
  },

];


// ============================================================
// MOCK CENTRAL
// ============================================================

export const MOVIMIENTO_PARABOLICO_MOCK = {

  experience:
    MOVIMIENTO_PARABOLICO_EXPERIENCE,

  moments:
    MOVIMIENTO_PARABOLICO_MOMENTS,

  activities:
    MOVIMIENTO_PARABOLICO_ACTIVITIES,

};