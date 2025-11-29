import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from '../entity/proyecto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proyecto])],
  controllers: [ProyectoController],
  providers: [ProyectoService],
})
export class ProyectoModule {}
