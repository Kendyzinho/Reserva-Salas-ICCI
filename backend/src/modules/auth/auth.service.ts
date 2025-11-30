import { Repository } from 'typeorm';

import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/database/entity/usuario.entity';

@Injectable()
export class AuthService {
  // Ya no necesitamos la constante de error genérico

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  // 1. REGISTRO (CREATE) - Sin cambios, sigue siendo seguro
  async register(registerDto: RegisterDto) {
    const existingUser = await this.usuarioRepository.findOne({
      where: { correo: registerDto.correo },
      select: ['id_usuario'],
    });
    if (existingUser) {
      throw new ConflictException('❌ Este correo ya está registrado.');
    }

    if (registerDto.contrasena.length < 8) {
      throw new BadRequestException(
        '❌ La contraseña debe tener al menos 8 caracteres.',
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.contrasena, 10);
    const rol = registerDto.rol || 'funcionario';

    const createUsuarioDto: CreateUsuarioDto = {
      correo: registerDto.correo,
      contrasena: hashedPassword,
      nombre: registerDto.nombre,
      apellido: registerDto.apellido,
      rut: registerDto.rut,
      rol: rol,
    };

    const usuario = await this.usuarioService.create(createUsuarioDto);

    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const token = this.jwtService.sign(payload);
    const { contrasena, ...usuarioSinContrasena } = usuario;

    return {
      message: '✔ Usuario registrado exitosamente.',
      access_token: token,
    };
  }

  // ----------------------------------------------------------------------
  // 2. INICIO DE SESIÓN (LOGIN) - Con errores específicos
  // ----------------------------------------------------------------------

  async login(loginDto: LoginDto) {
    // 1. Buscar el usuario
    const user = await this.usuarioRepository.findOne({
      where: { correo: loginDto.correo },
      select: [
        'id_usuario',
        'correo',
        'rol',
        'contrasena',
        'nombre',
        'apellido',
        'rut',
      ],
    });

    // 2. 🚨 VALIDACIÓN ESPECÍFICA 1: Comprueba la existencia del usuario
    if (!user) {
      // Mensaje específico para el correo
      throw new UnauthorizedException(
        '❌ El correo electrónico ingresado no existe.',
      );
    }

    // 3. 🚨 VALIDACIÓN ESPECÍFICA 2: Comprueba la contraseña
    const match = await bcrypt.compare(loginDto.contrasena, user.contrasena);
    if (!match) {
      // Mensaje específico para la contraseña
      throw new UnauthorizedException('❌ Contraseña incorrecta.');
    }

    // Generar token
    const payload = {
      sub: user.id_usuario,
      correo: user.correo,
      rol: user.rol,
    };

    const token = this.jwtService.sign(payload);

    const { contrasena, ...usuarioSinContrasena } = user;

    return {
      message: '✔ Inicio de sesión exitoso.',
      access_token: token,
    };
  }
}
