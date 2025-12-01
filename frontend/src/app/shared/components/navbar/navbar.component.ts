import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
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
  
  menuAbierto = false; 
  mostrarModalPerfil = false;

  constructor() {
    this.usuario = this.authService.getUser();
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

  // --- ESTA ES LA FUNCIÓN CLAVE ---
  onLogout() {
    this.menuAbierto = false; 
    this.authService.logout(); // Esto borra localStorage y redirige a /login
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}