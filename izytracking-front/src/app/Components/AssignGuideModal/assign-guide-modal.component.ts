import { Component, input, output, computed, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ServiceRequest } from '../../Services/ServiceRequests/service-requests.service';
import { GuideDetails } from '../../Types/guide.types';
import { GuidesService } from '../../Services/Guides/guides.service';
import { LoaderComponent } from '../Loader/loader.component';
import { BadgeComponent } from '../Badge/badge.component';

@Component({
    selector: 'cp-assign-guide-modal',
    templateUrl: './assign-guide-modal.component.html',
    styleUrl: './assign-guide-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoaderComponent, BadgeComponent]
})
export class AssignGuideModalComponent implements OnInit {
    // Injected services
    private guidesService = inject(GuidesService);

    // Inputs
    isOpen = input<boolean>(false);
    serviceRequest = input.required<ServiceRequest>();
    isAssigning = input<boolean>(false);

    // Outputs
    close = output<void>();
    assignGuide = output<{ requestId: string; guideId: string }>();

    // Signals
    isLoading = signal<boolean>(true);
    availableGuides = signal<GuideDetails[]>([]);
    selectedGuide = signal<GuideDetails | null>(null);

    // Computed properties
    canAssign = computed(() => {
        return this.selectedGuide() !== null && !this.isAssigning();
    });

    ngOnInit(): void {
        this.loadAvailableGuides();
    }

    private loadAvailableGuides(): void {
        this.isLoading.set(true);

        this.guidesService.getAvailableGuides().subscribe({
            next: (guides) => {
                this.availableGuides.set(guides);
            },
            error: (error) => {
                console.error('Error loading available guides:', error);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
    }

    onGuideSelect(guide: GuideDetails): void {
        this.selectedGuide.set(guide);
    }

    onAssign(): void {
        const selectedGuide = this.selectedGuide();
        const request = this.serviceRequest();

        if (selectedGuide && request) {
            this.assignGuide.emit({
                requestId: request.id,
                guideId: selectedGuide.id
            });
        }
    }

    onClose(): void {
        this.selectedGuide.set(null);
        this.close.emit();
    }

    getGuideStatusConfig(status: string) {
        switch (status) {
            case 'available':
                return {
                    label: 'Disponible',
                    variant: 'success' as const,
                    style: 'filled' as const
                };
            case 'busy':
                return {
                    label: 'Ocupado',
                    variant: 'warning' as const,
                    style: 'filled' as const
                };
            case 'offline':
                return {
                    label: 'Sin conexión',
                    variant: 'secondary' as const,
                    style: 'outline' as const
                };
            default:
                return {
                    label: 'Desconocido',
                    variant: 'secondary' as const,
                    style: 'outline' as const
                };
        }
    }

    formatGuideExperience(years: number): string {
        if (years === 1) {
            return '1 año de experiencia';
        }
        return `${years} años de experiencia`;
    }

    formatGuideLanguages(languages: string[]): string {
        // Assuming languages array contains language codes, you might want to map them to readable names
        return languages.join(', ');
    }
}
