import { Component, input, output, computed, inject, ChangeDetectionStrategy } from "@angular/core";
import { GuideDetails, GuideStatusUtils, GUIDE_SPECIALTIES, GUIDE_LANGUAGES } from "../../../../../Types/guide.types";
import { CardComponent } from "../../../../../Components/Card/card.component";
import { BadgeComponent } from "../../../../../Components/Badge/badge.component";

@Component({
    selector: 'cp-guide-info-section',
    templateUrl: './guide-info-section.component.html',
    styleUrl: './guide-info-section.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent, BadgeComponent],
})
export class GuideInfoSectionComponent {
    // Inputs
    guideData = input.required<GuideDetails>();

    // Outputs
    hireGuide = output<void>();
    completeService = output<void>();
    deleteGuide = output<void>();

    // Computed properties
    statusInfo = computed(() => {
        const guide = this.guideData();
        return GuideStatusUtils.getStatusConfig(guide.status);
    });

    canBeHired = computed(() => {
        const guide = this.guideData();
        return GuideStatusUtils.isAvailable(guide.status);
    });

    canCompleteService = computed(() => {
        const guide = this.guideData();
        return guide.status === 'busy';
    });

    specialtiesText = computed(() => {
        const guide = this.guideData();
        return guide.specialties
            .map(specialty => GUIDE_SPECIALTIES[specialty].name)
            .join(', ');
    });

    languagesText = computed(() => {
        const guide = this.guideData();
        return guide.languages
            .map(lang => `${GUIDE_LANGUAGES[lang].flag} ${GUIDE_LANGUAGES[lang].name}`)
            .join(', ');
    });

    // Event handlers
    onHireGuide(): void {
        this.hireGuide.emit();
    }

    onCompleteService(): void {
        this.completeService.emit();
    }

    onDeleteGuide(): void {
        const guideName = this.guideData().name;
        if (confirm(`¿Estás seguro de que deseas eliminar al guía "${guideName}"? Esta acción no se puede deshacer.`)) {
            this.deleteGuide.emit();
        }
    }
}
