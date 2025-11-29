/* eslint-disable @typescript-eslint/require-await */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyecto } from '../entity/proyecto.entity';
import { CreateProyectoDto } from './DTO/create-proyecto.dto';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,
  ) {}

  async crearProyecto(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const nuevoProyecto = this.proyectoRepository.create(createProyectoDto);
    return this.proyectoRepository.save(nuevoProyecto);
  }

  // getReporteGastos: busca los reportes de un proyecto específico
  async getReporteGastos(idProyecto: number): Promise<any[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return [];
  }

  // subirReporteGastos: crea un nuevo reporte para un proyecto
  async subirReporteGastos(idProyecto: number, reporteData: any): Promise<any> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return { success: true, message: 'Reporte de gastos subido' };
  }

  // getAvance: busca los avances de un proyecto
  async getReporte(idProyecto: number): Promise<any[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return [];
  }

  // subirAvance: crea un nuevo avance para un proyecto
  async subirAvance(idProyecto: number, avanceData: any): Promise<any> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return { success: true, message: 'Avance subido' };
  }

  // aprobarReporte: busca y actualiza un reporte específico
  async aprobarReporte(idProyecto: number, idReporte: number): Promise<any> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return { success: true, message: 'Reporte aprobado' };
  }

  // rechazarReporte: busca y actualiza un reporte específico
  async rechazarReporte(idProyecto: number, idReporte: number): Promise<any> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return { success: true, message: 'Reporte rechazado' };
  }

  // getHistorialAvances: busca los avances de un proyecto
  async getHistorialAvances(idProyecto: number): Promise<any[]> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return [];
  }

  // getReporte: busca un informe específico de un proyecto
  async getReportesProyecto(idProyecto: number): Promise<any> {
    const proyecto = await this.proyectoRepository.findOne({
      where: { idProyecto },
    });
    if (!proyecto) {
      throw new NotFoundException(
        `Proyecto con ID ${idProyecto} no encontrado`,
      );
    }
    return null;
  }

  // listaProyectosUsuario: busca proyectos de un usuario
  // eslint-disable-next-line @typescript-eslint/require-await
  async listaProyectos(idUsuario: number): Promise<Proyecto[]> {
    return [];
  }

  // obtenerProyectosFinalizados: busca proyectos con un estado específico
  // y como no existe...
  async obtenerProyectosFinalizados(): Promise<Proyecto[]> {
    return [];
  }
}
