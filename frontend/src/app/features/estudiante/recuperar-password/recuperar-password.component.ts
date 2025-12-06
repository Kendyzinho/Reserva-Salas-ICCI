import { Component, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  @Output() close = new EventEmitter<void>();

  recuperarForm = this.fb.group({
    nombreCompleto: ['', [Validators.required]],
    rut: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    passwordActual: ['', [Validators.required]],
    nuevaPassword: ['', [Validators.required, Validators.minLength(3)]],
  });

  enviado = false;
  error = '';

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const { correo, nuevaPassword } = this.recuperarForm.value;

    this.http
      .post('http://localhost:3000/api/password-reset-request', {
        correo,
        nueva_contrasena: nuevaPassword, // solo esto importa para el backend
      })
      .subscribe({
        next: () => {
          this.enviado = true;
          this.error = '';
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al enviar la solicitud';
        },
      });
  }
}
