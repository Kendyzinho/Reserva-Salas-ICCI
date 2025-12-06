import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface PasswordRequest {
  id: number;
  nombre: string;
  correo: string;
  rut: string;
  nueva_contrasena: string;
}

@Component({
  selector: 'app-ayudante-password-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './ayudante-password-panel.component.html',
  styleUrls: ['./ayudante-password-panel.component.css'],
})
export class AyudantePasswordPanelComponent implements OnInit {
  private http = inject(HttpClient);

  solicitudes: PasswordRequest[] = [];
  loading = false;
  mensaje = '';

  private baseUrl = 'http://localhost:3000/api'; // <-- URL del backend

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;
    this.http
      .get<PasswordRequest[]>(`${this.baseUrl}/ayudante/password-requests`)
      .pipe(
        catchError((err) => {
          console.error(err);
          this.mensaje = 'Error al cargar solicitudes';
          return of([]);
        })
      )
      .subscribe((data) => {
        this.solicitudes = data;
        this.loading = false;
      });
  }

  aprobar(solicitud: PasswordRequest) {
    const idAyudante = 7; // ID del ayudante logueado (puede venir de tu auth service)
    this.http
      .patch(
        `${this.baseUrl}/ayudante/password-requests/${solicitud.id}/approve`,
        {
          id_ayudante: idAyudante,
        }
      )
      .subscribe({
        next: () => {
          this.mensaje = `Contraseña de ${solicitud.nombre} actualizada y correo enviado`;
          this.solicitudes = this.solicitudes.filter(
            (s) => s.id !== solicitud.id
          );
        },
        error: (err) => {
          console.error(err);
          this.mensaje = 'Error al aprobar solicitud';
        },
      });
  }

  rechazar(solicitud: PasswordRequest) {
    const idAyudante = 7; // ID del ayudante logueado
    this.http
      .patch(
        `${this.baseUrl}/ayudante/password-requests/${solicitud.id}/reject`,
        {
          id_ayudante: idAyudante,
        }
      )
      .subscribe({
        next: () => {
          this.mensaje = `Solicitud de ${solicitud.nombre} rechazada`;
          this.solicitudes = this.solicitudes.filter(
            (s) => s.id !== solicitud.id
          );
        },
        error: (err) => {
          console.error(err);
          this.mensaje = 'Error al rechazar solicitud';
        },
      });
  }
}
