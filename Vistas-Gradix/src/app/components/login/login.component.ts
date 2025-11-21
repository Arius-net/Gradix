import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  email = signal('');
  password = signal('');
  nombre = signal('');
  confirmPassword = signal('');
  isRegistering = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email())) {
      this.errorMessage.set('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validaciones adicionales para registro
    if (this.isRegistering()) {
      if (!this.nombre()) {
        this.errorMessage.set('Por favor ingresa tu nombre completo');
        return;
      }

      if (this.password().length < 6) {
        this.errorMessage.set('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (this.password() !== this.confirmPassword()) {
        this.errorMessage.set('Las contraseñas no coinciden');
        return;
      }
    }

    const success = this.authService.login(
      this.email(),
      this.password(),
      this.isRegistering(),
      this.nombre()
    );

    if (success) {
      if (this.isRegistering()) {
        this.successMessage.set('Registro exitoso. Redirigiendo...');
      } else {
        this.successMessage.set('Inicio de sesión exitoso. Redirigiendo...');
      }
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      this.errorMessage.set('Credenciales incorrectas');
    }
  }

  toggleMode(): void {
    this.isRegistering.update(val => !val);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.nombre.set('');
    this.confirmPassword.set('');
  }

  fillDemoCredentials(): void {
    this.email.set('maria.garcia@telesecundaria.edu.mx');
    this.password.set('demo123');
    this.isRegistering.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}
