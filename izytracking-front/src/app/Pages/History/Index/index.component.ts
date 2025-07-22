import { Component, signal, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HistoryTrip } from "../../../Types/travel.types";
import { TravelsService } from "../../../Services/Travels/travels.service";
import { CurrencyComponent } from "../../../Components/currency/currency.component";

@Component({
    selector: "pg-history-index",
    templateUrl: "./index.component.html",
    styleUrl: "./index.component.css",
    standalone: true,
    imports: [CommonModule, CurrencyComponent],
})
export class HistoryIndexComponent implements OnInit {

    private travelsService = inject(TravelsService);

    // Estado del componente
    selectedTrip = signal<HistoryTrip | null>(null);
    trips = signal<HistoryTrip[]>([]);
    isLoading = signal<boolean>(false); ngOnInit() {
        this.loadHistoryTrips();
    }

    // Cargar viajes del historial desde el servicio
    private loadHistoryTrips(): void {
        this.isLoading.set(true);

        this.travelsService.getHistoryTripsFormatted().subscribe({
            next: (trips) => {
                this.trips.set(trips);

                // Seleccionar el primer viaje por defecto si hay viajes
                if (trips.length > 0) {
                    this.selectedTrip.set(trips[0]);
                }

                this.isLoading.set(false);
                this.travelsService.clearLoading();
            },
            error: (error) => {
                console.error('Error al cargar historial de viajes:', error);
                this.isLoading.set(false);
                this.travelsService.clearLoading();
            }
        });
    }

    // Método para seleccionar un viaje
    selectTrip(trip: HistoryTrip): void {
        this.selectedTrip.set(trip);
    }

    // Método para formatear la fecha
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // Método para formatear el precio
    formatPrice(price: number): string {
        return `$${price.toFixed(2)}`;
    }

    // Método para obtener la etiqueta del estado
    getStatusLabel(status: HistoryTrip['status']): string {
        switch (status) {
            case 'fin-servicio': return 'Completado';
            case 'cancelado-turismo': return 'Sin servicio de Turismo';
            case 'cancelado-transportista': return 'Cancelado por Transportista';
            case 'cancelado-agencia': return 'Cancelado por Agencia';
            case 'sin-proveedores': return 'Sin Proveedores';
            default: return status;
        }
    }
}