import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Logo } from '../../../components/logo/logo';
import { InputComponent } from '../../../components/input/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,

    // ⚠️ Solo mantenlos si realmente los usas en HTML
    Logo,
    InputComponent
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  email = '';
  password = '';
  rememberMe = false;

  loading = false;
  showPassword = false;
  error = '';

  constructor(private router: Router) {}

  login(): void {

    this.loading = true;
    this.error = '';

    console.log('LOGIN TELLUS');
    console.log('email:', this.email);

    setTimeout(() => {

      this.loading = false;

      if (!this.email || !this.password) {
        this.error = 'Completa todos los campos';
        return;
      }

      // Simulación auth
      localStorage.setItem('auth', 'true');

      // 🚀 Ecosistema Tellus
      this.router.navigate(['/tellus']);

    }, 1000);
  }

  loginWithGoogle(): void {
    console.log('Google login');
  }

  loginWithMicrosoft(): void {
    console.log('Microsoft login');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}