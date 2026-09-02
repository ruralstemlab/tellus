import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Navbar } from '../../../components/navbar/navbar';
import { Footer } from '../../../components/footer/footer';

import {
  getExperienceById,
} from '../data/experience-registry';

import {
  Experience,
} from '../models/experience.model';

import {
  Moment,
} from '../models/moment.model';

import {
  Activity,
} from '../models/activity.model';

import {
  AguaResource,
  getAguaResourceById,
} from '../data/resources/agua-territorio.resources';


@Component({
  selector: 'app-moment',

  standalone: true,

  imports: [
    CommonModule,
    Navbar,
    Footer,
  ],

  templateUrl: './moment.html',

  styleUrls: [
    './moment.scss',
  ],

  changeDetection:
    ChangeDetectionStrategy.OnPush,
})
export class MomentComponent
  implements OnInit, OnDestroy {


  // ============================================================
  // INYECCIONES
  // ============================================================

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly destroy$ =
    new Subject<void>();


  // ============================================================
  // RUTA
  // ============================================================

  readonly experienceId =
    signal<string>('');

  readonly momentId =
    signal<string>('');


  // ============================================================
  // ESTADO
  // ============================================================

  readonly acknowledged =
    signal<boolean>(false);


  // ============================================================
  // EXPERIENCIA
  // ============================================================

  readonly experienceData =
    computed(() => {

      const id =
        this.experienceId();

      if (!id) {
        return null;
      }

      return getExperienceById(id);

    });


  readonly experience =
    computed<Experience | null>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return null;
      }

      return data.experience as Experience;

    });


  // ============================================================
  // MOMENTOS
  // ============================================================

  readonly moments =
    computed<Moment[]>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return [];
      }

      return data.moments as Moment[];

    });


  // ============================================================
  // ACTIVIDADES
  // ============================================================

  readonly activities =
    computed<Activity[]>(() => {

      const data =
        this.experienceData();

      if (!data) {
        return [];
      }

      return data.activities as Activity[];

    });


  // ============================================================
  // MOMENTO ACTUAL
  // ============================================================

  readonly currentMoment =
    computed<Moment | null>(() => {

      const allMoments =
        this.moments();

      const id =
        this.momentId();

      return (
        allMoments.find(
          (moment: Moment) =>
            moment.id === id
        )

        ??

        allMoments.find(
          (moment: Moment) =>
            moment.order === 1
        )

        ??

        allMoments[0]

        ??

        null
      );

    });


  // ============================================================
  // ACTIVIDADES DEL MOMENTO
  // ============================================================

  readonly currentActivities =
    computed<Activity[]>(() => {

      const moment =
        this.currentMoment();

      if (!moment) {
        return [];
      }

      const ids =
        moment.activityIds
        ?? [];

      return this.activities()
        .filter(
          (activity: Activity) =>
            ids.includes(activity.id)
        );

    });


  // ============================================================
  // RECURSOS DIRECTOS DEL MOMENTO
  // ============================================================

  readonly currentResources =
    computed<AguaResource[]>(() => {

      const moment =
        this.currentMoment();

      if (!moment) {
        return [];
      }

      const resourceIds:
        string[] =
        moment.resourceIds
        ?? [];

      const resources:
        AguaResource[] = [];

      for (
        const resourceId
        of resourceIds
      ) {

        const resource =
          getAguaResourceById(
            resourceId
          );

        if (
          resource &&
          resource.published !== false
        ) {

          resources.push(
            resource
          );

        }

      }

      resources.sort(
        (
          a: AguaResource,
          b: AguaResource,
        ) =>
          (a.order ?? 999)
          -
          (b.order ?? 999)
      );

      return resources;

    });


  // ============================================================
  // MOMENTO ANTERIOR
  // ============================================================

  readonly previousMoment =
    computed<Moment | null>(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          (moment: Moment) =>
            moment.order ===
            current.order - 1
        )

        ??

        null
      );

    });


  // ============================================================
  // MOMENTO SIGUIENTE
  // ============================================================

  readonly nextMoment =
    computed<Moment | null>(() => {

      const current =
        this.currentMoment();

      if (!current) {
        return null;
      }

      return (
        this.moments().find(
          (moment: Moment) =>
            moment.order ===
            current.order + 1
        )

        ??

        null
      );

    });


  // ============================================================
  // PROGRESO
  // ============================================================

  readonly currentOrder =
    computed<number>(() => {

      return (
        this.currentMoment()?.order
        ??
        1
      );

    });


  readonly totalMoments =
    computed<number>(() => {

      return this.moments().length;

    });


  readonly progressPercentage =
    computed<number>(() => {

      const total =
        this.totalMoments();

      if (total <= 1) {
        return 0;
      }

      return Math.round(
        (
          (this.currentOrder() - 1)
          /
          (total - 1)
        )
        * 100
      );

    });


  readonly progressLabel =
    computed<string>(() => {

      const total =
        this.totalMoments();

      if (!total) {
        return 'Sin momentos';
      }

      return (
        `Momento ${this.currentOrder()} de ${total}`
      );

    });


  // ============================================================
  // TEXTO PRINCIPAL
  // ============================================================

  readonly currentMomentTitle =
    computed<string>(() => {

      return (
        this.currentMoment()?.title
        ??
        'Comienza tu experiencia'
      );

    });


  readonly currentMomentDescription =
    computed<string>(() => {

      return (
        this.currentMoment()?.description
        ??
        'Explora, observa y construye tus primeras ideas.'
      );

    });


  // ============================================================
  // IMAGEN PRINCIPAL
  // ============================================================

  readonly currentMomentImage =
    computed<string>(() => {

      const moment =
        this.currentMoment();

      const experience =
        this.experience();

      return (
        moment?.image
        ??
        this.getExperienceImage(
          experience
        )
        ??
        ''
      );

    });


  // ============================================================
  // DURACIÃ“N
  // ============================================================

  getDuration(): number {

    const moment =
      this.currentMoment();

    if (
      moment?.estimatedDurationMinutes
      != null
    ) {

      return (
        moment.estimatedDurationMinutes
      );

    }

    const experience =
      this.experience();

    if (
      experience?.estimatedDurationMinutes
      != null
    ) {

      return (
        experience.estimatedDurationMinutes
      );

    }

    return 15;

  }


  // ============================================================
  // ASIGNATURA
  // ============================================================

  getSubject(): string {

    return (
      this.experience()?.subject
      ??
      'STEAM'
    );

  }


  // ============================================================
  // GRADO
  // ============================================================

  getGradeLevel(): string {

    return (
      this.experience()?.gradeLevel
      ??
      ''
    );

  }


  // ============================================================
  // TEMA VISUAL
  // ============================================================

  readonly experienceTheme =
    computed<string>(() => {

      const experience =
        this.experience();

      if (!experience) {
        return 'default';
      }

      const id =
        experience.id.toLowerCase();

      const title =
        experience.title.toLowerCase();


      if (
        id.includes('agua') ||
        id.includes('water') ||
        id.includes('territorio') ||
        title.includes('agua')
      ) {

        return 'water';

      }


      if (
        id.includes('parabol') ||
        id.includes('proyectil') ||
        title.includes('parab')
      ) {

        return 'parabolic';

      }


      if (
        id.includes('creadores') ||
        id.includes('steam') ||
        id.includes('ia') ||
        id.includes('program') ||
        title.includes('creadores') ||
        title.includes('ia')
      ) {

        return 'programming';

      }


      if (
        id.includes('circuit') ||
        id.includes('electric') ||
        title.includes('circuit')
      ) {

        return 'circuits';

      }


      if (
        id.includes('quimica') ||
        id.includes('quÃ­mica') ||
        title.includes('quimica') ||
        title.includes('quÃ­mica')
      ) {

        return 'chemistry';

      }


      if (
        id.includes('fluido') ||
        id.includes('fluid') ||
        title.includes('fluido')
      ) {

        return 'fluids';

      }


      if (
        id.includes('energia') ||
        id.includes('energÃ­a') ||
        id.includes('energy') ||
        title.includes('energ')
      ) {

        return 'energy';

      }


      return 'default';

    });


  // ============================================================
  // NOMBRE DEL TEMA
  // ============================================================

  readonly experienceThemeLabel =
    computed<string>(() => {

      const labels:
        Record<string, string> = {

        water:
          'AGUA Y TERRITORIO',

        parabolic:
          'MOVIMIENTO PARABÃ“LICO',

        programming:
          'CREADORES STEAM CON IA',

        circuits:
          'CIRCUITOS ELÃ‰CTRICOS',

        chemistry:
          'QUÃMICA EN NUESTRO ENTORNO',

        fluids:
          'MECÃNICA DE FLUIDOS',

        energy:
          'ENERGÃA',

        default:
          'TELLUS LEARNING',

      };

      return (
        labels[
          this.experienceTheme()
        ]
        ??
        labels['default']
      );

    });


  // ============================================================
  // ICONO DE EXPERIENCIA
  // ============================================================

  readonly experienceIcon =
    computed<string>(() => {

      const icons:
        Record<string, string> = {

        water:
          'ðŸ’§',

        parabolic:
          'ðŸ¹',

        programming:
          'ðŸ¤–',

        circuits:
          'âš¡',

        chemistry:
          'ðŸ§ª',

        fluids:
          'ðŸŒŠ',

        energy:
          'ðŸ”‹',

        default:
          'ðŸŒ±',

      };

      return (
        icons[
          this.experienceTheme()
        ]
        ??
        icons['default']
      );

    });


  // ============================================================
  // ICONOS DE MOMENTOS
  // ============================================================

  readonly momentIcons:
    Record<string, string> = {

    motivacion:
      'ðŸ’¡',

    exploracion:
      'ðŸ”Ž',

    prediccion:
      'ðŸŽ¯',

    experimentacion:
      'ðŸ§ª',

    construccion:
      'ðŸ§ ',

    analisis_evaluacion:
      'ðŸ“Š',

    reflexion:
      'ðŸŒŽ',

  };


  // ============================================================
  // CICLO DE VIDA
  // ============================================================

  ngOnInit(): void {

    this.route.paramMap
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe(params => {

        this.experienceId.set(
          params.get(
            'experienceId'
          )
          ??
          ''
        );

        this.momentId.set(
          params.get(
            'momentId'
          )
          ??
          ''
        );

        this.acknowledged.set(
          false
        );

      });

  }


  ngOnDestroy(): void {

    this.destroy$.next();

    this.destroy$.complete();

  }


  // ============================================================
  // IMAGEN DE EXPERIENCIA
  // ============================================================

  private getExperienceImage(
    experience: Experience | null
  ): string {

    if (!experience) {
      return '';
    }

    return (
      experience.coverUrl
      ??
      experience.thumbnailUrl
      ??
      ''
    );

  }


  // ============================================================
  // ICONO DEL MOMENTO
  // ============================================================

  getMomentIcon(
    moment: Moment
  ): string {

    return (
      this.momentIcons[
        String(moment.type)
      ]
      ??
      this.getFallbackIcon(
        moment.order
      )
    );

  }


  private getFallbackIcon(
    order: number
  ): string {

    const icons: string[] = [

      'ðŸ’¡',
      'ðŸ”Ž',
      'ðŸŽ¯',
      'ðŸ§ª',
      'ðŸ§ ',
      'ðŸ“Š',
      'ðŸŒŽ',

    ];

    return (
      icons[order - 1]
      ??
      'ðŸŒ±'
    );

  }


  // ============================================================
  // ICONO DE ACTIVIDAD
  // ============================================================

  getActivityIcon(
    type: unknown
  ): string {

    const value =
      String(
        type
        ??
        ''
      ).toLowerCase();


    if (
      value.includes('video')
    ) {
      return 'â–¶ï¸';
    }


    if (
      value.includes('simulation') ||
      value.includes('simul')
    ) {
      return 'ðŸŽ®';
    }


    if (
      value.includes('question') ||
      value.includes('quiz')
    ) {
      return 'â“';
    }


    if (
      value.includes('reflection') ||
      value.includes('reflex')
    ) {
      return 'ðŸŒ±';
    }


    if (
      value.includes('analysis') ||
      value.includes('data')
    ) {
      return 'ðŸ“Š';
    }


    if (
      value.includes('experiment') ||
      value.includes('lab')
    ) {
      return 'ðŸ§ª';
    }


    if (
      value.includes('preinforme') ||
      value.includes('predict')
    ) {
      return 'ðŸŽ¯';
    }


    if (
      value.includes('explor')
    ) {
      return 'ðŸ”Ž';
    }


    return 'âœ¦';

  }


  // ============================================================
  // TIPO DE ACTIVIDAD
  // ============================================================

  getActivityTypeLabel(
    activity: Activity
  ): string {

    const type =
      String(
        activity.type
        ??
        ''
      ).toLowerCase();


    const labels:
      Record<string, string> = {

      video:
        'DESCUBRE',

      reflection:
        'REFLEXIONA',

      data_analysis:
        'INVESTIGA',

      simulation:
        'EXPERIMENTA',

      questionnaire:
        'RESPONDE',

      preinforme:
        'PREDICE',

      lab_physical:
        'COMPRUEBA',

      question:
        'PIENSA',

      experiment:
        'COMPRUEBA',

      open:
        'EXPLORA',

      problem:
        'RESUELVE',

    };


    return (
      labels[type]
      ??
      'EXPLORA'
    );

  }


  // ============================================================
  // TIPO DE RECURSO
  // ============================================================

  isImage(
    resource: AguaResource
  ): boolean {

    return (
      resource.type === 'image' ||
      resource.type === 'infographic'
    );

  }


  isVideo(
    resource: AguaResource
  ): boolean {

    return (
      resource.type === 'video'
    );

  }


  isSimulation(
    resource: AguaResource
  ): boolean {

    return (
      resource.type === 'simulation'
    );

  }


  isInformationResource(
    resource: AguaResource
  ): boolean {

    return (
      resource.type === 'data' ||
      resource.type === 'map' ||
      resource.type === 'document' ||
      resource.type === 'worked-example' ||
      resource.type === 'link'
    );

  }


  getResourceIcon(
    resource: AguaResource
  ): string {

    const icons:
      Record<string, string> = {

      image:
        'ðŸ–¼ï¸',

      infographic:
        'ðŸ“Š',

      video:
        'â–¶ï¸',

      map:
        'ðŸ—ºï¸',

      data:
        'ðŸ“ˆ',

      document:
        'ðŸ“„',

      'worked-example':
        'ðŸ§ ',

      link:
        'ðŸ”—',

      simulation:
        'ðŸ”¬',

    };

    return (
      icons[
        resource.type
      ]
      ??
      'ðŸŒ±'
    );

  }


  hasResourceUrl(
    resource: AguaResource
  ): boolean {

    return !!resource.url;

  }


  hasSourceUrl(
    resource: AguaResource
  ): boolean {

    return !!resource.sourceUrl;

  }


  // ============================================================
  // ESTADOS
  // ============================================================

  isCurrent(
    moment: Moment
  ): boolean {

    return (
      moment.id ===
      this.currentMoment()?.id
    );

  }


  isCompleted(
    moment: Moment
  ): boolean {

    return (
      moment.order <
      this.currentOrder()
    );

  }


  isLocked(
    moment: Moment
  ): boolean {

    return (
      moment.order >
      this.currentOrder()
    );

  }


  isFirstMoment(): boolean {

    return (
      this.currentOrder() === 1
    );

  }


  isLastMoment(): boolean {

    return (
      this.currentOrder()
      ===
      this.totalMoments()
    );

  }


  // ============================================================
  // REGISTRAR OBSERVACIÃ“N
  // ============================================================

  acknowledgeChallenge(): void {

    this.acknowledged.set(
      true
    );

  }


  // ============================================================
  // ABRIR ACTIVIDAD
  // ============================================================

  openActivity(
    activity: Activity
  ): void {

    if (!activity?.id) {
      return;
    }

    const experienceId =
      this.experienceId();

    if (!experienceId) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      experienceId,
      'actividad',
      activity.id,
    ]);

  }


  // ============================================================
  // VOLVER AL AULA
  // ============================================================

  backToClassroom(): void {

    this.router.navigate([
      '/mi-aula',
    ]);

  }


  // ============================================================
  // CONTINUAR
  // ============================================================

  continue(): void {

    const next =
      this.nextMoment();

    if (!next) {

      this.router.navigate([
        '/mi-aula',
      ]);

      return;

    }

    const experienceId =
      this.experienceId();

    if (!experienceId) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      experienceId,
      'momento',
      next.id,
    ]);

  }


  // ============================================================
  // IR A MOMENTO
  // ============================================================

  goToMoment(
    momentId: string
  ): void {

    const target =
      this.moments().find(
        (moment: Moment) =>
          moment.id === momentId
      );

    if (!target) {
      return;
    }

    if (
      this.isLocked(target)
    ) {
      return;
    }

    const experienceId =
      this.experienceId();

    if (!experienceId) {
      return;
    }

    this.router.navigate([
      '/experiencia',
      experienceId,
      'momento',
      target.id,
    ]);

  }


  // ============================================================
  // TRACK MOMENTOS
  // ============================================================

  trackByMomentId(
    _index: number,
    moment: Moment
  ): string {

    return moment.id;

  }


  // ============================================================
  // TRACK ACTIVIDADES
  // ============================================================

  trackByActivityId(
    _index: number,
    activity: Activity
  ): string {

    return activity.id;

  }


  // ============================================================
  // TRACK RECURSOS
  // ============================================================

  trackByResourceId(
    _index: number,
    resource: AguaResource
  ): string {

    return resource.id;

  }

}
