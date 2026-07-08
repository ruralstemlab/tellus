import { Component } from '@angular/core';
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
export class Home {

  teacherName = 'Henson Alberto';

  greeting = this.getGreeting();

  dailyQuote = this.getDailyQuote();

  bannerImage = this.getBanner();

  private getGreeting(): string {

    const hour = new Date().getHours();

    if (hour < 12) {

      return 'Buenos días';

    }

    if (hour < 18) {

      return 'Buenas tardes';

    }

    return 'Buenas noches';

  }

  private getBanner(): string {

    const hour = new Date().getHours();

    if (hour >= 6 && hour < 18) {

      return 'assets/backgrounds/light-banner.png';

    }

    return 'assets/backgrounds/dark-banner.png';

  }

  private getDailyQuote(): string {

    const quotes = [

      'Cada clase puede cambiar una vida.',

      'La curiosidad es el inicio del aprendizaje.',

      'Educar es sembrar futuro.',

      'Hoy tienes la oportunidad de inspirar a tus estudiantes.',

      'La tecnología tiene sentido cuando mejora la educación.'

    ];

    const index = new Date().getDate() % quotes.length;

    return quotes[index];

  }

}