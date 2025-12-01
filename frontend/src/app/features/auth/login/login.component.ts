import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorLogin: boolean = false;
  loading: boolean = false;
  mensajeError: string = ''; // Nuevo: para ver qué pasó

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorLogin = false;
    this.mensajeError = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      // CASO ÉXITO: El backend respondió 200 OK con el usuario
      next: (usuario: Usuario) => {
        this.loading = false;
        
        // Redirección según Rol
        if (usuario.rol === 'AYUDANTE') {
          this.router.navigate(['/admin']);
        } else {
          // Si tienes el calendario como home, cámbialo aquí
          this.router.navigate(['/calendario']); 
        }
      },
      
      // CASO ERROR: El backend respondió 401 o 500
      error: (err: any) => {
        this.loading = false;
        this.errorLogin = true;
        
        // Si el backend manda un mensaje específico, úsalo (opcional)
        if (err.error && err.error.message) {
            this.mensajeError = err.error.message;
        } else {
            this.mensajeError = 'Credenciales incorrectas o error de servidor';
        }
        
        console.error('Error de login:', err);
      }
    });
  }
}