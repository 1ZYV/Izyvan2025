import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceRequestCardComponent } from '../../utils/service-request-card/service-request-card.component';
import { RecentServiceRequestComponent } from '../../utils/recent-service-request/recent-service-request.component';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-list-service-request',
  imports: [
    RouterLink,
    RecentServiceRequestComponent,
    RefreshIconComponent,
    SearchIconComponent,
    NgClass,
  ],
  templateUrl: './list-service-request.component.html',
  styleUrl: './list-service-request.component.css',
})
export class ListServiceRequestComponent {
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
    },
  ]);
}
