import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class HomeComponent {
  title = 'Mi Proyecto Angular Material';

  features = [
    {
      icon: 'calendar-days',
      title: 'Reserva de Salas',
      description:
        'Agenda tu espacio (laboratorio, auditorio, sala) en minutos.',
    },
    {
      icon: 'clock',
      title: 'Disponibilidad en Tiempo Real',
      description: 'Consulta el estado actual de todas las salas.',
    },
    {
      icon: 'information-circle',
      title: 'Información de Salas',
      description: 'Detalles sobre capacidad, equipamiento y ubicación.',
    },
  ];

  mostrarLogin = false;
  modoRegistro = false;

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

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
    }
  }
}
