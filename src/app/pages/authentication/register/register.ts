import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async register(): Promise<void> {

    // Validar contraseñas
    if (this.password !== this.confirmPassword) {
      alert('❌ Las contraseñas no coinciden.');
      return;
    }

    // Validar términos
    if (!this.acceptTerms) {
      alert('❌ Debes aceptar los términos y condiciones.');
      return;
    }

    try {

      await this.authService.register(
        this.email,
        this.password
      );

      alert('✅ ¡Cuenta creada exitosamente!');

      this.router.navigate(['/login']);

    } catch (error: any) {

      console.error(error);

      switch (error.code) {

        case 'auth/email-already-in-use':
          alert('❌ Este correo ya está registrado.');
          break;

        case 'auth/weak-password':
          alert('❌ La contraseña debe tener mínimo 6 caracteres.');
          break;

        case 'auth/invalid-email':
          alert('❌ El correo electrónico no es válido.');
          break;

        default:
          alert('❌ Error al crear la cuenta.');
          console.error(error);
      }

    }

  }

}