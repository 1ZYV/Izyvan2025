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
/**
 * Componente para la creación de solicitudes de servicio.
 * Permite al usuario ingresar datos y enviar una nueva solicitud.
 */
export class ServiceRequestComponent {
  /** Señal para el centro del mapa (por defecto 0,0) */
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  /** Señal para el nivel de zoom del mapa */
  zoom = signal<number>(5);

  /**
   * Constructor que inyecta el servicio de reservas.
   * @param bookingService Servicio para gestionar la reserva.
   */
  constructor(private bookingService: BookingServiceService) { }

  /**
   * Formulario reactivo para la solicitud de servicio.
   */
  serviceRequestForm: FormGroup = new FormGroup<{
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

  /**
   * Maneja el envío del formulario de solicitud de servicio.
   * Valida el formulario y actualiza el estado global mediante el servicio.
   */
  handleSubmitServiceRequest() {
    if (this.serviceRequestForm.valid) {
      const formData = this.serviceRequestForm.value;
      this.bookingService.date.set(formData.date || "");
      this.bookingService.time.set(formData.time || "");
      this.bookingService.includeTourismGuide.set(formData.includeTourismGuide || false);
      this.bookingService.nameReference.set(formData.nameReference || "");
      this.bookingService.passengerNumber.set(formData.passengerNumber || 0);
      this.bookingService.description.set(formData.description || "");
      this.bookingService.bookingServiceRequest(); // Llama al servicio para registrar la solicitud
    } else {
      // Se recomienda mostrar feedback visual al usuario
      console.log('Form is invalid');
    }
  }
}
