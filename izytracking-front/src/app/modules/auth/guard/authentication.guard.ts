import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


export const authenticationGuard: CanMatchFn = (
  route,
  segments,
): MaybeAsync<GuardResult> => {
  const router = inject(Router);

  return inject(AuthenticationService).currentUser$.pipe(
    map((user) => {
      console.log('Guard user:', user);
      if (user) {
        return true;
      }

      return router.createUrlTree(['/auth/sign-in']);
    }),
  );
};
