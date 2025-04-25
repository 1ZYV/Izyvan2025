import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SignInComponent } from './modules/auth/components/sign-in/sign-in.component';
import { AuthLayoutComponent } from './modules/auth/layouts/auth-layout/auth-layout.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';
import { DashboardLayoutComponent } from './modules/core/layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
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
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'auth/sign-in',
  },
];
