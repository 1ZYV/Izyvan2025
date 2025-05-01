import { Component, computed, effect, inject, signal } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-history',
  imports: [
    RefreshIconComponent,
    SearchIconComponent,
    GoogleMap,
    GoogleMapsModule,
    MapDirectionsRenderer,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  mapDirectionsService = inject(MapDirectionsService);
  geoCodingService = inject(GeocodingService);

  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);

  travels = signal<IServiceRequest[]>([
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

  readonly directionsResults = signal<google.maps.DirectionsResult | undefined>(
    undefined
  );

  request = signal<google.maps.DirectionsRequest>({
    origin: { lat: 0, lng: 0 },
    destination: { lat: 0, lng: 0 },
    travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING',
  });

  originCoords = signal<google.maps.LatLng | undefined>(undefined);
  destinationCoords = signal<google.maps.LatLng | undefined>(undefined);

  constructor() {
    this.handleRequestDirections(
      this.travels()[0].originAddress,
      this.travels()[0].destinationAddress
    );
  }

  async handleRequestDirections(
    originAddress: string,
    destinationAddress: string
  ) {
    // Obtener las coordenadas de origen y destino
    const origin = await firstValueFrom(
      this.geoCodingService.getGeocodingData(originAddress)
    );
    const destination = await firstValueFrom(
      this.geoCodingService.getGeocodingData(destinationAddress)
    );

    if (origin && destination) {
      // Actualizar la solicitud de direcciones
      this.request.set({
        origin: origin as google.maps.LatLng,
        destination: destination as google.maps.LatLng,
        travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING',
      });

      // Realizar la solicitud de direcciones y actualizar el resultado
      this.mapDirectionsService.route(this.request()).subscribe((result) => {
        this.directionsResults.set(result.result || undefined);
      });
    }
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
}
