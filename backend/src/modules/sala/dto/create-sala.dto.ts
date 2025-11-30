import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';

export class CreateSalaDto {
  @IsString()
  @MaxLength(20)
  @IsIn(
    [
      'licancabur',
      'pomerape',
      'guallatire',
      'socompa',
      'parinacota',
      'azufre',
      'putre',
      'socoroma',
    ],
    { message: 'El nombre no es válido' },
  )
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion!: string;

  @IsInt()
  @Min(1, { message: 'La capacidad máxima no puede ser negativa ni cero' })
  capacidadMax!: number;

  @IsString()
  @MaxLength(50)
  @IsIn(['laboratorio', 'sala de clases'], {
    message: 'El tipo debe ser laboratorio, sala de clases o auditorio',
  })
  tipo!: string;

  @IsOptional()
  @IsBoolean()
  esMantencion?: boolean;
}
