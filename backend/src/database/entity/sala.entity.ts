import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { Reserva } from '../../reserva/entities/reserva.entity';

@Entity('sala')
export class Sala {
  @PrimaryGeneratedColumn()
  id_sala: number;

  // Nombre corto de la sala (Ej: "Licancabur", "Socompa")
  @Column({ unique: true })
  nombre: string;

  // Descripción general (equipamiento, características)
  @Column({ type: 'text' })
  descripcion: string;

  // Capacidad máxima permitida
  @Column({ type: 'int' })
  capacidadMax: number;

  // Tipo de sala (laboratorio, auditorio, sala de clases, etc.)
  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  // Gestionar si la sala está fuera de servicio (mantención)
  @Column({ type: 'boolean', default: false })
  esMantencion: boolean;

  //--------------------------------------------
  // RELACIONES
  //--------------------------------------------

  // Una sala puede tener muchas reservas
  //  @OneToMany(() => Reserva, (reserva) => reserva.sala)
  // reservas: Reserva[];
}
