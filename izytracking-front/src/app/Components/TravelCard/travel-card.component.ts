import { Component, input, output, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BadgeComponent } from "../Badge/badge.component";
import { TravelInfo } from "./travel-card.types";
import { TravelStatusService } from "../../Services/TravelStatus/travel-status.service";
import { TravelStatus, TravelStatusUtils } from "../../Types/travel.types";
import { CurrencyPipe } from "@angular/common";
import { CurrencyComponent } from "../currency/currency.component";

/**
 * TravelCard Component
 * 
 * Componente específico para mostrar información de viajes de forma consistente.
 * 
 * @example
 * ```html
 * <cp-travel-card 
 *   [travel]="travelData"
 *   (detailsClick)="onViewDetails($event)">
 * </cp-travel-card>
 * ```
 */
@Component({
    selector: 'cp-travel-card',
    templateUrl: './travel-card.component.html',
    styleUrl: './travel-card.component.css',
    standalone: true,
    imports: [RouterLink, BadgeComponent, CurrencyComponent],
})

export class TravelCardComponent {
    // Services
    private travelStatusService = inject(TravelStatusService);

    // Propiedades de entrada
    travel = input.required<TravelInfo>();
    showImage = input<boolean>(true);
    showPrice = input<boolean>(true);
    showStatus = input<boolean>(true);
    detailsRoute = input<string>('');    // Outputs
    detailsClick = output<TravelInfo>();
    cardClick = output<TravelInfo>();

    // Computed properties using centralized service
    statusConfig = computed(() => {
        const status = this.travel().status as TravelStatus;
        return this.travelStatusService.getStatusInfo(status);
    });    // Computed property para verificar si el viaje está pendiente o sin conductor
    isPendingOrNoDriver = computed(() => {
        const travel = this.travel();
        return travel.status === 'pending' as TravelStatus || !travel.driver || travel.driver === 'N/A';
    });

    // Computed property para el texto del conductor
    driverText = computed(() => {
        const travel = this.travel();
        if (!travel.driver || travel.driver === 'N/A') {
            return 'Conductor no asignado';
        }
        return `Conductor: ${travel.driver}`;
    });

    // Computed property para las clases CSS de la card
    cardCssClasses = computed(() => {
        const baseClasses = 'travel-card';
        return this.isPendingOrNoDriver() ? `${baseClasses} travel-card--no-driver` : baseClasses;
    });

    formattedPrice = computed(() => {
        return `$${this.travel().price.toFixed(2)}`;
    });

    imageUrl = computed(() => {
        return this.travel().imageUrl || '';
    });

    detailsLink = computed(() => {
        const route = this.detailsRoute();
        const id = this.travel().id;
        return route ? `${route}/${id}` : `/travels/${id}`;
    });

    constructor() { }

    // Métodos de eventos
    onDetailsClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.detailsClick.emit(this.travel());
    }

    onCardClick(): void {
        this.cardClick.emit(this.travel());
    }
}
