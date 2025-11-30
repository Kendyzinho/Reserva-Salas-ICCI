import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
  ],
})
export class HomeComponent {
  title = 'Mi Proyecto Angular Material';

  features = [
    {
      icon: 'date_range',
      title: 'Reserva de Salas',
      description:
        'Agenda tu espacio (laboratorio, auditorio, sala) en minutos.',
    },
    {
      icon: 'event_available',
      title: 'Disponibilidad en Tiempo Real',
      description: 'Consulta el estado actual de todas las salas.',
    },
    {
      icon: 'info',
      title: 'Información de Salas',
      description: 'Detalles sobre capacidad, equipamiento y ubicación.',
    },
  ];

  // Modal login/registro
  mostrarLogin = false;
  modoRegistro = false; // false = login, true = registro

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    // Registro
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@alumnos\.uta\.cl$/),
        ],
      ],
      password: ['', Validators.required],
      confirmarPassword: ['', Validators.required],
    });
  }

  abrirLogin() {
    this.mostrarLogin = true;
    this.modoRegistro = false;
  }

  abrirRegistro() {
    this.mostrarLogin = true;
    this.modoRegistro = true;
  }

  cerrarLogin() {
    this.mostrarLogin = false;
  }

  login() {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
      this.cerrarLogin();
      // Lógica de autenticación backend
    }
  }

  registrar() {
    if (this.registerForm.valid) {
      if (
        this.registerForm.value.password !==
        this.registerForm.value.confirmarPassword
      ) {
        alert('Las contraseñas no coinciden');
        return;
      }
      console.log('Registro:', this.registerForm.value);
      this.cerrarLogin();
      // Lógica de registro backend
    }
  }
}
