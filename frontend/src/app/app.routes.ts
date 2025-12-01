import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MisReservasComponent } from './features/estudiante/mis-reservas/mis-reservas.component';
import { CrearReservaComponent } from './features/estudiante/crear-reserva/crear-reserva.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
<<<<<<< HEAD
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
=======
import { CalendarioComponent } from './features/estudiante/calendario/calendario.component';

// Importamos los guardias de seguridad
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // 1. RUTA PÚBLICA (La única a la que se puede entrar sin llave)
>>>>>>> origin/Reserva
  { path: 'login', component: LoginComponent },

  // 2. RUTAS PRIVADAS (Protegidas por authGuard)
  {
    path: '',
    canActivate: [authGuard], // <--- ESTO ES LO QUE "CIERRA LA SESIÓN" REALMENTE
    children: [
      // Si entran a la raiz '/', los mandamos al calendario (Dashboard principal)
      { path: '', redirectTo: 'calendario', pathMatch: 'full' },
      
      { path: 'calendario', component: CalendarioComponent },
      { path: 'mis-reservas', component: MisReservasComponent },
      { path: 'crear-reserva', component: CrearReservaComponent },
      
      // Zona Admin (Doble protección: Login + Ser Ayudante)
      { 
        path: 'admin', 
        canActivate: [roleGuard],
        component: DashboardComponent 
      },
    ]
  },

  // 3. COMODÍN: Cualquier ruta desconocida manda al login
  { path: '**', redirectTo: 'login' }
];