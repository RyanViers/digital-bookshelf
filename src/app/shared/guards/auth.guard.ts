import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

/**
 * A route guard that prevents access to routes if the user is not logged in.
 * If the user is not authenticated, they will be redirected to the /login page.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // We use the raw authState observable here to ensure the guard waits
  // for Firebase to initialize before making a decision.
  return authState(authService['auth']).pipe(
    map(user => {
      if (user) {
        return true; // User is logged in, allow access
      } else {
        router.navigate(['/login']); // User is not logged in, redirect
        return false;
      }
    })
  );
};