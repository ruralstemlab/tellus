import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  Observable,
  combineLatest,
  from
} from 'rxjs';

import {
  map,
  shareReplay
} from 'rxjs/operators';

import {
  doc,
  getDoc
} from 'firebase/firestore';

import { db } from '../../../environments/firebase.config';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { ProjectGalleryComponent } from './components/project-gallery/project-gallery';

import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

import { ConvocatoriaService } from '../../core/services/convocatoria.service';
import { Convocatoria } from '../../core/models/convocatoria.model';

import { InstitutionService } from '../../core/services/institution.service';
import { Institution } from '../../core/models/institution.model';

interface HeroStats {
  projects: number;
  developers: number;
  institutions: number;
  votes: number;
  published: number;
  featured: Project | null;
  latestProjects: Project[];
}

interface HallOfFameEntry {
  name: string;
  project: string;
  year: string;
  prize: string;
  avatar: string;
  rating: number;
  votes: number;
}

@Component({
  selector: 'app-biblioteca-viva',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Navbar,
    Footer,
    AdminDashboardComponent,
    ProjectGalleryComponent
  ],
  templateUrl: './biblioteca-viva.html',
  styleUrl: './biblioteca-viva.scss'
})
export class BibliotecaViva implements OnInit, OnDestroy {

  @ViewChild('gallerySection') gallerySection!: ElementRef;

  profile$: Observable<UserProfile | null>;
  featuredProject$: Observable<Project | null>;
  /** Estadísticas generales de Biblioteca Viva (todas las ediciones). */
  stats$: Observable<HeroStats>;
  /** Estadísticas exclusivas de la edición HTML 2.0. */
  contestStats$: Observable<HeroStats>;
  convocatorias$: Observable<Convocatoria[]>;
  historicalConvocatorias$: Observable<Convocatoria[]>;
  hallOfFame$: Observable<HallOfFameEntry[]>;
  institutions$: Observable<Institution[]>;

  // ---------- CONTADOR ----------
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  private timer: any;

  // ---------- ESTADÍSTICAS ----------
  stats = [
    { number: '0', label: 'Proyectos' },
    { number: '0', label: 'Instituciones' },
    { number: '0', label: 'Developers' },
    { number: '0', label: 'Votos' }
  ];

  // ---------- QUÉ PUEDES CONSTRUIR ----------
  buildItems = [
    { icon: '🎮', title: 'Juegos', desc: 'Aventuras, puzzles, plataformas' },
    { icon: '📚', title: 'Educación', desc: 'Matemáticas, ciencias, idiomas' },
    { icon: '🧪', title: 'Simuladores', desc: 'Física, química, circuitos' },
    { icon: '💰', title: 'Finanzas', desc: 'Presupuestos, ahorro, inversiones' },
    { icon: '🚀', title: 'Emprendimiento', desc: 'Planes de negocio, tiendas' },
    { icon: '🌍', title: 'Turismo', desc: 'Guías, destinos, reservas' },
    { icon: '🏥', title: 'Salud', desc: 'Seguimiento, recordatorios' },
    { icon: '⚽', title: 'Deportes', desc: 'Estadísticas, entrenamiento' },
    { icon: '🧠', title: 'IA & Robótica', desc: 'Chatbots, control de robots' },
    { icon: '🔌', title: 'Electrónica', desc: 'Simuladores de circuitos' },
    { icon: '📦', title: 'Inventarios', desc: 'Control de stock' },
    { icon: '💡', title: 'Tu idea', desc: 'La imaginación es el límite' }
  ];

  // ---------- APRENDE DESDE CERO ----------
  technologies = [
    { icon: '🟧', name: 'HTML', progress: 100, level: 'Fundamentos' },
    { icon: '🟦', name: 'CSS', progress: 80, level: 'Intermedio' },
    { icon: '🟨', name: 'JavaScript', progress: 60, level: 'Intermedio' },
    { icon: '💻', name: 'VS Code', progress: 90, level: 'Avanzado' },
    { icon: '🐙', name: 'GitHub', progress: 70, level: 'Intermedio' },
    { icon: '🔥', name: 'Firebase', progress: 40, level: 'Básico' }
  ];

