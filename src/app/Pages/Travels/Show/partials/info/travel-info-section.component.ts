import { Component, input, computed, inject } from "@angular/core";
import { TravelStatusService } from "../../../../../Services/TravelStatus/travel-status.service";
import { TravelStatus, TravelStatusUtils } from "../../../../../Types/travel.types";
import { CardComponent } from "@/Components/Card";
import { BadgeComponent } from "@/Components/Badge/badge.component";
import { TravelMapData } from "@/Components/TravelMap/travel-map.types";

@Component({
    selector: 'cp-travel-info-section',
    templateUrl: './travel-info-section.component.html',
    styleUrl: './travel-info-section.component.css',
    standalone: true,
    imports: [CardComponent, BadgeComponent],
})
export class TravelInfoSectionComponent {
    // Servicios
    private travelStatusService = inject(TravelStatusService);

    // Inputs
    travelData = input.required<TravelMapData>();
    currentDate = input<string>('');
    travelStatus = input<string>('pending'); // Estado del viaje, por defecto 'pending'

    // Computed property para el estado del viaje usando el servicio centralizado
    statusInfo = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.getStatusInfo(status);
    });

    // Computed properties simplificadas que usan el servicio
    statusBadgeVariant = computed(() => this.statusInfo().variant);
    statusText = computed(() => this.statusInfo().label);
    statusDescription = computed(() => this.statusInfo().description);
    statusStyle = computed(() => this.statusInfo().style);
    statusActions = computed(() => this.statusInfo().actions);

    // Computed properties para información de ubicaciones con más detalles
    originLocationInfo = computed(() => {
        const origin = this.travelData()?.origin;
        if (!origin) return {
            name: 'N/A',
            address: '',
            displayName: 'Origen no disponible',
            hasAddress: false
        };

        return {
            name: origin.name,
            address: origin.address || '',
            displayName: origin.name,
            hasAddress: Boolean(origin.address)
        };
    });

    destinationLocationInfo = computed(() => {
        const destination = this.travelData()?.destination;
        if (!destination) return {
            name: 'N/A',
            address: '',
            displayName: 'Destino no disponible',
            hasAddress: false
        };

        return {
            name: destination.name,
            address: destination.address || '',
            displayName: destination.name,
            hasAddress: Boolean(destination.address)
        };
    });

    formattedDistance = computed(() => {
        const distance = this.travelData()?.distance;
        if (!distance) return 'N/A';
        return `${distance.toFixed(1)} km`;
    });

    formattedDuration = computed(() => {
        const duration = this.travelData()?.estimatedDuration;
        if (!duration) return 'N/A';

        if (duration < 60) {
            return `${duration} min`;
        } else {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
        }
    });

    travelDate = computed(() => {
        const currentDate = this.currentDate();
        if (!currentDate) return new Date().toLocaleDateString('es-ES');
        return currentDate;
    });

    // Computed properties que usan el servicio para determinar acciones
    isActiveTravel = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canComplete');
    });

    canBeCancelled = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canCancel');
    });

    canBeEdited = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canEdit');
    });

    canBeRebooked = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canRebook');
    }); canBeReviewed = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canReview');
    });

    canBeStarted = computed(() => {
        const status = this.travelStatus() as TravelStatus;
        return this.travelStatusService.canPerformAction(status, 'canStart');
    });
}