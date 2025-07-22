import { AuthService } from "@/Services/Auth/auth.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { catchError, map, of } from "rxjs";

export const ProviderGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedProviderType = route.data['providerType'];

    return authService.currentProvider$.pipe(
        map(provider => {
            if (provider && provider.type === expectedProviderType) {
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
