import { Component, input, output, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BadgeComponent } from "../Badge/badge.component";
import { Invoice, InvoiceStatusUtils } from "../../Types/invoice.types";

/**
 * InvoiceCard Component
 * 
 * Componente específico para mostrar información de facturas de forma consistente.
 * Sigue el mismo patrón de diseño que TravelCard para mantener coherencia visual.
 * 
 * @example
 * ```html
 * <cp-invoice-card 
 *   [invoice]="invoiceData"
 *   (detailsClick)="onViewDetails($event)"
 *   (cardClick)="onCardClick($event)">
 * </cp-invoice-card>
 * ```
 */
@Component({
    selector: 'cp-invoice-card',
    templateUrl: './invoice-card.component.html',
    styleUrl: './invoice-card.component.css',
    standalone: true,
    imports: [RouterLink, BadgeComponent],
})
export class InvoiceCardComponent {
    // Propiedades de entrada
    invoice = input.required<Invoice>();
    showAmount = input<boolean>(true);
    showStatus = input<boolean>(true);
    detailsRoute = input<string>('');

    // Outputs
    detailsClick = output<Invoice>();
    cardClick = output<Invoice>();

    // Computed properties para mostrar información derivada
    statusVariant = computed(() => {
        return InvoiceStatusUtils.getStatusVariant(this.invoice().status);
    });

    statusDescription = computed(() => {
        return InvoiceStatusUtils.getStatusDescription(this.invoice().status);
    });

    formattedAmount = computed(() => {
        const invoice = this.invoice();
        return `${invoice.currency} $${invoice.total.toFixed(2)}`;
    });

    formattedDate = computed(() => {
        const date = new Date(this.invoice().date);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    });

    isPaidStatus = computed(() => {
        return InvoiceStatusUtils.isPaidStatus(this.invoice().status);
    }); isPendingStatus = computed(() => {
        return InvoiceStatusUtils.isPendingStatus(this.invoice().status);
    });    // Computed para formatear fechas

    formattedTravelDate = computed(() => {
        const invoice = this.invoice();
        if (!invoice.travel?.date) return '';
        return new Date(invoice.travel.date).toLocaleDateString('es-ES');
    });

    // Métodos para manejo de eventos
    onDetailsClick(event: Event): void {
        event.stopPropagation();
        this.detailsClick.emit(this.invoice());
    }

    onCardClick(): void {
        this.cardClick.emit(this.invoice());
    }

    // Método para truncar descripción larga
    getTruncatedDescription(): string {
        const description = this.invoice().description;
        return description.length > 60 ?
            description.substring(0, 60) + '...' :
            description;
    }
}
