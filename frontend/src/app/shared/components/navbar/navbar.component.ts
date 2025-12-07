import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
import { Notificacion } from '../../../core/models/notificacion.model';
import { PerfilModalComponent } from '../perfil-modal/perfil-modal.component';
import { NotificacionesComponent } from '../../../features/estudiante/notificaciones/notificaciones.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PerfilModalComponent,
    NotificacionesComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
// navbar.component.ts
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  usuario: Usuario | null = null;

  menuAbierto = false;
  mostrarModalPerfil = false;
  mostrarModalNotificaciones = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      this.usuario = user;
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  abrirPerfil() {
    this.mostrarModalPerfil = true;
    this.menuAbierto = false;
  }

  cerrarPerfil() {
    this.mostrarModalPerfil = false;
  }

  onLogout() {
    this.menuAbierto = false;
    this.authService.logout();
  }

  get isLoggedIn(): boolean {
    return !!this.usuario;
  }

  get isAyudante(): boolean {
    return this.usuario?.rol === 'AYUDANTE';
  }

  abrirNotificaciones() {
    if (!this.usuario) return;
    this.mostrarModalNotificaciones = false;
    setTimeout(() => (this.mostrarModalNotificaciones = true), 0);
  }

  cerrarNotificaciones() {
    this.mostrarModalNotificaciones = false;
  }
  get usuarioIdNumber(): number | undefined {
    // Si usuario es null, devuelve undefined
    return this.usuario?.id ? +this.usuario.id : undefined;
  }
}
