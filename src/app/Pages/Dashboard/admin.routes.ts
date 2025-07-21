import { DashboardLayout } from "@/Layouts/Dashboard/dashboard.component";
import { Routes } from "@angular/router";
import { UnauthorizedPage } from "./Unauthorized/unauthorize.component";
import { DashboardPage } from "./dashboard.component";
import { TravelsIndexComponent } from "../Travels/Index/index.component";
import { TravelsCreateComponent } from "../Travels/Create/create.component";
import { TravelsShowComponent } from "../Travels/Show/show.component";
import { HistoryIndexComponent } from "../History/Index/index.component";
import { InvoicesIndexComponent } from "../Invoices/Index/index.component";
import { InvoicesShowComponent } from "../Invoices/Show/show.component";
import { InvoiceCreateComponent } from "../Invoices/Create/create.component";
import { ServicesIndexComponent } from "../Services/Index/index.component";
import { DriversIndexComponent } from "../Drivers/Index/index.component";
import { GuidesIndexComponent } from "../Guides/Index/index.component";
import { GuidesShowComponent } from "../Guides/Show/show.component";
import { TariffsIndexComponent } from "../Tariffs/Index/index.component";
import { VehiclesIndexComponent } from "../Vehicles/Index/index.component";
import { ProviderGuard } from "@/Guards/Auth/provider.guard";

type RouteData = {
    title: string;
    subtitle: string;
    role?: string; // Optional role for route access control
    providerType?: string; // Optional provider type for specific access control
}

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: DashboardLayout,

        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                loadComponent: () => DashboardPage,
                data: { title: 'Tu inicio', subtitle: 'Panel de control principal, gestiona tus viajes y preferencias' },
            }, {
                path: 'travels',
                loadComponent: () => TravelsIndexComponent,
                data: { title: 'Tus Viajes', subtitle: 'Gestiona tus viajes, reservas y preferencias de transporte', role: 'agency' },
            },

            {
                path: 'travels/create',
                loadComponent: () => TravelsCreateComponent,
                data: { title: 'Solicitar Viaje', subtitle: 'Completa los detalles de tu viaje y elige tu vehículo preferido', role: 'agency' },
            },

            {
                path: 'travels/:id',
                loadComponent: () => TravelsShowComponent,
                data: { title: 'Detalle del Viaje', subtitle: 'Información detallada y seguimiento en tiempo real de tu viaje', role: 'agency' },
            },

            {
                path: 'services',
                loadComponent: () => ServicesIndexComponent,
                data: { title: 'Tus Servicios', subtitle: 'Consulta y gestiona tus servicios', role: 'provider' },
            },

            {
                path: 'history',
                loadComponent: () => HistoryIndexComponent,
                data: { title: 'Tu Historial', subtitle: 'Consulta el historial de tus viajes y reservas', role: 'admin' },
            }, {
                path: 'invoices',
                loadComponent: () => InvoicesIndexComponent,
                data: { title: 'Tus Cargos', subtitle: 'Consulta y gestiona tus cargos', role: 'admin' },
            },

            {
                path: 'invoices/create',
                loadComponent: () => InvoiceCreateComponent,
                data: { title: 'Crear Cargo', subtitle: 'Crear un nuevo cargo para servicios completados' },
            },

            {
                path: 'invoices/:id',
                loadComponent: () => InvoicesShowComponent,
                data: { title: 'Detalle de Cargo', subtitle: 'Información detallada del cargo', role: 'admin' },
            },

            {
                path: 'drivers',
                loadComponent: () => DriversIndexComponent,
                canActivate: [ProviderGuard],
                data: { title: 'Tus Conductores', subtitle: 'Consulta y gestiona tus conductores', role: 'admin', providerType: 'transport' },
            },

            {
                path: 'vehicles',
                loadComponent: () => VehiclesIndexComponent,
                canActivate: [ProviderGuard],
                data: { title: 'Tus Vehículos', subtitle: 'Consulta y gestiona tus vehículos', role: 'provider', providerType: 'transport' },
            },

            {
                path: 'guides',
                loadComponent: () => GuidesIndexComponent,
                canActivate: [ProviderGuard],
                data: { title: 'Tus Guías', subtitle: 'Consulta y gestiona tus guías', role: 'admin', providerType: 'tourism' },
            },

            {
                path: 'guides/create',
                loadComponent: () => import('../Guides/Create/create.component').then(c => c.GuidesCreateComponent),
                canActivate: [ProviderGuard],
                data: { title: 'Nuevo Guía', subtitle: 'Añadir un nuevo guía turístico', role: 'admin', providerType: 'tourism' },
            },

            {
                path: 'guides/:id',
                loadComponent: () => GuidesShowComponent,
                canActivate: [ProviderGuard],
                data: { title: 'Detalle del Guía', subtitle: 'Información detallada del guía turístico', role: 'admin', providerType: 'tourism' },
            },

            {
                path: 'tariffs',
                loadComponent: () => TariffsIndexComponent,
                data: { title: 'Tus Tarifas', subtitle: 'Consulta y gestiona tus tarifas', role: 'admin' },
            },

        ]
    }
]