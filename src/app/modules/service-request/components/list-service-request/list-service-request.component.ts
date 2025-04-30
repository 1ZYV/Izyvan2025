import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestCardComponent } from '../../utils/service-request-card/service-request-card.component';
import { RecentServiceRequestComponent } from '../../utils/recent-service-request/recent-service-request.component';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';

@Component({
  selector: 'app-list-service-request',
  imports: [
    RouterLink,
    RecentServiceRequestComponent,
    RefreshIconComponent,
    SearchIconComponent,
  ],
  templateUrl: './list-service-request.component.html',
  styleUrl: './list-service-request.component.css',
})
export class ListServiceRequestComponent {}
