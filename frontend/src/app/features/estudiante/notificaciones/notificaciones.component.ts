import { Component, inject, Input, OnInit } from '@angular/core';
import { Notificacion } from '../../../core/models/notificacion.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  private http = inject(HttpClient);

  notificaciones: Notificacion[] = [];

  private _mostrar = false;
  @Input() usuarioId?: number;

  @Input() set mostrar(valor: boolean) {
    this._mostrar = valor;
    if (valor && this.usuarioId) this.cargarNotificaciones();
  }
  get mostrar(): boolean {
    return this._mostrar;
  }

  ngOnInit() {}

  cargarNotificaciones() {
    if (!this.usuarioId) return;
    this.http
      .get<Notificacion[]>(
        `http://localhost:3000/api/notificaciones/usuario/${this.usuarioId}`
      )
      .subscribe((res) => {
        this.notificaciones = res.map((n) => ({ ...n, leido: !!n.leido }));
      });
  }

  marcarComoLeida(notificacion: Notificacion) {
    this.http
      .patch(`/api/notificaciones/${notificacion.id}/leer`, {})
      .subscribe(() => (notificacion.leido = true));
  }
}
