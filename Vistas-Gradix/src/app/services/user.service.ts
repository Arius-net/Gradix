import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // El proxy redirige esto a http://localhost:8081/api/users
  private apiUrl = '/api/users'; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    // Hace una petición GET a la API de Ktor
    return this.http.get<any>(this.apiUrl);
  }
  
  createUser(userData: any): Observable<any> {
    // Hace una petición POST (ej. para crear un nuevo usuario)
    return this.http.post<any>(this.apiUrl, userData);
  }
}
