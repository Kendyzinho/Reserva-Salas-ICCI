import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './DTO/create-proyecto.dto';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}
  /* */
  @Post('crear')
  crearProyecto(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.crearProyecto(createProyectoDto);
  }

  @Get(':id/reporte-gastos')
  getReporteGastos(@Param('id') id: number) {
    return this.proyectoService.getReporteGastos(id);
  }
  /* */
  @Post(':id/subir-reporte-gastos')
  subirReporteGastos(@Param('id') id: number, @Body() reporteData: any) {
    return this.proyectoService.subirReporteGastos(id, reporteData);
  }

  @Get(':id/avance')
  getReporte(@Param('id') id: number) {
    return this.proyectoService.getReporte(id);
  }
  /* */
  @Post(':id/subir-avance')
  subirAvance(@Param('id') id: number, @Body() avanceData: any) {
    return this.proyectoService.subirAvance(id, avanceData);
  }
  /* */
  @Post(':id/aprobar-reporte/:reporteId')
  aprobarReporte(
    @Param('id') id: number,
    @Param('reporteId') reporteId: number,
  ) {
    return this.proyectoService.aprobarReporte(id, reporteId);
  }
  /* */
  @Post(':id/rechazar-reporte/:reporteId')
  rechazarReporte(
    @Param('id') id: number,
    @Param('reporteId') reporteId: number,
  ) {
    return this.proyectoService.rechazarReporte(id, reporteId);
  }
  /* */
  @Get('historial-avances/:id')
  getHistorialAvances(@Param('id') id: number) {
    return this.proyectoService.getHistorialAvances(id);
  }
  /* */
  @Get('reporte/:id')
  getReportesProyecto(@Param('id') id: number) {
    return this.proyectoService.getReportesProyecto(id);
  }
  /* */
  @Get('usuario/:id')
  listaProyectos(@Param('id') id: number) {
    return this.proyectoService.listaProyectos(id);
  }

  @Get('finalizados')
  obtenerProyectosFinalizados() {
    return this.proyectoService.obtenerProyectosFinalizados();
  }
}
