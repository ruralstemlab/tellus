import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  opacity: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    Navbar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, AfterViewInit, OnDestroy {

  // Usamos ViewChild para referenciar el canvas por su id (o por template reference)
  @ViewChild('particlesCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  teacherName = 'Henson Alberto';

  greeting = '';

  currentTime = '';

  currentDate = '';

  weather = '--';

  temperature = '--°';

  dailyQuote = '';

  bannerImage = '';

  private timer!: ReturnType<typeof setInterval>;
  private weatherTimer!: ReturnType<typeof setInterval>;
  private animationFrame!: number;
  private particles: Particle[] = [];
  private ctx!: CanvasRenderingContext2D | null;
  private canvas!: HTMLCanvasElement;

  private http = inject(HttpClient);

  ngOnInit(): void {

    this.dailyQuote = this.getDailyQuote();

    this.updateDashboardInfo();

    this.timer = setInterval(() => {

      this.updateDashboardInfo();

    }, 1000);

    this.fetchWeather();
    this.weatherTimer = setInterval(() => {

      this.fetchWeather();

    }, 5 * 60 * 1000);

  }

  ngAfterViewInit(): void {
    // Inicializar partículas después de que la vista esté lista
    this.initParticles();
  }

  ngOnDestroy(): void {

    if (this.timer) {
      clearInterval(this.timer);
    }

    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
    }

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

  }

  private updateDashboardInfo(): void {

    const now = new Date();

    this.greeting = this.getGreeting(now);

    this.currentTime = now.toLocaleTimeString('es-CO', {

      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'

    });

    this.currentDate = now.toLocaleDateString('es-CO', {

      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'

    });

    this.bannerImage = this.getBanner(now);

  }

  private getGreeting(date: Date): string {

    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return 'Buenos días';
    }

    if (hour >= 12 && hour < 19) {
      return 'Buenas tardes';
    }

    return 'Buenas noches';

  }

  private getBanner(date: Date): string {

    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return 'assets/backgrounds/morning-banner.png';
    }

    if (hour >= 12 && hour < 19) {
      return 'assets/backgrounds/afternoon-banner.png';
    }

    return 'assets/backgrounds/night-banner.png';

  }

  private getDailyQuote(): string {

    const quotes = [

      'Cada clase puede cambiar una vida.',
      'La curiosidad es el inicio del aprendizaje.',
      'Educar es sembrar futuro.',
      'Hoy tienes la oportunidad de inspirar a tus estudiantes.',
      'La tecnología tiene sentido cuando mejora la educación.',
      'Cada estudiante aprende de una forma diferente. Inspíralo.',
      'El conocimiento florece cuando existe pasión por enseñar.',
      'Hoy sembramos las ideas que transformarán el mañana.'

    ];

    const index = new Date().getDate() % quotes.length;

    return quotes[index];

  }

  private fetchWeather(): void {

    const url = 'https://api.open-meteo.com/v1/forecast?latitude=6.06&longitude=-73.64&current_weather=true';

    this.http.get<any>(url).subscribe({

      next: (data) => {

        const current = data.current_weather;

        if (current) {

          const temp = current.temperature;
          const code = current.weathercode;

          this.temperature = `${Math.round(temp)}°C`;
          this.weather = this.mapWeatherCode(code);

        }

      },

      error: () => {

        this.temperature = '--°';
        this.weather = '--';

      }

    });

  }

  private mapWeatherCode(code: number): string {

    const map: { [key: number]: string } = {

      0: '☀️ Despejado',
      1: '🌤 Mayormente despejado',
      2: '⛅ Parcialmente nublado',
      3: '☁️ Nublado',
      45: '🌫 Niebla',
      48: '🌫 Escarcha',
      51: '🌧 Lluvia ligera',
      53: '🌧 Lluvia moderada',
      55: '🌧 Lluvia intensa',
      56: '🌧 Lluvia helada ligera',
      57: '🌧 Lluvia helada intensa',
      61: '🌧 Lluvia ligera',
      63: '🌧 Lluvia moderada',
      65: '🌧 Lluvia intensa',
      66: '🌧 Lluvia helada ligera',
      67: '🌧 Lluvia helada intensa',
      71: '❄️ Nevada ligera',
      73: '❄️ Nevada moderada',
      75: '❄️ Nevada intensa',
      77: '❄️ Granizo',
      80: '🌧 Chubasco ligero',
      81: '🌧 Chubasco moderado',
      82: '🌧 Chubasco intenso',
      85: '❄️ Chubasco de nieve ligero',
      86: '❄️ Chubasco de nieve intenso',
      95: '⛈ Tormenta eléctrica',
      96: '⛈ Tormenta con granizo ligero',
      99: '⛈ Tormenta con granizo intenso'

    };

    return map[code] || '🌡 Sin datos';

  }

  // ============================================================
  //  PARTÍCULAS (nieve/lluvia)
  // ============================================================

  private initParticles(): void {

    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    if (!this.ctx) {
      console.warn('No se pudo obtener el contexto 2D del canvas');
      return;
    }

    // Ajustar tamaño al viewport
    this.resizeCanvas();

    // Crear partículas (nieve)
    const count = 120;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1.5,   // 1.5 - 4.5 px
        speedY: Math.random() * 0.6 + 0.2, // 0.2 - 0.8 px/frame
        opacity: Math.random() * 0.5 + 0.3 // 0.3 - 0.8
      });
    }

    // Iniciar animación
    this.animateParticles();

    // Redimensionar al cambiar ventana
    window.addEventListener('resize', () => this.resizeCanvas());

  }

  private resizeCanvas(): void {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private animateParticles(): void {

    if (!this.ctx) return;

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Actualizar y dibujar cada partícula
    for (const p of this.particles) {

      // Mover
      p.y += p.speedY;

      // Si sale por abajo, reaparecer arriba
      if (p.y > this.canvas.height) {
        p.y = -p.size;
        p.x = Math.random() * this.canvas.width;
        p.size = Math.random() * 3 + 1.5;
        p.speedY = Math.random() * 0.6 + 0.2;
        p.opacity = Math.random() * 0.5 + 0.3;
      }

      // Dibujar círculo (nieve)
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      this.ctx.fill();

    }

    // Solicitar siguiente frame
    this.animationFrame = requestAnimationFrame(() => this.animateParticles());

  }

}