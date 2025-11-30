import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('usuario') // El nombre de la tabla en la base de datos será 'usuario'
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' }) // Especifica el nombre exacto de la columna PK
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true }) // 'correo' debería ser único para evitar duplicados
  correo: string;

  @Column({ unique: true }) // 'rut' también debería ser único
  rut: string;

  @Column()
  rol: string; // O podrías usar un Enum para roles predefinidos (e.g., 'ADMIN', 'EMPLEADO')

  @Column({ select: true })
  contrasena: string; // ¡IMPORTANTE: SIEMPRE HASHEAR LAS CONTRASEÑAS! Nunca las guardes en texto plano.

  // --- Relaciones (si es que existen) ---
}
