import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private http = inject(HttpClient);
  
  // Asegúrate de que este puerto (3000) sea el mismo que muestra tu terminal de backend
  private apiUrl = 'http://localhost:3000/api'; 

  // 1. Obtener lista de salas
  getSalas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/salas`);
  }

  // 2. Obtener reservas de una sala específica
  // Aceptamos number o string para evitar errores de tipo
  getReservasPorSala(salaId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas?salaId=${salaId}`);
  }

  // 3. Crear una nueva reserva (Este es el que probablemente te faltaba)
  crearReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservas`, reserva);
  }
}