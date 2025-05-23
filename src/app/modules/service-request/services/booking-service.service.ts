import { Injectable, signal } from '@angular/core'; // Import Injectable for service and signal for reactive state

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class BookingServiceService {
  // Signal to store the origin location (LatLng or null if not set)
  origin = signal<google.maps.LatLng | null>(null);
  // Signal to store the destination location (LatLng or null if not set)
  destiny = signal<google.maps.LatLng | null>(null);

  constructor() {} // Constructor for the service
}
