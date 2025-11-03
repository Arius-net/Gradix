import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  email = signal('');
  password = signal('');
  isRegistering = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');

    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    const success = this.authService.login(
      this.email(),
      this.password(),
      this.isRegistering()
    );

    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Credenciales incorrectas');
    }
  }

  toggleMode(): void {
    this.isRegistering.update(val => !val);
    this.errorMessage.set('');
  }
}
