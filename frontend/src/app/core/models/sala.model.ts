export interface Sala {
  id_sala?: number; // opcional, autogenerado en backend
  nombre: string;
  descripcion?: string;
  capacidadMax: number;
  tipo: string;
  esMantencion?: boolean;
}
