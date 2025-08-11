import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (_route, _state) => { // 👈 async
  const auth = inject(AuthService);
  const router = inject(Router);

  const loggedIn = auth.isAuthenticated();
  const admin = await auth.isAdmin();

  if (loggedIn && admin) {
    return true;
  }

  // Si está autenticado pero no es admin
  if (loggedIn) {
    await router.navigate(['/user']);
  } else {
    await router.navigate(['/login']);
  }

  return false;
};
