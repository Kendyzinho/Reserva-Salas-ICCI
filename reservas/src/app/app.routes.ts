import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MisReservasComponent } from './features/estudiante/mis-reservas/mis-reservas.component';
import { CrearReservaComponent } from './features/estudiante/crear-reserva/crear-reserva.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  // Rutas protegidas (Usuario logueado)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'mis-reservas', component: MisReservasComponent },
      { path: 'crear-reserva', component: CrearReservaComponent },
      
      // Solo Ayudantes
      { 
        path: 'admin', 
        canActivate: [roleGuard],
        component: DashboardComponent 
      },
      
      // Redirección por defecto al entrar a la raiz
      { path: '', redirectTo: 'mis-reservas', pathMatch: 'full' }
    ]
  },
  
  { path: '**', redirectTo: 'login' }
];