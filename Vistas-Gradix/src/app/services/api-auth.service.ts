import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
}

export interface LoginData {
  correo: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user?: any;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiAuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) { }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  me(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }
}
