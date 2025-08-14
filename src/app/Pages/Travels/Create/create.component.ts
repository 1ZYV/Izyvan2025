import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule, MapGeocoder, MapMarker, MapPolyline } from '@angular/google-maps'
import { TravelMapComponent } from "@/Components/TravelMap/travel-map.component";


@Component({
    selector: 'pg-travels-create',
    templateUrl: './create.component.html',
    standalone: true,
    imports: [ReactiveFormsModule, DatePipe, ReactiveFormsModule, TravelMapComponent]
})
export class TravelsCreateComponent {
    protected stepTracker = signal(0);
    private geocodingService = inject(MapGeocoder);



}
