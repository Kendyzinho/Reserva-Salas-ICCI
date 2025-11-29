import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAyudante()) {
    return true;
  } else {
    // Si intenta entrar a admin y no es admin, lo mandamos a sus reservas
    router.navigate(['/mis-reservas']);
    return false;
  }
};