  // ---------- CÓMO PARTICIPAR ----------
  steps = [
    {
      title: 'Regístrate',
      desc: 'Crea tu cuenta en Tellus con tu correo institucional.'
    },
    {
      title: 'Conviértete en Developer',
      desc: 'Activa tu perfil de desarrollador en Biblioteca Viva.'
    },
    {
      title: 'Aprende',
      desc: 'Sigue nuestros tutoriales de HTML, CSS y JavaScript.'
    },
    {
      title: 'Crea tu proyecto',
      desc: 'Diseña y programa tu aplicación web.'
    },
    {
      title: 'Completa la ficha técnica',
      desc: 'Describe tu proyecto, categoría y tecnologías.'
    },
    {
      title: 'Publica',
      desc: 'Sube tu proyecto a la plataforma.'
    },
    {
      title: 'Participa',
      desc: 'Tu proyecto entra en la convocatoria activa.'
    },
    {
      title: 'Gana',
      desc: 'Los mejores proyectos serán premiados.'
    }
  ];

  // ---------- CRONOGRAMA OFICIAL HTML 2.0 ----------
  // Fechas confirmadas: cierre de inscripciones 1 nov. 2026 y premiación 6 nov. 2026.
  // No se agregan etapas intermedias porque no se han confirmado sus fechas.
  schedule = [
    {
      date: '1 nov. 2026',
      title: 'Cierre de inscripciones',
      desc: 'Último día para enviar aplicaciones al Concurso HTML 2.0.'
    },
    {
      date: '6 nov. 2026',
      title: 'Premiación',
      desc: 'Ceremonia de reconocimiento del Concurso HTML 2.0.'
    }
  ];

  // ---------- PREMIOS ----------
  prizes = [
    {
      icon: '🥇',
      title: 'Primer Lugar',
      amount: '$50.000',
      benefits: [
        'Diploma de honor',
        'Publicación destacada',
        'Menciones en redes'
      ]
    },
    {
      icon: '🥈',
      title: 'Segundo Lugar',
      amount: '$20.000',
      benefits: [
        'Diploma de honor',
        'Publicación en web'
      ]
    },
    {
      icon: '🥉',
      title: 'Tercer Lugar',
      amount: 'Onces en cafetería',
      benefits: [
        'Diploma de honor',
        'Publicación en web'
      ]
    }
  ];

  // ---------- VIDEOS ----------
  videos = [
    {
      title: 'Trailer oficial Tellus 2026',
      desc: 'Conoce la experiencia de la Biblioteca Viva.',
      duration: '2:30'
    },
    {
      title: 'Tutorial: Crea tu primera app HTML',
      desc: 'Aprende HTML, CSS y JS desde cero.',
      duration: '12:15'
    }
  ];

  // ---------- TARJETAS PRINCIPALES ----------
  mainCards = [
    {
      icon: '⬆️',
      title: 'Subir Proyecto',
      desc: 'Publica tu aplicación y compite.'
    },
    {
      icon: '👀',
      title: 'Ver Proyectos',
      desc: 'Explora creaciones de otros estudiantes.'
    },
    {
      icon: '🗳️',
      title: 'Votar',
      desc: 'Apoya los proyectos que más te gusten.'
    },
    {
      icon: '🏆',
      title: 'Ganadores',
      desc: 'Conoce los proyectos galardonados.'
    },
    {
      icon: '📘',
      title: 'Tutoriales',
      desc: 'Aprende con guías paso a paso.'
    },
    {
      icon: '👨‍💻',
      title: 'Developer',
      desc: 'Accede a tu perfil de desarrollador.'
    },
    {
      icon: '🏅',
      title: 'Hall of Fame',
      desc: 'Los mejores de la historia.'
    },
    {
      icon: '📢',
      title: 'Convocatorias',
      desc: 'Consulta concursos activos.'
    }
  ];

  // ---------- TESTIMONIOS ----------
  testimonials = [
    {
      text: 'Tellus cambió la forma en que enseño. Mis estudiantes ahora crean sus propias aplicaciones.',
      name: 'Prof. Carlos R.',
      role: 'Docente de tecnología',
      avatar: '👨‍🏫'
    },
    {
      text: 'Nunca pensé que podría programar. Con los tutoriales de Tellus, hice mi primer juego.',
      name: 'María P.',
      role: 'Estudiante, grado 9',
      avatar: '👩‍🎓'
    },
    {
      text: 'Implementar Tellus en nuestra institución fue la mejor decisión. Los estudiantes están motivados.',
      name: 'Rector Luis F.',
      role: 'Rector I.E. Tierra Negra',
      avatar: '👨‍🎓'
    }
  ];

  // Los ganadores de HTML 1.0 se calculan desde los proyectos publicados y sus votos.

