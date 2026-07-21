import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, of, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { ProjectGalleryComponent } from './components/project-gallery/project-gallery';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { UserService } from '../../core/services/user.service';
import { ConvocatoriaService } from '../../core/services/convocatoria.service';
import { Convocatoria } from '../../core/models/convocatoria.model';
import { InstitutionService } from '../../core/services/institution.service'; // ✅ NUEVO

interface HeroStats {
  projects: number;
  developers: number;
  institutions: number;
  votes: number;
  published: number;
  featured: Project | null;
  latestProjects: Project[];
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

  @ViewChild('gallerySection') gallerySection!: ElementRef<HTMLElement>;

  profile$: Observable<UserProfile | null>;
  featuredProject$: Observable<Project | null>;
  stats$: Observable<HeroStats>;
  convocatorias$: Observable<Convocatoria[]>;

  // ---------- CONTADOR ----------
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  private timer: any;

  // ---------- ESTADÍSTICAS (estáticas, ya no se usan) ----------
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
    { title: 'Regístrate', desc: 'Crea tu cuenta en Tellus con tu correo institucional.' },
    { title: 'Conviértete en Developer', desc: 'Activa tu perfil de desarrollador en Biblioteca Viva.' },
    { title: 'Aprende', desc: 'Sigue nuestros tutoriales de HTML, CSS y JavaScript.' },
    { title: 'Crea tu proyecto', desc: 'Diseña y programa tu aplicación web.' },
    { title: 'Completa la ficha técnica', desc: 'Describe tu proyecto, categoría y tecnologías.' },
    { title: 'Publica', desc: 'Sube tu proyecto a la plataforma.' },
    { title: 'Participa', desc: 'Tu proyecto entra en la convocatoria activa.' },
    { title: 'Gana', desc: 'Los mejores proyectos serán premiados.' }
  ];

  // ---------- CRONOGRAMA ----------
  schedule = [
    { date: '31 Jul', title: 'Cierre de inscripciones', desc: 'Último día para publicar proyectos.' },
    { date: '1–12 Ago', title: 'Revisión y evaluación', desc: 'Jurado califica los proyectos.' },
    { date: '13 Ago', title: 'Votación popular', desc: 'La comunidad vota por sus favoritos.' },
    { date: '14 Ago', title: 'Premiación', desc: 'Gran evento de premiación en vivo.' }
  ];

  // ---------- PREMIOS ----------
  prizes = [
    {
      icon: '🥇',
      title: 'Primer Lugar',
      amount: '$50.000',
      benefits: ['Diploma de honor', 'Publicación destacada', 'Menciones en redes']
    },
    {
      icon: '🥈',
      title: 'Segundo Lugar',
      amount: '$20.000',
      benefits: ['Diploma de honor', 'Publicación en web']
    },
    {
      icon: '🥉',
      title: 'Tercer Lugar',
      amount: 'Onces en cafetería',
      benefits: ['Diploma de honor', 'Publicación en web']
    }
  ];

  // ---------- VIDEOS ----------
  videos = [
    { title: 'Trailer oficial Tellus 2026', desc: 'Conoce la experiencia de la Biblioteca Viva.', duration: '2:30' },
    { title: 'Tutorial: Crea tu primera app HTML', desc: 'Aprende HTML, CSS y JS desde cero.', duration: '12:15' }
  ];

  // ---------- TARJETAS PRINCIPALES ----------
  mainCards = [
    { icon: '⬆️', title: 'Subir Proyecto', desc: 'Publica tu aplicación y compite.' },
    { icon: '👀', title: 'Ver Proyectos', desc: 'Explora creaciones de otros estudiantes.' },
    { icon: '🗳️', title: 'Votar', desc: 'Apoya los proyectos que más te gusten.' },
    { icon: '🏆', title: 'Ganadores', desc: 'Conoce los proyectos galardonados.' },
    { icon: '📘', title: 'Tutoriales', desc: 'Aprende con guías paso a paso.' },
    { icon: '👨‍💻', title: 'Developer', desc: 'Accede a tu perfil de desarrollador.' },
    { icon: '🏅', title: 'Hall of Fame', desc: 'Los mejores de la historia.' },
    { icon: '📢', title: 'Convocatorias', desc: 'Consulta concursos activos.' }
  ];

  // ---------- CONVOCATORIAS ----------
  calls = [
    { name: 'I.E. Tierra Negra', location: '📍 Tierra Negra', active: true, participants: 45 },
    { name: 'Colegio Bogotá', location: '📍 Bogotá', active: true, participants: 28 },
    { name: 'Colegio Bucaramanga', location: '📍 Bucaramanga', active: false, participants: 0 },
    { name: 'Colegio Medellín', location: '📍 Medellín', active: false, participants: 0 },
    { name: 'Universidad de Santander', location: '📍 Santander', active: true, participants: 32 }
  ];

  // ---------- TESTIMONIOS ----------
  testimonials = [
    { text: 'Tellus cambió la forma en que enseño. Mis estudiantes ahora crean sus propias aplicaciones.', name: 'Prof. Carlos R.', role: 'Docente de tecnología', avatar: '👨‍🏫' },
    { text: 'Nunca pensé que podría programar. Con los tutoriales de Tellus, hice mi primer juego.', name: 'María P.', role: 'Estudiante, grado 9', avatar: '👩‍🎓' },
    { text: 'Implementar Tellus en nuestra institución fue la mejor decisión. Los estudiantes están motivados.', name: 'Rector Luis F.', role: 'Rector I.E. Tierra Negra', avatar: '👨‍🎓' }
  ];

  // ---------- HALL OF FAME ----------
  hallOfFame = [
    { name: 'Ana García', project: 'EcoSim', year: '2025', prize: '🥇', avatar: '👩‍💻' },
    { name: 'Luis Martínez', project: 'MathQuest', year: '2025', prize: '🥈', avatar: '👨‍💻' },
    { name: 'Sofía Torres', project: 'Finanzas 360', year: '2024', prize: '🥇', avatar: '👩‍💻' },
    { name: 'Jorge Ramírez', project: 'Robot Sim', year: '2024', prize: '🥉', avatar: '👨‍💻' }
  ];

  // ---------- FAQ ----------
  faqs = [
    {
      question: '¿Necesito saber programar para participar?',
      answer: 'No, puedes aprender desde cero con nuestros tutoriales. El concurso está diseñado para todos los niveles.',
      open: false
    },
    {
      question: '¿Puedo participar en equipo?',
      answer: 'Sí, los equipos pueden tener hasta 3 integrantes. Todos deben estar registrados en Tellus.',
      open: false
    },
    {
      question: '¿Qué tecnologías puedo usar?',
      answer: 'HTML, CSS y JavaScript. Puedes usar librerías externas siempre que sean compatibles con el navegador.',
      open: false
    },
    {
      question: '¿Los proyectos serán públicos?',
      answer: 'Sí, todos los proyectos publicados serán visibles en la Biblioteca Viva y podrán ser votados por la comunidad.',
      open: false
    },
    {
      question: '¿Qué premios hay?',
      answer: 'Primer lugar: $50.000, Segundo: $20.000, Tercero: Onces en cafetería. Todos reciben diploma.',
      open: false
    }
  ];

  filteredFaqs = this.faqs;

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly convocatoriaService: ConvocatoriaService,
    private readonly institutionService: InstitutionService // ✅ NUEVO
  ) {
    this.profile$ = this.profileService.profile$;
    this.stats$ = this.loadHeroStats().pipe(shareReplay(1));
    this.featuredProject$ = this.stats$.pipe(
      map(stats => stats.featured)
    );
    this.convocatorias$ = this.convocatoriaService.getActiveConvocatorias();
  }

  private loadHeroStats(): Observable<HeroStats> {
    // Proyectos publicados
    const publishedProjects$ = this.projectService.getProjects('published').pipe(
      shareReplay(1)
    );

    const projects$ = publishedProjects$.pipe(
      map(projects => projects.length)
    );

    const developers$ = this.userService.getUsers().pipe(
      map(users => users.filter(u => u.role === 'student' || u.role === 'teacher').length)
    );

    // 🔥 CAMBIO: Usar InstitutionService en lugar de ProjectService
    const institutions$ = this.institutionService.getInstitutionsCount();

    const votes$ = publishedProjects$.pipe(
      map(projects => projects.reduce((acc, p) => acc + (p.ratingCount || 0), 0))
    );

    const featured$ = publishedProjects$.pipe(
      map(projects => {
        if (projects.length === 0) return null;
        const sorted = [...projects].sort((a, b) => {
          if ((a.rating || 0) !== (b.rating || 0)) {
            return (b.rating || 0) - (a.rating || 0);
          }
          if ((a.ratingCount || 0) !== (b.ratingCount || 0)) {
            return (b.ratingCount || 0) - (a.ratingCount || 0);
          }
          return (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0);
        });
        return sorted[0];
      })
    );

    const latestProjects$ = publishedProjects$.pipe(
      map(projects => {
        const sorted = [...projects].sort((a, b) => {
          const dateA = a.publishedAt || a.uploadedAt;
          const dateB = b.publishedAt || b.uploadedAt;
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateB.getTime() - dateA.getTime();
        });
        return sorted.slice(0, 5);
      })
    );

    return combineLatest([projects$, developers$, institutions$, votes$, featured$, latestProjects$]).pipe(
      map(([projects, developers, institutions, votes, featured, latestProjects]) => ({
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

  scrollToGallery(): void {
    const element = this.gallerySection?.nativeElement;
    if (!element) return;

    const navbarHeight = 80;
    const y = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }

  verProyecto(project: Project): void {
    if (!project.htmlContent) {
      alert('Este proyecto no tiene contenido HTML.');
      return;
    }
    const blob = new Blob([project.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private startCountdown(): void {
    const target = new Date('2026-07-31T23:59:59').getTime();
    this.timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance <= 0) {
        this.days = 0; this.hours = 0; this.minutes = 0; this.seconds = 0;
        clearInterval(this.timer);
        return;
      }
      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }

  filterFaqs(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredFaqs = this.faqs.filter(f => f.question.toLowerCase().includes(query));
  }

  toggleFaq(faq: any): void {
    faq.open = !faq.open;
  }

  getStars(rating: number): string {
    const full = Math.round(rating || 0);
    const empty = 5 - full;
    return '⭐'.repeat(full) + '☆'.repeat(empty);
  }
}