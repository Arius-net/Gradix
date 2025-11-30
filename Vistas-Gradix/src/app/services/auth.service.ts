import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Docente } from '../models';
import { ApiAuthService } from './api-auth.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiAuthService = inject(ApiAuthService);
  private dataService = inject(DataService);
  
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

  login(email: string, password: string, isRegistering: boolean = false, nombre?: string): Promise<boolean> {
    if (isRegistering) {
      // Registro con API
      return new Promise((resolve) => {
        this.apiAuthService.register({
          nombre: nombre || email.split('@')[0],
          correo: email,
          password: password
        }).subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('gradix_token', response.token);
            }
            if (response.user) {
              localStorage.setItem('gradix_docenteId', response.user.id.toString());
            }
            localStorage.setItem('gradix_currentUser', email);
            if (nombre) {
              localStorage.setItem('gradix_userName', nombre);
            }
            this.isAuthenticated.set(true);
            this.currentUser.set(email);
            
            // Cargar todos los datos desde la API después de registro exitoso
            this.dataService.loadData();
            
            resolve(true);
          },
          error: (err) => {
            resolve(false);
          }
        });
      });
    } else {
      // Login con API
      return new Promise((resolve) => {
        this.apiAuthService.login({
          correo: email,
          password: password
        }).subscribe({
          next: (response) => {
            if (response.token) {
              localStorage.setItem('gradix_token', response.token);
            }
            if (response.user) {
              localStorage.setItem('gradix_docenteId', response.user.id.toString());
            }
            localStorage.setItem('gradix_currentUser', email);
            this.isAuthenticated.set(true);
            this.currentUser.set(email);
            
            // Cargar todos los datos desde la API después de login exitoso
            this.dataService.loadData();
            
            resolve(true);
          },
          error: (err) => {
            resolve(false);
          }
        });
      });
    }
  }

  logout(): void {
    localStorage.removeItem('gradix_currentUser');
    localStorage.removeItem('gradix_token');
    localStorage.removeItem('gradix_docenteId');
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getDocenteId(): number {
    const id = localStorage.getItem('gradix_docenteId');
    return id ? parseInt(id, 10) : 1;
  }

  getDocenteName(): string {
    const userName = localStorage.getItem('gradix_userName');
    if (userName) {
      return userName;
    }
    
    const storedDocente = localStorage.getItem('gradix_docente');
    if (storedDocente) {
      const docente: Docente = JSON.parse(storedDocente);
      return docente.nombre;
    }
    return 'Docente';
  }
}

