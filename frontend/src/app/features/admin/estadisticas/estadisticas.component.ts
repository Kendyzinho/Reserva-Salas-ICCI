import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
})
export class EstadisticasComponent implements OnInit {
  salas: any[] = [];

  // Valores calculados para gráficos
  porcentajeDisponibles = 0;
  pieBackground = '';

  porcLaboratorios = 0;
  porcClases = 0;

  cantLaboratorios = 0;
  cantClases = 0;

  ngOnInit(): void {
    this.generarSalasArtificiales();
    this.calcularGraficos();
  }

  generarSalasArtificiales() {
    const nombres = [
      'Licancabur',
      'Socompa',
      'Azufre',
      'Guallatire',
      'Parinacota',
      'Pomerape',
      'Auditorio',
      'Putre',
      'Socoroma',
      'Servidores',
    ];

    for (let i = 0; i < nombres.length; i++) {
      this.salas.push({
        nombre: nombres[i],
        capacidad: Math.floor(Math.random() * 50) + 10,
        tipo: Math.random() > 0.5 ? 'laboratorio' : 'sala de clases',
        esMantencion: Math.random() > 0.7,
      });
    }
  }

  calcularGraficos() {
    const total = this.salas.length;

    // Disponibles vs Mantención
    const disponibles = this.totalDisponibles();
    const mantencion = this.totalMantencion();

    this.porcentajeDisponibles = Math.round((disponibles / total) * 100);

    // CSS para gráfico doughnut
    const disponiblesPorc = (disponibles / total) * 360;
    this.pieBackground = `
      conic-gradient(
        #34D399 ${disponiblesPorc}deg,
        #F87171 ${disponiblesPorc}deg
      )
    `;

    // Barras
    this.cantLaboratorios = this.salas.filter(
      (s) => s.tipo === 'laboratorio'
    ).length;
    this.cantClases = this.salas.filter(
      (s) => s.tipo === 'sala de clases'
    ).length;

    this.porcLaboratorios = (this.cantLaboratorios / total) * 100;
    this.porcClases = (this.cantClases / total) * 100;
  }

  totalSalas() {
    return this.salas.length;
  }

  totalDisponibles() {
    return this.salas.filter((s) => !s.esMantencion).length;
  }

  totalMantencion() {
    return this.salas.filter((s) => s.esMantencion).length;
  }

  capacidadTotal() {
    return this.salas.reduce((acc, s) => acc + s.capacidad, 0);
  }
}
