import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000'; // Tu JSON Server

  // Login: Busca usuario por email y pass
  login(email: string, pass: string): Observable<Usuario | null> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios?email=${email}&password=${pass}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            const user = users[0];
            // Guardamos en localStorage
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          }
          return null;
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

  isAyudante(): boolean {
    const user = this.getUser();
    return user?.rol === 'AYUDANTE';
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}