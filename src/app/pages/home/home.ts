import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

import { ProfileService } from '../../core/services/profile.service';
import { UserProfile } from '../../core/models/user-profile.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterLink,
    Navbar,
    Footer
  ],
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
  private profileService = inject(ProfileService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {

    this.profileService.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe((profile: UserProfile | null) => {

        if (profile) {

          this.userName = profile.name;

          const roles: Record<string, string> = {

            teacher: 'Docente',
            student: 'Estudiante',
            admin: 'Administrador',
            developer: 'Developer'

          };

          this.roleLabel = roles[profile.role] ?? '';

        } else {

          this.userName = '';
          this.roleLabel = '';

        }

        this.cdr.detectChanges();

      });

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

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state ||
            '';

          const country =
            data.address.country ||
            '';

          this.userLocation =
            city && country
              ? `${city}, ${country}`
              : city || country || 'Ubicación desconocida';

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

    if (hour >= 5 && hour < 12)
      return 'assets/backgrounds/morning-banner.png';

    if (hour >= 12 && hour < 19)
      return 'assets/backgrounds/afternoon-banner.png';

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

    const url =
      'https://api.open-meteo.com/v1/forecast?latitude=6.06&longitude=-73.64&current_weather=true';

    this.http.get<any>(url).subscribe({

      next: (data) => {

        const current = data.current_weather;

        if (current) {

          this.temperature = `${Math.round(current.temperature)}°C`;

          this.weather = this.mapWeatherCode(current.weathercode);

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

      0:'☀️ Despejado',
      1:'🌤 Mayormente despejado',
      2:'⛅ Parcialmente nublado',
      3:'☁️ Nublado',
      45:'🌫 Niebla',
      48:'🌫 Escarcha',
      51:'🌧 Lluvia ligera',
      53:'🌧 Lluvia moderada',
      55:'🌧 Lluvia intensa',
      61:'🌧 Lluvia ligera',
      63:'🌧 Lluvia moderada',
      65:'🌧 Lluvia intensa',
      71:'❄️ Nevada ligera',
      73:'❄️ Nevada moderada',
      75:'❄️ Nevada intensa',
      80:'🌧 Chubasco ligero',
      81:'🌧 Chubasco moderado',
      82:'🌧 Chubasco intenso',
      95:'⛈ Tormenta eléctrica',
      96:'⛈ Tormenta con granizo',
      99:'⛈ Tormenta severa'

    };

    return map[code] || '🌡 Sin datos';

  }

}