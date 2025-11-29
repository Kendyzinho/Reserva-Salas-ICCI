import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn()
  idProyecto: number;
}
