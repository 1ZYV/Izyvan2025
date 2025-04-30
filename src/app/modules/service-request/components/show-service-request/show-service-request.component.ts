import { Component } from '@angular/core';
import { MapGeocoder } from '@angular/google-maps';

@Component({
  selector: 'app-show-service-request',
  imports: [MapGeocoder],
  templateUrl: './show-service-request.component.html',
  styleUrl: './show-service-request.component.css',
})
export class ShowServiceRequestComponent {
  serviceOriginAdress = '123 Main St, Cityville, ST 12345';

  serviceDestinationAdress = '456 Elm St, Townsville, ST 67890';

  constructor(geocoder: MapGeocoder) {
    geocoder
      .geocode({
        address: '1600 Amphitheatre Parkway, Mountain View, CA',
      })
      .subscribe(({ results }) => {
        console.log(results);
      });
  }
}
