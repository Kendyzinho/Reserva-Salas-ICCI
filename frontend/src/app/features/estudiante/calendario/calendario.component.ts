import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// CORRECCIÓN 1: Ajuste de ruta (3 retrocesos en vez de 4)
import { ReservasService } from '../../../core/services/reservas.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  private reservasService = inject(ReservasService);

  salas: any[] = [];
  reservas: any[] = [];
  salaSeleccionada: number = 0; 

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  bloquesHorarios = [
    '08:00:00', '09:30:00', '11:00:00', '12:30:00', 
    '14:00:00', '15:30:00', '17:00:00', '18:30:00'
  ];

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    // CORRECCIÓN 2: Tipado explícito (data: any[])
    this.reservasService.getSalas().subscribe((data: any[]) => {
      this.salas = data;
      if (this.salas.length > 0) {
        this.salaSeleccionada = this.salas[0].id;
        this.cargarReservas();
      }
    });
  }

  cargarReservas() {
    if (!this.salaSeleccionada) return;

    // CORRECCIÓN 3: Tipado explícito (data: any[])
    this.reservasService.getReservasPorSala(this.salaSeleccionada)
      .subscribe((data: any[]) => {
        console.log('Reservas recibidas:', data);
        this.reservas = data;
      });
  }

  onCambioSala() {
    this.cargarReservas();
  }

  obtenerReserva(diaColumna: string, horaFila: string) {
    // Tipamos 'r' como any para evitar errores aquí también
    return this.reservas.find((r: any) => {
      // Convertir fecha string a objeto Date
      // Nota: Si la fecha viene como '2025-11-24', agregamos 'T00:00' para evitar líos de zona horaria
      const fechaString = r.fecha.includes('T') ? r.fecha : `${r.fecha}T00:00:00`;
      const fechaReserva = new Date(fechaString);
      
      const diaReserva = this.getDiaNombre(fechaReserva);

      return diaReserva === diaColumna && r.bloqueInicio === horaFila;
    });
  }

  getDiaNombre(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()]; 
  }
}