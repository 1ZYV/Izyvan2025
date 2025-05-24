import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core'; // Import Injectable for service and signal for reactive state
import { Router } from '@angular/router';

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

  constructor(private http : HttpClient, private router: Router) {} // Constructor for the service

  public bookingServiceRequest() {
    const request = {
      origin: this.originLngLtd(),
      destiny: this.destinyLngLtd(),
      includeTourismGuide: this.includeTourismGuide(),
      nameReference: this.nameReference(),
      passengerNumber: this.passengerNumber(),
      description: this.description(),
      date: this.date(),
      time: this.time(),
    };

    this.http.post('http://localhost:8080/api/v1/service-request', request).subscribe({
      next: (response) => {
        console.log('Service request booked successfully:', response);
        this.router.navigate(['/dashboard/tariffs/create']);
      },
      error: (error) => {
        console.error('Error booking service request:', error);
        this.router.navigate(['/dashboard/tariffs/create']);
      }
    });
  }
}
