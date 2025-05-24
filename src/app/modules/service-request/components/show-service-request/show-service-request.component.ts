import { Component, inject, OnInit, signal } from '@angular/core';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component';
import { TransportProvidersServiceService } from '../../../providers/transporter/services/transport-providers-service.service';
import { ITransportProvider } from '../../../core/utils/interfaces/ITransportProvider';
import { ServiceRequestRatingComponent } from '../../utils/service-request-rating/service-request-rating.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-show-service-request',
  imports: [
    ServiceRequestMapDirectionComponent,
    ServiceRequestRatingComponent,
    NgClass,
  ],
  templateUrl: './show-service-request.component.html',
  styleUrl: './show-service-request.component.css',
})
export class ShowServiceRequestComponent implements OnInit {
  transportProvicerService = inject(TransportProvidersServiceService);
  travel = signal<IServiceRequest>({
    id: 1,
    nameReference: 'Viaje 1',
    status: ServiceStatus.ACCEPTED,
    originAddress: 'Aeropuerto El Dorado, Bogotá',
    destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
    numberOfPassengers: 3,
    vehicleType: VehicleType.BUS,
    date: '2023-10-01',
    rating: 4,
    time: '08:00 AM',
    tariffs: [
      {
        providerId: 1,
        destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
        originAddress: 'Aeropuerto El Dorado, Bogotá',
        price: 50000,
      }
    ]
  });

  transporterProvider = signal<ITransportProvider | undefined>(undefined);

  ngOnInit(): void {
    this.transporterProvider.set(
      this.transportProvicerService.getTransporterProvider(
        this.travel().tariffs?.[0].providerId || 0
      )
    );
  }
}
