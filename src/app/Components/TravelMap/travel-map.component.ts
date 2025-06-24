import { Component, input, output, computed } from "@angular/core";
import { TravelMapData, TravelLocation } from "./travel-map.types";

/**
 * TravelMap Component
 * 
 * Componente que muestra un mapa visual con origen y destino de un viaje,
 * replicando exactamente el diseño mostrado en la imagen proporcionada.
 * 
 * @example
 * ```html
 * <cp-travel-map 
 *   [mapData]="travelMapData"
 *   [height]="'200px'"
 *   [showRoute]="true"
 *   (locationClick)="onLocationClick($event)"
 *   (mapClick)="onMapClick()">
 * </cp-travel-map>
 * ```
 */
@Component({
    selector: 'cp-travel-map',
    templateUrl: './travel-map.component.html',
    styleUrl: './travel-map.component.css',
    standalone: true,
    imports: [],
})
export class TravelMapComponent {
    // Propiedades de entrada
    mapData = input.required<TravelMapData>();
    height = input<string>('200px');
    showRoute = input<boolean>(true);
    showDuration = input<boolean>(false);
    showDistance = input<boolean>(false);
    interactive = input<boolean>(true);

    // Outputs
    locationClick = output<TravelLocation>();
    mapClick = output<void>();
    routeClick = output<void>();

    // Computed properties
    origin = computed(() => this.mapData().origin);
    destination = computed(() => this.mapData().destination);

    routeInfo = computed(() => {
        const data = this.mapData();
        let info = '';

        if (this.showDuration() && data.estimatedDuration) {
            const hours = Math.floor(data.estimatedDuration / 60);
            const minutes = data.estimatedDuration % 60;
            if (hours > 0) {
                info += `${hours}h ${minutes}m`;
            } else {
                info += `${minutes}m`;
            }
        }

        if (this.showDistance() && data.distance) {
            if (info) info += ' • ';
            info += `${data.distance.toFixed(1)} km`;
        }

        return info;
    });

    // Métodos de eventos
    onOriginClick(): void {
        if (this.interactive()) {
            this.locationClick.emit(this.origin());
        }
    }

    onDestinationClick(): void {
        if (this.interactive()) {
            this.locationClick.emit(this.destination());
        }
    }

    onMapContainerClick(): void {
        if (this.interactive()) {
            this.mapClick.emit();
        }
    }

    onRouteLineClick(): void {
        if (this.interactive()) {
            this.routeClick.emit();
        }
    }
}
