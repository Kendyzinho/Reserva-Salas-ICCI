import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private api = 'http://localhost:3000/reservas'; // ⇦ cámbialo por tu backend

  constructor(private http: HttpClient) {}

  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.api);
  }

  aprobarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.api}/${id}/aprobar`, {});
  }

  rechazarReserva(id: number): Observable<any> {
    return this.http.patch(`${this.api}/${id}/rechazar`, {});
  }
}
