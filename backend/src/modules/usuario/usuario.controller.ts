// Backend/src/modules/users/users.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('usuario') // Base URL: /users
export class UsuarioController {
  constructor(private readonly usersService: UsuarioService) {}

  // POST /users
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUsuarioDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id); // Usamos '+' para convertir el number a number
  }

  // PATCH /users/:id
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUsuarioDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // DELETE /users/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 si la eliminación fue exitosa
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
