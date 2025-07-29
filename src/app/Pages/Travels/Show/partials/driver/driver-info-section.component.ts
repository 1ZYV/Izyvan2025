import { BadgeComponent } from "@/Components/Badge/badge.component";
import { CardComponent } from "@/Components/Card";
import { Component, input } from "@angular/core";

// Tipos para información del conductor
export interface DriverInfo {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalTrips: number;
    yearsExperience: number;
    vehicleInfo: {
        brand: string;
        model: string;
        year: number;
        color: string;
        licensePlate: string;
    };
    phone: string;
    status: 'active' | 'completed' | 'en_route';
}

@Component({
    selector: 'cp-driver-info-section',
    templateUrl: './driver-info-section.component.html',
    styleUrl: './driver-info-section.component.css',
    standalone: true,
    imports: [CardComponent, BadgeComponent],
})
export class DriverInfoSectionComponent {
    // Inputs
    driverData = input<DriverInfo>({
        id: 'driver-001',
        name: 'Carlos Mendoza',
        avatar: 'https://via.placeholder.com/80x80?text=CM',
        rating: 4.8,
        totalTrips: 347,
        yearsExperience: 5,
        vehicleInfo: {
            brand: 'Toyota',
            model: 'Corolla',
            year: 2020,
            color: 'Blanco',
            licensePlate: 'ABC-123'
        },
        phone: '+1-555-0123',
        status: 'active'
    });

    // Computed properties
    get driverInitials(): string {
        const name = this.driverData().name;
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    get statusBadge(): { label: string; variant: 'success' | 'primary' | 'warning' | 'info' } {
        const status = this.driverData().status;
        const statusMap = {
            active: { label: 'En Servicio', variant: 'success' as const },
            completed: { label: 'Completado', variant: 'primary' as const },
            en_route: { label: 'En Camino', variant: 'warning' as const }
        };
        return statusMap[status] || { label: 'Activo', variant: 'info' as const };
    }

    get vehicleFullName(): string {
        const vehicle = this.driverData().vehicleInfo;
        return `${vehicle.brand} ${vehicle.model} ${vehicle.year}`;
    }

    get ratingStars(): number[] {
        const rating = this.driverData().rating;
        const fullStars = Math.floor(rating);
        return Array(fullStars).fill(0);
    }

    get hasPartialStar(): boolean {
        const rating = this.driverData().rating;
        return rating % 1 !== 0;
    }
}
