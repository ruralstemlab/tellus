import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Activity } from '../models';

import { ActivityService } from '../services/activity.service';

import {
  getActivityById,
} from '../data/experience-registry';

import {
  AguaResource,
  getAguaResourceById,
} from '../data/resources/agua-territorio.resources';


// ============================================================
// TELLUS LEARNING
// ACTIVITY COMPONENT
//
// La actividad muestra directamente su recurso principal.
//
// Flujo:
//
// URL
//   ↓
// ActivityComponent
//   ↓
// experienceId + activityId
//   ↓
// EXPERIENCE_REGISTRY
//   ↓
// Activity
//   ↓
// resourceIds
//   ↓
// Recurso
//   ↓
// Imagen / Infografía / Video / Mapa / Simulación
//
// La actividad ya no depende de una experiencia específica
// para localizarse.
//
// ============================================================

@Component({
  selector: 'app-activity',

  standalone: true,

  imports: [
    CommonModule,
  ],

  templateUrl: './activity.html',

  styleUrls: [
    './activity.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent
  implements OnInit {

  // ==========================================================
  // SERVICIOS
  // ==========================================================

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly activityService =
    inject(ActivityService);


  // ==========================================================
  // ESTADO
  // ==========================================================

  readonly loading =
    signal(true);

  readonly error =
    signal('');

  readonly activity =
    signal<Activity | null>(null);

  readonly resources =
    signal<AguaResource[]>([]);

  readonly primaryResource =
    signal<AguaResource | null>(null);

  readonly experienceId =
    signal('');

  readonly activityId =
    signal('');

  readonly response =
    signal('');

  readonly saved =
    signal(false);


  // ==========================================================
  // INICIO
  // ==========================================================

  async ngOnInit(): Promise<void> {

    const experienceId =
      this.route.snapshot.paramMap.get(
        'experienceId',
      ) ?? '';

    const activityId =
      this.route.snapshot.paramMap.get(
        'activityId',
      ) ?? '';


    this.experienceId.set(
      experienceId,
    );

    this.activityId.set(
      activityId,
    );


    console.log(
      '[TELLUS] ActivityComponent iniciado',
    );

    console.log(
      '[TELLUS] Experience ID:',
      experienceId,
    );

    console.log(
      '[TELLUS] Activity ID:',
      activityId,
    );


    if (!experienceId) {

      this.error.set(
        'No se encontró el identificador de la experiencia.',
      );

      this.loading.set(false);

      return;
    }


    if (!activityId) {

      this.error.set(
        'No se encontró el identificador de la actividad.',
      );

      this.loading.set(false);

      return;
    }


    await this.loadActivity(
      experienceId,
      activityId,
    );
  }


  // ==========================================================
  // CARGAR ACTIVIDAD
  // ==========================================================

  private async loadActivity(
    experienceId: string,
    activityId: string,
  ): Promise<void> {

    this.loading.set(true);

    this.error.set('');

    this.resources.set([]);

    this.primaryResource.set(null);


    try {

      // ========================================================
      // 1. REGISTRO CENTRAL DE EXPERIENCIAS
      // ========================================================

      console.log(
        '[TELLUS] Buscando actividad en EXPERIENCE_REGISTRY:',
        activityId,
      );

      const localActivity =
        getActivityById(
          experienceId,
          activityId,
        );


      if (localActivity) {

        console.log(
          '[TELLUS] Actividad encontrada en EXPERIENCE_REGISTRY:',
          localActivity,
        );


        this.activity.set(
          localActivity,
        );


        this.loadResources(
          localActivity,
        );


        this.loading.set(false);

        return;
      }


      // ========================================================
      // 2. FIRESTORE COMO RESPALDO
      // ========================================================

      console.warn(
        '[TELLUS] Actividad no encontrada en EXPERIENCE_REGISTRY:',
        {
          experienceId,
          activityId,
        },
      );


      const firestoreActivity =
        await this.activityService.getById(
          activityId,
        );


      if (!firestoreActivity) {

        this.error.set(
          `No se encontró la actividad "${activityId}".`,
        );

        this.loading.set(false);

        return;
      }


      // ========================================================
      // VALIDACIÓN DE EXPERIENCIA
      //
      // Evita cargar una actividad que pertenezca a otra
      // experiencia cuando venga desde Firestore.
      // ========================================================

      if (
        firestoreActivity.experienceId
        &&
        firestoreActivity.experienceId
          !== experienceId
      ) {

        console.warn(
          '[TELLUS] La actividad pertenece a otra experiencia:',
          firestoreActivity,
        );


        this.error.set(
          'La actividad no pertenece a esta experiencia.',
        );

        this.loading.set(false);

        return;
      }


      console.log(
        '[TELLUS] Actividad encontrada en Firestore:',
        firestoreActivity,
      );


      this.activity.set(
        firestoreActivity,
      );


      this.loadResources(
        firestoreActivity,
      );


      this.loading.set(false);

    } catch (error) {

      console.error(
        '[TELLUS] Error cargando actividad:',
        error,
      );


      this.error.set(
        'No fue posible cargar esta actividad.',
      );


      this.loading.set(false);
    }
  }


  // ==========================================================
  // CARGAR RECURSOS
  //
  // NOTA:
  // Esta parte todavía conserva el resolvedor de Agua.
  //
  // Es intencional.
  //
  // Primero estamos comprobando que el motor de actividades
  // funcione independientemente de Agua.
  //
  // El siguiente paso será reemplazar esta dependencia por
  // un resolver genérico de recursos.
  // ==========================================================

  private loadResources(
    activity: Activity,
  ): void {

    const resourceIds =
      activity.resourceIds ?? [];


    console.log(
      '[TELLUS] Resource IDs:',
      resourceIds,
    );


    if (
      resourceIds.length === 0
    ) {

      console.log(
        '[TELLUS] La actividad no tiene recursos asociados.',
      );

      this.resources.set([]);

      this.primaryResource.set(null);

      return;
    }


    const loadedResources =
      resourceIds
        .map(
          resourceId => {

            const resource =
              getAguaResourceById(
                resourceId,
              );


            if (!resource) {

              console.warn(
                '[TELLUS] Recurso no encontrado:',
                resourceId,
              );

              return null;
            }


            console.log(
              '[TELLUS] Recurso encontrado:',
              resource,
            );


            return resource;
          },
        )
        .filter(
          (
            resource,
          ): resource is AguaResource =>
            resource !== null,
        )
        .filter(
          resource =>
            resource.published !== false,
        );


    this.resources.set(
      loadedResources,
    );


    // ========================================================
    // RECURSO PRINCIPAL
    //
    // El primero de la lista es el recurso protagonista.
    // ========================================================

    const mainResource =
      loadedResources[0] ?? null;


    this.primaryResource.set(
      mainResource,
    );


    console.log(
      '[TELLUS] Recursos cargados:',
      loadedResources,
    );


    console.log(
      '[TELLUS] Total recursos:',
      loadedResources.length,
    );


    console.log(
      '[TELLUS] Recurso principal:',
      mainResource,
    );
  }


  // ==========================================================
  // CAMBIO DE RESPUESTA
  // ==========================================================

  onResponseChange(
    event: Event,
  ): void {

    const textarea =
      event.target as HTMLTextAreaElement;


    this.response.set(
      textarea.value,
    );


    this.saved.set(false);
  }


  // ==========================================================
  // GUARDAR BORRADOR
  // ==========================================================

  saveDraft(): void {

    this.saved.set(true);

    console.log(
      '[TELLUS] Borrador guardado:',
      this.response(),
    );
  }


  // ==========================================================
  // CONTINUAR
  // ==========================================================

  continue(): void {

    console.log(
      '[TELLUS] Continuar actividad:',
      this.activityId(),
    );


    this.saveDraft();
  }


  // ==========================================================
  // VOLVER AL MOMENTO
  // ==========================================================

  backToMoment(): void {

    this.router.navigate([
      '/experiencia',
      this.experienceId(),
      'momento',
      this.activity()?.momentId ?? '',
    ]);
  }


  // ==========================================================
  // TIPOS DE RECURSO
  // ==========================================================

  isImage(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'image'
    );
  }


  isInfographic(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'infographic'
    );
  }


  isVideo(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'video'
    );
  }


  isMap(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'map'
    );
  }


  isSimulation(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'simulation'
    );
  }


  isLink(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'link'
    );
  }


  // ==========================================================
  // RECURSO VISUAL
  // ==========================================================

  hasResource(): boolean {

    return (
      this.primaryResource() !== null
    );
  }


  // ==========================================================
  // URL SEGURA DEL RECURSO
  // ==========================================================

  getResourceUrl(
    resource: AguaResource,
  ): string {

    return resource.url ?? '';
  }


  // ==========================================================
  // TÍTULO DE ACTIVIDAD
  // ==========================================================

  getActivityTitle(): string {

    return (
      this.activity()?.title ??
      'Actividad Tellus'
    );
  }


  // ==========================================================
  // DESCRIPCIÓN
  // ==========================================================

  getActivityDescription(): string {

    return (
      this.activity()?.description ??
      ''
    );
  }


  // ==========================================================
  // DURACIÓN
  // ==========================================================

  getDuration(): number {

    return (
      this.activity()?.estimatedDurationMinutes ??
      10
    );
  }


  // ==========================================================
  // TIPO VISIBLE
  // ==========================================================

  getResourceTypeLabel(
    resource: AguaResource,
  ): string {

    switch (resource.type) {

      case 'infographic':
        return 'INFOGRAFÍA';

      case 'image':
        return 'IMAGEN';

      case 'video':
        return 'VIDEO';

      case 'map':
        return 'MAPA';

      case 'data':
        return 'DATOS';

      case 'document':
        return 'DOCUMENTO';

      case 'simulation':
        return 'SIMULADOR';

      case 'worked-example':
        return 'EJEMPLO';

      case 'link':
        return 'RECURSO EXTERNO';

      default:
        return 'RECURSO';
    }
  }
}