import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapDirectionsRenderer,
  MapDirectionsService,
} from '@angular/google-maps';
import { GeocodingService } from '../../../core/services/google-maps/geocoding/geocoding.service';
import {
  firstValueFrom,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';

@Component({
  selector: 'app-service-request-map-direction',
  imports: [GoogleMap, MapDirectionsRenderer, GoogleMapsModule],
  templateUrl: './service-request-map-direction.component.html',
  styleUrl: './service-request-map-direction.component.css',
})
export class ServiceRequestMapDirectionComponent implements OnInit {
  travel = input<IServiceRequest | undefined>();

  mapDirectionsService = inject(MapDirectionsService);
  geoCodingService = inject(GeocodingService);

  center = input<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = input<number>(5);

  width = input.required<string>();
  height = input.required<string>();

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

  constructor() {}

  ngOnInit(): void {
    this.handleRequestDirections(
      this.travel()?.originAddress,
      this.travel()?.destinationAddress
    );
  }

  private fetchCoordinates(
    originAddress: string,
    destinationAddress: string
  ): Observable<{
    origin: google.maps.LatLng;
    destination: google.maps.LatLng;
  }> {
    return forkJoin({
      origin: this.geoCodingService.getGeocodingData(originAddress),
      destination: this.geoCodingService.getGeocodingData(destinationAddress),
    }).pipe(
      map(({ origin, destination }) => {
        if (!origin || !destination) {
          throw new Error('No se pudieron obtener las coordenadas');
        }
        return {
          origin: origin as google.maps.LatLng,
          destination: destination as google.maps.LatLng,
        };
      })
    );
  }

  handleRequestDirections(originAddress?: string, destinationAddress?: string) {
    if (!originAddress || !destinationAddress) return;

    this.fetchCoordinates(originAddress, destinationAddress)
      .pipe(
        tap(({ origin, destination }) =>
          this.request.set({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          })
        ),
        switchMap(() => this.mapDirectionsService.route(this.request())),
        map((result) => result.result)
      )
      .subscribe({
        next: (coords) => this.directionsResults.set(coords || undefined),
        error: (err) => console.warn(err.message),
      });
  }
}
