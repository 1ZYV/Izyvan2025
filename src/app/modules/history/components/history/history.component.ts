import { Component, signal } from '@angular/core';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';

import {
  GoogleMap,
  GoogleMapsModule,
  MapDirectionsRenderer,
  MapDirectionsService,
} from '@angular/google-maps';

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
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);

  readonly directionsResults$ = signal<
    google.maps.DirectionsResult | undefined
  >(undefined);

  constructor(public mapDirectionsService: MapDirectionsService) {
    const request = signal<google.maps.DirectionsRequest>({
      origin: { lat: 10.3908494, lng: -75.4752086 },
      destination: { lat: 10.3889344, lng: -75.479825 },
      travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING',
    });

    this.mapDirectionsService.route(request()).subscribe((result) => {
      this.directionsResults$.set(result.result || undefined);
    });
  }
}
