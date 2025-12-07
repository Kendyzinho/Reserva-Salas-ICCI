export interface Notificacion {
  id: number;
  usuario_id: number; // <- agregar
  mensaje: string;
  fecha: string;
  leido: boolean;
}
