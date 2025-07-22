import { Component, input, output, computed, inject, ChangeDetectionStrategy } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BadgeComponent } from "../Badge/badge.component";
import { GuideCardInfo } from "./guide-card.types";
import { GuideStatus, GuideStatusUtils, GUIDE_SPECIALTIES, GUIDE_LANGUAGES } from "../../Types/guide.types";

/**
 * GuideCard Component
 * 
 * Componente específico para mostrar información de guías turísticos de forma consistente.
 * 
 * @example
 * ```html
 * <cp-guide-card 
 *   [guide]="guideData"
 *   (detailsClick)="onViewDetails($event)">
 * </cp-guide-card>
 * ```
 */
@Component({
    selector: 'cp-guide-card',
    templateUrl: './guide-card.component.html',
    styleUrl: './guide-card.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, BadgeComponent],
})
export class GuideCardComponent {
    // Propiedades de entrada
    guide = input.required<GuideCardInfo>();
    showPhoto = input<boolean>(true);
    showRate = input<boolean>(true);
    showStatus = input<boolean>(true);
    detailsRoute = input<string>('');

    // Outputs
    detailsClick = output<GuideCardInfo>();
    cardClick = output<GuideCardInfo>();

    // Computed properties using centralized service
    statusConfig = computed(() => {
        const status = this.guide().status as GuideStatus;
        return GuideStatusUtils.getStatusConfig(status);
    });

    // Computed property para verificar si el guía está disponible
    isAvailable = computed(() => {
        const guide = this.guide();
        return GuideStatusUtils.isAvailable(guide.status);
    });

    // Computed property para las clases CSS de la card
    cardCssClasses = computed(() => {
        const baseClasses = 'guide-card';
        return this.isAvailable() ? baseClasses : `${baseClasses} guide-card--unavailable`;
    });

    // Computed property para la imagen del guía
    photoUrl = computed(() => {
        const guide = this.guide();
        return guide.photo || `https://via.placeholder.com/80x80?text=${guide.name.charAt(0)}`;
    });

    // Computed property para mostrar especialidades
    specialtiesText = computed(() => {
        const guide = this.guide();
        if (guide.specialties.length === 0) return 'Guía general';

        const specialtyNames = guide.specialties
            .slice(0, 2) // Mostrar máximo 2 especialidades
            .map(specialty => GUIDE_SPECIALTIES[specialty].name);

        if (guide.specialties.length > 2) {
            specialtyNames.push(`+${guide.specialties.length - 2} más`);
        }

        return specialtyNames.join(', ');
    });

    // Computed property para mostrar idiomas
    languagesText = computed(() => {
        const guide = this.guide();
        if (guide.languages.length === 0) return 'No especificado';

        const languageFlags = guide.languages
            .slice(0, 3) // Mostrar máximo 3 idiomas
            .map(lang => GUIDE_LANGUAGES[lang].flag);

        if (guide.languages.length > 3) {
            languageFlags.push(`+${guide.languages.length - 3}`);
        }

        return languageFlags.join(' ');
    });

    // Computed property para el enlace de detalles
    detailsLink = computed(() => {
        const route = this.detailsRoute();
        const guideId = this.guide().id;
        return route ? `${route}/${guideId}` : `/dashboard/guides/${guideId}`;
    });

    // Métodos para manejar eventos
    onCardClick(): void {
        this.cardClick.emit(this.guide());
    }

    onDetailsClick(event: Event): void {
        event.stopPropagation();
        this.detailsClick.emit(this.guide());
    }
}
