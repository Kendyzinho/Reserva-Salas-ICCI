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

<<<<<<< HEAD
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
=======
  // Variables del Modal
>>>>>>> origin/Reserva
  mostrarModal: boolean = false;
  modoCrear: boolean = true;
  selectedReserva: any = null;
  aceptaReglas: boolean = false;

  // Mock Data (Vacío porque usas Backend)
  private mockData: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

  formReserva: any = {
    tipoReserva: '', // 'Clases' | 'Particular'
    motivo: '',
    profesor: '',
    asignatura: '',
    fecha: '',
    bloqueInicio: '',
    salaId: 0,
<<<<<<< HEAD
    cantidadPersonas: null
=======
    cantidadPersonas: 1
>>>>>>> origin/Reserva
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
        tipoReserva: 'Clases',
        motivo: '',
        profesor: '',
        asignatura: '',
        fecha: this.diaToFechaString(dia),
        bloqueInicio: bloqueInicio,
        salaId: this.salaSeleccionada,
<<<<<<< HEAD
        cantidadPersonas: null
=======
        cantidadPersonas: 1
>>>>>>> origin/Reserva
      };
    }
    this.mostrarModal = true;
  }

  abrirFormularioGeneral() {
    this.aceptaReglas = false;
    this.modoCrear = true;
    this.formReserva = {
      tipoReserva: 'Clases',
      motivo: '',
      profesor: '',
      asignatura: '',
      fecha: '',
      bloqueInicio: '',
      salaId: this.salaSeleccionada,
<<<<<<< HEAD
      cantidadPersonas: null
=======
      cantidadPersonas: 1
>>>>>>> origin/Reserva
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
<<<<<<< HEAD
    // Validaciones básicas comunes
=======
    if (this.modoCrear && !this.aceptaReglas) {
        alert('Debes aceptar las normas de uso.');
        return;
    }
>>>>>>> origin/Reserva
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
<<<<<<< HEAD
      id: this.generateIdMock(),
      tipoReserva: this.formReserva.tipoReserva,
      motivo: this.formReserva.motivo,
      profesor: this.formReserva.tipoReserva === 'Clases' ? this.formReserva.profesor : null,
      asignatura: this.formReserva.tipoReserva === 'Clases' ? this.formReserva.asignatura : null,
      cantidadPersonas: this.formReserva.tipoReserva === 'Particular' ? this.formReserva.cantidadPersonas : null,
=======
      // 4. USAR EL ID DEL USUARIO LOGUEADO
      usuarioId: usuarioLogueado.id, 
      salaId: Number(this.formReserva.salaId),
>>>>>>> origin/Reserva
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

<<<<<<< HEAD
    /*
    // Si tienes backend
=======
>>>>>>> origin/Reserva
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