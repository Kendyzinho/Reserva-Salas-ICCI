import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sala } from '../../../core/models/sala.model';

@Injectable({
  providedIn: 'root',
})
export class SalaService {
  private apiUrl = 'http://localhost:3000/sala';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sala[]> {
    return this.http.get<Sala[]>(this.apiUrl);
  }

  create(sala: Omit<Sala, 'id_sala'>): Observable<Sala> {
    return this.http.post<Sala>(this.apiUrl, sala);
  }

  update(id: number, sala: Partial<Sala>): Observable<Sala> {
    return this.http.patch<Sala>(`${this.apiUrl}/${id}`, sala);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
