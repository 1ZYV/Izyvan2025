import { Component, OnInit, OnDestroy, signal, inject } from "@angular/core";
import { TravelHeaderComponent } from "./partials/header/travel-header.component";
import { TravelCardComponent } from "../../../Components/TravelCard/travel-card.component";
import { TravelInfo } from "../../../Components/TravelCard/travel-card.types";
import { TravelStatusService } from "../../../Services/TravelStatus/travel-status.service";
import { TravelStatus, TravelStatusUtils } from "../../../Types/travel.types";
import { Router } from "@angular/router";
import { TravelsService, TravelListItem } from "../../../Services/Travels/travels.service";
import { Subscription } from "rxjs";
import { LoaderComponent } from "../../../Components/Loader/loader.component";
import { EmptyStateComponent } from "../../../Components/EmptyState/empty-state.component";

@Component({
    selector: "pg-travels-index",
    templateUrl: "./index.component.html",
    standalone: true,
    imports: [
        TravelHeaderComponent,
        TravelCardComponent,
        LoaderComponent,
        EmptyStateComponent
    ],
})
export class TravelsIndexComponent implements OnInit, OnDestroy {
    // Services
    private travelStatusService = inject(TravelStatusService);

    // Señales para el estado del componente
    isLoading = signal<boolean>(true);
    travelsList = signal<TravelInfo[]>([]);

    private subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private travelsService: TravelsService
    ) { }

    ngOnInit(): void {
        this.loadTravelsList();

        // Suscribirse al estado de loading del servicio
        const loadingSub = this.travelsService.isLoading$.subscribe(loading => {
            this.isLoading.set(loading);
        });
        this.subscriptions.push(loadingSub);
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.travelsService.clearLoading();
    }

    private loadTravelsList(): void {
        const travelsSub = this.travelsService.getTravelsList().subscribe({
            next: (travels) => {
                // Convertir TravelListItem a TravelInfo para compatibilidad con TravelCard
                const travelInfoList: TravelInfo[] = travels.map((travel, index) => ({
                    id: travel.id,
                    title: travel.name,
                    date: travel.date.toISOString().split('T')[0], // Formato YYYY-MM-DD
                    time: travel.date.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    price: travel.price,
                    status: travel.status as TravelStatus, // Direct assignment using centralized types
                    destination: travel.destination,
                    driver: this.getDriverForTravel(travel.status, index)
                }));

                this.travelsList.set(travelInfoList);
            },
            error: (error) => {
                console.error('Error al cargar lista de viajes:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.travelsService.clearLoading();
            }
        }); this.subscriptions.push(travelsSub);
    }    /**
     * Método para asignar conductores de forma variada según el estado y el índice
     * Para mostrar diferentes escenarios en la UI
     */
    private getDriverForTravel(status: string, index: number): string {
        // Los viajes pendientes no tienen conductor asignado
        if (status === ('pending' as TravelStatus)) {
            return 'N/A';
        }

        // Los viajes confirmados pueden o no tener conductor
        if (status === ('confirmed' as TravelStatus)) {
            return index % 2 === 0 ? 'N/A' : 'Carlos Mendoza';
        }

        // Los viajes activos/en progreso siempre tienen conductor
        if (status === ('active' as TravelStatus) || status === 'in-progress') {
            const drivers = ['Carlos Mendoza', 'María García', 'Luis Rodríguez'];
            return drivers[index % drivers.length];
        }

        // Los viajes completados y cancelados muestran el conductor que tenían
        const drivers = ['Carlos Mendoza', 'María García', 'Luis Rodríguez', 'N/A'];
        return drivers[index % drivers.length];
    }

    // Métodos para manejar eventos del TravelCard
    onViewDetails(travel: TravelInfo): void {
        console.log('Ver detalles del viaje:', travel);
        this.router.navigate(['/dashboard/travels', travel.id]);
    }

    onCardClick(travel: TravelInfo): void {
        console.log('Card clickeada:', travel);
        this.router.navigate(['/dashboard/travels', travel.id]);
    }    // Método para el botón de crear viaje
    onCreateTravel = (): void => {
        console.log('Crear nuevo viaje');
        this.router.navigate(['/dashboard/travels/create']);
    }
}