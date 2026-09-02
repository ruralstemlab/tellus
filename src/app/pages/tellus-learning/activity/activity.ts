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
  AGUA_TERRITORIO_ACTIVITIES,
} from '../data/agua-territorio.mock';

import {
  AguaResource,
  getAguaResourceById,
} from '../data/resources/agua-territorio.resources';


// ============================================================
// TELLUS LEARNING
// VISOR DE ACTIVIDADES
// ============================================================
//
// Flujo:
//
// URL
//   ↓
// ActivityComponent
//   ↓
// MOCK LOCAL
//   ↓
// Activity
//   ↓
// resourceIds
//   ↓
// Recursos Agua-Territorio
//
// Firestore queda como respaldo únicamente si la actividad
// no existe en el catálogo local.
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

  readonly experienceId =
    signal('');

  readonly activityId =
    signal('');


  // ==========================================================
  // CICLO DE VIDA
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
      '[TELLUS] 🚀 ActivityComponent iniciado',
    );

    console.log(
      '[TELLUS] Experience ID:',
      experienceId,
    );

    console.log(
      '[TELLUS] Activity ID:',
      activityId,
    );


    if (!activityId) {

      this.error.set(
        'No se encontró el identificador de la actividad.',
      );

      this.loading.set(false);

      return;
    }


    await this.loadActivity(
      activityId,
    );

  }


  // ==========================================================
  // CARGAR ACTIVIDAD
  // ==========================================================

  private async loadActivity(
    activityId: string,
  ): Promise<void> {

    this.loading.set(true);

    this.error.set('');


    try {

      // ========================================================
      // 1. BUSCAR PRIMERO EN EL MOCK LOCAL
      // ========================================================
      //
      // Esta es la fuente principal durante la construcción
      // de la experiencia Agua en nuestro territorio.
      //
      // No necesitamos Firebase para visualizar la ruta
      // pedagógica.
      // ========================================================

      console.log(
        '[TELLUS] 🔎 Buscando actividad en MOCK:',
        activityId,
      );


      const localActivity =
        AGUA_TERRITORIO_ACTIVITIES.find(
          activity =>
            activity.id === activityId,
        );


      // ========================================================
      // ACTIVIDAD ENCONTRADA
      // ========================================================

      if (localActivity) {

        console.log(
          '[TELLUS] ✅ Actividad encontrada en MOCK:',
          localActivity,
        );


        console.log(
          '[TELLUS] 📚 Resource IDs:',
          localActivity.resourceIds ?? [],
        );


        this.activity.set(
          localActivity,
        );


        // ------------------------------------------------------
        // CARGAR RECURSOS
        // ------------------------------------------------------

        this.loadResources(
          localActivity,
        );


        this.loading.set(false);

        return;
      }


      // ========================================================
      // 2. RESPALDO FIRESTORE
      // ========================================================
      //
      // Solo llegamos aquí si la actividad no está definida
      // en el catálogo local.
      // ========================================================

      console.warn(
        '[TELLUS] ⚠️ Actividad no encontrada en MOCK.',
        activityId,
      );

      console.log(
        '[TELLUS] ☁️ Intentando buscar en Firestore...',
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


      console.log(
        '[TELLUS] ☁️ Actividad encontrada en Firestore:',
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

      // ========================================================
      // ERROR
      // ========================================================

      console.error(
        '[TELLUS] ❌ Error cargando actividad:',
        error,
      );


      this.error.set(
        'No fue posible cargar la actividad.',
      );


      this.loading.set(false);

    }

  }


  // ==========================================================
  // CARGAR RECURSOS DE LA ACTIVIDAD
  // ==========================================================

  private loadResources(
    activity: Activity,
  ): void {

    const resourceIds =
      activity.resourceIds ?? [];


    console.log(
      '[TELLUS] 📚 IDs de recursos:',
      resourceIds,
    );


    // ----------------------------------------------------------
    // SIN RECURSOS
    // ----------------------------------------------------------

    if (
      resourceIds.length === 0
    ) {

      console.warn(
        '[TELLUS] ⚠️ Esta actividad no tiene resourceIds.',
      );


      this.resources.set([]);

      return;
    }


    // ----------------------------------------------------------
    // BUSCAR CADA RECURSO
    // ----------------------------------------------------------

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
                '[TELLUS] ⚠️ Recurso no encontrado:',
                resourceId,
              );

            }


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


    // ----------------------------------------------------------
    // GUARDAR RECURSOS
    // ----------------------------------------------------------

    this.resources.set(
      loadedResources,
    );


    console.log(
      '[TELLUS] ✅ Recursos cargados:',
      loadedResources,
    );


    console.log(
      '[TELLUS] 📊 Total recursos:',
      loadedResources.length,
    );

  }


  // ==========================================================
  // IDENTIFICAR TIPO DE RECURSO
  // ==========================================================

  isImage(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'image' ||
      resource.type === 'infographic'
    );

  }


  // ==========================================================
  // VIDEO
  // ==========================================================

  isVideo(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'video'
    );

  }


  // ==========================================================
  // RECURSO EXTERNO
  // ==========================================================

  isExternal(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'link' ||
      resource.type === 'map' ||
      resource.type === 'data'
    );

  }


  // ==========================================================
  // DOCUMENTO
  // ==========================================================

  isDocument(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'document' ||
      resource.type === 'worked-example'
    );

  }


  // ==========================================================
  // SIMULADOR
  // ==========================================================

  isSimulation(
    resource: AguaResource,
  ): boolean {

    return (
      resource.type === 'simulation'
    );

  }


  // ==========================================================
  // RECURSO PUBLICADO
  // ==========================================================

  isPublished(
    resource: AguaResource,
  ): boolean {

    return (
      resource.published !== false
    );

  }


  // ==========================================================
  // RECURSO OFFLINE
  // ==========================================================

  isOfflineAvailable(
    resource: AguaResource,
  ): boolean {

    return (
      resource.offlineAvailable === true
    );

  }


  // ==========================================================
  // VOLVER AL MOMENTO
  // ==========================================================

  back(): void {

    const currentActivity =
      this.activity();


    const momentId =
      currentActivity?.momentId;


    if (!momentId) {

      this.router.navigate([
        '/mi-aula',
      ]);

      return;
    }


    this.router.navigate([
      '/experiencia',
      this.experienceId(),
      'momento',
      momentId,
    ]);

  }

}