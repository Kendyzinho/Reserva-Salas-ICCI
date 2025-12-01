import { Component, inject, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  
  usuario: Usuario | null = null;
  
  menuAbierto = false; 
  mostrarModalPerfil = false;

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
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

  // NUEVO: Helper para saber si es ayudante en la vista
  get isAyudante(): boolean {
    return this.usuario?.rol === 'AYUDANTE';
  }
}