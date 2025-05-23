import { Component, signal } from '@angular/core'; // Import Component decorator and signal for reactive state
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component'; // Component to display map directions
import { GoogleMapsModule } from '@angular/google-maps'; // Module for Google Maps integration
import { PlaceAutocompleteComponent } from '../../../core/lib/components/place-autocomplete/place-autocomplete.component'; // Component for place autocomplete input
import { VehicleTypeSelectorComponent } from '../../../core/lib/components/vehicle-type-selector/vehicle-type-selector.component'; // Component for selecting vehicle type

@Component({
  selector: 'app-service-request', // CSS selector for using this component
  imports: [
    // List of modules and components used by this component's template
    ServiceRequestMapDirectionComponent,
    GoogleMapsModule,
    PlaceAutocompleteComponent,
    VehicleTypeSelectorComponent,
  ],
  templateUrl: './service-request.component.html', // Path to the HTML template
  styleUrl: './service-request.component.css', // Path to the CSS styles
})
export class ServiceRequestComponent {
  // Signal for the map's center coordinates, default to (0,0)
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  // Signal for the map's zoom level, default to 5
  zoom = signal<number>(5);

  handleSumbitServiceRequest(){
    
  }
}
