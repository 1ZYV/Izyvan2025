import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { ServiceRequest, ServiceRequestType } from '../../Services/ServiceRequests/service-requests.service';
import { BadgeComponent } from '../Badge/badge.component';

@Component({
    selector: 'cp-service-details-modal',
    templateUrl: './service-details-modal.component.html',
    styleUrl: './service-details-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BadgeComponent]
})
export class ServiceDetailsModalComponent {
    // Inputs
    isOpen = input<boolean>(false);
    serviceRequest = input.required<ServiceRequest>();
    isLoading = input<boolean>(false);

    // Outputs
    close = output<void>();
    cancel = output<{ requestId: string; reason: string }>();

    // Computed properties
    canBeCancelled = computed(() => {
        const status = this.serviceRequest().status;
        return status === 'pending' || status === 'accepted' || status === 'assigned';
    });

    statusConfig = computed(() => {
        const status = this.serviceRequest().status;
        switch (status) {
            case 'pending':
                return { label: 'Pendiente', variant: 'info' as const, style: 'filled' as const };
            case 'accepted':
                return { label: 'Aceptada', variant: 'success' as const, style: 'filled' as const };
            case 'rejected':
                return { label: 'Rechazada', variant: 'danger' as const, style: 'outline' as const };
            case 'assigned':
                return { label: 'Asignada', variant: 'warning' as const, style: 'filled' as const };
            case 'completed':
                return { label: 'Completada', variant: 'success' as const, style: 'outline' as const };
            case 'cancelled':
                return { label: 'Cancelada', variant: 'secondary' as const, style: 'outline' as const };
            default:
                return { label: status, variant: 'secondary' as const, style: 'outline' as const };
        }
    });

    // Event handlers
    onClose(): void {
        this.close.emit();
    }

    onCancel(): void {
        const reason = prompt('¿Por qué deseas cancelar este servicio?');
        if (reason && reason.trim()) {
            this.cancel.emit({
                requestId: this.serviceRequest().id,
                reason: reason.trim()
            });
        }
    }

    // Utility methods
    formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    formatDateSafe(date: Date | undefined): string {
        if (!date) return 'No especificado';
        return this.formatDate(date);
    }

    formatPrice(price: number, currency: string): string {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: currency
        }).format(price);
    }

    formatDuration(duration: number): string {
        if (duration < 60) {
            return `${duration} min`;
        } else {
            const hours = Math.floor(duration / 60);
            const minutes = duration % 60;
            return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
        }
    }

    formatDurationSafe(duration: number | undefined): string {
        if (duration === undefined) return 'No especificado';
        return this.formatDuration(duration);
    }

    formatDistance(distance: number): string {
        return `${distance.toFixed(1)} km`;
    }

    formatDistanceSafe(distance: number | undefined): string {
        if (distance === undefined) return 'No especificado';
        return this.formatDistance(distance);
    }

    getServiceTypeIcon(type: ServiceRequestType): string {
        return type === 'transport' ? '🚗' : '🏛️';
    }

    getServiceTypeLabel(type: ServiceRequestType): string {
        return type === 'transport' ? 'Transporte' : 'Turismo';
    }

    getVehicleTypeLabel(vehicleType?: string): string {
        switch (vehicleType) {
            case 'carro': return 'Automóvil';
            case 'van': return 'Van';
            case 'bus': return 'Bus';
            default: return vehicleType || 'No especificado';
        }
    }
}
