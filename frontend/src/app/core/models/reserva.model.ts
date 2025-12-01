export interface Reserva {
  id: number;
  salaId: number;
  fecha: string;
  bloque: string;

  tipoReserva: 'Clases' | 'Particular';

  // Solo para Clases:
  profesor?: string;
  asignatura?: string;

  // Solo para Particular:
  cantidadPersonas?: number;

  // Para ambos:
  motivo: string;
}
