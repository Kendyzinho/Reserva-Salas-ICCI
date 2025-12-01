import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../../core/services/reservas.service';

@Component({
  selector: 'app-gestion-salas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-salas.component.html',
  styleUrl: './gestion-salas.component.css'
})
export class GestionSalasComponent implements OnInit {
  private reservasService = inject(ReservasService);

  salas: any[] = [];
  nuevaSala = { nombre: '', capacidad: 20, ubicacion: '' };
  loading = false;

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.reservasService.getSalas().subscribe({
      next: (data) => this.salas = data,
      error: (err) => console.error(err)
    });
  }

  crearSala() {
    if (!this.nuevaSala.nombre) return;
    
    this.loading = true;
    this.reservasService.crearSala(this.nuevaSala).subscribe({
      next: () => {
        alert('Sala creada correctamente');
        this.nuevaSala = { nombre: '', capacidad: 20, ubicacion: '' }; // Reset form
        this.cargarSalas();
        this.loading = false;
      },
      error: (err) => {
        alert('Error al crear sala');
        console.error(err);
        this.loading = false;
      }
    });
  }

  cambiarEstado(sala: any) {
    const nuevoEstado = sala.estado === 'DISPONIBLE' ? 'MANTENCION' : 'DISPONIBLE';
    
    this.reservasService.actualizarEstadoSala(sala.id, nuevoEstado).subscribe({
      next: () => {
        sala.estado = nuevoEstado; // Actualizamos visualmente
      },
      error: (err) => alert('Error al cambiar estado')
    });
  }
  
  eliminarSala(id: number) {
    if(!confirm('¿Estás seguro? Esto podría borrar reservas asociadas.')) return;

    this.reservasService.eliminarSala(id).subscribe({
        next: () => this.cargarSalas(),
        error: () => alert('No se pudo eliminar la sala (puede que tenga reservas activas)')
    });
  }
}