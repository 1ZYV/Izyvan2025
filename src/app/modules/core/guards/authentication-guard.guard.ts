import { CanMatchFn } from '@angular/router';

export const authenticationGuardGuard: CanMatchFn = (route, segments) => {
  return true;
};
