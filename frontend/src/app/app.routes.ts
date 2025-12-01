import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MisReservasComponent } from './features/estudiante/mis-reservas/mis-reservas.component';
import { CrearReservaComponent } from './features/estudiante/crear-reserva/crear-reserva.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { CalendarioComponent } from './features/estudiante/calendario/calendario.component'; 
import { HomeComponent } from './features/home/home.component';
import { ListadoReservasComponent } from './features/admin/listado-reservas/listado-reservas.component';

export const routes: Routes = [
  // 1. REGLA DE ORO: Si entro a la raíz, mándame al calendario
  { path: '', redirectTo: 'calendario', pathMatch: 'full' },

  // 2. Ruta directa del calendario (SIN GUARDS NI NADA)
  { path: 'calendario', component: CalendarioComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'listado-reservas', component: ListadoReservasComponent},
  { path: 'login', component: LoginComponent },
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: 'crear-reserva', component: CrearReservaComponent },
  { path: 'admin', component: DashboardComponent },
  
  // 4. Si escribo cualquier disparate, mándame al calendario también (para probar)
  { path: '**', redirectTo: 'calendario' }
];