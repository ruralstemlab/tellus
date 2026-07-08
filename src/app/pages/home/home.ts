import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { takeUntil, Subject } from 'rxjs';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

// Ruta correcta hacia el AuthService
import { AuthService } from '../../core/auth/auth.service';

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
export class Home implements OnInit, OnDestroy {

  teacherName = 'Profesor'; // valor por defecto mientras carga

  greeting = '';

  currentTime = '';

  currentDate = '';

  weather = '--';

  temperature = '--°';

  dailyQuote = '';

  bannerImage = '';

  private timer!: ReturnType<typeof setInterval>;
  private weatherTimer!: ReturnType<typeof setInterval>;
  private destroy$ = new Subject<void>();

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  ngOnInit(): void {

    // 1. Obtener el nombre del usuario logueado desde Firebase
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          // Usar displayName o el email como fallback
          const name = user.displayName || user.email?.split('@')[0] || 'Profesor';
          this.teacherName = name;
        } else {
          this.teacherName = 'Profesor';
        }
      });

    // 2. Resto de la inicialización
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

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

    if (this.timer) {
      clearInterval(this.timer);
    }

    if (this.weatherTimer) {
      clearInterval(this.weatherTimer);
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

}