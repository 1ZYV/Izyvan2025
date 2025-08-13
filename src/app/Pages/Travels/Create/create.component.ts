import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapGeocoder, MapMarker, MapPolyline } from '@angular/google-maps'


@Component({
    selector: 'pg-travels-create',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [GoogleMapsModule, MapPolyline, GoogleMap, MapMarker, ReactiveFormsModule]
})
export class TravelsCreateComponent {
    private geoCoding = inject(MapGeocoder);
    private formBuilder = inject(FormBuilder);

    formGroup = this.formBuilder.group({
        origin: [''],
        destination: [''],
        date: [''],
        time: [''],
        passengers: [''],
        vehicleType: [''],
    });


    mapOptions: google.maps.MapOptions = {
        center: { lat: 24, lng: 12 },
        zoom: 8
    }

    originCenter: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
    destinationCenter: google.maps.LatLngLiteral = { lat: 24.5, lng: 12.5 };
    polylinePath: google.maps.LatLngLiteral[] = [
        this.originCenter,
        this.destinationCenter
    ];
}
