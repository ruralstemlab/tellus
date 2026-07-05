import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Logo } from '../../../components/logo/logo';
import { InputComponent } from '../../../components/input/input';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
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

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async login(): Promise<void> {

    this.loading = true;
    this.error = '';

    if (!this.email || !this.password) {
      this.loading = false;
      this.error = 'Completa todos los campos';
      return;
    }

    try {

      await this.authService.login(
        this.email,
        this.password
      );

      this.loading = false;

      this.router.navigate(['/tellus']);

    } catch (error: any) {

      this.loading = false;

      switch (error.code) {

        case 'auth/invalid-credential':
          this.error = 'Correo o contraseña incorrectos.';
          break;

        case 'auth/invalid-email':
          this.error = 'Correo electrónico inválido.';
          break;

        default:
          this.error = 'No fue posible iniciar sesión.';
      }

      console.error(error);

    }

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