import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated() && auth.isAdmin()) {
    return true;
  }

  // Si está autenticado pero no es admin, lo mandamos a su panel de usuario
  if (auth.isAuthenticated()) {
    router.navigate(['/user']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
