import {
  Component,
  effect, // Angular's effect for reactive side effects
  inject, // Dependency injection function
  input, // Input decorator for component properties
  OnInit, // Lifecycle hook
  signal, // Signal for reactive state management
} from '@angular/core';
import {
  GoogleMap, // Google Map component
  GoogleMapsModule, // Module for Google Maps integration
  MapDirectionsRenderer, // Component to render directions on the map
  MapDirectionsService, // Service to fetch directions
} from '@angular/google-maps'; // Service for geocoding addresses
import {
  firstValueFrom, // RxJS utility to get the first emitted value as a Promise
  forkJoin, // RxJS operator to combine multiple Observables
  map, // RxJS operator to transform emitted values
  Observable, // RxJS Observable
  switchMap, // RxJS operator to switch to a new Observable
  tap, // RxJS operator for side effects
} from 'rxjs';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest'; // Interface for service request data
import { BookingServiceService } from '../../services/booking-service.service'; // Service to manage booking state
import { GeocodingService } from '../../../core/services/google-maps/geocoding/geocoding.service';

@Component({
  selector: 'app-service-request-map-direction',
  imports: [GoogleMap, MapDirectionsRenderer, GoogleMapsModule], // Modules and components used in the template
  templateUrl: './service-request-map-direction.component.html',
  styleUrl: './service-request-map-direction.component.css',
})
export class ServiceRequestMapDirectionComponent implements OnInit {
  // Input property for service request details (optional)
  travel = input<IServiceRequest | undefined>();
  // Input property to determine if directions should be fetched by coordinates (default: false)
  coords = input<boolean>(false);

  // Injected Google Maps services
  mapDirectionsService = inject(MapDirectionsService);
  geoCodingService = inject(GeocodingService);

  // Input property for the map's center coordinates
  center = input<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  // Input property for the map's zoom level
  zoom = input<number>(5);

  // Required input properties for map dimensions
  width = input.required<string>();
  height = input.required<string>();

  // Signal to store the directions results from Google Maps
  readonly directionsResults = signal<google.maps.DirectionsResult | undefined>(
    undefined
  );

  // Signal to store the current directions request parameters
  request = signal<google.maps.DirectionsRequest>({
    origin: { lat: 0, lng: 0 }, // Default origin
    destination: { lat: 0, lng: 0 }, // Default destination
    travelMode: google.maps.TravelMode?.DRIVING || 'DRIVING', // Default travel mode
  });

  /**
   * Constructor for the component.
   * @param bookingService Service to manage booking origin and destination coordinates.
   */
  constructor(private bookingService: BookingServiceService) {
    // Effect that runs when `coords` or booking service signals change
    effect(() => {
      if (this.coords()) {
        // Check if directions should be fetched by coordinates
        const origin = this.bookingService.origin(); // Get origin from booking service
        const destination = this.bookingService.destiny(); // Get destination from booking service
        if (origin && destination) {
          // If both origin and destination are available
          // Request directions using coordinates
          this.handleRequestDirectionsByCoords(origin, destination);
        }
      }
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   */
  ngOnInit(): void {
    // Request directions using addresses from the `travel` input if available
    this.handleRequestDirections(
      this.travel()?.originAddress,
      this.travel()?.destinationAddress
    );
  }

  /**
   * Fetches coordinates for given origin and destination addresses.
   * @param originAddress The origin address string.
   * @param destinationAddress The destination address string.
   * @returns An Observable emitting an object with origin and destination LatLng.
   */
  private fetchCoordinates(
    originAddress: string,
    destinationAddress: string
  ): Observable<{
    origin: google.maps.LatLng;
    destination: google.maps.LatLng;
  }> {
    // Use forkJoin to make parallel geocoding requests
    return forkJoin({
      origin: this.geoCodingService.getGeocodingData(originAddress),
      destination: this.geoCodingService.getGeocodingData(destinationAddress),
    }).pipe(
      map(({ origin, destination }) => {
        if (!origin || !destination) {
          // Throw an error if coordinates could not be obtained
          throw new Error('No se pudieron obtener las coordenadas');
        }
        // Return the coordinates as LatLng objects
        return {
          origin: origin as google.maps.LatLng,
          destination: destination as google.maps.LatLng,
        };
      })
    );
  }

  /**
   * Handles requesting directions based on origin and destination addresses.
   * @param originAddress The origin address string (optional).
   * @param destinationAddress The destination address string (optional).
   */
  handleRequestDirections(originAddress?: string, destinationAddress?: string) {
    // Return if either address is missing
    if (!originAddress || !destinationAddress) return;

    // Fetch coordinates for the addresses
    this.fetchCoordinates(originAddress, destinationAddress)
      .pipe(
        // Tap to update the request signal with the fetched coordinates
        tap(({ origin, destination }) =>
          this.request.set({
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
          })
        ),
        // Switch to the map directions service to get the route
        switchMap(() => this.mapDirectionsService.route(this.request())),
        // Map the result to get only the DirectionsResult
        map((result) => result.result)
      )
      .subscribe({
        // Set the directionsResults signal with the fetched route
        next: (coords) => this.directionsResults.set(coords || undefined),
        // Log any errors
        error: (err) => console.warn(err.message),
      });
  }

  /**
   * Handles requesting directions based on origin and destination coordinates.
   * @param origin The origin google.maps.LatLng object.
   * @param destination The destination google.maps.LatLng object.
   */
  handleRequestDirectionsByCoords(
    origin: google.maps.LatLng,
    destination: google.maps.LatLng
  ) {
    // Convert LatLng objects to LatLngLiteral for the request
    const originLiteral = { lat: origin.lat(), lng: origin.lng() };
    const destinationLiteral = {
      lat: destination.lat(),
      lng: destination.lng(),
    };

    // Update the request signal with the new coordinates
    this.request.set({
      origin: originLiteral,
      destination: destinationLiteral,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    // Request the route from the map directions service
    this.mapDirectionsService.route(this.request()).subscribe({
      // Set the directionsResults signal with the fetched route
      next: (result) => {
        this.directionsResults.set(result.result || undefined);
      },
      // Log any errors
      error: (err) => console.warn(err.message),
    });
  }
}
