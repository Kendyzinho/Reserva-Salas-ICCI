import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  // CAMBIO: Ponlo en false para usar tu Backend real de MySQL
  usarMock: boolean = false; 

  salas = [
    { id: 1, nombre: 'Guallatire' },
    { id: 2, nombre: 'Parinacota' },
    { id: 3, nombre: 'Pomerape' },
    { id: 4, nombre: 'Socompa' },
    { id: 5, nombre: 'Azufre' },
    { id: 6, nombre: 'Licancabur' }
  ];

  salaSeleccionada: number = 1;
  reservas: any[] = [];

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  bloques = [
    { bloque: 1, inicio: '08:00:00', fin: '09:30:00' },
    { bloque: 2, inicio: '09:40:00', fin: '11:10:00' },
    { bloque: 3, inicio: '11:20:00', fin: '12:50:00' },
    { bloque: 4, inicio: '14:45:00', fin: '16:15:00' },
    { bloque: 5, inicio: '16:20:00', fin: '17:50:00' },
    { bloque: 6, inicio: '18:00:00', fin: '19:30:00' }
  ];

  // --- Mock Data (Solo respaldo) ---
  private mockData: Record<number, any[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };

  // --- Variables del Modal ---
  mostrarModal: boolean = false;
  modoCrear: boolean = true;
  selectedReserva: any = null;
  
  // NUEVO: Variable para el checkbox de reglas
  aceptaReglas: boolean = false;

  formReserva: any = {
    motivo: '',
    profesor: '',
    asignatura: '',
    fecha: '',
    bloqueInicio: '',
    salaId: 0,
    cantidadPersonas: 1 // NUEVO CAMPO
  };

  ngOnInit() {
    this.cargarReservas();
  }

  onCambioSala() {
    this.cargarReservas();
  }

  cargarReservas() {
    if (this.usarMock) {
      this.reservas = (this.mockData[this.salaSeleccionada] || []).map(r => ({ ...r }));
      return;
    }

    // Backend Real
    this.reservasService.getReservasPorSala(this.salaSeleccionada)
      .subscribe({
        next: (data: any[]) => { this.reservas = data; },
        error: (err) => { console.error('Error cargando reservas:', err); this.reservas = []; }
      });
  }

  obtenerReserva(diaColumna: string, bloqueInicio: string) {
    return this.reservas.find((r: any) => {
      const fechaString = r.fecha.includes('T') ? r.fecha : `${r.fecha}T00:00:00`;
      const fechaReserva = new Date(fechaString);
      const diaReserva = this.getDiaNombre(fechaReserva);
      // Comparar bloque (cortando segundos si es necesario para asegurar coincidencia)
      return diaReserva === diaColumna && r.bloqueInicio.slice(0,5) === bloqueInicio.slice(0,5);
    });
  }

  getDiaNombre(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  // --- ABRIR MODAL ---
  openInfo(dia: string, bloqueInicio: string, reservaReal?: any) {
    this.aceptaReglas = false; // Resetear reglas siempre que se abre

    if (reservaReal) {
      this.modoCrear = false;
      this.selectedReserva = reservaReal;
    } else {
      this.modoCrear = true;
      this.formReserva = {
        motivo: '',
        profesor: '',
        asignatura: '',
        fecha: this.diaToFechaString(dia),
        bloqueInicio: bloqueInicio,
        salaId: this.salaSeleccionada,
        cantidadPersonas: 1 // Valor por defecto
      };
    }
    this.mostrarModal = true;
  }

  abrirFormularioGeneral() {
    this.aceptaReglas = false; // Resetear reglas
    this.modoCrear = true;
    this.formReserva = {
      motivo: '',
      profesor: '',
      asignatura: '',
      fecha: '',
      bloqueInicio: '',
      salaId: this.salaSeleccionada,
      cantidadPersonas: 1
    };
    this.mostrarModal = true;
  }

  diaToFechaString(diaNombre: string): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const target = dias.indexOf(diaNombre);
    const hoy = new Date();
    const hoyDia = hoy.getDay();
    let diff = target - hoyDia;
    if (diff < 0) diff += 7;
    const result = new Date(hoy);
    result.setDate(hoy.getDate() + diff);
    const yyyy = result.getFullYear();
    const mm = (result.getMonth() + 1).toString().padStart(2, '0');
    const dd = result.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  crearReservaEnviar() {
    // Validar Reglas
    if (!this.aceptaReglas) {
      alert('Debes aceptar las normas de uso para continuar.');
      return;
    }

    if (!this.formReserva.fecha || !this.formReserva.bloqueInicio || !this.formReserva.motivo) {
      alert('Completa los campos obligatorios.');
      return;
    }

    const nueva = {
      // id: se genera en backend
      usuarioId: 1, // Hardcodeado por ahora (deberías sacar del authService)
      motivo: this.formReserva.motivo,
      profesor: this.formReserva.profesor,
      asignatura: this.formReserva.asignatura,
      fecha: this.formReserva.fecha,
      bloqueInicio: this.formReserva.bloqueInicio,
      bloqueFin: this.calcularFin(this.formReserva.bloqueInicio),
      estado: 'PENDIENTE', // Siempre nace pendiente
      salaId: Number(this.formReserva.salaId),
      cantidadPersonas: this.formReserva.cantidadPersonas
    };

    if (this.usarMock) {
      if (!this.mockData[this.salaSeleccionada]) this.mockData[this.salaSeleccionada] = [];
      this.mockData[this.salaSeleccionada].push({ ...nueva, id: 999, estado: 'APROBADA' });
      this.cargarReservas();
      this.mostrarModal = false;
      return;
    }

    // Backend Real
    this.reservasService.crearReserva(nueva).subscribe({
      next: () => {
        alert('Solicitud enviada con éxito');
        this.cargarReservas();
        this.mostrarModal = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear reserva.');
      }
    });
  }

  calcularFin(inicio: string): string {
    // Busca el bloque en tu array para sacar el fin exacto
    const b = this.bloques.find(x => x.inicio === inicio);
    return b ? b.fin : inicio; 
  }

  closeModal() {
    this.mostrarModal = false;
    this.selectedReserva = null;
  }
}