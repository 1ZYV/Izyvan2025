import { Component, inject, OnInit, signal } from '@angular/core';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component';
import { TransportProvidersServiceService } from '../../../providers/transporter/services/transport-providers-service.service';
import { ITransportProvider } from '../../../core/utils/interfaces/ITransportProvider';

@Component({
  selector: 'app-show-service-request',
  imports: [ServiceRequestMapDirectionComponent],
  templateUrl: './show-service-request.component.html',
  styleUrl: './show-service-request.component.css',
})
export class ShowServiceRequestComponent implements OnInit {
  transportProvicerService = inject(TransportProvidersServiceService);
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
    transportProviderId: 1,
  });

  transporterProvider = signal<ITransportProvider | undefined>(undefined);

  ngOnInit(): void {
    this.transporterProvider.set(
      this.transportProvicerService.getTransporterProvider(
        this.travel().transportProviderId || 0
      )
    );
  }
}
