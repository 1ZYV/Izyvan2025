import { Component, input, output, computed, signal, ChangeDetectionStrategy } from "@angular/core";
import { TravelListItem } from "../../Services/Travels/travels.service";
import { GuideDetails } from "../../Types/guide.types";

@Component({
    selector: 'cp-guide-assignment-modal',
    templateUrl: './guide-assignment-modal.component.html',
    styleUrl: './guide-assignment-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideAssignmentModalComponent {
    // Inputs
    isOpen = input<boolean>(false);
    guide = input.required<GuideDetails>();
    availableServices = input<TravelListItem[]>([]);
    isAssigning = input<boolean>(false);

    // Outputs
    close = output<void>();
    assignService = output<{ serviceId: string; guideId: string }>();
    deleteService = output<string>(); // Emite el ID del servicio a eliminar

    // Señal para el servicio seleccionado
    selectedService = signal<TravelListItem | null>(null);

    // Computed para verificar si se puede asignar
    canAssign = computed(() => {
        return this.selectedService() !== null && !this.isAssigning();
    });

    // Computed para verificar compatibilidad del guía
    getServiceCompatibility = computed(() => {
        const service = this.selectedService();
        const guide = this.guide();

        if (!service) return null;

        // Por ahora, asumimos que todos los guías pueden tomar cualquier servicio
        // En el futuro se puede mejorar esta lógica basándose en el destino o tipo de viaje
        return {
            hasSpecialty: true,
            hasLanguage: true,
            isCompatible: true
        };
    });

    // Métodos
    onServiceSelect(service: TravelListItem): void {
        this.selectedService.set(service);
    }

    onAssign(): void {
        const service = this.selectedService();
        if (service) {
            this.assignService.emit({
                serviceId: service.id,
                guideId: this.guide().id
            });
        }
    }

    onDeleteService(service: TravelListItem, event: Event): void {
        // Prevenir que se seleccione el servicio cuando se hace clic en eliminar
        event.stopPropagation();

        if (confirm(`¿Estás seguro de que deseas eliminar el servicio "${service.name}"?`)) {
            this.deleteService.emit(service.id);

            // Si el servicio eliminado era el seleccionado, limpiar la selección
            if (this.selectedService()?.id === service.id) {
                this.selectedService.set(null);
            }
        }
    }

    onClose(): void {
        this.selectedService.set(null);
        this.close.emit();
    }

    formatDate(date: Date): string {
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
