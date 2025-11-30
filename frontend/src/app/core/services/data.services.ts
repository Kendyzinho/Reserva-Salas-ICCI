import { Usuario } from '../models/usuario.model';
// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

export type UserRole = Usuario['rol'];

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly apiUrl = 'http://localhost:3000';

  //Estandarizado, solo se llama a la ruta maestra (controlador)
  private readonly usuariosEndpoint = `${this.apiUrl}/usuario`;
}
