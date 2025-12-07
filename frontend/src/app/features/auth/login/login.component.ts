import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';
import { RecuperarPasswordComponent } from '../../estudiante/recuperar-password/recuperar-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RecuperarPasswordComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  mostrarRecuperar: boolean = false;

  errorLogin: boolean = false;
  loading: boolean = false;
  mensajeError: string = '';

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]],
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
      next: (usuario: Usuario) => {
        this.loading = false;

        if (usuario.rol === 'AYUDANTE') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/calendario']);
        }
      },

      error: (err: any) => {
        this.loading = false;
        this.errorLogin = true;

        if (err.error && err.error.message) {
          this.mensajeError = err.error.message;
        } else {
          this.mensajeError = 'Credenciales incorrectas o error de servidor';
        }

        console.error('Error de login:', err);
      },
    });
  }
  cerrarModal() {
    // Limpia (opcional)
    this.loginForm.reset();
    this.mostrarRecuperar = false;

    // Regresa al home
    this.router.navigate(['/home']);
  }
}
