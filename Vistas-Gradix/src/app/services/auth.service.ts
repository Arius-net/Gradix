import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Docente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<string | null>(null);

  constructor(private router: Router) {
    this.checkAuth();
  }

  checkAuth(): void {
    const currentUser = localStorage.getItem('gradix_currentUser');
    if (currentUser) {
      this.isAuthenticated.set(true);
      this.currentUser.set(currentUser);
    }
  }

  login(email: string, password: string, isRegistering: boolean = false): boolean {
    const storedDocente = localStorage.getItem('gradix_docente');
    
    if (!storedDocente) {
      return false;
    }

    const docente: Docente = JSON.parse(storedDocente);

    if (isRegistering) {
      // Registro
      docente.email = email;
      docente.password = password;
      localStorage.setItem('gradix_docente', JSON.stringify(docente));
      localStorage.setItem('gradix_currentUser', email);
      this.isAuthenticated.set(true);
      this.currentUser.set(email);
      return true;
    } else {
      // Login
      if (docente.email === email && docente.password === password) {
        localStorage.setItem('gradix_currentUser', email);
        this.isAuthenticated.set(true);
        this.currentUser.set(email);
        return true;
      }
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('gradix_currentUser');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getDocenteName(): string {
    const storedDocente = localStorage.getItem('gradix_docente');
    if (storedDocente) {
      const docente: Docente = JSON.parse(storedDocente);
      return docente.nombre;
    }
    return 'Docente';
  }
}
