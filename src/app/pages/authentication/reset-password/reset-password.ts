import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {

  password = '';

  confirmPassword = '';

  showPassword = false;

  showConfirmPassword = false;

  resetPassword(): void {

    console.log('===============================');
    console.log('Restablecer contraseña');
    console.log('Nueva contraseña:', this.password);
    console.log('===============================');

    alert('Tu contraseña ha sido actualizada correctamente.');

  }

}