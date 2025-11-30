import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

interface SalaStats {
  nombre: string;
  capacidad: number;
  tipo: 'laboratorio' | 'sala de clases';
  esMantencion: boolean;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.scss'],
})
export class EstadisticasComponent implements OnInit {
  // Datos simulados
  salas: any[] = [];

  // Datos de los gráficos
  disponibilidadData!: ChartData<'doughnut'>;
  tipoData!: ChartData<'bar'>;

  // OPCIONES DEL GRÁFICO DOUGHNUT (Aquí va cutout)
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
    cutout: '70%', // ✅ Aquí se define el "corte" del gráfico circular
  };

  // OPCIONES DEL GRÁFICO DE BARRAS
  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  ngOnInit() {
    this.generarSalasArtificiales();
    this.generarDatosGraficos();
  }

  generarSalasArtificiales() {
    // simulación de salas
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
    for (let i = 0; i < 10; i++) {
      this.salas.push({
        nombre: nombres[i],
        capacidad: Math.floor(Math.random() * 50) + 10,
        tipo: Math.random() > 0.5 ? 'laboratorio' : 'sala de clases',
        esMantencion: Math.random() > 0.7,
      });
    }
  }

  generarDatosGraficos() {
    const disponibles = this.salas.filter((s) => !s.esMantencion).length;
    const mantencion = this.salas.filter((s) => s.esMantencion).length;

    this.disponibilidadData = {
      labels: ['Disponibles', 'En Mantención'],
      datasets: [
        {
          data: [disponibles, mantencion],
          backgroundColor: ['#34D399', '#F87171'],
        },
      ],
    };

    const laboratorio = this.salas.filter(
      (s) => s.tipo === 'laboratorio'
    ).length;
    const clases = this.salas.filter((s) => s.tipo === 'sala de clases').length;

    this.tipoData = {
      labels: ['Laboratorio', 'Sala de Clases'],
      datasets: [
        {
          label: 'Cantidad de Salas',
          data: [laboratorio, clases],
          backgroundColor: ['#3B82F6', '#FBBF24'],
        },
      ],
    };
  }

  // MÉTRICAS
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
