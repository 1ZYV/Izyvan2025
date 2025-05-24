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
      originAddress: 'Aeropuerto El Dorado, Bogotá',
      destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
      numberOfPassengers: 3,
      vehicleType: VehicleType.BUS,
      date: '2023-10-01',
      rating: 4,
      time: '08:00 AM',
    },
    {
      id: 2,
      nameReference: 'Viaje 2',
      status: ServiceStatus.ACCEPTED,
      originAddress: 'Chicago, IL',
      destinationAddress: 'New York, NY',
      numberOfPassengers: 2,
      vehicleType: VehicleType.AUTOMOVIL,
      date: '2023-10-02',
      rating: 5,
      time: '10:30 AM',
    },
    {
      id: 3,
      nameReference: 'Viaje 3',
      status: ServiceStatus.IN_PROGRESS,
      originAddress: 'White House, Washington, D.C.',
      destinationAddress: 'Capitol Hill, Washington, D.C.',
      numberOfPassengers: 4,
      vehicleType: VehicleType.VAN,
      date: '2023-10-03',
      rating: 3,
      time: '11:00 AM',
    },
  ]);
}
