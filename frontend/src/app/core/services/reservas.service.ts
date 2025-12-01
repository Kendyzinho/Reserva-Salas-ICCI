import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private http = inject(HttpClient);
  
  // Asegúrate de que este puerto sea el correcto (donde corre tu backend node index.js)
  private apiUrl = 'http://localhost:3000/api'; 

  // 1. Obtener lista de salas
  getSalas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/salas`);
  }

  // 2. Obtener reservas de una sala específica (Para el calendario)
  getReservasPorSala(salaId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas?salaId=${salaId}`);
  }

  // 3. Obtener reservas de un usuario (ESTA ES LA QUE TE FALTABA)
  getReservasPorUsuario(userId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservas/usuario/${userId}`);
  }

  // 4. Crear una nueva reserva
  crearReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reservas`, reserva);
  }
}