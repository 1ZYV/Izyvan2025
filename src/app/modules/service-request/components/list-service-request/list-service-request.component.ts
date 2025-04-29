import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestCardComponent } from '../../utils/service-request-card/service-request-card.component';

@Component({
  selector: 'app-list-service-request',
  imports: [RouterLink, ServiceRequestCardComponent],
  templateUrl: './list-service-request.component.html',
  styleUrl: './list-service-request.component.css',
})
export class ListServiceRequestComponent {
  serviceRequests = [
    {
      id: 1,
      nameReference: 'Service Request 1',
      date: '2023/10/01',
      originAdress: '123 Main St',
      destinationAddress: '456 Elm St',
      typeVehicle: 'Car',
    },
    {
      id: 2,

      nameReference: 'Service Request 2',
      date: '2023/10/02',
      originAdress: '789 Maple Ave',
      destinationAddress: '101 Pine St',
      typeVehicle: 'Van',
    },
  ];
}
