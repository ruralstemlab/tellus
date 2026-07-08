import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Navbar,
    Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit, OnDestroy {

  teacherName = 'Henson Alberto';

  greeting = '';

  currentTime = '';

  currentDate = '';

  weather = 'Próximamente';

  temperature = '--°';

  dailyQuote = '';

  bannerImage = '';

  private timer!: ReturnType<typeof setInterval>;

  ngOnInit(): void {

    this.dailyQuote = this.getDailyQuote();

    this.updateDashboardInfo();

    this.timer = setInterval(() => {

      this.updateDashboardInfo();

    }, 1000);

  }

  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);

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

    // 🌅 Mañana
    if (hour >= 5 && hour < 12) {

      return 'Buenos días';

    }

    // 🌞 Tarde
    if (hour >= 12 && hour < 19) {

      return 'Buenas tardes';

    }

    // 🌙 Noche
    return 'Buenas noches';

  }

  private getBanner(date: Date): string {

    const hour = date.getHours();

    // 🌅 Mañana
    if (hour >= 5 && hour < 12) {

      return 'assets/backgrounds/morning-banner.png';

    }

    // 🌞 Tarde
    if (hour >= 12 && hour < 19) {

      return 'assets/backgrounds/afternoon-banner.png';

    }

    // 🌙 Noche
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

}