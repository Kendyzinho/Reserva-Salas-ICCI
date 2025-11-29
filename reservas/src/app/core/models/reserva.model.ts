export interface Reserva {
  id?: string;
  usuarioId: string;
  salaNombre: string; // Simplificado para MVP
  fecha: string;
  horario: string;
  estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
  motivo: string;
}