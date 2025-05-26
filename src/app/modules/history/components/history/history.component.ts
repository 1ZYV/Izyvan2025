import {
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';

import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceRequestMapDirectionComponent } from '../../../service-request/utils/service-request-map-direction/service-request-map-direction.component';
import { ServiceRequestOperationService } from '../../../service-request/services/service-request-operation.service';

@Component({
  selector: 'app-history',
  imports: [
    RefreshIconComponent,
    SearchIconComponent,
    ServiceRequestMapDirectionComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  serviceRequestOperation = inject(ServiceRequestOperationService);
  travels = signal<IServiceRequest[]>([]);

  private serviceRequestMapDirectionComponent = viewChild(
    ServiceRequestMapDirectionComponent
  );

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);

  constructor() { }
  ngOnInit(): void {
    this.handleRefresh();
  }

  handleTravelClick(travel: IServiceRequest) {
    this.serviceRequestMapDirectionComponent()?.handleRequestDirections(
      travel.originAddress,
      travel.destinationAddress
    );
  }

  handleSearch(event: Event) {
    const input = (event.target as HTMLInputElement)?.value
      .trim()
      .toLowerCase();

    if (!input) {
      this.handleRefresh();
      return;
    }

    const filteredTravels = this.travels().filter(
      (travel) =>
        travel.originAddress.toLowerCase().includes(input) ||
        travel.destinationAddress.toLowerCase().includes(input)
    );

    if (filteredTravels.length > 0) {
      this.travels.set(filteredTravels);
    } else {
      this.handleRefresh();
    }
  }

  handleRefresh() {
    this.serviceRequestOperation.getAllServiceRequests();
    this.travels.set(this.serviceRequestOperation.travels());
  }
}
