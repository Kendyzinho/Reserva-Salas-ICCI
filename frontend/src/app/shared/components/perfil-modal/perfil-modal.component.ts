import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-modal.component.html',
  styleUrls: ['./perfil-modal.component.css'],
})
export class PerfilModalComponent implements OnInit {
  @Input() usuario: Usuario | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<Partial<Usuario>>();

  perfilForm!: FormGroup;
  editando: boolean = false; // controla si los campos son editables

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.perfilForm = this.fb.group({
      nombre: [
        { value: this.usuario?.nombre || '', disabled: true },
        Validators.required,
      ],
      carrera: [{ value: this.usuario?.carrera || '', disabled: true }],
      telefono: [{ value: this.usuario?.telefono || '', disabled: true }],
      rut: [{ value: this.usuario?.rut || '', disabled: true }], // <-- agregado
    });
  }

  onCerrar() {
    this.cerrar.emit();
  }

  habilitarEdicion() {
    this.editando = true;
    this.perfilForm.get('nombre')?.enable();
    this.perfilForm.get('carrera')?.enable();
    this.perfilForm.get('telefono')?.enable();
    this.perfilForm.get('rut')?.enable(); // <-- habilitar edición de RUT
  }

  onGuardar() {
    if (this.perfilForm.valid && this.usuario) {
      this.usuarioService
        .actualizarUsuario(this.usuario.id, this.perfilForm.value)
        .subscribe({
          next: (res) => {
            // Crear objeto actualizado
            const usuarioActualizado = {
              ...this.usuario,
              ...this.perfilForm.value,
            };

            // Actualizar local
            this.usuario = usuarioActualizado;
            this.editando = false;
            this.perfilForm.disable();

            // Emitir al componente padre para sincronizar
            this.guardar.emit(usuarioActualizado);

            alert('Perfil actualizado correctamente');
          },
          error: (err) => {
            console.error(err);
            alert('Error al actualizar el perfil');
          },
        });
    }
  }
}
