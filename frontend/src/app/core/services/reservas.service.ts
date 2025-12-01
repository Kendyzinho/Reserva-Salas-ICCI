import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Tu Backend real

  // Obtener lista de salas
  getSalas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/salas`);
  }

  // Obtener reservas de una sala específica
  getReservasPorSala(salaId: string | number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas?salaId=${salaId}`);
  }
}