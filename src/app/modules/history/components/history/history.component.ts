import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';

import {
  GoogleMap,
  GoogleMapsModule,
  MapDirectionsRenderer,
  MapDirectionsService,
} from '@angular/google-maps';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { GeocodingService } from '../../../core/services/google-maps/geocoding/geocoding.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ServiceRequestMapDirectionComponent } from '../../../service-request/utils/service-request-map-direction/service-request-map-direction.component';

@Component({
  selector: 'app-history',
  imports: [
    RefreshIconComponent,
    SearchIconComponent,
    ServiceRequestMapDirectionComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  travels = signal<IServiceRequest[]>([
    {
      id: 1,
      nameReference: 'Viaje 1',
      status: ServiceStatus.COMPLETED,
      originAddress: 'Aeropuerto El Dorado, Bogotá',
      destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
      numberOfPassengers: 3,
      vehicleType: VehicleType.BUS,
      date: '2023-10-01',
      time: '08:00 AM',
      tariffs: [
        {
          destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
          originAddress: 'Aeropuerto El Dorado, Bogotá',
          price: 50000,
          providerId: 1,
        }
      ]
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
      time: '09:00 AM',
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
      time: '10:00 AM',
    },
  ]);

  private serviceRequestMapDirectionComponent = viewChild(
    ServiceRequestMapDirectionComponent
  );

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);

  constructor() { }
  ngOnInit(): void {
    this.handleRefresh();
  }

  getTotalTariffs(travel: IServiceRequest): number {
    return travel.tariffs?.reduce((sum, t) => sum + (t.price ?? 0), 0) || 0;
  }

  handleTravelClick(travel: IServiceRequest) {
    this.serviceRequestMapDirectionComponent()?.handleRequestDirections(
      travel.originAddress,
      travel.destinationAddress
    );
  }

  handleSearch(event: Event) {
    const input = (event.target as HTMLInputElement)?.value
      .trim()
      .toLowerCase();

    if (!input) {
      this.handleRefresh();
      return;
    }

    const filteredTravels = this.travels().filter(
      (travel) =>
        travel.originAddress.toLowerCase().includes(input) ||
        travel.destinationAddress.toLowerCase().includes(input)
    );

    if (filteredTravels.length > 0) {
      this.travels.set(filteredTravels);
    } else {
      this.handleRefresh();
    }
  }

  handleRefresh() {
    this.travels.set([
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
        time: '08:00 AM',
        tariffs: [
          {
            destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
            originAddress: 'Aeropuerto El Dorado, Bogotá',
            price: 50000,
            providerId: 1,
          }
        ]
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
        time: '09:00 AM',
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
        time: '10:00 AM',
      },
    ]);
  }
}
