import {
  Component,
  NgZone, // Service to run work inside or outside Angular's zone
  AfterViewInit, // Lifecycle hook
  Output, // Decorator for output properties
  EventEmitter,
  output, // Class to emit custom events
} from '@angular/core';
import { BookingServiceService } from '../../../../service-request/services/booking-service.service'; // Service to manage booking state

@Component({
  selector: 'app-place-autocomplete',
  standalone: true, // Indicates that the component is standalone
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css'],
})
export class PlaceAutocompleteComponent implements AfterViewInit {
  // Stores the selected origin location (LatLng)
  origen: google.maps.LatLng | null = null;
  // Stores the selected destination location (LatLng)
  destino: google.maps.LatLng | null = null;

  // Output event emitter for when both origin and destination are selected
  ubicacionesSeleccionadas = output<{
    origen: google.maps.LatLngLiteral;
    destino: google.maps.LatLngLiteral;
  }>();

  /**
   * Constructor for the component.
   * @param ngZone Angular's NgZone service.
   * @param bookingService Service to manage booking origin and destination.
   */
  constructor(
    private ngZone: NgZone,
    protected bookingService: BookingServiceService
  ) { }

  /**
   * Lifecycle hook called after the component's view has been initialized.
   * Initializes Google Places Autocomplete for origin and destination inputs.
   */
  ngAfterViewInit(): void {
    // Initialize autocomplete for the 'origen' input
    this.initAutocomplete('origen', (location) => {
      this.ngZone.run(() => {
        this.origen = location?.geometry?.location || null;
        console.log('Origen:', location);
        this.bookingService.bookingForm().originLngLtd =
          location && location.geometry && location.geometry.location
            ? location.geometry.location.toJSON() // CONVERT TO LatLngLiteral
            : null;
        this.bookingService.bookingForm().originLiteral = location?.name ?? "";
        this.bookingService.originLatLng.set(
          location && location.geometry && location.geometry.location
            ? location.geometry.location.toJSON()
            : null
        );
        this.checkAndEmitUbicaciones();
      });
    });

    // Initialize autocomplete for the 'destino' input
    this.initAutocomplete('destino', (location) => {
      this.ngZone.run(() => {
        this.destino = location?.geometry?.location || null;
        console.log('Destino:', location);
        this.bookingService.bookingForm().destinyLngLtd =
          location && location.geometry && location.geometry.location
            ? location.geometry.location.toJSON() // CONVERT TO LatLngLiteral
            : null;
        this.bookingService.bookingForm().destinyLiteral = location?.name ?? "";
        this.bookingService.destinyLatLng.set(
          location && location.geometry && location.geometry.location
            ? location.geometry.location.toJSON()
            : null
        );
        this.checkAndEmitUbicaciones();
      });
    });
  }

  /**
   * Checks if both origin and destination are selected and emits an event.
   */
  private checkAndEmitUbicaciones() {
    const currentOrigin = this.bookingService.bookingForm().originLngLtd; // Get current origin from service
    const currentDestiny = this.bookingService.bookingForm().destinyLngLtd; // Get current destination from service
    if (currentOrigin && currentDestiny) {
      // If both are selected
      // Emit the selected locations
      this.ubicacionesSeleccionadas.emit({
        origen: currentOrigin,
        destino: currentDestiny,
      });

      console.log('Ubicaciones seleccionadas:', {
        origen: currentOrigin,
        destino: currentDestiny,
      }); // Log the selected locations
    }
  }

  /**
   * Initializes Google Places Autocomplete on a given input element.
   * @param inputId The ID of the HTML input element.
   * @param callback A function to call when a place is selected.
   */
  private initAutocomplete(
    inputId: string,
    callback: (location: google.maps.places.PlaceResult | null) => void,
  ) {
    const input = document.getElementById(inputId) as HTMLInputElement; // Get the input element
    // Create a new Autocomplete instance, restricted to Colombia and fetching geometry
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'COL' }, // Restrict to Colombia
      fields: ['geometry', 'name'], // Request only geometry data (location)
    });

    // Add a listener for the 'place_changed' event
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace(); // Get the selected place
      const location = place || null; // Extract the location (LatLng)
      callback(location); // Call the callback with the location
    });
  }
}
