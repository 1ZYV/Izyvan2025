import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignInComponent } from './modules/auth/components/sign-in/sign-in.component';
import { AuthLayoutComponent } from './modules/auth/layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';
import { DashboardLayoutComponent } from './modules/core/layouts/dashboard-layout/dashboard-layout.component';
import { ListServiceRequestComponent } from './modules/service-request/components/list-service-request/list-service-request.component';

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
        component: ListServiceRequestComponent,
      },
      {
        path: 'history',
      },
      {
        path: 'vehicles',
      },
      {
        path: 'guides',
      },
      {
        path: 'tariffs',
      },
      {
        path: 'billing',
      },
      {
        path: 'reports',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth/sign-in',
  },
];
