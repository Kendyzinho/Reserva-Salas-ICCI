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
  // Inyecta el servicio (si lo tienes)
  private reservasService = inject(ReservasService);

  // ---------- CONFIG ----------
  // Si quieres probar sin backend, deja true. Para usar backend, pon false.
  usarMock: boolean = true;

  // Salas fijas (según pediste)
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

  // ---------- MOCK DATA (simula calendarios diferentes por sala) ----------
  // Fecha formato YYYY-MM-DD. Asegúrate que las fechas correspondan al día de la semana esperado.
  private mockData: Record<number, any[]> = {
    1: [ // Guallatire
      { id: 101, motivo: 'Clase: Geología I', profesor: 'Dr. López', asignatura: 'Geología I', fecha: '2025-12-01', bloqueInicio: '08:00:00', estado: 'APROBADA' },
      { id: 102, motivo: 'Seminario', profesor: 'Sra. Pérez', asignatura: 'Seminarios', fecha: '2025-12-02', bloqueInicio: '09:40:00', estado: 'APROBADA' }
    ],
    2: [ // Parinacota
      { id: 201, motivo: 'Taller de Campo', profesor: 'Ing. Ramos', asignatura: 'Práctica', fecha: '2025-12-03', bloqueInicio: '11:20:00', estado: 'APROBADA' }
    ],
    3: [ // Pomerape
      { id: 301, motivo: 'Examen', profesor: 'Prof. Díaz', asignatura: 'Matemáticas', fecha: '2025-12-01', bloqueInicio: '14:45:00', estado: 'APROBADA' },
      { id: 302, motivo: 'Reunión', profesor: 'Coord.', asignatura: 'Admin', fecha: '2025-12-04', bloqueInicio: '16:20:00', estado: 'APROBADA' }
    ],
    4: [], // Socompa (vacío)
    5: [ // Azufre
      { id: 501, motivo: 'Clase práctica', profesor: 'M. Torres', asignatura: 'Química', fecha: '2025-12-02', bloqueInicio: '08:00:00', estado: 'APROBADA' },
      { id: 502, motivo: 'Taller', profesor: 'E. Silva', asignatura: 'Taller', fecha: '2025-12-05', bloqueInicio: '18:00:00', estado: 'APROBADA' }
    ],
    6: [ // Licancabur
      { id: 601, motivo: 'Conferencia', profesor: 'Invitado', asignatura: 'Divulgación', fecha: '2025-12-03', bloqueInicio: '09:40:00', estado: 'APROBADA' }
    ]
  };

  // ---------- Modal / Form ----------
  mostrarModal: boolean = false;
  modoCrear: boolean = true; // true = formulario, false = ver reserva
  selectedReserva: any = null;

  formReserva: any = {
    motivo: '',
    profesor: '',
    asignatura: '',
    fecha: '',
    bloqueInicio: '',
    salaId: 0
  };

  ngOnInit() {
    // Inicializa con la salaSeleccionada por defecto
    this.cargarReservas();
  }

  // Cambia sala -> recarga calendario para esa sala
  onCambioSala() {
    this.cargarReservas();
  }

  // Cargar reservas: si usarMock true, usa mockData; si false, llama al servicio
  cargarReservas() {
    if (this.usarMock) {
      // Clone para evitar mutaciones accidentales
      this.reservas = (this.mockData[this.salaSeleccionada] || []).map(r => ({ ...r }));
      return;
    }

    // Si tienes servicio real
    this.reservasService.getReservasPorSala(this.salaSeleccionada)
      .subscribe({
        next: (data: any[]) => { this.reservas = data; },
        error: (err) => { console.error('Error cargando reservas:', err); this.reservas = []; }
      });
  }

  // Buscar reserva por día (nombre) y bloqueInicio (string HH:MM:SS)
  obtenerReserva(diaColumna: string, bloqueInicio: string) {
    return this.reservas.find((r: any) => {
      // Acepta fechas con o sin 'T'
      const fechaString = r.fecha.includes('T') ? r.fecha : `${r.fecha}T00:00:00`;
      const fechaReserva = new Date(fechaString);
      const diaReserva = this.getDiaNombre(fechaReserva);

      return diaReserva === diaColumna && r.bloqueInicio === bloqueInicio;
    });
  }

  // Convierte Date.getDay() a nombre en español
  getDiaNombre(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  // ---------- INTERACCIONES: modal, ver y crear ----------
  // Abrir modal para ver reserva o crear (si reservaReal existe, mostramos info)
  openInfo(dia: string, bloqueInicio: string, reservaReal?: any) {
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
        salaId: this.salaSeleccionada
      };
    }
    this.mostrarModal = true;
  }

  // Abrir formulario general (botón)
  abrirFormularioGeneral() {
    this.modoCrear = true;
    this.formReserva = {
      motivo: '',
      profesor: '',
      asignatura: '',
      fecha: '',
      bloqueInicio: '',
      salaId: this.salaSeleccionada
    };
    this.mostrarModal = true;
  }

  // Convierte nombre de día (Lunes...) a una fecha de referencia de la semana actual
  // Esto es aproximado: toma la próxima fecha que corresponda al día solicitado.
  diaToFechaString(diaNombre: string): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const target = dias.indexOf(diaNombre);
    const hoy = new Date();
    const hoyDia = hoy.getDay();
    // calcular diferencia en días hacia el target en la misma semana (puede ser negativa)
    let diff = target - hoyDia;
    if (diff < 0) diff += 7; // siguiente semana si fue antes
    const result = new Date(hoy);
    result.setDate(hoy.getDate() + diff);
    // Formato YYYY-MM-DD
    const yyyy = result.getFullYear();
    const mm = (result.getMonth() + 1).toString().padStart(2, '0');
    const dd = result.getDate().toString().padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Crear reserva (mock o real)
  crearReservaEnviar() {
    // Validaciones básicas
    if (!this.formReserva.fecha || !this.formReserva.bloqueInicio || !this.formReserva.motivo) {
      alert('Completa fecha, bloque y motivo.');
      return;
    }

    const nueva = {
      id: this.generateIdMock(),
      motivo: this.formReserva.motivo,
      profesor: this.formReserva.profesor,
      asignatura: this.formReserva.asignatura,
      fecha: this.formReserva.fecha,
      bloqueInicio: this.formReserva.bloqueInicio,
      estado: 'APROBADA',
      salaId: this.formReserva.salaId
    };

    if (this.usarMock) {
      // Insertar en mockData y recargar vistas
      if (!this.mockData[this.salaSeleccionada]) this.mockData[this.salaSeleccionada] = [];
      this.mockData[this.salaSeleccionada].push(nueva);
      this.cargarReservas();
      this.mostrarModal = false;
      alert('Reserva (mock) creada correctamente.');
      return;
    }
/*
    // Si tienes backend
    this.reservasService.crearReserva(nueva).subscribe({
      next: () => {
        this.cargarReservas();
        this.mostrarModal = false;
        alert('Reserva creada correctamente.');
      },
      error: (err) => {
        console.error(err);
        alert('Error al crear reserva.');
      }
    });
    */
  }

  // Genera un id mock simple (no colisionará en pruebas locales típicas)
  private generateIdMock(): number {
    const all = Object.values(this.mockData).flat();
    const max = all.length ? Math.max(...all.map((x: any) => x.id || 0)) : 100;
    return max + 1;
  }

  closeModal() {
    this.mostrarModal = false;
    this.selectedReserva = null;
  }
}
