import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.css',
})
export class DashboardSidebarComponent {
  authenticationService = inject(AuthenticationService);
  userRole: string | undefined;

  providerType: string | undefined;

  currentUser = this.authenticationService.currentUser$.subscribe((user) => {
    this.userRole = user?.role;
    this.providerType = user?.providerType ? user.providerType : undefined;
  });

  ngOnDestroy() {
    this.currentUser.unsubscribe();
  }

  handleLogout() {
    this.authenticationService.logout();
  }
}
