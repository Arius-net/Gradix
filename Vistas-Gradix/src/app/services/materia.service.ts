import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, MateriaRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  private apiUrl = '/api/materias';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Materia[]> {
    return this.http.get<Materia[]>(this.apiUrl);
  }

  getById(id: number): Observable<Materia> {
    return this.http.get<Materia>(`${this.apiUrl}/${id}`);
  }

  create(materia: MateriaRequest): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  update(id: number, materia: MateriaRequest): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${id}`, materia);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
