import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
// Importamos el modal (ya lo tenías bien)
import { PerfilModalComponent } from '../perfil-modal/perfil-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, PerfilModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  usuario: Usuario | null = null;
  
  // 1. Variables nuevas para controlar la vista
  menuAbierto = false; 
  mostrarModalPerfil = false;

  constructor() {
    this.usuario = this.authService.getUser();
  }

  // 2. Función para abrir/cerrar el menú pequeñito
  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // 3. Función para ABRIR el modal (y cerrar el menú para que no estorbe)
  abrirPerfil() {
    this.mostrarModalPerfil = true;
    this.menuAbierto = false; 
  }

  // 4. Función para CERRAR el modal (se llama desde el botón X o Cerrar)
  cerrarPerfil() {
    this.mostrarModalPerfil = false;
  }

  onLogout() {
    this.menuAbierto = false; // Cerramos el menú por si acaso
    this.authService.logout();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}