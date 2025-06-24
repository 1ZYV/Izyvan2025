import { AuthService } from "@/Services/Auth/auth.service";
import { Role } from "@/Types/index.d";
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { catchError, map, of, tap } from "rxjs";


export const RoleGuard: CanActivateFn = (route) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedRoles: Role[] = route.data['roles'];

    return authService.currentUser$.pipe(
        map(user => {
            if (user && expectedRoles.some((role: Role) => user.roles.includes(role))) {
                return true;
            } else {
                router.navigate(['/unauthorized']);
                return false;
            }
        }),
        catchError(() => {
            router.navigate(['/auth/login']);
            return of(false);
        })
    ); // Default return value, will be overridden in the subscription
}