  // ---------- FAQ ----------
  faqs = [
    {
      question: '¿Necesito saber programar para participar?',
      answer:
        'No, puedes aprender desde cero con nuestros tutoriales. El concurso está diseñado para todos los niveles.',
      open: false
    },
    {
      question: '¿Puedo participar en equipo?',
      answer:
        'Sí, los equipos pueden tener hasta 3 integrantes. Todos deben estar registrados en Tellus.',
      open: false
    },
    {
      question: '¿Qué tecnologías puedo usar?',
      answer:
        'HTML, CSS y JavaScript. Puedes usar librerías externas siempre que sean compatibles con el navegador.',
      open: false
    },
    {
      question: '¿Los proyectos serán públicos?',
      answer:
        'Sí, todos los proyectos publicados serán visibles en la Biblioteca Viva y podrán ser votados por la comunidad.',
      open: false
    },
    {
      question: '¿Qué premios hay?',
      answer:
        'Los premios de HTML 2.0 deben consultarse en la convocatoria vigente. Los premios de la edición HTML 1.0 corresponden a la edición anterior.',
      open: false
    }
  ];

  filteredFaqs = this.faqs;

  // ==========================================================
  // CENTRO DE RECURSOS – CONSTANTES Y MODAL
  // ==========================================================

  readonly STUDENT_GUIDE = 'assets/pdf/infografia-estudiantes.pdf';
  readonly TEACHER_GUIDE = 'assets/pdf/infografia-docentes.pdf';

