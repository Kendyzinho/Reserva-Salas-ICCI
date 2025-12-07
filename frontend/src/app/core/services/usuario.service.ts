import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  // usuario.service.ts
  actualizarUsuario(id: string, data: Partial<Usuario>) {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  obtenerUsuario(id: string) {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }
}
