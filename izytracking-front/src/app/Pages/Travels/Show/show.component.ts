import { Component, OnInit, signal, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TravelMapData, TravelLocation } from "../../../Components/TravelMap/travel-map.types";
import { TravelRouteInfo, RouteLocation, RouteUpdate } from "../../../Components/TravelRoute/travel-route.types";
import { TravelShowHeaderComponent } from "./partials/header/travel-show-header.component";
import { TravelRouteSectionComponent } from "./partials/route/travel-route-section.component";
import { TravelInfoSectionComponent } from "./partials/info/travel-info-section.component";
import { PriceBreakdown, PriceBreakdownSectionComponent } from "./partials/pricing/price-breakdown-section.component";
import { DriverInfo, DriverInfoSectionComponent } from "./partials/driver/driver-info-section.component";
import { TravelsService, TravelDetails } from "../../../Services/Travels/travels.service";
import { TravelStatus } from "../../../Types/travel.types";
import { Subscription } from "rxjs";
import { LoaderComponent } from "../../../Components/Loader/loader.component";
import { TravelMapSectionComponent } from "./partials/map/travel-map-section.component";


@Component({
    selector: "pg-travels-show",
    templateUrl: "./show.component.html",
    styleUrl: "./show.component.css",
    standalone: true, imports: [
        TravelShowHeaderComponent,
        TravelMapSectionComponent,
        TravelRouteSectionComponent,
        TravelInfoSectionComponent,
        PriceBreakdownSectionComponent,
        DriverInfoSectionComponent,
        LoaderComponent
    ],
})
export class TravelsShowComponent implements OnInit, OnDestroy {
    // Señales para el estado del componente
    travelId = signal<string>('');
    isLoading = signal<boolean>(true);
    currentDate = new Date().toLocaleDateString();

    // Datos del viaje (ahora vienen del servicio)
    travelDetails = signal<TravelDetails | null>(null);
    travelNameReference = signal<string>('');
    travelStatus = signal<TravelStatus>('solicitud-servicio'); // Estado del viaje
    priceData = signal<PriceBreakdown | null>(null);
    driverData = signal<DriverInfo | null>(null);
    travelMapData = signal<TravelMapData | null>(null);
    routeData = signal<TravelRouteInfo | null>(null);

    private subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private travelsService: TravelsService
    ) { } ngOnInit(): void {
        // Obtener el ID del viaje desde la ruta
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.travelId.set(id);
                this.loadTravelData(id);
            }
        });

        // Suscribirse al estado de loading del servicio
        const loadingSub = this.travelsService.isLoading$.subscribe(loading => {
            this.isLoading.set(loading);
        });
        this.subscriptions.push(loadingSub);
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.travelsService.clearLoading();
    }

    // Cargar datos del viaje desde el servicio
    private loadTravelData(id: string): void {
        const travelSub = this.travelsService.getTravelDetails(id).subscribe({
            next: (travelDetails) => {
                if (travelDetails) {
                    console.log('TravelsShow - travelDetails loaded:', travelDetails.status);
                    this.travelDetails.set(travelDetails);
                    this.travelNameReference.set(travelDetails.name);
                    this.travelStatus.set(travelDetails.status); // Establecer el estado real
                    console.log('TravelsShow - travelStatus set to:', travelDetails.status);
                    this.priceData.set(travelDetails.price);
                    this.driverData.set(travelDetails.driverInfo || null);
                    this.travelMapData.set(travelDetails.mapData);
                    this.routeData.set(travelDetails.routeInfo);
                } else {
                    // Manejar caso donde el viaje no existe
                    console.error('Viaje no encontrado');
                    this.router.navigate(['/dashboard/travels']);
                }
            },
            error: (error) => {
                console.error('Error al cargar datos del viaje:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.travelsService.clearLoading();
            }
        });
        this.subscriptions.push(travelSub);
    }

    // Métodos para manejar eventos del TravelMap
    onMapLocationClick(location: TravelLocation): void {
        console.log('Ubicación del mapa clickeada:', location);
        // Aquí puedes agregar lógica específica para el mapa simple
    }

    onMapClick(): void {
        console.log('Mapa clickeado');
        // Aquí puedes abrir un mapa en pantalla completa o similar
    }

    onRouteClick(): void {
        console.log('Ruta clickeada');
        // Aquí puedes mostrar detalles de la ruta
    }

    // Métodos para manejar eventos del TravelRoute
    onLocationClick(location: RouteLocation): void {
        console.log('Ubicación clickeada:', location);
        // Aquí puedes agregar lógica para mostrar detalles de la ubicación
    }

    onUpdateClick(update: RouteUpdate): void {
        console.log('Novedad clickeada:', update);
        // Aquí puedes mostrar más detalles de la novedad
    }

    // Navegación
    onBackToTravels(): void {
        this.router.navigate(['/dashboard/travels']);
    }
}
