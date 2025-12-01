import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  usuario = {
    nombre: 'César Bastián',
    rol: 'Administrador',
    email: 'admin@sistema.com',
    avatar: 'https://i.pravatar.cc/150?img=5'
  };

}
