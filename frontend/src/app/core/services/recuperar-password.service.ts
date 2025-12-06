import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para la respuesta de la solicitud
interface ResetRequestPayload {
  correo: string;
  nueva_contrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecuperarPasswordService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // URL base de tu API

  checkEmailExists(correo: string): Observable<{ exists: boolean }> {
    // Usamos un GET con el correo como parámetro de consulta
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-email`, {
      params: { correo: correo },
    });
  }

  sendResetRequest(payload: ResetRequestPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/password-reset-request`, payload);
  }
}
