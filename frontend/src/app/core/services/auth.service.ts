import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api'; 

  // 1. CREAMOS EL CANAL DE NOTICIAS (BehaviorSubject)
  // Lo inicializamos leyendo el localStorage para saber si ya hay alguien al entrar
  private currentUserSubject = new BehaviorSubject<Usuario | null>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  // 2. EXPONEMOS EL CANAL COMO OBSERVABLE (Para que otros se suscriban)
  public currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(user => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            // 3. AVISAMOS A TODOS QUE HAY UN NUEVO USUARIO
            this.currentUserSubject.next(user);
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
    // 4. AVISAMOS A TODOS QUE YA NO HAY USUARIO
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Método auxiliar para obtener el valor actual sin suscribirse (síncrono)
  getUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAyudante(): boolean {
    const user = this.getUser();
    return user?.rol === 'AYUDANTE';
  }
}