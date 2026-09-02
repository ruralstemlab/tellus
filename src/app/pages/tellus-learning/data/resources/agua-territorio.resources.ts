// ============================================================
// TELLUS LEARNING
// RECURSOS â€” AGUA EN NUESTRO TERRITORIO
// ============================================================
//
// CatÃ¡logo central de recursos utilizados por la experiencia
// "Agua en nuestro territorio".
//
// IMPORTANTE:
// Este archivo NO contiene actividades.
// Los recursos son reutilizables por diferentes actividades.
//
// Esto permitirÃ¡ posteriormente:
// - cambiar una imagen sin modificar la actividad
// - reemplazar un video
// - incorporar recursos del IDEAM
// - agregar infografÃ­as
// - incorporar mapas
// - trabajar offline
// - migrar posteriormente a Firestore
// ============================================================


// ============================================================
// TIPO BASE
// ============================================================

export type AguaResourceType =
  | 'image'
  | 'infographic'
  | 'video'
  | 'map'
  | 'data'
  | 'document'
  | 'worked-example'
  | 'link'
  | 'simulation';


// ============================================================
// INTERFAZ DE RECURSO
// ============================================================

export interface AguaResource {

  /**
   * Identificador Ãºnico del recurso.
   */
  id: string;

  /**
   * Experiencia a la que pertenece.
   */
  experienceId: string;

  /**
   * Tipo de recurso.
   */
  type: AguaResourceType;

  /**
   * TÃ­tulo visible para el estudiante.
   */
  title: string;

  /**
   * DescripciÃ³n breve.
   */
  description?: string;

  /**
   * Ruta local o URL externa.
   */
  url?: string;

  /**
   * Imagen representativa.
   */
  thumbnailUrl?: string;

  /**
   * Fuente del recurso.
   *
   * Ejemplo:
   * IDEAM
   * UNGRD
   * AlcaldÃ­a de VÃ©lez
   */
  source?: string;

  /**
   * URL de la fuente original.
   */
  sourceUrl?: string;

  /**
   * CrÃ©dito de imagen o material.
   */
  credit?: string;

  /**
   * Disponible sin conexiÃ³n.
   */
  offlineAvailable?: boolean;

  /**
   * Publicado.
   */
  published?: boolean;

  /**
   * Orden sugerido.
   */
  order?: number;

  /**
   * Metadatos adicionales.
   */
  metadata?: Record<string, unknown>;
}


// ============================================================
// IDENTIFICADOR DE EXPERIENCIA
// ============================================================

export const AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID =
  'agua-territorio';


// ============================================================
// RECURSOS â€” MOMENTO 1
// MOTIVACIÃ“N
// ============================================================

