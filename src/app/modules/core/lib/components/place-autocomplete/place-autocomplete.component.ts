import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-place-autocomplete',
  imports: [FormsModule, GoogleMapsModule],
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.css',
})
export class PlaceAutocompleteComponent {
  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    //@ts-ignore
    const autocomplete = new google.maps.places.PlaceAutocompleteElement({
      componentRestrictions: { country: ['co'] },
      requestedLanguage: 'es',
      locationBias: { lat: 10.4071, lng: -75.5134, radius: 50000 },
    });
    //@ts-ignore
    document.querySelector('#autocomplete')?.appendChild(autocomplete);

    autocomplete.addEventListener('gmp-select', async (e: any) => {
      const place = e.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
      console.log('Place:', JSON.stringify(place.location, null, 2));
    });

    console.log(document.querySelector('#autocomplete'));
  }
}
