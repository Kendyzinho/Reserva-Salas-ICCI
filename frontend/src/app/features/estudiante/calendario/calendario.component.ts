import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para el <select>
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // Datos para la vista
  salas: any[] = [];
  reservas: any[] = [];
  salaSeleccionada: string = 'azufre'; // Valor por defecto

  // Configuración del Calendario
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  
  // Generamos bloques de 1 hora y media (o como prefieras)
  // Aquí puse intervalos de ejemplo según tu horario 8:00 a 19:30
  bloquesHorarios = [
    '08:00', '09:30', '11:00', '12:30', 
    '14:00', '15:30', '17:00', '18:30'
  ];

  ngOnInit() {
    this.cargarSalas();
    this.cargarReservas();
  }

  cargarSalas() {
    this.http.get<any[]>(`${this.apiUrl}/salas`).subscribe(data => {
      this.salas = data;
    });
  }

  cargarReservas() {
    // Truco: JSON Server permite filtrar directo en la URL
    // ?salaId=azufre
    this.http.get<any[]>(`${this.apiUrl}/reservas?salaId=${this.salaSeleccionada}`)
      .subscribe(data => {
        this.reservas = data;
      });
  }

  // Evento cuando cambias el select
  onCambioSala() {
    this.cargarReservas();
  }

  // Función auxiliar para pintar la celda
  obtenerReserva(dia: string, hora: string) {
    return this.reservas.find(r => r.dia === dia && r.bloqueInicio === hora);
  }
}