import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReservasService } from './reservas.service';

@Component({
  selector: 'app-listado-reservas',
  standalone: true,
  templateUrl: './listado-reservas.component.html',
  styleUrls: ['./listado-reservas.component.css'],
  imports: [CommonModule, RouterModule],
})
export class ListadoReservasComponent implements OnInit {
  reservas: any[] = [];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas() {
    this.reservasService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
      },
      error: (err) => {
        console.error('Error al cargar reservas', err);
      },
    });
  }

  aprobar(id: number) {
    this.reservasService.aprobarReserva(id).subscribe({
      next: () => {
        alert('Reserva aprobada');
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al aprobar reserva', err);
      },
    });
  }

  rechazar(id: number) {
    this.reservasService.rechazarReserva(id).subscribe({
      next: () => {
        alert('Reserva rechazada');
        this.cargarReservas();
      },
      error: (err) => {
        console.error('Error al rechazar reserva', err);
      },
    });
  }
}
