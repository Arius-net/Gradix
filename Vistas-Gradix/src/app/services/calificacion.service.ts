import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = '/api/calificaciones';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(calificacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, calificacion);
  }

  update(id: number, calificacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, calificacion);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
