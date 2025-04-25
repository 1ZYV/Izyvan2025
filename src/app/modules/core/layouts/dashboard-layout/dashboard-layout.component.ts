import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardNavbarComponent } from '../../components/dashboard-navbar/dashboard-navbar.component';
import { DashboardFooterComponent } from '../../components/dashboard-footer/dashboard-footer.component';
import { DashboardSidebarComponent } from '../../components/dashboard-sidebar/dashboard-sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    DashboardNavbarComponent,
    DashboardFooterComponent,
    DashboardSidebarComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {}
