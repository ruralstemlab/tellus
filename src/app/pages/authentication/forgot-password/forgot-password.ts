import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {

  email = '';

  sendRecoveryEmail(): void {

    console.log('===============================');
    console.log('Recuperar contraseña');
    console.log('Correo:', this.email);
    console.log('===============================');

    alert('Se ha enviado un enlace de recuperación a tu correo electrónico.');

  }

}