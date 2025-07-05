import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { ServiceRequest } from '../../Services/ServiceRequests/service-requests.service';
import { CardComponent } from '../Card/card.component';
import { BadgeComponent } from '../Badge/badge.component';

@Component({
    selector: 'cp-service-request-card',
    templateUrl: './service-request-card.component.html',
    styleUrl: './service-request-card.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CardComponent, BadgeComponent]
})
export class ServiceRequestCardComponent {
    // Inputs
    serviceRequest = input.required<ServiceRequest>();
    showActions = input<boolean>(true);

    // Outputs
    accept = output<string>();
    reject = output<string>();
    viewDetails = output<string>();
    assignResources = output<string>();

    // Computed properties
    statusConfig = computed(() => {
        const status = this.serviceRequest().status;
        switch (status) {
            case 'pending':
                return {
                    label: 'Pendiente',
                    variant: 'warning' as const,
                    style: 'filled' as const
                };
            case 'accepted':
                return {
                    label: 'Aceptado',
                    variant: 'success' as const,
                    style: 'filled' as const
                };
            case 'rejected':
                return {
                    label: 'Rechazado',
                    variant: 'danger' as const,
                    style: 'filled' as const
                };
            case 'assigned':
                return {
                    label: 'Asignado',
                    variant: 'info' as const,
                    style: 'filled' as const
                };
            case 'completed':
                return {
                    label: 'Completado',
                    variant: 'success' as const,
                    style: 'outline' as const
                };
            default:
                return {
                    label: 'Desconocido',
                    variant: 'secondary' as const,
                    style: 'outline' as const
                };
        }
    });

    typeConfig = computed(() => {
        const type = this.serviceRequest().type;
        switch (type) {
            case 'transport':
                return {
                    label: 'Transporte',
                    icon: '🚗',
                    color: 'text-blue-600'
                };
            case 'tourism':
                return {
                    label: 'Turismo',
                    icon: '🏛️',
                    color: 'text-green-600'
                };
            default:
                return {
                    label: 'Desconocido',
                    icon: '❓',
                    color: 'text-gray-600'
                };
        }
    });

    canAccept = computed(() => {
        return this.serviceRequest().status === 'pending';
    });

    canAssignResources = computed(() => {
        return this.serviceRequest().status === 'accepted';
    });

    formattedDate = computed(() => {
        const date = this.serviceRequest().scheduledDate;
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    formattedPrice = computed(() => {
        const request = this.serviceRequest();
        return `${request.price.toFixed(2)} ${request.currency}`;
    });

    formatAssignedDate = computed(() => {
        const assignedAt = this.serviceRequest().assignedResources?.assignedAt;
        if (!assignedAt) return '';

        return assignedAt.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    });

    // Event handlers
    onAccept(): void {
        this.accept.emit(this.serviceRequest().id);
    }

    onReject(): void {
        this.reject.emit(this.serviceRequest().id);
    }

    onViewDetails(): void {
        this.viewDetails.emit(this.serviceRequest().id);
    }

    onAssignResources(): void {
        this.assignResources.emit(this.serviceRequest().id);
    }
}
