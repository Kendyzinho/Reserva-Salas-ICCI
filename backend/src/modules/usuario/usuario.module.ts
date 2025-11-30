// Backend/src/modules/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from 'src/database/entity/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]), // Registra la entidad Usuario con TypeORM
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService], // Si otros módulos (como Auth) necesitan acceder al servicio
})
export class UsuarioModule {}
