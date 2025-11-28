import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CampoFormativoService {
  private apiUrl = '/api/campos-formativos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(campoFormativo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, campoFormativo);
  }

  update(id: number, campoFormativo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, campoFormativo);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
