import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../../core/services/reservas.service';
// 1. IMPORTAR AUTH SERVICE
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent implements OnInit {
  private reservasService = inject(ReservasService);
  // 2. INYECTAR AUTH SERVICE
  private authService = inject(AuthService);

  // ---------- CONFIG ----------
  usarMock: boolean = false;

  salas: any[] = [];
  salaSeleccionada: number = 0;
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

  // Variables del Modal
  mostrarModal: boolean = false;
  modoCrear: boolean = true;
  selectedReserva: any = null;
  aceptaReglas: boolean = false;

  // Mock Data (Vacío porque usas Backend)
  private mockData: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  formReserva: any = {
    motivo: '',
    profesor: '',
    asignatura: '',
    fecha: '',
    bloqueInicio: '',
    salaId: 0,
    cantidadPersonas: 1
  };

  ngOnInit() {
    this.cargarSalas();
  }

  cargarSalas() {
    this.reservasService.getSalas().subscribe({
      next: (data: any[]) => {
        this.salas = data;
        if (this.salas.length > 0) {
          this.salaSeleccionada = this.salas[0].id;
          this.cargarReservas();
        }
      },
      error: (err) => console.error('Error al cargar salas:', err)
    });
  }

  onCambioSala() {
    this.cargarReservas();
  }

  cargarReservas() {
    if (this.usarMock) {
       this.reservas = (this.mockData[this.salaSeleccionada] || []).map(r => ({ ...r }));
       return;
    }

    if (!this.salaSeleccionada) return;

    this.reservasService.getReservasPorSala(this.salaSeleccionada)
      .subscribe({
        next: (data: any[]) => { this.reservas = data; },
        error: (err: any) => { console.error('Error cargando reservas:', err); this.reservas = []; }
      });
  }

  obtenerReserva(diaColumna: string, bloqueInicio: string) {
    return this.reservas.find((r: any) => {
      const fechaString = r.fecha.includes('T') ? r.fecha : `${r.fecha}T00:00:00`;
      const fechaReserva = new Date(fechaString);
      const diaReserva = this.getDiaNombre(fechaReserva);

      return diaReserva === diaColumna && r.bloqueInicio.slice(0,5) === bloqueInicio.slice(0,5);
    });
  }

  getDiaNombre(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  openInfo(dia: string, bloqueInicio: string, reservaReal?: any) {
    this.aceptaReglas = false; 
    
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
        cantidadPersonas: 1
      };
    }
    this.mostrarModal = true;
  }

  abrirFormularioGeneral() {
    this.aceptaReglas = false;
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
    if (this.modoCrear && !this.aceptaReglas) {
        alert('Debes aceptar las normas de uso.');
        return;
    }
    if (!this.formReserva.fecha || !this.formReserva.bloqueInicio || !this.formReserva.motivo) {
      alert('Completa los campos obligatorios.');
      return;
    }

    // 3. OBTENER EL USUARIO REAL DE LA SESIÓN
    const usuarioLogueado = this.authService.getUser();
    
    if (!usuarioLogueado) {
      alert('Error: No estás logueado.');
      return;
    }

    const nueva = {
      // 4. USAR EL ID DEL USUARIO LOGUEADO
      usuarioId: usuarioLogueado.id, 
      salaId: Number(this.formReserva.salaId),
      fecha: this.formReserva.fecha,
      bloqueInicio: this.formReserva.bloqueInicio,
      bloqueFin: this.calcularFin(this.formReserva.bloqueInicio),
      motivo: this.formReserva.motivo,
      cantidadPersonas: this.formReserva.cantidadPersonas
    };

    if (this.usarMock) {
        // mock logic
        return;
    }

    this.reservasService.crearReserva(nueva).subscribe({
      next: () => {
        alert('Solicitud enviada con éxito.');
        this.cargarReservas();
        this.mostrarModal = false;
      },
      error: (err: any) => {
        console.error(err);
        alert('Error al crear reserva.');
      }
    });
  }

  calcularFin(inicio: string): string {
    const b = this.bloques.find(x => x.inicio === inicio);
    return b ? b.fin : inicio; 
  }

  closeModal() {
    this.mostrarModal = false;
    this.selectedReserva = null;
  }
}