import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { takeUntil, Subject } from 'rxjs';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
// --- IMPORTS CORREGIDOS ---
import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

  userName = '';
  roleLabel = '';

  greeting = '';
  currentTime = '';
  currentDate = '';
  weather = '--';
  temperature = '--°';
  dailyQuote = '';
  bannerImage = '';

  userLocation = 'Obteniendo ubicación…';

  private timer!: ReturnType<typeof setInterval>;
  private weatherTimer!: ReturnType<typeof setInterval>;
  private destroy$ = new Subject<void>();

  private http = inject(HttpClient);
  private profileService = inject(ProfileService);  // Inyectamos ProfileService
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {

    // ============================================================
    // SUSCRIPCIÓN AL PERFIL
    // ============================================================
    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile: UserProfile | null) => {

        console.log('PERFIL EN HOME:', profile);

        if (profile) {
          this.userName = profile.name;

          // Asignar roleLabel según el rol (usando mapa para simplificar)
          const roles: Record<string, string> = {
            teacher: 'Docente',
            student: 'Estudiante',
            admin: 'Administrador'
          };
          this.roleLabel = roles[profile.role] ?? '';
        } else {
          this.userName = '';
          this.roleLabel = '';
        }

        this.cdr.detectChanges();
      });

    // ============================================================
    // UBICACIÓN, CLIMA, RELOJ, ETC. (TODO IGUAL)
    // ============================================================
    this.getUserLocation();

    this.dailyQuote = this.getDailyQuote();
    this.updateDashboardInfo();

    this.timer = setInterval(() => this.updateDashboardInfo(), 1000);
    this.fetchWeather();
    this.weatherTimer = setInterval(() => this.fetchWeather(), 5 * 60 * 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.timer);
    clearInterval(this.weatherTimer);
  }

  // ============================
  // UBICACIÓN DINÁMICA
  // ============================
  private getUserLocation(): void {
    if (!navigator.geolocation) {
      this.userLocation = 'Ubicación no disponible';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.reverseGeocode(latitude, longitude);
      },
      () => {
        this.userLocation = 'Chipatá, Santander';
        this.cdr.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  private reverseGeocode(lat: number, lon: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=es`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.address) {
          const city = data.address.city || data.address.town || data.address.village || data.address.state || '';
          const country = data.address.country || '';
          this.userLocation = city && country ? `${city}, ${country}` : (city || country || 'Ubicación desconocida');
        } else {
          this.userLocation = 'Ubicación no disponible';
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.userLocation = 'Chipatá, Santander';
        this.cdr.detectChanges();
      }
    });
  }

  // ============================
  // RELOJ, FECHA, BANNER
  // ============================
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
    if (hour >= 5 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }

  private getBanner(date: Date): string {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'assets/backgrounds/morning-banner.png';
    if (hour >= 12 && hour < 19) return 'assets/backgrounds/afternoon-banner.png';
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

  // ============================
  // CLIMA
  // ============================
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
        this.cdr.detectChanges();
      },
      error: () => {
        this.temperature = '--°';
        this.weather = '--';
        this.cdr.detectChanges();
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