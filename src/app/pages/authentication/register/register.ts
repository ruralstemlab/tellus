import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  createAccount(): void {

    console.log('=================================');
    console.log('Nuevo registro');
    console.log('Nombre:', this.fullName);
    console.log('Correo:', this.email);
    console.log('Contraseña:', this.password);
    console.log('=================================');

  }

}