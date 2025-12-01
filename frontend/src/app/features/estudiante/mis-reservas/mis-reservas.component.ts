import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../core/services/reservas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.css'
})
export class MisReservasComponent implements OnInit {
  private reservasService = inject(ReservasService);
  private authService = inject(AuthService);

  reservas: any[] = [];
  loading: boolean = true;

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authService.getUser();
    
    if (!usuario) {
      this.loading = false;
      return;
    }

    // Llamamos al servicio para traer las reservas de este usuario
    this.reservasService.getReservasPorUsuario(usuario.id).subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.loading = false;
      }
    });
  }

  // Función para asignar colores según el estado
  getClassEstado(estado: string): string {
    switch (estado) {
      case 'APROBADA': return 'badge-success';
      case 'RECHAZADA': return 'badge-danger';
      case 'PENDIENTE': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}