export interface Usuario {
  id: string;
  email: string;
  password?: string;
  rol: 'ESTUDIANTE' | 'AYUDANTE';
  
  // Nuevos campos para el perfil
  nombre: string;       // Nombres
  apellidos?: string;   // Apellidos
  rut?: string;
  carrera?: string;
  fechaNacimiento?: string;
  genero?: string;
  puebloOriginario?: boolean | string; // Puede ser Si/No o el nombre
  discapacidad?: boolean | string;
  telefono?: string;
}