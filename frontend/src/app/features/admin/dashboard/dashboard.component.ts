import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../core/services/reservas.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private reservasService = inject(ReservasService);

  solicitudes: any[] = [];
  loading = true;

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.loading = true;
    this.reservasService.getTodasLasReservas().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  actualizarEstado(id: number, nuevoEstado: 'APROBADA' | 'RECHAZADA') {
    if (!confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;

    this.reservasService.cambiarEstadoReserva(id, nuevoEstado).subscribe({
      next: () => {
        // Actualizamos la lista localmente para no recargar todo
        const solicitud = this.solicitudes.find(s => s.id === id);
        if (solicitud) {
          solicitud.estado = nuevoEstado;
        }
        alert(`Solicitud ${nuevoEstado} correctamente.`);
      },
      error: (err) => alert('Error al actualizar estado.')
    });
  }

  // Helper para CSS
  getClassEstado(estado: string): string {
    switch (estado) {
      case 'APROBADA': return 'badge-success';
      case 'RECHAZADA': return 'badge-danger';
      case 'PENDIENTE': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}