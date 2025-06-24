import { TravelRouteComponent } from "@/Components/TravelRoute/travel-route.component";
import { RouteLocation, RouteUpdate, TravelRouteInfo } from "@/Components/TravelRoute/travel-route.types";
import { Component, input, output } from "@angular/core";

@Component({
    selector: 'cp-travel-route-section',
    templateUrl: './travel-route-section.component.html',
    styleUrl: './travel-route-section.component.css',
    standalone: true,
    imports: [TravelRouteComponent],
})
export class TravelRouteSectionComponent {
    // Inputs
    routeInfo = input.required<TravelRouteInfo>();
    maxUpdates = input<number>(10);

    // Outputs
    locationClick = output<RouteLocation>();
    updateClick = output<RouteUpdate>();

    onLocationClick(location: RouteLocation): void {
        this.locationClick.emit(location);
    }

    onUpdateClick(update: RouteUpdate): void {
        this.updateClick.emit(update);
    }
}
