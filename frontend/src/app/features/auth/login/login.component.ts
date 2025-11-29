import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// CORRECCIÓN 1: Ruta del import ajustada (3 retrocesos, no 4)
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

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      // CORRECCIÓN 2: Tipado explícito para 'usuario'
      next: (usuario: Usuario | null) => {
        this.loading = false;
        if (usuario) {
          if (usuario.rol === 'AYUDANTE') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/mis-reservas']);
          }
        } else {
          this.errorLogin = true;
        }
      },
      // CORRECCIÓN 3: Tipado explícito para 'err'
      error: (err: any) => {
        this.loading = false;
        this.errorLogin = true;
        console.error('Error de conexión', err);
      }
    });
  }
}