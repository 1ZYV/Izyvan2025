import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestCardComponent } from '../service-request-card/service-request-card.component';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { ServiceRequestOperationService } from '../../services/service-request-operation.service';

@Component({
  selector: 'app-recent-service-request',
  imports: [RouterLink, ServiceRequestCardComponent],
  templateUrl: './recent-service-request.component.html',
  styleUrl: './recent-service-request.component.css',
})
export class RecentServiceRequestComponent {
  serviceRequestOperationService = inject(ServiceRequestOperationService);
  serviceRequests = this.serviceRequestOperationService.getMockServiceRequests();
}
