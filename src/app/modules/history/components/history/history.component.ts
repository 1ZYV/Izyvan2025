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
      originAddress: 'Calle 3 #3-3',
      destinationAddress: 'Calle 4 #4-4',
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
      originAddress: 'Calle 5 #5-5',
      destinationAddress: 'Calle 6 #6-6',
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
    origin: { lat: 10.3908494, lng: -75.4752086 },
    destination: { lat: 10.3889344, lng: -75.479825 },
    travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING',
  });

  constructor() {
    this.handleRequestDirections(
      this.travels()[0].originAddress,
      this.travels()[0].destinationAddress
    );
  }

  handleRequestDirections(originAddress: string, destinationAddress: string) {
    // 1. Convertir cada llamada en una Signal
    const originSignal = this.geoCodingService.getGeocodingData(originAddress);
    const destSignal =
      this.geoCodingService.getGeocodingData(destinationAddress);

    // 2. Computed opcional: combinar o transformar
    const bothCoords = computed(() => ({
      origin: originSignal(),
      destination: destSignal(),
    }));

    // 3. Efecto: ejecutar la función cuando cambie el valor de la Signal
    effect(() => {
      const coords = bothCoords();
      if (coords.origin && coords.destination) {
        this.request.set({
          origin: { ...coords.origin } as google.maps.LatLng,
          destination: { ...coords.destination } as google.maps.LatLng,
          travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING',
        });

        this.mapDirectionsService.route(this.request()).subscribe((result) => {
          this.directionsResults.set(result.result || undefined);
        });
      }
    });
  }
}
