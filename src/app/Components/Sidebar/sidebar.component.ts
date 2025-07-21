import { Component, inject, OnInit, OnDestroy } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NavLinkComponent } from "../NavLinks/navlink.component";
import { AuthService } from "@/Services/Auth/auth.service";
import { tap, takeUntil, Subject } from "rxjs";
import { User, Role } from "@/Types/index.d";

@Component({
    selector: 'cp-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [NavLinkComponent],
})

export class SidebarComponent implements OnInit, OnDestroy {
    private baseRoute = '/dashboard';
    private destroy$ = new Subject<void>();

    private authService = inject(AuthService);

    currentUser: User = null;
    currentProviderType: 'transport' | 'tourism' | undefined = undefined; // Puede ser 'transport', 'tourism' o undefined si no es un proveedor
    roles: Role[] = [];

    items = [
        { label: 'Inicio', link: `${this.baseRoute}/home`, roles: ['admin', 'agency', 'provider'] as Role[] },
        { label: 'Viajes', link: `${this.baseRoute}/travels`, roles: ['agency', 'admin'] as Role[] },
        { label: 'Servicios', link: `${this.baseRoute}/services`, roles: ['provider', 'admin'] as Role[] },
        { label: 'Historial', link: `${this.baseRoute}/history`, roles: ['admin', 'agency', 'provider'] as Role[] },
        { label: 'Vehiculos', link: `${this.baseRoute}/vehicles`, roles: ['provider', 'admin'] as Role[], providerType: 'transport' as 'transport' | 'tourism' },
        { label: 'Conductores', link: `${this.baseRoute}/drivers`, roles: ['admin', 'provider'] as Role[], providerType: 'transport' as 'transport' | 'tourism' },
        { label: 'Guías', link: `${this.baseRoute}/guides`, roles: ['provider', 'admin'] as Role[], providerType: 'tourism' as 'transport' | 'tourism' },
        { label: 'Tarifas', link: `${this.baseRoute}/tariffs`, roles: ['provider', 'admin'] as Role[] },
        { label: 'Cargos', link: `${this.baseRoute}/invoices`, roles: ['admin', 'agency', 'provider'] as Role[] },
    ];

    constructor() { }

    hasAccess(itemRoles: Role[], requiredProviderType?: 'transport' | 'tourism'): boolean {
        // Primero verificar si tiene los roles necesarios
        const hasRoles = this.roles.some(role => itemRoles.includes(role));

        if (!hasRoles) {
            return false;
        }

        // Si no se requiere un tipo de proveedor específico, permitir acceso
        if (!requiredProviderType) {
            return true;
        }

        // Si se requiere un tipo de proveedor pero el usuario no tiene uno definido, permitir acceso
        if (this.currentProviderType === undefined || this.currentProviderType === null) {
            return true;
        }

        // Si tiene un tipo de proveedor, debe coincidir con el requerido
        return this.currentProviderType === requiredProviderType;
    }



    ngOnInit(): void {
        // Suscribirse al usuario actual
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.currentUser = user;
                this.roles = user?.roles || [];
            });

        // También obtener los datos actuales del usuario si existe
        this.authService.getCurrentUserData()
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                if (user) {
                    this.currentUser = user;
                    this.roles = user.roles || [];
                }
            });

        // Obtener el tipo de proveedor actual
        this.authService.currentProvider$
            .pipe(takeUntil(this.destroy$))
            .subscribe(provider => {
                this.currentProviderType = provider?.type;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Método para cerrar sesión
    logout(): void {
        this.authService.logout();
    }
}