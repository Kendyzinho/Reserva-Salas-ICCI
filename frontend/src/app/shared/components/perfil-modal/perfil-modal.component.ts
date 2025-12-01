import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-modal.component.html',
  styleUrl: './perfil-modal.component.css'
})
export class PerfilModalComponent {
  // Recibimos los datos del usuario
  @Input() usuario: Usuario | null = null;
  
  // Evento para avisar al padre que cierre la ventana
  @Output() cerrar = new EventEmitter<void>();

  onCerrar() {
    this.cerrar.emit();
  }
}