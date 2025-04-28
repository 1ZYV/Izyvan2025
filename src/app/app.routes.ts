import { Routes } from '@angular/router';
import { SignInComponent } from './modules/auth/components/sign-in/sign-in.component';
import { AuthLayoutComponent } from './modules/auth/layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';
import { DashboardLayoutComponent } from './modules/core/layouts/dashboard-layout/dashboard-layout.component';
import { ListServiceRequestComponent } from './modules/service-request/components/list-service-request/list-service-request.component';
import { ServiceRequestComponent } from './modules/service-request/components/service-request/service-request.component';
import { HistoryComponent } from './modules/history/components/history/history.component';
import { ListVehiclesComponent } from './modules/providers/transporter/components/vehicles/list-vehicles/list-vehicles.component';
import { CreateVehicleComponent } from './modules/providers/transporter/components/vehicles/create-vehicle/create-vehicle.component';
import { ModifyVehicleComponent } from './modules/providers/transporter/components/vehicles/modify-vehicle/modify-vehicle.component';
import { ListGuidesComponent } from './modules/providers/tourism/components/guides/list-guides/list-guides.component';
import { CreateGuideComponent } from './modules/providers/tourism/components/guides/create-guide/create-guide.component';
import { ModifyGuideComponent } from './modules/providers/tourism/components/guides/modify-guide/modify-guide.component';
import { ListTariffsComponent } from './modules/tariffs/components/list-tariffs/list-tariffs.component';
import { CreateTariffComponent } from './modules/tariffs/components/create-tariff/create-tariff.component';
import { ModifyTariffComponent } from './modules/tariffs/components/modify-tariff/modify-tariff.component';
import { RequestTariffsComponent } from './modules/tariffs/components/request-tariffs/request-tariffs.component';
import { ListBillingsComponent } from './modules/billing/components/list-billings/list-billings.component';
import { CreateBillingComponent } from './modules/billing/components/create-billing/create-billing.component';
import { ShowBillingComponent } from './modules/billing/components/show-billing/show-billing.component';
import { ListReportsComponent } from './modules/reports/components/list-reports/list-reports.component';
import { ShowServiceRequestComponent } from './modules/service-request/components/show-service-request/show-service-request.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'sign-up',
        component: SignUpComponent,
      },
    ],
  },

  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'services',
        children: [
          {
            path: '',
            component: ListServiceRequestComponent,
          },
          {
            path: 'create',
            component: ServiceRequestComponent,
          },
          {
            path: 'show/:id',
            component: ShowServiceRequestComponent,
          },
          {
            path: 'tariffs',
            component: RequestTariffsComponent,
          },
        ],
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'vehicles',
        children: [
          {
            path: '',
            component: ListVehiclesComponent,
          },
          {
            path: 'create',
            component: CreateVehicleComponent,
          },
          {
            path: 'edit/:id',
            component: ModifyVehicleComponent,
          },
        ],
      },
      {
        path: 'guides',
        children: [
          {
            path: '',
            component: ListGuidesComponent,
          },
          {
            path: 'create',
            component: CreateGuideComponent,
          },
          {
            path: 'edit/:id',
            component: ModifyGuideComponent,
          },
        ],
      },
      {
        path: 'tariffs',
        children: [
          {
            path: '',
            component: ListTariffsComponent,
          },
          {
            path: 'create',
            component: CreateTariffComponent,
          },
          {
            path: 'edit/:id',
            component: ModifyTariffComponent,
          },
        ],
      },
      {
        path: 'billing',
        children: [
          {
            path: '',
            component: ListBillingsComponent,
          },
          {
            path: 'create',
            component: CreateBillingComponent,
          },
          {
            path: 'show/:id',
            component: ShowBillingComponent,
          },
        ],
      },
      {
        path: 'reports',
        component: ListReportsComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth/sign-in',
  },
];
