import { AuthService } from "@/Services/Auth/auth.service";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const AuthGuard: CanActivateFn = (route) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    console.log('AuthGuard: Verificando autenticación...');

    if (authService.isAuthenticated()) {
        console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
        return true;
    } else {
        console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
        router.navigate(['/auth/login']);
        return false;
    }
}