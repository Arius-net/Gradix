import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno, AlumnoRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = '/api/alumnos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.apiUrl);
  }

  getById(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(`${this.apiUrl}/${id}`);
  }

  create(alumno: AlumnoRequest): Observable<Alumno> {
    return this.http.post<Alumno>(this.apiUrl, alumno);
  }

  update(id: number, alumno: AlumnoRequest): Observable<Alumno> {
    return this.http.put<Alumno>(`${this.apiUrl}/${id}`, alumno);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
