import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  http = inject(HttpClient);

  constructor() {}
  /**
   * Fetches geocoding data for a given address using the Google Maps Geocoding API.
   * @param address The address to geocode.
   * @returns An observable containing the geocoding data.
   */

  getGeocodingData(address: string) {
    const apiKey = 'AIzaSyAVs8uqNCpyEkaXAGB89EVpvwN9bY1SeeY';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    return this.http.get<google.maps.GeocoderResponse>(url).pipe(
      map((response) => {
        if (!response.results || response.results.length === 0) {
          console.error('No results found for address:', address);
          return null;
        }
        const location = response.results[0]?.geometry.location;
        if (!location) {
          console.error('No geometry location found for address:', address);
          return null;
        }
        return { lat: location.lat, lng: location.lng };
      })
    );
  }
}
