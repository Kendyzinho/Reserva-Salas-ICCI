// Backend/src/modules/users/users.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from 'src/database/entity/usuario.entity';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt'; // Asegúrate de que esta línea esté presente

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
  ) {}

  // 1. CREAR (C)
  async create(createUserDto: CreateUsuarioDto): Promise<Usuario> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  // 2. LEER TODOS (R)
  findAll(): Promise<Usuario[]> {
    return this.userRepository.find();
  }

  // 3. LEER UNO POR ID (R)
  async findOne(id_usuario: number): Promise<Usuario> {
    const user = await this.userRepository.findOne({ where: { id_usuario } });
    if (!user) {
      throw new NotFoundException(
        `Usuario con ID ${id_usuario} no encontrado.`,
      );
    }
    return user;
  }

  // 4. ACTUALIZAR (U)
  async update(
    id_usuario: number,
    updateUserData: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const user = await this.findOne(id_usuario); // Revisa si existe

    // Opcional: Si se envía una nueva contraseña en el DTO de actualización, ¡también debe hashearse!
    if (updateUserData.contrasena) {
      updateUserData.contrasena = await bcrypt.hash(
        updateUserData.contrasena,
        10,
      );
    }

    const updatedUser = this.userRepository.merge(user, updateUserData);

    return this.userRepository.save(updatedUser);
  }

  // 5. ELIMINAR (D)
  async remove(id_usuario: number): Promise<void> {
    const result = await this.userRepository.delete(id_usuario);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Usuario con ID ${id_usuario} no encontrado para eliminar.`,
      );
    }
  }
}
