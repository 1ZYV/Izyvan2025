import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestRatingComponent } from '../service-request-rating/service-request-rating.component';

type ServiceRequestCard = {
  id: number;
  nameReference: string;
  date: string;
  originAdress: string;
  destinationAddress: string;
  typeVehicle: string;
  ratings: number;
};

@Component({
  selector: 'app-service-request-card',
  imports: [RouterLink, ServiceRequestRatingComponent],
  templateUrl: './service-request-card.component.html',
  styleUrl: './service-request-card.component.css',
})
export class ServiceRequestCardComponent {
  serviceRequest = input<ServiceRequestCard>();
}
