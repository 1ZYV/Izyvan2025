import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'cp-sidebar',
    templateUrl: './sidebar.component.html',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
})

export class SidebarComponent {
    private baseRoute = '/dashboard';
    items = [
        { label: 'Inicio', link: `${this.baseRoute}/home`, roles: ['ADMIN', 'AGENCY', 'PROVIDER'] },
        { label: 'Viajes', link: `${this.baseRoute}/travels`, roles: ['AGENCY', 'ADMIN'] },
        { label: 'Servicios', link: `${this.baseRoute}/services`, roles: ['PROVIDER', 'ADMIN'] },
        { label: 'Historial', link: `${this.baseRoute}/history`, roles: ['ADMIN', 'AGENCY', 'PROVIDER'] },
        { label: 'Vehículos', link: `${this.baseRoute}/vehicles`, roles: ['ADMIN', 'PROVIDER'], providerType: 'transport' as 'transport' | 'tourism' },
        { label: 'Conductores', link: `${this.baseRoute}/drivers`, roles: ['ADMIN', 'PROVIDER'], providerType: 'transport' as 'transport' | 'tourism' },
        { label: 'Guías', link: `${this.baseRoute}/guides`, roles: ['PROVIDER', 'ADMIN'], providerType: 'tourism' as 'transport' | 'tourism' },
        { label: 'Tarifas', link: `${this.baseRoute}/tariffs`, roles: ['PROVIDER', 'ADMIN'] },
        { label: 'Cargos', link: `${this.baseRoute}/invoices`, roles: ['ADMIN', 'AGENCY', 'PROVIDER'] },
        { label: 'Transportistas', link: `${this.baseRoute}/transporters`, roles: ['ADMIN'] },
        { label: 'Agencias', link: `${this.baseRoute}/agencies`, roles: ['ADMIN'] }
    ];

    constructor() { }

    // Método para cerrar sesión
    logout(): void {
    }
}