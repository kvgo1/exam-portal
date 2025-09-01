import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LoginService } from './login.service';

export const adminGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const login = inject(LoginService);
  const router = inject(Router);

  if (login.isLoggedIn() && login.getUserRole() === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/login']);
};




