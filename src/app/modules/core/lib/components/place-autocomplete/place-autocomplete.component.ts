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
  autocomplete!: google.maps.places.PlaceAutocompleteElement;

  constructor(private ngZone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    const initializeAutocomplete = () => {
      //@ts-ignore
      const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement(
        {
          componentRestrictions: { country: 'col' },
          requestedLanguage: 'es',
        }
      );

      //@ts-ignore
      document.querySelector('#autocomplete')?.appendChild(placeAutocomplete);

      placeAutocomplete.addEventListener(
        'gmp-select',
        //@ts-ignore
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location'],
          });
          console.log('Place:', JSON.stringify(place.location, null, 2));
        }
      );
    };

    initializeAutocomplete();
  }
}
