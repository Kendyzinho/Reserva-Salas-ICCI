import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsIn,
} from 'class-validator';

export class RegisterDto {
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
  @IsIn(['estudiante', 'ayudante'], {
    message: 'El rol debe ser estudiante o ayudante',
  })
  rol?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6) // Asume una longitud mínima para la contraseña
  contrasena!: string;
}