  showResourcesModal = false;

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly convocatoriaService: ConvocatoriaService,
    private readonly institutionService: InstitutionService
  ) {
    this.profile$ = this.profileService.profile$;

    // Métricas generales: se conservan para las secciones de comunidad.
    this.stats$ = this.loadHeroStats().pipe(
      shareReplay(1)
    );

    // El panel superior y el proyecto destacado corresponden solo a HTML 2.0.
    this.contestStats$ = this.loadContestStats().pipe(
      shareReplay(1)
    );

    this.featuredProject$ = this.contestStats$.pipe(
      map(stats => stats.featured)
    );

    // Cargamos una sola vez las convocatorias que devuelve el servicio.
    // HTML 2.0 se presenta como edición vigente; las demás se conservan
    // en una sección separada como convocatorias anteriores.
    const allConvocatorias$ = this.convocatoriaService
      .getAllConvocatorias()
      .pipe(shareReplay(1));

    this.convocatorias$ = allConvocatorias$.pipe(
      map(items => items.filter(item => item.active && this.isHtml20Convocatoria(item)))
    );

    this.historicalConvocatorias$ = allConvocatorias$.pipe(
      map(items => items.filter(item => !this.isHtml20Convocatoria(item)))
    );

    this.hallOfFame$ = this.loadHallOfFame().pipe(shareReplay(1));

    this.institutions$ =
      this.institutionService.getActiveInstitutions();
  }

  /**
   * Evita confundir "HTML 2026" (la edición anterior) con "HTML 2.0".
   */
  private isHtml20Convocatoria(convocatoria: Convocatoria): boolean {
    const text = `${convocatoria.title || ''} ${convocatoria.description || ''}`.toLowerCase();
    return /\bhtml\s*2\.0\b/.test(text)
      || /\bhtml[-_\s]+2[-_.]0\b/.test(text)
      || /\bhtml\s+2\b/.test(text);
  }

  /**
   * Calcula el podio de HTML 1.0 a partir de los proyectos publicados.
   * Usa la misma puntuación de la galería: promedio de estrellas × cantidad de votos.
   * Los documentos antiguos sin campo edition se consideran parte de HTML 1.0;
   * los identificados explícitamente como HTML 2.0 quedan excluidos.
   */
  private loadHallOfFame(): Observable<HallOfFameEntry[]> {
    const asDate = (value: unknown): Date | null => {
      if (value instanceof Date) return value;
      if (value && typeof value === 'object' && 'toDate' in value) {
        const converter = (value as { toDate?: () => Date }).toDate;
        if (typeof converter === 'function') return converter.call(value);
      }
      return null;
    };

    return this.projectService.getProjects('published').pipe(
      map(projects => {
        const html10Projects = projects.filter(project => {
          const record = project as Project & { edition?: string; contestEdition?: string };
          const rawEdition = String(record.edition ?? record.contestEdition ?? '').trim().toLowerCase();

          if (!rawEdition) return true;

          const normalized = rawEdition.replace(/[\s_.]/g, '-');
          return normalized === 'html-1-0'
            || normalized === 'concurso-html-1-0'
            || /\bhtml\s*1\.0\b/.test(rawEdition)
            || /\bhtml[-_\s]+1[-_.]0\b/.test(rawEdition);
        });

        return html10Projects
          .filter(project => (project.ratingCount || 0) > 0)
          .sort((a, b) => {
            const scoreA = (a.rating || 0) * (a.ratingCount || 0);
            const scoreB = (b.rating || 0) * (b.ratingCount || 0);
            if (scoreA !== scoreB) return scoreB - scoreA;
            if ((a.ratingCount || 0) !== (b.ratingCount || 0)) {
              return (b.ratingCount || 0) - (a.ratingCount || 0);
            }
            const dateA = asDate(a.publishedAt) || asDate(a.uploadedAt);
            const dateB = asDate(b.publishedAt) || asDate(b.uploadedAt);
            return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
          })
          .slice(0, 3)
          .map((project, index) => {
            const date = asDate(project.publishedAt) || asDate(project.uploadedAt);
            const medals = ['🥇', '🥈', '🥉'];
            return {
              name: project.studentName || 'Desarrollador Tellus',
              project: project.title || 'Proyecto sin título',
              year: String(date?.getFullYear() || 2026),
              prize: medals[index],
              avatar: '💻',
              rating: project.rating || 0,
              votes: project.ratingCount || 0
            };
          });
      })
    );
  }

  /**
   * Estadísticas exclusivamente de proyectos publicados en Concurso HTML 2.0.
   * Los proyectos históricos sin edition no se incluyen aquí.
   */
  private loadContestStats(): Observable<HeroStats> {
    return this.projectService.getProjects('published').pipe(
      map(allProjects => {
        const projects = allProjects.filter(project => {
          const record = project as Project & {
            edition?: string;
            contestEdition?: string;
          };
          const edition = String(
            record.edition ?? record.contestEdition ?? ''
          ).trim().toLowerCase();
          const normalized = edition.replace(/[\s_.]/g, '-');
          return normalized === 'html-2-0'
            || normalized === 'concurso-html-2-0'
            || /\bhtml\s*2\.0\b/.test(edition)
            || /\bhtml[-_\s]+2[-_.]0\b/.test(edition);
        });

        const developers = new Set(
          projects
            .map(project => String(
              (project as Project & { studentEmail?: string }).studentEmail ||
              project.studentName || ''
            ).trim().toLowerCase())
            .filter(Boolean)
        );

        const institutions = new Set(
          projects
            .map(project => String(project.institution || '').trim().toLowerCase())
            .filter(Boolean)
        );

        const latestProjects = [...projects].sort((a, b) => {
          const dateA = a.publishedAt || a.uploadedAt;
          const dateB = b.publishedAt || b.uploadedAt;
          return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        }).slice(0, 5);

        const ranked = [...projects].sort((a, b) => {
          const ratingDifference = (b.rating || 0) - (a.rating || 0);
          if (ratingDifference !== 0) return ratingDifference;
          const voteDifference = (b.ratingCount || 0) - (a.ratingCount || 0);
          if (voteDifference !== 0) return voteDifference;
          return (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0);
        });

        return {
          projects: projects.length,
          developers: developers.size,
          institutions: institutions.size,
          votes: projects.reduce((total, project) => total + (project.ratingCount || 0), 0),
          published: projects.length,
          featured: ranked[0] || null,
          latestProjects
        };
      })
    );
  }

  private loadHeroStats(): Observable<HeroStats> {

    const publishedProjects$ =
      this.projectService.getProjects('published').pipe(
        shareReplay(1)
      );

    const projects$ =
      publishedProjects$.pipe(
        map(projects => projects.length)
      );

    // ========================================================
    // DEVELOPERS — AHORA DESDE publicStats
    // ========================================================

    const developers$ = from(
      getDoc(
        doc(
          db,
          'publicStats',
          'biblioteca-viva'
        )
      )
    ).pipe(
      map(snapshot => {

        if (!snapshot.exists()) {
          return 0;
        }

        const data = snapshot.data();

        return Number(
          data['developers'] ?? 0
        );
      })
    );

    const institutions$ =
      this.institutionService.getInstitutionsCount();

    const votes$ =
      publishedProjects$.pipe(
        map(projects =>
          projects.reduce(
            (acc, p) =>
              acc + (p.ratingCount || 0),
            0
          )
        )
      );

    const featured$ =
      publishedProjects$.pipe(
        map(projects => {

          if (projects.length === 0) {
            return null;
          }

          const sorted = [...projects].sort(
            (a, b) => {

              if (
                (a.rating || 0) !==
                (b.rating || 0)
              ) {
                return (
                  (b.rating || 0) -
                  (a.rating || 0)
                );
              }

              if (
                (a.ratingCount || 0) !==
                (b.ratingCount || 0)
              ) {
                return (
                  (b.ratingCount || 0) -
                  (a.ratingCount || 0)
                );
              }

              return (
                (b.uploadedAt?.getTime() || 0) -
                (a.uploadedAt?.getTime() || 0)
              );
            }
          );

          return sorted[0];
        })
      );

    const latestProjects$ =
      publishedProjects$.pipe(
        map(projects => {

          const sorted = [...projects].sort(
            (a, b) => {

              const dateA =
                a.publishedAt || a.uploadedAt;

              const dateB =
                b.publishedAt || b.uploadedAt;

              if (!dateA && !dateB) {
                return 0;
              }

              if (!dateA) {
                return 1;
              }

              if (!dateB) {
                return -1;
              }

              return (
                dateB.getTime() -
                dateA.getTime()
              );
            }
          );

          return sorted.slice(0, 5);
        })
      );

    return combineLatest([
      projects$,
      developers$,
      institutions$,
      votes$,
      featured$,
      latestProjects$
    ]).pipe(

      map(([
        projects,
        developers,
        institutions,
        votes,
        featured,
        latestProjects
      ]) => ({

        projects,

        developers,

        institutions,

        votes,

        published: projects,

        featured,

        latestProjects

      }))
    );
  }

  // ==========================================================
  // NAVEGACIÓN Y SCROLL
  // ==========================================================

  scrollToGallery(): void {

    const element =
      this.gallerySection?.nativeElement;

    if (!element) {
      return;
    }

    const navbarHeight = 80;

    const y =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      navbarHeight;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }

  verProyecto(project: Project): void {

    if (!project.htmlContent) {

      alert(
        'Este proyecto no tiene contenido HTML.'
      );

      return;
    }

    const blob =
      new Blob(
        [project.htmlContent],
        {
          type: 'text/html'
        }
      );

    const url =
      URL.createObjectURL(blob);

    window.open(
      url,
      '_blank'
    );

    setTimeout(
      () => URL.revokeObjectURL(url),
      5000
    );
  }

  // ==========================================================
  // CENTRO DE RECURSOS – MÉTODOS
  // ==========================================================

  openResourcesModal(): void {
    this.showResourcesModal = true;
  }

  closeResourcesModal(): void {
    this.showResourcesModal = false;
  }

  openStudentGuide(): void {

    this.closeResourcesModal();

    window.open(
      this.STUDENT_GUIDE,
      '_blank'
    );
  }

  openTeacherGuide(): void {

    this.closeResourcesModal();

    window.open(
      this.TEACHER_GUIDE,
      '_blank'
    );
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeResourcesModal();
  }

  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private startCountdown(): void {

    const target =
      new Date(
        '2026-11-01T23:59:59-05:00'
      ).getTime();

    this.timer =
      setInterval(() => {

        const now =
          new Date().getTime();

        const distance =
          target - now;

        if (distance <= 0) {

          this.days = 0;
          this.hours = 0;
          this.minutes = 0;
          this.seconds = 0;

          clearInterval(this.timer);

          return;
        }

        this.days =
          Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
          );

        this.hours =
          Math.floor(
            (
              distance %
              (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
          );

        this.minutes =
          Math.floor(
            (
              distance %
              (1000 * 60 * 60)
            ) /
            (1000 * 60)
          );

        this.seconds =
          Math.floor(
            (
              distance %
              (1000 * 60)
            ) /
            1000
          );

      }, 1000);
  }

  filterFaqs(event: Event): void {

    const query =
      (
        event.target as HTMLInputElement
      ).value.toLowerCase();

    this.filteredFaqs =
      this.faqs.filter(
        f =>
          f.question
            .toLowerCase()
            .includes(query)
      );
  }

  toggleFaq(faq: any): void {
    faq.open = !faq.open;
  }

  getStars(rating: number): string {

    const full =
      Math.round(rating || 0);

    const empty =
      5 - full;

    return (
      '⭐'.repeat(full) +
      '☆'.repeat(empty)
    );
  }
}