import { Routes } from '@angular/router';
import { MisReservasComponent } from './features/estudiante/mis-reservas/mis-reservas.component';
import { CrearReservaComponent } from './features/estudiante/crear-reserva/crear-reserva.component';
import { HomeComponent } from './features/home/home.component';
import { GestionarSalaComponent } from './features/admin/gestionar-sala/gestionar-sala.component';
import { EstadisticasComponent } from './features/admin/estadisticas/estadisticas.component';

export const routes: Routes = [
  // 1. Ruta principal
  { path: '', component: HomeComponent },

  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'crear-reserva', component: CrearReservaComponent },
  { path: 'gestionar-sala', component: GestionarSalaComponent },
  {
    path: 'estadisticas',
    component: EstadisticasComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
