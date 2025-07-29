import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { GuideCardComponent } from "../../../Components/GuideCard/guide-card.component";
import { GuideCardInfo } from "../../../Components/GuideCard/guide-card.types";
import { LoaderComponent } from "../../../Components/Loader/loader.component";
import { EmptyStateComponent } from "../../../Components/EmptyState/empty-state.component";
import { GuidesService, GuideListItem } from "../../../Services/Guides/guides.service";

@Component({
    selector: "pg-guides-index",
    templateUrl: "./index.component.html",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        GuideCardComponent,
        LoaderComponent,
        EmptyStateComponent
    ],
})
export class GuidesIndexComponent implements OnInit, OnDestroy {
    // Services
    private guidesService = inject(GuidesService);
    private router = inject(Router);

    // Señales para el estado del componente
    isLoading = signal<boolean>(true);
    guidesList = signal<GuideCardInfo[]>([]);

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadGuidesList();

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

    private loadGuidesList(): void {
        const guidesSub = this.guidesService.getGuidesList().subscribe({
            next: (guides) => {
                // Convertir GuideListItem a GuideCardInfo para compatibilidad con GuideCard
                const guideCardInfoList: GuideCardInfo[] = guides.map((guide) => ({
                    id: guide.id,
                    name: guide.name,
                    photo: guide.photo,
                    status: guide.status,
                    rating: guide.rating,
                    totalTours: guide.totalTours,
                    yearsExperience: guide.yearsExperience,
                    specialties: guide.specialties,
                    languages: guide.languages,
                    hourlyRate: guide.hourlyRate,
                    location: guide.location,
                    description: guide.description
                }));

                this.guidesList.set(guideCardInfoList);
            },
            error: (error) => {
                console.error('Error al cargar lista de guías:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.guidesService.clearLoading();
            }
        });

        this.subscriptions.push(guidesSub);
    }

    // Métodos para manejar eventos del GuideCard
    onViewDetails(guide: GuideCardInfo): void {
        console.log('Ver detalles del guía:', guide);
        this.router.navigate(['/dashboard/guides', guide.id]);
    }

    onCardClick(guide: GuideCardInfo): void {
        console.log('Card clickeada:', guide);
        this.router.navigate(['/dashboard/guides', guide.id]);
    }

    // Método para el botón de añadir guía
    onAddGuide = (): void => {
        console.log('Añadir nuevo guía turístico');
        this.router.navigate(['/dashboard/guides/create']);
    }
}