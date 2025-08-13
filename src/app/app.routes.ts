import { Routes } from '@angular/router';
import { ADMIN_ROUTES } from './Pages/Dashboard/admin.routes';
import { UnauthorizedPage } from './Pages/Dashboard/Unauthorized/unauthorize.component';
import { LoginComponent } from './Pages/Auth/login.component';

export const routes: Routes = [
    // Rutas de autenticación
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },

    // Rutas protegidas del dashboard
    {
        path: 'dashboard',
        loadChildren: () => ADMIN_ROUTES,
        data: { roles: ['ADMIN', 'AGENCY', 'PROVIDER'] }
    },

    // Ruta de no autorizado
    { path: 'unauthorized', component: UnauthorizedPage },

    // Redirección por defecto
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

    // Ruta wildcard para 404
    { path: '**', redirectTo: '/auth/login' }
];
