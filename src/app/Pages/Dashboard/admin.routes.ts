import { DashboardLayout } from "@/Layouts/Dashboard/dashboard.component";
import { Routes } from "@angular/router";
import { DashboardPage } from "./dashboard.component";
import { TravelsIndexComponent } from "../Travels/Index/index.component";
import { TravelsCreateComponent } from "../Travels/Create/create.component";
import { TravelsShowComponent } from "../Travels/Show/show.component";
import { HistoryIndexComponent } from "../History/index.component";
import { InvoicesIndexComponent } from "../Invoices/index.component";
import { InvoicesShowComponent } from "../Invoices/Show/show.component";
import { InvoiceCreateComponent } from "../Invoices/Create/create.component";
import { ServicesIndexComponent } from "../Services/Index/index.component";
import { DriversIndexComponent } from "../Drivers/index.component";
import { GuidesIndexComponent } from "../Guides/index.component";
import { GuidesShowComponent } from "../Guides/Show/show.component";
import { TariffsIndexComponent } from "../Tariffs/Index/index.component";
import { VehiclesIndexComponent } from "../Vehicles/index.component";
import { AgenciesIndexComponent } from "../Agencies/index.component";

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
                data: { title: 'Tus Viajes', subtitle: 'Gestiona tus viajes, reservas y preferencias de transporte', role: 'AGENCY' },
            },

            {
                path: 'travels/create',
                loadComponent: () => TravelsCreateComponent,
                data: { title: 'Solicitar Viaje', subtitle: 'Completa los detalles de tu viaje y elige tu vehículo preferido', role: 'AGENCY' },
            },

            {
                path: 'travels/:id',
                loadComponent: () => TravelsShowComponent,
                data: { title: 'Detalle del Viaje', subtitle: 'Información detallada y seguimiento en tiempo real de tu viaje', role: 'AGENCY' },
            },

            {
                path: 'services',
                loadComponent: () => ServicesIndexComponent,
                data: { title: 'Tus Servicios', subtitle: 'Consulta y gestiona tus servicios', role: 'PROVIDER' },
            },

            {
                path: 'history',
                loadComponent: () => HistoryIndexComponent,
                data: { title: 'Tu Historial', subtitle: 'Consulta el historial de tus viajes y reservas', role: 'ADMIN' },
            }, {
                path: 'invoices',
                loadComponent: () => InvoicesIndexComponent,
                data: { title: 'Tus Cargos', subtitle: 'Consulta y gestiona tus cargos', role: 'ADMIN' },
            },

            {
                path: 'invoices/create',
                loadComponent: () => InvoiceCreateComponent,
                data: { title: 'Crear Cargo', subtitle: 'Crear un nuevo cargo para servicios completados' },
            },

            {
                path: 'invoices/:id',
                loadComponent: () => InvoicesShowComponent,
                data: { title: 'Detalle de Cargo', subtitle: 'Información detallada del cargo', role: 'ADMIN' },
            },

            {
                path: 'drivers',
                loadComponent: () => DriversIndexComponent,
                data: { title: 'Tus Conductores', subtitle: 'Consulta y gestiona tus conductores', role: 'ADMIN', providerType: 'transport' },
            },

            {
                path: 'vehicles',
                loadComponent: () => VehiclesIndexComponent,
                data: { title: 'Tus Vehículos', subtitle: 'Consulta y gestiona tus vehículos', role: 'PROVIDER', providerType: 'transport' },
            },

            {
                path: 'guides',
                loadComponent: () => GuidesIndexComponent,
                data: { title: 'Tus Guías', subtitle: 'Consulta y gestiona tus guías', role: 'ADMIN', providerType: 'tourism' },
            },

            {
                path: 'guides/create',
                loadComponent: () => import('../Guides/Create/create.component').then(c => c.GuidesCreateComponent),
                data: { title: 'Nuevo Guía', subtitle: 'Añadir un nuevo guía turístico', role: 'ADMIN', providerType: 'tourism' },
            },

            {
                path: 'guides/:id',
                loadComponent: () => GuidesShowComponent,
                data: { title: 'Detalle del Guía', subtitle: 'Información detallada del guía turístico', role: 'ADMIN', providerType: 'tourism' },
            },

            {
                path: 'tariffs',
                loadComponent: () => TariffsIndexComponent,
                data: { title: 'Tus Tarifas', subtitle: 'Consulta y gestiona tus tarifas', role: 'ADMIN' },
            },
            {
                path: 'agencies',
                loadComponent: () => AgenciesIndexComponent,
                data: { title: 'Tus Agencias', subtitle: 'Consulta y gestiona tus agencias', role: 'ADMIN' },
            },
            {
                path: 'agencies/create',
                loadComponent: () => import('../Agencies/Create/create.component').then(c => c.AgenciesCreateComponent),
                data: { title: 'Nueva Agencia', subtitle: 'Añadir una nueva agencia', role: 'ADMIN' },
            },
            {
                path: 'agencies/:id',
                loadComponent: () => import('../Agencies/Show/show.component').then(c => c.AgenciesShowComponent),
                data: { title: 'Detalle de Agencia', subtitle: 'Información detallada de la agencia', role: 'ADMIN' },
            },
            {
                path: 'transporters',
                loadComponent: () => import('../Transporters/index.component').then(c => c.TransportersIndexComponent),
                data: { title: 'Tus Transportistas', subtitle: 'Consulta y gestiona tus transportistas', role: 'ADMIN' },
            },
            {
                path: 'transporters/create',
                loadComponent: () => import('../Transporters/Create/create.component').then(c => c.TransportersCreateComponent),
                data: { title: 'Nuevo Transportista', subtitle: 'Añadir un nuevo transportista', role: 'ADMIN' },
            },
            {
                path: 'transporters/:id',
                loadComponent: () => import('../Transporters/Show/show.component').then(c => c.TransportersShowComponent),
                data: { title: 'Detalle de Transportista', subtitle: 'Información detallada del transportista', role: 'ADMIN' },
            }

        ]
    }
]