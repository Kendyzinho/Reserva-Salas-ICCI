import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SalaService } from './sala.service';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('sala')
export class SalaController {
  constructor(private readonly salaService: SalaService) {}

  @Post()
  create(@Body() dto: CreateSalaDto) {
    return this.salaService.create(dto);
  }

  @Get()
  findAll() {
    return this.salaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateSalaDto) {
    return this.salaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.salaService.remove(id);
  }

  @Patch('mantencion/:id')
  async setMantencion(
    @Param('id') id: number,
    @Body('estado') estado: boolean,
  ) {
    return this.salaService.setMantencion(id, estado);
  }
}
