import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  @IsNotEmpty()
  correo!: string;

  @IsString()
  @IsNotEmpty()
  rut!: string;

  @IsString()
  @IsNotEmpty()
  rol!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Asume una longitud mínima para la contraseña
  contrasena!: string;
}
