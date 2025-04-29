import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

type ServiceRequestCard = {
  id: number;
  nameReference: string;
  date: string;
  originAdress: string;
  destinationAddress: string;
  typeVehicle: string;
};

@Component({
  selector: 'app-service-request-card',
  imports: [RouterLink],
  templateUrl: './service-request-card.component.html',
  styleUrl: './service-request-card.component.css',
})
export class ServiceRequestCardComponent {
  serviceRequest = input<ServiceRequestCard>();
}
