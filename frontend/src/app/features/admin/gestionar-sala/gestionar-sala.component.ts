import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Sala } from '../../../core/models/sala.model';
import { SalaService } from './sala.service';

@Component({
  selector: 'app-gestionar-sala',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
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
    if (this.form.invalid) {
      console.log('Formulario inválido:', this.form.value);
      return;
    }
    const nombreExistente = this.salas.some(
      (sala) =>
        sala.nombre.toLowerCase() === this.form.value.nombre.toLowerCase()
    );

    if (nombreExistente) {
      alert('Ya existe una sala con este nombre.');
      this.form.controls['nombre'].setErrors({ duplicado: true });
      return;
    }

    console.log('Enviando al backend:', this.form.value);

    this.salaService.create(this.form.value).subscribe({
      next: (data) => {
        console.log('Sala creada:', data);
        this.cargarSalas();
        this.form.reset({ capacidadMax: 1, esMantencion: false });
      },
      error: (err) => {
        console.error('Error creando sala:', err);

        // Validación backend: nombre duplicado
        if (
          err?.error?.code === 'ER_DUP_ENTRY' ||
          err?.code === 'ER_DUP_ENTRY'
        ) {
          alert('Ya existe una sala con este nombre en la base de datos.');
          this.form.controls['nombre'].setErrors({ duplicado: true });
        } else {
          alert('Error al crear la sala. Intenta nuevamente.');
        }
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

    // Validar nombre único ignorando la sala que se edita
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
