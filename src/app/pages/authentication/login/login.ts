import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Logo } from '../../../components/logo/logo';
import { InputComponent } from '../../../components/input/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    Logo,
    InputComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email: string = '';

  password: string = '';

  rememberMe: boolean = false;

  loading: boolean = false;

  showPassword: boolean = false;

  constructor(
    private router: Router
  ) {}

  login(): void {

    this.loading = true;

    console.clear();

    console.log('===================================');
    console.log('TELLUS AUTHENTICATION');
    console.log('===================================');
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    console.log('Recordarme:', this.rememberMe);

    setTimeout(() => {

      this.loading = false;

      this.router.navigate(['/dashboard']);

    }, 1200);

  }

  loginWithGoogle(): void {

    console.log('Login con Google');

  }

  loginWithMicrosoft(): void {

    console.log('Login con Microsoft');

  }

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

}