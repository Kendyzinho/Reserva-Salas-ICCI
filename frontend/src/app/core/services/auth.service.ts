import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Asegúrate que apunte a tu puerto 3000
  private apiUrl = 'http://localhost:3000/api'; 

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
          }
        }),
        catchError(error => {
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

  // --- ESTA ES LA FUNCIÓN QUE FALTABA ---
  isAyudante(): boolean {
    const user = this.getUser();
    // Verifica si el rol es exactamente 'AYUDANTE'
    return user?.rol === 'AYUDANTE';
  }
}