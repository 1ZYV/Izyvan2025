import { BadgeComponent } from "@/Components/Badge/badge.component";
import { CardComponent } from "@/Components/Card/card.component";
import { Component, OnInit, OnDestroy, signal, inject, computed } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { TravelListItem, TravelsService } from "@/Services/Travels/travels.service";
import { TravelStatusService } from "@/Services/TravelStatus/travel-status.service";
import { TravelStatus } from "@/Types/travel.types";
import { CurrencyComponent } from "../../../../../Components/currency/currency.component";

@Component({
    selector: 'cp-travel-header',
    templateUrl: './travel-header.component.html',
    standalone: true,
    imports: [CardComponent, BadgeComponent, CommonModule, CurrencyPipe, CurrencyComponent],
})
export class TravelHeaderComponent implements OnInit, OnDestroy {
    // Services
    private travelStatusService = inject(TravelStatusService);

    // Señales para el estado del componente
    isLoading = signal<boolean>(true);
    recentTravels = signal<TravelListItem[]>([]);

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private travelsService: TravelsService
    ) { }

    ngOnInit(): void {
        this.loadRecentTravels();
        // this.isLoading.set(false);
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.travelsService.clearLoading();
    }

    private loadRecentTravels(): void {
        const travelsSub = this.travelsService.getRecentTravels().subscribe({
            next: (travels) => {
                this.recentTravels.set(travels);
            },
            error: (error) => {
                console.error('Error al cargar viajes recientes:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.isLoading.set(false);
                this.travelsService.clearLoading();
            }
        });
        this.subscriptions.push(travelsSub);
    }    // Método para navegar al detalle de un viaje
    onViewTravelDetails(travelId: string): void {
        console.log('Navegando al detalle del viaje:', travelId);
        this.router.navigate(['/dashboard/travels', travelId]);
    }

    // Método para obtener información de estado usando el servicio centralizado
    getStatusInfo(status: string) {
        return this.travelStatusService.getStatusInfo(status as TravelStatus);
    }

    // Método auxiliar para formatear fechas
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Método auxiliar para formatear horas
    formatTime(date: Date): string {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}