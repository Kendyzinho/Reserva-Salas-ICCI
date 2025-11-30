import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { Sala } from 'src/database/entity/sala.entity';

@Injectable()
export class SalaService {
  constructor(
    @InjectRepository(Sala)
    private readonly salaRepository: Repository<Sala>,
  ) {}

  async create(dto: CreateSalaDto): Promise<Sala> {
    const sala = this.salaRepository.create(dto);
    return this.salaRepository.save(sala);
  }

  async findAll(): Promise<Sala[]> {
    return this.salaRepository.find();
  }

  async findOne(id: number): Promise<Sala> {
    const sala = await this.salaRepository.findOne({ where: { id_sala: id } });

    if (!sala) {
      throw new NotFoundException(`La sala con ID ${id} no existe`);
    }

    return sala;
  }

  async update(id: number, dto: UpdateSalaDto): Promise<Sala> {
    const sala = await this.findOne(id);
    const updated = Object.assign(sala, dto);
    return this.salaRepository.save(updated);
  }

  async remove(id: number) {
    const sala = await this.salaRepository.findOne({ where: { id_sala: id } });
    if (!sala) throw new NotFoundException('Sala no encontrada');
    return this.salaRepository.remove(sala);
  }

  async setMantencion(id: number, estado: boolean): Promise<Sala> {
    const sala = await this.findOne(id); // reutiliza findOne
    sala.esMantencion = estado;
    return this.salaRepository.save(sala);
  }
}
