// ============================================================
// TELLUS LEARNING
// RECURSOS — AGUA EN NUESTRO TERRITORIO
// ============================================================
//
// Catálogo central de recursos utilizados por la experiencia
// "Agua en nuestro territorio".
//
// IMPORTANTE:
// Este archivo NO contiene actividades.
// Los recursos son reutilizables por diferentes actividades.
//
// Esto permitirá posteriormente:
// - cambiar una imagen sin modificar la actividad
// - reemplazar un video
// - incorporar recursos del IDEAM
// - agregar infografías
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
   * Identificador único del recurso.
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
   * Título visible para el estudiante.
   */
  title: string;

  /**
   * Descripción breve.
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
   * Alcaldía de Vélez
   */
  source?: string;

  /**
   * URL de la fuente original.
   */
  sourceUrl?: string;

  /**
   * Crédito de imagen o material.
   */
  credit?: string;

  /**
   * Disponible sin conexión.
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
// RECURSOS — MOMENTO 1
// MOTIVACIÓN
// ============================================================

export const AGUA_MOTIVACION_RESOURCES: AguaResource[] = [

  // ----------------------------------------------------------
  // 01 — FOTOGRAFÍA DEL PROBLEMA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-foto-velez',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'image',

    title:
      'Cuando el agua comienza a faltar',

    description:
      'Observa una situación real relacionada con el abastecimiento de agua en Vélez, Santander.',

    // TODAVÍA NO PONEMOS LA FOTO REAL.
    url:
      '/assets/tellus/experiences/agua-territorio/motivacion/foto-velez.webp',

    source:
      'Pendiente de selección',

    offlineAvailable: true,

    published: false,

    order: 1,
  },


  // ----------------------------------------------------------
  // 02 — VIDEO EL NIÑO
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-video-el-nino',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'video',

    title:
      '¿Qué es el fenómeno de El Niño?',

    description:
      'Conoce cómo las condiciones del océano Pacífico pueden relacionarse con cambios en el comportamiento climático de Colombia.',

    url:
      '/assets/tellus/experiences/agua-territorio/motivacion/video-el-nino.mp4',

    source:
      'Pendiente de selección',

    offlineAvailable: true,

    published: false,

    order: 2,

    metadata: {
      durationSeconds: 180,
      topic: 'Fenómeno de El Niño',
    },
  },


  // ----------------------------------------------------------
  // 03 — DATOS IDEAM
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-datos-ideam',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'data',

    title:
      '¿Qué nos dicen los datos del clima?',

    description:
      'Datos climáticos utilizados para analizar el comportamiento de la precipitación y las condiciones relacionadas con la disponibilidad de agua.',

    source:
      'IDEAM',

    sourceUrl:
      'https://www.ideam.gov.co/',

    offlineAvailable: true,

    published: false,

    order: 3,

    metadata: {
      institution:
        'Instituto de Hidrología, Meteorología y Estudios Ambientales',

      dataType:
        'precipitacion',

      geographicContext:
        'Santander / Vélez',

      status:
        'pendiente de selección de datos oficiales',
    },
  },


  // ----------------------------------------------------------
  // 04 — MAPA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-mapa-territorio',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'map',

    title:
      'Nuestro territorio',

    description:
      'Ubica Vélez dentro del contexto geográfico de Santander y relaciona el territorio con las condiciones del agua.',

    source:
      'IDEAM / fuentes cartográficas oficiales',

    offlineAvailable: true,

    published: false,

    order: 4,

    metadata: {
      geographicLevel:
        'municipio / departamento',

      location:
        'Vélez, Santander, Colombia',
    },
  },


  // ----------------------------------------------------------
  // 05 — CONTEXTO LOCAL
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-contexto-velez',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'document',

    title:
      'El problema del agua en Vélez',

    description:
      'Contexto sobre situaciones de abastecimiento, disponibilidad y gestión del agua en el territorio.',

    source:
      'Fuentes oficiales y documentación territorial',

    offlineAvailable: true,

    published: false,

    order: 5,

    metadata: {
      geographicContext:
        'Vélez, Santander',

      requiresCitation:
        true,
    },
  },


  // ----------------------------------------------------------
  // 06 — INFOGRAFÍA SISTÉMICA
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-infografia-sistema',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'infographic',

    title:
      'El agua es un sistema',

    description:
      'Visualiza las relaciones entre clima, fuentes hídricas, almacenamiento, infraestructura, distribución, consumo y comunidad.',

    url:
      '/assets/tellus/experiences/agua-territorio/motivacion/infografia-sistema.webp',

    source:
      'Rural STEAM Lab',

    credit:
      'Diseño educativo Rural STEAM Lab',

    offlineAvailable: true,

    published: true,

    order: 6,

    metadata: {
      pedagogicalPurpose:
        'pensamiento sistemico',

      target:
        '8.º a 11.º',
    },
  },


  // ----------------------------------------------------------
  // 07 — RETO INICIAL
  // ----------------------------------------------------------

  {
    id: 'agua-recurso-reto-inicial',

    experienceId:
      AGUA_TERRITORIO_RESOURCE_EXPERIENCE_ID,

    type: 'worked-example',

    title:
      '¿Por qué puede faltar el agua?',

    description:
      'Una situación inicial para formular hipótesis antes de estudiar las variables científicas del sistema.',

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