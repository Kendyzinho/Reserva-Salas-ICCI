import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, throwError } from 'rxjs'; // Agregamos operadores
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // 1. Asegúrate que apunte a tu puerto 3000
  private apiUrl = 'http://localhost:3000/api'; 

  // --- LOGIN ACTUALIZADO PARA MYSQL ---
  login(email: string, password: string): Observable<Usuario> {
    // Ahora usamos POST y enviamos un objeto { email, password }
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(user => {
          // Si el servidor responde éxito, guardamos el usuario
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        }),
        catchError(error => {
          // Si el servidor responde 401 (Credenciales malas), lanzamos el error
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}