export const AGUA_MOTIVACION_RESOURCES: AguaResource[] = [

  // ----------------------------------------------------------
  // 01 â€” FOTOGRAFÃA DEL PROBLEMA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-foto-velez',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'image',

    title:
      'Cuando el agua comienza a faltar',

    description:
      'Observa una situaciÃ³n real relacionada con el abastecimiento de agua en VÃ©lez, Santander.',

    // TODAVÃA NO PONEMOS LA FOTO REAL.
    url:
      '/assets/tellus/experiences/agua-territorio/motivacion/foto-velez.webp',

    source:
      'Pendiente de selecciÃ³n',

    offlineAvailable: true,

    published: false,

    order: 1,
  },


  // ----------------------------------------------------------
  // 02 â€” VIDEO EL NIÃ‘O
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-video-el-nino',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'video',

    title:
      'Â¿QuÃ© es el fenÃ³meno de El NiÃ±o?',

    description:
      'Conoce cÃ³mo las condiciones del ocÃ©ano PacÃ­fico pueden relacionarse con cambios en el comportamiento climÃ¡tico de Colombia.',

    url:
      '/assets/tellus/experiences/agua-territorio/motivacion/video-el-nino.mp4',

    source:
      'Pendiente de selecciÃ³n',

    offlineAvailable: true,

    published: false,

    order: 2,

    metadata: {
      durationSeconds: 180,
      topic: 'FenÃ³meno de El NiÃ±o',
    },
  },


  // ----------------------------------------------------------
  // 03 â€” DATOS IDEAM
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-datos-ideam',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'data',

    title:
      'Â¿QuÃ© nos dicen los datos del clima?',

    description:
      'Datos climÃ¡ticos utilizados para analizar el comportamiento de la precipitaciÃ³n y las condiciones relacionadas con la disponibilidad de agua.',

    source:
      'IDEAM',

    sourceUrl:
      'https://www.ideam.gov.co/',

    offlineAvailable: true,

    published: false,

    order: 3,

    metadata: {
      institution:
        'Instituto de HidrologÃ­a, MeteorologÃ­a y Estudios Ambientales',

      dataType:
        'precipitacion',

      geographicContext:
        'Santander / VÃ©lez',

      status:
        'pendiente de selecciÃ³n de datos oficiales',
    },
  },


  // ----------------------------------------------------------
  // 04 â€” MAPA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-mapa-territorio',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'map',

    title:
      'Nuestro territorio',

    description:
      'Ubica VÃ©lez dentro del contexto geogrÃ¡fico de Santander y relaciona el territorio con las condiciones del agua.',

    source:
      'IDEAM / fuentes cartogrÃ¡ficas oficiales',

    offlineAvailable: true,

    published: false,

    order: 4,

    metadata: {
      geographicLevel:
        'municipio / departamento',

      location:
        'VÃ©lez, Santander, Colombia',
    },
  },


  // ----------------------------------------------------------
  // 05 â€” CONTEXTO LOCAL
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-contexto-velez',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'document',

    title:
      'El problema del agua en VÃ©lez',

    description:
      'Contexto sobre situaciones de abastecimiento, disponibilidad y gestiÃ³n del agua en el territorio.',

    source:
      'Fuentes oficiales y documentaciÃ³n territorial',

    offlineAvailable: true,

    published: false,

    order: 5,

    metadata: {
      geographicContext:
        'VÃ©lez, Santander',

      requiresCitation:
        true,
    },
  },


  // ----------------------------------------------------------
  // 06 â€” INFOGRAFÃA SISTÃ‰MICA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-infografia-sistema',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'infographic',

    title:
      'El agua es un sistema',

    description:
      'Visualiza las relaciones entre clima, fuentes hÃ­dricas, almacenamiento, infraestructura, distribuciÃ³n, consumo y comunidad.',

    url:
      '/assets/tellus-learning/agua/infografia-sistema-agua.png',

    source:
      'Rural STEAM Lab',

    credit:
      'DiseÃ±o educativo Rural STEAM Lab',

    offlineAvailable: true,

    published: true,

    order: 6,

    metadata: {
      pedagogicalPurpose:
        'pensamiento sistemico',

      target:
        '8.Âº a 11.Âº',
    },
  },


  // ----------------------------------------------------------
  // 07 â€” RETO INICIAL
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-reto-inicial',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'worked-example',

    title:
      'Â¿Por quÃ© puede faltar el agua?',

    description:
      'Una situaciÃ³n inicial para formular hipÃ³tesis antes de estudiar las variables cientÃ­ficas del sistema.',

    source:
      'Rural STEAM Lab',

    offlineAvailable: true,

    published: true,

    order: 7,

    metadata: {
      pedagogicalPurpose:
        'formulacion de hipotesis',
    },
  },

];


// ============================================================
// REGISTRO DE RECURSOS
// ============================================================

export const AGUA_TERRITORIO_RESOURCES = {

  motivacion:
    AGUA_MOTIVACION_RESOURCES,

} as const;


// ============================================================
// OBTENER UN RECURSO
// ============================================================

export function getAguaResourceById(
  resourceId: string,
): AguaResource | null {

  return (
    AGUA_MOTIVACION_RESOURCES.find(
      resource =>
        resource.id === resourceId
    )
    ?? null
  );

}


// ============================================================
// OBTENER TODOS LOS RECURSOS
// ============================================================

export function getAllAguaResources(): AguaResource[] {

  return [
    ...AGUA_MOTIVACION_RESOURCES,
  ];

}
