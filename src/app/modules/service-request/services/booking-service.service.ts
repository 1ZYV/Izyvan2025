import { Injectable, signal } from '@angular/core'; // Import Injectable for service and signal for reactive state

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class BookingServiceService {
  // Signal to store the selected vehicle type (number or null if not set)
  selectedVehicleType = signal<number | null>(null);
  // Signal to store the origin location (LatLng or null if not set)
  originLngLtd = signal<google.maps.LatLng | null>(null);
  // Signal to store the destination location (LatLng or null if not set)
  destinyLngLtd = signal<google.maps.LatLng | null>(null);

  originLiteral = signal<string>("");
  destinyLiteral = signal<string>("");

  includeTourismGuide = signal<boolean>(false);

  nameReference = signal<string>("");
  passengerNumber = signal<number>(0);
  description = signal<string>("");

  date = signal<string>("");
  time = signal<string>("");

  constructor() {} // Constructor for the service
}
