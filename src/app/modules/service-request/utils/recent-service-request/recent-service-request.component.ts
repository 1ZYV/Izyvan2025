import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestCardComponent } from '../service-request-card/service-request-card.component';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';

@Component({
  selector: 'app-recent-service-request',
  imports: [RouterLink, ServiceRequestCardComponent],
  templateUrl: './recent-service-request.component.html',
  styleUrl: './recent-service-request.component.css',
})
export class RecentServiceRequestComponent {
  serviceRequests = signal<IServiceRequest[]>([
    {
      id: 1,
      nameReference: 'Viaje 1',
      status: ServiceStatus.COMPLETED,
      pin: '1234',
      originAddress: 'Aeropuerto El Dorado, Bogotá',
      destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
      numberOfPassengers: 3,
      vehicleType: VehicleType.BUS,
      date: '2023-10-01',
      price: 10000,
      rating: 4,
    },
    {
      id: 2,
      nameReference: 'Viaje 2',
      status: ServiceStatus.ACCEPTED,
      pin: '5678',
      originAddress: 'Chicago, IL',
      destinationAddress: 'New York, NY',
      numberOfPassengers: 2,
      vehicleType: VehicleType.AUTOMOVIL,
      date: '2023-10-02',
      price: 15000,
      rating: 5,
    },
    {
      id: 3,
      nameReference: 'Viaje 3',
      status: ServiceStatus.IN_PROGRESS,
      pin: '91011',
      originAddress: 'White House, Washington, D.C.',
      destinationAddress: 'Capitol Hill, Washington, D.C.',
      numberOfPassengers: 4,
      vehicleType: VehicleType.VAN,
      date: '2023-10-03',
      price: 20000,
      rating: 3,
    },
  ]);
}
