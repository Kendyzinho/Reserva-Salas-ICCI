import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ReservasService } from '../../../core/services/reservas.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css'],
})
export class MisReservasComponent implements OnInit {
  private reservasService = inject(ReservasService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  reservas: any[] = [];
  loading: boolean = true;

  // --- Editar reserva ---
  editReservaId: string | null = null;
  editForm = this.fb.group({
    fecha: [''],
    motivo: [''],
    cantidadPersonas: [''],
  });

  ngOnInit() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    const usuario = this.authService.getUser();
    if (!usuario) {
      this.loading = false;
      return;
    }

    this.reservasService.getReservasPorUsuario(usuario.id).subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando historial', err);
        this.loading = false;
      },
    });
  }

  getClassEstado(estado: string): string {
    switch (estado) {
      case 'APROBADA':
        return 'badge-success';
      case 'RECHAZADA':
        return 'badge-danger';
      case 'PENDIENTE':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  // --- Funciones de edición ---
  iniciarEdicion(reserva: any) {
    this.editReservaId = reserva.id;
    this.editForm.setValue({
      fecha: reserva.fecha || '',
      motivo: reserva.motivo || '',
      cantidadPersonas: reserva.cantidadPersonas?.toString() || '1',
    });
  }

  cancelarEdicion() {
    this.editReservaId = null;
  }

  guardarEdicion(reservaId: string) {
    const formValue = this.editForm.value;
    const idNum = Number(reservaId);
    console.log('EDITANDO RESERVA:', idNum, formValue);

    const updatedData = {
      fecha: formValue.fecha || '',
      motivo: formValue.motivo || '',
      cantidadPersonas: Number(formValue.cantidadPersonas) || 1,
    };

    this.reservasService.actualizarReserva(idNum, updatedData).subscribe({
      next: (res) => {
        console.log('Respuesta backend:', res);
        const index = this.reservas.findIndex((r) => r.id === idNum);
        if (index !== -1) {
          this.reservas[index] = { ...this.reservas[index], ...updatedData };
        }
        this.editReservaId = null;
      },
      error: (err) => console.error('Error al actualizar:', err),
    });
  }

  eliminarReserva(reservaId: string) {
    if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return;
    const idNum = Number(reservaId);

    this.reservasService.eliminarReserva(idNum).subscribe({
      next: () => {
        this.reservas = this.reservas.filter((r) => r.id !== idNum);
      },
      error: (err) => console.error('Error al eliminar reserva', err),
    });
  }

  trackById(index: number, reserva: any) {
    return reserva.id; // o cualquier propiedad única de tu reserva
  }
}
