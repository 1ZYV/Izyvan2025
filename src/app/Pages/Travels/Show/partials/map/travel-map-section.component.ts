import { TravelMapComponent } from "@/Components/TravelMap/travel-map.component";
import { TravelLocation, TravelMapData } from "@/Components/TravelMap/travel-map.types";
import { Component, input, output } from "@angular/core";

@Component({
    selector: 'cp-travel-map-section',
    templateUrl: './travel-map-section.component.html',
    styleUrl: './travel-map-section.component.css',
    standalone: true,
    imports: [TravelMapComponent],
})
export class TravelMapSectionComponent {
    // Inputs
    mapData = input.required<TravelMapData>();
    height = input<string>('300px');

    // Outputs
    locationClick = output<TravelLocation>();
    mapClick = output<void>();
    routeClick = output<void>();

    onLocationClick(location: TravelLocation): void {
        this.locationClick.emit(location);
    }

    onMapClick(): void {
        this.mapClick.emit();
    }

    onRouteClick(): void {
        this.routeClick.emit();
    }
}
