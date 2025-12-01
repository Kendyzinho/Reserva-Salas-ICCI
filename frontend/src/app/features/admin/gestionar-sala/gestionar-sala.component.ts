import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Sala } from '../../../core/models/sala.model';
import { SalaService } from './sala.service';

@Component({
  selector: 'app-gestionar-sala',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gestionar-sala.component.html',
  styleUrl: './gestionar-sala.component.scss',
})
export class GestionarSalaComponent implements OnInit {
  salas: Sala[] = [];
  form!: FormGroup;
  editMode = false;
  salaEditandoId: number | null = null;

  tipos = ['laboratorio', 'sala de clases'];
  nombresPermitidos = [
    'licancabur',
    'socompa',
    'azufre',
    'guallatire',
    'parinacota',
    'pomerape',
    'servidores',
    'auditorio',
    'putre',
    'socoroma',
  ];

  constructor(private salaService: SalaService, private fb: FormBuilder) {}

  ngOnInit() {
    this.cargarSalas();

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      capacidadMax: [1, [Validators.required, Validators.min(1)]],
      tipo: ['', Validators.required],
      esMantencion: [false],
    });
  }

  cargarSalas() {
    this.salaService.getAll().subscribe((data) => {
      this.salas = data;
    });
  }

  crearSala() {
    if (this.form.invalid) return;

    const nombreExistente = this.salas.some(
      (sala) =>
        sala.nombre.toLowerCase() === this.form.value.nombre.toLowerCase()
    );

    if (nombreExistente) {
      alert('Ya existe una sala con este nombre.');
      return;
    }

    this.salaService.create(this.form.value).subscribe({
      next: () => {
        this.cargarSalas();
        this.form.reset({ capacidadMax: 1, esMantencion: false });
      },
      error: () => {
        alert('Error al crear la sala.');
      },
    });
  }

  activarEdicion(sala: Sala) {
    this.editMode = true;
    this.salaEditandoId = sala.id_sala!;
    this.form.patchValue(sala);
  }

  guardarEdicion() {
    if (!this.salaEditandoId || this.form.invalid) return;

    const nombreExistente = this.salas.some(
      (sala) =>
        sala.id_sala !== this.salaEditandoId &&
        sala.nombre.toLowerCase() === this.form.value.nombre.toLowerCase()
    );
    if (nombreExistente) {
      alert('Ya existe otra sala con este nombre.');
      return;
    }

    this.salaService.update(this.salaEditandoId, this.form.value).subscribe({
      next: () => {
        this.editMode = false;
        this.salaEditandoId = null;
        this.cargarSalas();
        this.form.reset({ capacidadMax: 1, esMantencion: false });
      },
      error: () => alert('Error al actualizar la sala'),
    });
  }

  cancelarEdicion() {
    this.editMode = false;
    this.salaEditandoId = null;
    this.form.reset({ capacidadMax: 1, esMantencion: false });
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar sala?')) return;

    this.salaService.delete(id).subscribe({
      next: () => this.cargarSalas(),
      error: () => alert('Error eliminando sala'),
    });
  }
}
