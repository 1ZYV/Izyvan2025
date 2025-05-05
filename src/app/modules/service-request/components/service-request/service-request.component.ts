import { Component, signal } from '@angular/core';
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PlaceAutocompleteComponent } from '../../../core/lib/components/place-autocomplete/place-autocomplete.component';

@Component({
  selector: 'app-service-request',
  imports: [
    ServiceRequestMapDirectionComponent,
    GoogleMapsModule,
    PlaceAutocompleteComponent,
  ],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.css',
})
export class ServiceRequestComponent {
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);
}
