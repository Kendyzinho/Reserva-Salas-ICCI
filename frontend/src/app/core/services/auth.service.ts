// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

interface DecodedToken {
  sub: number; // id del usuario en el backend
  correo: string;
  rol: string; // 'funcionario' | 'secretaria' | 'administrador'
  exp: number; // timestamp en segundos
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'authUser';
  private readonly LAST_SESSION_KEY = 'lastSession';

  constructor(private router: Router) {}

  // Guarda token + usuario
  login(token: string, user: Usuario): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.LAST_SESSION_KEY, new Date().toISOString());
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    // te mando SIEMPRE a la home ('/')
    this.router.navigateByUrl('/');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  public getUserFromStorage(): Usuario | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Usuario;
    } catch {
      return null;
    }
  }

  private getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Error decodificando token', err);
      return null;
    }
  }

  // -------- Helpers de sesión --------

  isLoggedIn(): boolean {
    const t = this.getDecodedToken();
    if (!t) return false;
    return Date.now() < t.exp * 1000;
  }

  getUserRole(): string | null {
    const t = this.getDecodedToken();
    if (t?.rol) return t.rol; // viene en minúscula del backend

    const u = this.getUserFromStorage();
    return u?.rol ?? null;
  }

  getUserId(): number | null {
    const t = this.getDecodedToken();
    if (t?.sub) return t.sub;

    const u = this.getUserFromStorage();
    return u?.id_usuario ?? null;
  }

  getUserEmail(): string | null {
    const t = this.getDecodedToken();
    if (t?.correo) return t.correo;

    const u = this.getUserFromStorage();
    return u?.correo ?? null;
  }

  getLastSessionISO(): string | null {
    return localStorage.getItem(this.LAST_SESSION_KEY);
  }

  // -------- Ruta home según rol --------
  getHomeRouteForRole(): string {
    const rol = this.getUserRole();
    const id = this.getUserId();

    if (!rol || !id) return '/';

    const r = rol.toLowerCase();

    if (r === 'estudiante') return `/funcionario/${id}/perfil`;
    if (r === 'ayudante') return `/secretaria/${id}/perfil`;

    return '/';
  }
}
