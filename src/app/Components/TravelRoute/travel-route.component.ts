import { Component, input, output, computed, signal, inject } from "@angular/core";
import { CardComponent } from "../Card/card.component";
import { BadgeComponent } from "../Badge/badge.component";
import { TravelRouteInfo, RouteUpdate, RouteLocation } from "./travel-route.types";
import { TravelStatusService } from "../../Services/TravelStatus/travel-status.service";
import { TravelStatus } from "../../Types/travel.types";

/**
 * TravelRoute Component
 * 
 * Componente para mostrar la ruta de un viaje con origen, destino y novedades.
 * Incluye un mapa placeholder y lista de actualizaciones del trayecto.
 * 
 * @example
 * ```html
 * <cp-travel-route 
 *   [routeInfo]="routeData"
 *   [showMap]="true"
 *   (locationClick)="onLocationClick($event)"
 *   (updateClick)="onUpdateClick($event)">
 * </cp-travel-route>
 * ```
 */
@Component({
    selector: 'cp-travel-route',
    templateUrl: './travel-route.component.html',
    styleUrl: './travel-route.component.css',
    standalone: true,
    imports: [CardComponent, BadgeComponent],
})

export class TravelRouteComponent {
    // Services
    private travelStatusService = inject(TravelStatusService);

    // Propiedades de entrada
    routeInfo = input.required<TravelRouteInfo>();
    showMap = input<boolean>(true);
    showUpdates = input<boolean>(true);
    mapHeight = input<string>('300px');
    maxUpdates = input<number>(5);

    // Outputs
    locationClick = output<RouteLocation>();
    updateClick = output<RouteUpdate>();
    mapReady = output<void>();

    // Estado interno
    isMapLoaded = signal(false);
    selectedUpdate = signal<RouteUpdate | null>(null);

    // Computed properties
    origin = computed(() => this.routeInfo().origin);
    destination = computed(() => this.routeInfo().destination);

    recentUpdates = computed(() => {
        const updates = this.routeInfo().updates;
        const maxCount = this.maxUpdates();
        return updates
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, maxCount);
    }); routeStatus = computed(() => {
        const status = this.routeInfo().status;
        return this.travelStatusService.getStatusInfo(status as TravelStatus);
    });

    hasUpdates = computed(() => this.routeInfo().updates.length > 0);

    estimatedInfo = computed(() => {
        const route = this.routeInfo();
        const duration = route.estimatedDuration;
        const distance = route.distance;

        let info = '';
        if (duration) {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            if (hours > 0) {
                info += `${hours}h ${minutes}m`;
            } else {
                info += `${minutes}m`;
            }
        }
        if (distance) {
            if (info) info += ' • ';
            info += `${distance.toFixed(1)} km`;
        }
        return info;
    });

    constructor() { }

    // Métodos de eventos
    onOriginClick(): void {
        this.locationClick.emit(this.origin());
    }

    onDestinationClick(): void {
        this.locationClick.emit(this.destination());
    }

    onUpdateItemClick(update: RouteUpdate): void {
        this.selectedUpdate.set(update);
        this.updateClick.emit(update);
    }

    onMapClick(): void {
        // Placeholder para cuando se implemente el mapa real
        console.log('Mapa clickeado - funcionalidad pendiente');
        this.mapReady.emit();
    }

    // Métodos de utilidad
    getUpdateIcon(type: RouteUpdate['type']): string {
        const iconMap = {
            info: '📍',
            warning: '⚠️',
            delay: '⏰',
            accident: '🚨',
            construction: '🚧'
        };
        return iconMap[type] || '📍';
    }

    getUpdateVariant(type: RouteUpdate['type']): 'primary' | 'warning' | 'danger' | 'info' {
        const variantMap = {
            info: 'info' as const,
            warning: 'warning' as const,
            delay: 'warning' as const,
            accident: 'danger' as const,
            construction: 'warning' as const
        };
        return variantMap[type] || 'info';
    }

    formatUpdateTime(timestamp: Date): string {
        const now = new Date();
        const diffMs = now.getTime() - timestamp.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours}h`;

        const diffDays = Math.floor(diffHours / 24);
        return `Hace ${diffDays}d`;
    }
}
