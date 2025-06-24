import { BadgeComponent } from "@/Components/Badge/badge.component";
import { CardComponent } from "@/Components/Card";
import { CurrencyComponent } from "@/Components/currency/currency.component";
import { Component, input } from "@angular/core";

// Tipos para el desglose de precio
export interface PriceBreakdown {
    baseFare: number;
    distanceFee: number;
    timeFee: number;
    serviceFee: number;
    taxes: number;
    discount?: number;
    total: number;
    currency: string;
}

@Component({
    selector: 'cp-price-breakdown-section',
    templateUrl: './price-breakdown-section.component.html',
    styleUrl: './price-breakdown-section.component.css',
    standalone: true,
    imports: [CardComponent, BadgeComponent, CurrencyComponent],
})
export class PriceBreakdownSectionComponent {
    // Inputs
    priceData = input<PriceBreakdown>({
        baseFare: 15.00,
        distanceFee: 8.50,
        timeFee: 12.00,
        serviceFee: 3.50,
        taxes: 6.50,
        discount: 0,
        total: 45.50,
        currency: 'USD'
    });

    // Computed properties
    get hasDiscount(): boolean {
        return (this.priceData().discount || 0) > 0;
    }

    get subtotal(): number {
        const data = this.priceData();
        return data.baseFare + data.distanceFee + data.timeFee + data.serviceFee + data.taxes;
    }

    formatCurrency(amount: number): string {
        const currency = this.priceData().currency;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency === 'USD' ? 'USD' : 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
}
