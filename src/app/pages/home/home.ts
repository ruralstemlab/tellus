import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  teacherName = 'Henson';

  // Datos de las tarjetas del Centro de Control
  cards = [
    {
      icon: '🤖',
      title: 'Gaian',
      desc: 'Tu asistente inteligente para planear, crear contenido y apoyar la enseñanza.'
    },
    {
      icon: '👨‍🏫',
      title: 'Mi Aula',
      desc: 'Gestiona cursos, estudiantes y actividades.'
    },
    {
      icon: '🧪',
      title: 'Laboratorios',
      desc: 'Explora simuladores interactivos STEAM.'
    },
    {
      icon: '📚',
      title: 'Biblioteca Viva',
      desc: 'Recursos, guías y materiales educativos.'
    },
    {
      icon: '📝',
      title: 'Planeación',
      desc: 'Diseña clases y proyectos.'
    },
    {
      icon: '📋',
      title: 'Evaluaciones',
      desc: 'Crea cuestionarios y rúbricas.'
    },
    {
      icon: '📊',
      title: 'Analíticas',
      desc: 'Visualiza indicadores y progreso.'
    }
  ];
}