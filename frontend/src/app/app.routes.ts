import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MisReservasComponent } from './features/estudiante/mis-reservas/mis-reservas.component';
import { CrearReservaComponent } from './features/estudiante/crear-reserva/crear-reserva.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { CalendarioComponent } from './features/estudiante/calendario/calendario.component';
// 1. IMPORTAR EL NUEVO COMPONENTE
import { GestionSalasComponent } from './features/admin/gestion-salas/gestion-salas.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { RecuperarPasswordComponent } from './features/estudiante/recuperar-password/recuperar-password.component';
import { AyudantePasswordPanelComponent } from './features/admin/ayudante-password-panel/ayudante-password-panel.component';
import { NotificacionesComponent } from './features/estudiante/notificaciones/notificaciones.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // ← HOME COMO INICIAL SIN LOGIN
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'home', component: HomeComponent },

  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'calendario', pathMatch: 'full' },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'mis-reservas', component: MisReservasComponent },
      { path: 'crear-reserva', component: CrearReservaComponent },
      { path: 'notificaciones', component: NotificacionesComponent }, // ← NUEVO

      // ZONA ADMIN
      {
        path: 'admin',
        canActivate: [roleGuard],
        children: [
          // Si entran a /admin van al dashboard
          { path: '', component: DashboardComponent },
          // 2. AGREGAR LA RUTA DE SALAS AQUÍ
          { path: 'salas', component: GestionSalasComponent },
          {
            path: 'ayudante-password-panel',
            component: AyudantePasswordPanelComponent,
          },
        ],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
