import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core'; // Import Injectable for service and signal for reactive state
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Makes the service available application-wide
})
export class BookingServiceService {

  bookingForm = signal({
    selectedVehicleType: null as number | null,
    originLngLtd: null as google.maps.LatLngLiteral | null,
    destinyLngLtd: null as google.maps.LatLngLiteral | null,
    originLiteral: "",
    destinyLiteral: "",
    includeTourismGuide: false,
    nameReference: "",
    passengerNumber: 0,
    description: "",
    date: "",
    time: ""
  });

  originLatLng = signal<google.maps.LatLngLiteral | null>(null);
  destinyLatLng = signal<google.maps.LatLngLiteral | null>(null);

  constructor(private http: HttpClient, private router: Router) { } // Constructor for the service

  public bookingServiceRequest() {

    this.http.post('http://localhost:8080/api/v1/service-request', this.bookingForm()).subscribe({
      next: (response) => {
        console.log('Service request booked successfully:', response);
        this.router.navigate(['/dashboard/services/tariffs']);
      },
      error: (error) => {
        console.error('Error booking service request:', error);
        this.router.navigate(['/dashboard/services/tariffs']);
      }
    });
  }
}
