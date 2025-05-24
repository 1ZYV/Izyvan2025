import { Component, signal } from '@angular/core'; // Import Component decorator and signal for reactive state
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component'; // Component to display map directions
import { GoogleMapsModule } from '@angular/google-maps'; // Module for Google Maps integration
import { PlaceAutocompleteComponent } from '../../../core/lib/components/place-autocomplete/place-autocomplete.component'; // Component for place autocomplete input
import { VehicleTypeSelectorComponent } from '../../../core/lib/components/vehicle-type-selector/vehicle-type-selector.component'; // Component for selecting vehicle type
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BookingServiceService } from '../../services/booking-service.service';

@Component({
  selector: 'app-service-request', // CSS selector for using this component
  imports: [
    // List of modules and components used by this component's template
    ServiceRequestMapDirectionComponent,
    GoogleMapsModule,
    PlaceAutocompleteComponent,
    VehicleTypeSelectorComponent,
    ReactiveFormsModule
  ],
  templateUrl: './service-request.component.html', // Path to the HTML template
  styleUrl: './service-request.component.css', // Path to the CSS styles
})
export class ServiceRequestComponent {
  // Signal for the map's center coordinates, default to (0,0)
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  // Signal for the map's zoom level, default to 5
  zoom = signal<number>(5);

  constructor(private bookingService: BookingServiceService) {}

  serviceRequestForm : FormGroup = new FormGroup<{
    includeTourismGuide: FormControl<boolean>,
    nameReference: FormControl<string>,
    passengerNumber: FormControl<number>,
    description: FormControl<string>,
    date: FormControl<string>,
    time: FormControl<string>,
  }>({
    includeTourismGuide: new FormControl<boolean>(false, { nonNullable: true }),
    nameReference: new FormControl<string>("", { nonNullable: true }),
    passengerNumber: new FormControl<number>(0, { nonNullable: true }),
    description: new FormControl<string>("", { nonNullable: true }),
    date: new FormControl<string>("", { nonNullable: true }),
    time: new FormControl<string>("", { nonNullable: true }),
  });

  handleSubmitServiceRequest(){
    if (this.serviceRequestForm.valid) {
      const formData = this.serviceRequestForm.value;
      
      this.bookingService.date.set(formData.date || "");
      this.bookingService.time.set(formData.time || "");
      this.bookingService.includeTourismGuide.set(formData.includeTourismGuide || false);
      this.bookingService.nameReference.set(formData.nameReference || "");
      this.bookingService.passengerNumber.set(formData.passengerNumber || 0);
      this.bookingService.description.set(formData.description || "");
      this.bookingService.bookingServiceRequest(); // Call the service to book the request
    } else {
      console.log('Form is invalid');
    }
  }
}
