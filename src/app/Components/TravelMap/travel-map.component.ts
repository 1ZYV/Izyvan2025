import { Component, inject, input, model } from "@angular/core";
import { GoogleMap, MapMarker, MapDirectionsService, MapDirectionsRenderer, GoogleMapsModule } from "@angular/google-maps";
import { map, Observable, of } from "rxjs";
import { AsyncPipe } from "@angular/common";


declare const google: any;

@Component({
    selector: 'cp-travel-map',
    templateUrl: './travel-map.component.html',
    imports: [GoogleMap, MapMarker, MapDirectionsRenderer, AsyncPipe, GoogleMapsModule],
    standalone: true
})

export class TravelMapComponent {

    mapDirectionsService = inject(MapDirectionsService);

    originCenter = model({ lat: 37.77, lng: -122.447 });
    destinationCenter = model({ lat: 37.768, lng: -122.511 });

    protected mapOptions: google.maps.MapOptions = {
        center: { lat: (37.77 + 37.768) / 2, lng: (-122.447 + -122.511) / 2 },
        zoom: 14,
        disableDefaultUI: true,
    };
    protected traceMapResults(): Observable<google.maps.DirectionsResult | undefined> {

        return this.mapDirectionsService.route({
            origin: {
                query: `${this.originCenter().lat}, ${this.originCenter().lng}`
            },
            destination: {
                query: `${this.destinationCenter().lat}, ${this.destinationCenter().lng}`
            },
            travelMode: google.maps.TravelMode.DRIVING || "DRIVING",
        }).pipe(map(r => r.result));
    }

}