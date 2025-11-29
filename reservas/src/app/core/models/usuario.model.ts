export interface Usuario {
  id: string; // JSON Server usa strings o numbers
  email: string;
  password?: string;
  nombre: string;
  rol: 'ESTUDIANTE' | 'AYUDANTE';
}