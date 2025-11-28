import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriterioRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CriterioService {
  private apiUrl = '/api/criterios';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(criterio: CriterioRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, criterio);
  }

  update(id: number, criterio: CriterioRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, criterio);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
