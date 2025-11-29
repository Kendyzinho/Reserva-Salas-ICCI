import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para que funcionen los links
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-navbar', // <--- Fíjate que el selector sea 'app-navbar'
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  usuario: Usuario | null = null;

  constructor() {
    this.usuario = this.authService.getUser();
  }

  onLogout() {
    this.authService.logout();
  }
  
  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}