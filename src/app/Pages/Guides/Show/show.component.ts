import { Component, OnInit, signal, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GuideDetails } from "../../../Types/guide.types";
import { GuidesService } from "../../../Services/Guides/guides.service";
import { TravelsService, TravelListItem } from "../../../Services/Travels/travels.service";
import { LoaderComponent } from "../../../Components/Loader/loader.component";
import { GuideShowHeaderComponent } from "./partials/header/guide-show-header.component";
import { GuideInfoSectionComponent } from "./partials/info/guide-info-section.component";
import { GuideProfileSectionComponent } from "./partials/profile/guide-profile-section.component";
import { GuideReviewsSectionComponent } from "./partials/reviews/guide-reviews-section.component";
import { GuidePortfolioSectionComponent } from "./partials/portfolio/guide-portfolio-section.component";
import { GuideAssignmentModalComponent } from "../../../Components/GuideAssignmentModal/guide-assignment-modal.component";

@Component({
    selector: "pg-guides-show",
    templateUrl: "./show.component.html",
    styleUrl: "./show.component.css",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        GuideShowHeaderComponent,
        GuideInfoSectionComponent,
        GuideProfileSectionComponent,
        GuideReviewsSectionComponent,
        GuidePortfolioSectionComponent,
        GuideAssignmentModalComponent,
        LoaderComponent
    ],
})
export class GuidesShowComponent implements OnInit, OnDestroy {
    // Señales para el estado del componente
    guideId = signal<string>('');
    isLoading = signal<boolean>(true);

    // Datos del guía
    guideDetails = signal<GuideDetails | null>(null);
    guideName = signal<string>('');

    // Señales para el modal de asignación
    showAssignmentModal = signal<boolean>(false);
    availableServices = signal<TravelListItem[]>([]);
    isAssigning = signal<boolean>(false);

    private subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private guidesService: GuidesService,
        private travelsService: TravelsService
    ) { }

    ngOnInit(): void {
        // Obtener el ID del guía desde la ruta
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.guideId.set(id);
                this.loadGuideData(id);
            }
        });

        // Suscribirse al estado de loading del servicio
        const loadingSub = this.guidesService.isLoading$.subscribe(loading => {
            this.isLoading.set(loading);
        });
        this.subscriptions.push(loadingSub);
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.guidesService.clearLoading();
    }

    // Cargar datos del guía desde el servicio
    private loadGuideData(id: string): void {
        const guideSub = this.guidesService.getGuideDetails(id).subscribe({
            next: (guideDetails) => {
                if (guideDetails) {
                    console.log('GuidesShow - guideDetails loaded:', guideDetails.status);
                    this.guideDetails.set(guideDetails);
                    this.guideName.set(guideDetails.name);
                } else {
                    // Manejar caso donde el guía no existe
                    console.error('Guía no encontrado');
                    this.router.navigate(['/dashboard/guides']);
                }
            },
            error: (error) => {
                console.error('Error al cargar datos del guía:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.guidesService.clearLoading();
            }
        });
        this.subscriptions.push(guideSub);
    }

    // Método para volver a la lista de guías
    onBackToGuides(): void {
        this.router.navigate(['/dashboard/guides']);
    }

    // Método para contratar el guía (ahora abre el modal)
    onHireGuide(): void {
        // Cargar servicios disponibles y mostrar el modal
        this.loadAvailableServices();
        this.showAssignmentModal.set(true);
    }

    // Método para finalizar servicio del guía
    onCompleteService(): void {
        const guideId = this.guideId();
        if (guideId) {
            this.guidesService.completeGuideService(guideId).subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Servicio finalizado exitosamente');
                        // Recargar datos para mostrar el nuevo estado
                        this.loadGuideData(guideId);
                    } else {
                        console.error('No se pudo finalizar el servicio');
                    }
                },
                error: (error) => {
                    console.error('Error al finalizar el servicio:', error);
                }
            });
        }
    }

    // Método para eliminar el guía
    onDeleteGuide(): void {
        const guideId = this.guideId();
        if (guideId) {
            this.guidesService.deleteGuide(guideId).subscribe({
                next: (success: boolean) => {
                    if (success) {
                        console.log('Guía eliminado exitosamente');
                        // Navegar de vuelta a la lista de guías
                        this.router.navigate(['/dashboard/guides']);
                    } else {
                        console.error('No se pudo eliminar el guía');
                    }
                },
                error: (error: any) => {
                    console.error('Error al eliminar el guía:', error);
                }
            });
        }
    }

    // Métodos para el modal de asignación
    private loadAvailableServices(): void {
        this.travelsService.getAvailableServiceRequests().subscribe({
            next: (services: TravelListItem[]) => {
                this.availableServices.set(services);
            },
            error: (error: any) => {
                console.error('Error al cargar servicios disponibles:', error);
            },
            complete: () => {
                this.travelsService.clearLoading();
            }
        });
    }

    onCloseAssignmentModal(): void {
        this.showAssignmentModal.set(false);
        this.availableServices.set([]);
    }

    onAssignService(assignment: { serviceId: string; guideId: string }): void {
        this.isAssigning.set(true);

        this.travelsService.assignGuideToTravel(assignment.serviceId, assignment.guideId).subscribe({
            next: (success: boolean) => {
                if (success) {
                    console.log('Servicio asignado exitosamente');
                    // Cerrar el modal
                    this.onCloseAssignmentModal();
                    // Recargar datos del guía para mostrar el nuevo estado
                    this.loadGuideData(assignment.guideId);
                } else {
                    console.error('No se pudo asignar el servicio');
                }
            },
            error: (error: any) => {
                console.error('Error al asignar el servicio:', error);
            },
            complete: () => {
                this.isAssigning.set(false);
                this.travelsService.clearLoading();
            }
        });
    }

    onDeleteService(serviceId: string): void {
        this.travelsService.deleteTravel(serviceId).subscribe({
            next: (success: boolean) => {
                if (success) {
                    console.log('Servicio eliminado exitosamente');
                    // Recargar la lista de servicios disponibles
                    this.loadAvailableServices();
                } else {
                    console.error('No se pudo eliminar el servicio');
                }
            },
            error: (error: any) => {
                console.error('Error al eliminar el servicio:', error);
            },
            complete: () => {
                this.travelsService.clearLoading();
            }
        });
    }
}
