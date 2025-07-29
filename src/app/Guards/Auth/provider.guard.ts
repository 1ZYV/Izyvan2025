import { AuthService } from "@/Services/Auth/auth.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { catchError, map, of } from "rxjs";

export const ProviderGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const expectedProviderType = route.data['providerType'];

    // Verificar si el usuario es ADMIN - los admins tienen acceso universal
    if (authService.hasRole('ADMIN')) {
        console.log('ProviderGuard: Usuario ADMIN detectado, permitiendo acceso universal');
        return true;
    }

    // Para usuarios no-admin, verificar el tipo de proveedor
    return authService.currentProvider$.pipe(
        map(provider => {
            if (provider && provider.type === expectedProviderType) {
                console.log(`ProviderGuard: Proveedor ${provider.type} autorizado para ${expectedProviderType}`);
                return true;
            } else {
                console.log(`ProviderGuard: Acceso denegado. Proveedor requerido: ${expectedProviderType}, actual: ${provider?.type || 'ninguno'}`);
                router.navigate(['/unauthorized']);
                return false;
            }
        }),
        catchError(() => {
            console.log('ProviderGuard: Error en verificación, redirigiendo a login');
            router.navigate(['/auth/login']);
            return of(false);
        })
    );
}
