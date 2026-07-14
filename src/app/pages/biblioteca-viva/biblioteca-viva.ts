import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-biblioteca-viva',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './biblioteca-viva.html',
  styleUrl: './biblioteca-viva.scss'
})
export class BibliotecaViva implements OnInit, OnDestroy {

  // ---------- CONTADOR ----------
  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;
  private timer: any;

  // ---------- ESTADÍSTICAS ----------
  stats = [
    { number: '250+', label: 'Proyectos' },
    { number: '15', label: 'Instituciones' },
    { number: '540', label: 'Developers' },
    { number: '9.2k', label: 'Votos' }
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

  // ---------- GALERÍA ----------
  gallery = [
    { emoji: '🎮', title: 'Juego de plataformas', author: 'Carlos M.' },
    { emoji: '🧪', title: 'Simulador de física', author: 'Ana G.' },
    { emoji: '📱', title: 'App financiera', author: 'Luis R.' },
    { emoji: '🤖', title: 'Chatbot educativo', author: 'Marta S.' },
    { emoji: '🏥', title: 'Sistema de salud', author: 'Pedro J.' },
    { emoji: '🚀', title: 'Plan de negocio', author: 'Laura T.' }
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

  // ---------- LIFECYCLE ----------
  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  // ---------- CONTADOR ----------
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

  // ---------- FAQ FILTER ----------
  filterFaqs(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredFaqs = this.faqs.filter(f => f.question.toLowerCase().includes(query));
  }

  // ---------- FAQ TOGGLE ----------
  toggleFaq(faq: any): void {
    faq.open = !faq.open;
  }
}