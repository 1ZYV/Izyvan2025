import { Component, inject, signal } from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapDirectionsRenderer,
  MapDirectionsService,
} from '@angular/google-maps';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { GeocodingService } from '../../../core/services/google-maps/geocoding/geocoding.service';
import { firstValueFrom } from 'rxjs';
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component';

@Component({
  selector: 'app-show-service-request',
  imports: [ServiceRequestMapDirectionComponent],
  templateUrl: './show-service-request.component.html',
  styleUrl: './show-service-request.component.css',
})
export class ShowServiceRequestComponent {
  travel = signal<IServiceRequest>({
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
  });
}
