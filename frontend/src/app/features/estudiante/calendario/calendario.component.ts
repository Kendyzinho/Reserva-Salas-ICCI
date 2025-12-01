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
      { id: 101, tipoReserva: 'Clases', motivo: 'Clase: Geología I', profesor: 'Dr. López', asignatura: 'Geología I', fecha: '2025-12-01', bloqueInicio: '08:00:00', estado: 'APROBADA', salaId: 1 },
      { id: 102, tipoReserva: 'Clases', motivo: 'Seminario', profesor: 'Sra. Pérez', asignatura: 'Seminarios', fecha: '2025-12-02', bloqueInicio: '09:40:00', estado: 'APROBADA', salaId: 1 }
    ],
    2: [ // Parinacota
      { id: 201, tipoReserva: 'Clases', motivo: 'Taller de Campo', profesor: 'Ing. Ramos', asignatura: 'Práctica', fecha: '2025-12-03', bloqueInicio: '11:20:00', estado: 'APROBADA', salaId: 2 }
    ],
    3: [ // Pomerape
      { id: 301, tipoReserva: 'Clases', motivo: 'Examen', profesor: 'Prof. Díaz', asignatura: 'Matemáticas', fecha: '2025-12-01', bloqueInicio: '14:45:00', estado: 'APROBADA', salaId: 3 },
      { id: 302, tipoReserva: 'Particular', motivo: 'Reunión privada', profesor: null, asignatura: null, cantidadPersonas: 5, fecha: '2025-12-04', bloqueInicio: '16:20:00', estado: 'APROBADA', salaId: 3 }
    ],
    4: [], // Socompa (vacío)
    5: [ // Azufre
      { id: 501, tipoReserva: 'Clases', motivo: 'Clase práctica', profesor: 'M. Torres', asignatura: 'Química', fecha: '2025-12-02', bloqueInicio: '08:00:00', estado: 'APROBADA', salaId: 5 },
      { id: 502, tipoReserva: 'Particular', motivo: 'Taller privado', profesor: null, asignatura: null, cantidadPersonas: 12, fecha: '2025-12-05', bloqueInicio: '18:00:00', estado: 'APROBADA', salaId: 5 }
    ],
    6: [ // Licancabur
      { id: 601, tipoReserva: 'Clases', motivo: 'Conferencia', profesor: 'Invitado', asignatura: 'Divulgación', fecha: '2025-12-03', bloqueInicio: '09:40:00', estado: 'APROBADA', salaId: 6 }
    ]
  };

  // ---------- Modal / Form ----------
  mostrarModal: boolean = false;
  modoCrear: boolean = true; // true = formulario, false = ver reserva
  selectedReserva: any = null;

  formReserva: any = {
    tipoReserva: '', // 'Clases' | 'Particular'
    motivo: '',
    profesor: '',
    asignatura: '',
    fecha: '',
    bloqueInicio: '',
    salaId: 0,
    cantidadPersonas: null
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
        tipoReserva: 'Clases',
        motivo: '',
        profesor: '',
        asignatura: '',
        fecha: this.diaToFechaString(dia),
        bloqueInicio: bloqueInicio,
        salaId: this.salaSeleccionada,
        cantidadPersonas: null
      };
    }
    this.mostrarModal = true;
  }

  // Abrir formulario general (botón)
  abrirFormularioGeneral() {
    this.modoCrear = true;
    this.formReserva = {
      tipoReserva: 'Clases',
      motivo: '',
      profesor: '',
      asignatura: '',
      fecha: '',
      bloqueInicio: '',
      salaId: this.salaSeleccionada,
      cantidadPersonas: null
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
    // Validaciones básicas comunes
    if (!this.formReserva.fecha || !this.formReserva.bloqueInicio || !this.formReserva.motivo) {
      alert('Completa fecha, bloque y motivo.');
      return;
    }

    // Validaciones según tipo
    if (this.formReserva.tipoReserva === 'Clases') {
      // profesor y asignatura opcionales, pero podemos advertir si faltan
      // (si quieres hacerlos obligatorios, cambia la condición)
      // aquí solo advertimos:
      if (!this.formReserva.profesor || !this.formReserva.asignatura) {
        const ok = confirm('No indicó profesor o asignatura. ¿Desea continuar de todas formas?');
        if (!ok) return;
      }
    } else if (this.formReserva.tipoReserva === 'Particular') {
      if (!this.formReserva.cantidadPersonas || this.formReserva.cantidadPersonas < 1) {
        alert('Ingrese la cantidad de personas para reservas particulares.');
        return;
      }
    }

    const nueva = {
      id: this.generateIdMock(),
      tipoReserva: this.formReserva.tipoReserva,
      motivo: this.formReserva.motivo,
      profesor: this.formReserva.tipoReserva === 'Clases' ? this.formReserva.profesor : null,
      asignatura: this.formReserva.tipoReserva === 'Clases' ? this.formReserva.asignatura : null,
      cantidadPersonas: this.formReserva.tipoReserva === 'Particular' ? this.formReserva.cantidadPersonas : null,
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
