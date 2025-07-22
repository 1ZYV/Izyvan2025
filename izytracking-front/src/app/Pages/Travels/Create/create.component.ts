import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardComponent } from '../../../Components/Card/card.component';
import { SelectableCardComponent, SelectableOption } from '../../../Components/SelectableCard/selectable-card.component';
import { VehicleType, VehicleTypeInfo, VEHICLE_TYPES } from '../../../Types/travel.types';

export interface TravelFormData {
    origin: string;
    destination: string;
    scheduledDate: string;
    scheduledTime: string;
    notes: string;
    vehicleType: VehicleType;
    passengerCount: number;
    includeTourGuide: boolean;
}

@Component({
    selector: 'pg-travels-create',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardComponent,
        SelectableCardComponent
    ]
})
export class TravelsCreateComponent {
    private router = inject(Router);
    private fb = inject(FormBuilder);

    // Estado del componente
    isLoading = signal<boolean>(false);
    currentStep = signal<number>(1);
    selectedVehicle = signal<VehicleTypeInfo | null>(null);

    // Formulario reactivo
    travelForm: FormGroup;

    // Opciones de vehículos estandarizadas
    vehicleOptions = signal<SelectableOption[]>(
        Object.values(VEHICLE_TYPES).map(vehicle => ({
            id: vehicle.id,
            title: vehicle.name,
            description: `${vehicle.description} (Capacidad: ${vehicle.capacity} pasajeros)`,
            icon: vehicle.icon,
            metadata: vehicle
        }))
    );

    constructor() {
        this.travelForm = this.fb.group({
            origin: ['', [Validators.required]],
            destination: ['', [Validators.required]],
            scheduledDate: ['', [Validators.required]],
            scheduledTime: ['', [Validators.required]],
            notes: [''],
            vehicleType: ['', [Validators.required]],
            passengerCount: [1, [Validators.required, Validators.min(1)]],
            includeTourGuide: [false]
        });
    }

    // Computed properties
    canProceedToVehicleSelection(): boolean {
        const originValue = this.travelForm.get('origin')?.value;
        const destinationValue = this.travelForm.get('destination')?.value;
        const scheduledDateValue = this.travelForm.get('scheduledDate')?.value;
        const scheduledTimeValue = this.travelForm.get('scheduledTime')?.value;
        const passengerCountValue = this.travelForm.get('passengerCount')?.value;

        // Validar que los campos requeridos tengan valores
        const hasOrigin = originValue && originValue.trim().length > 0;
        const hasDestination = destinationValue && destinationValue.trim().length > 0;
        const hasScheduledDate = scheduledDateValue && scheduledDateValue.trim().length > 0;
        const hasScheduledTime = scheduledTimeValue && scheduledTimeValue.trim().length > 0;
        const hasValidPassengerCount = passengerCountValue && passengerCountValue >= 1;

        return hasOrigin && hasDestination && hasScheduledDate && hasScheduledTime && hasValidPassengerCount;
    }

    canConfirmTrip(): boolean {
        return this.selectedVehicle() !== null && this.isVehicleCapacityValid();
    }

    // Computed property para validar capacidad del vehículo
    isVehicleCapacityValid(): boolean {
        const selectedVehicle = this.selectedVehicle();
        const passengerCount = this.travelForm.get('passengerCount')?.value || 0;
        return selectedVehicle ? passengerCount <= selectedVehicle.capacity : true;
    }

    // Computed property para obtener mensaje de capacidad
    capacityMessage(): string {
        const selectedVehicle = this.selectedVehicle();
        const passengerCount = this.travelForm.get('passengerCount')?.value || 0;

        if (!selectedVehicle) return '';

        if (passengerCount > selectedVehicle.capacity) {
            return `⚠️ Este vehículo solo tiene capacidad para ${selectedVehicle.capacity} pasajeros`;
        }

        return `✅ Capacidad suficiente (${passengerCount}/${selectedVehicle.capacity} pasajeros)`;
    }

    // Métodos para navegación entre pasos
    proceedToVehicleSelection(): void {
        if (this.canProceedToVehicleSelection()) {
            this.currentStep.set(2);
        }
    }

    goBackToDetails(): void {
        this.currentStep.set(1);
    }

    // Método para seleccionar vehículo
    selectVehicle(option: SelectableOption): void {
        const vehicleInfo = option.metadata as VehicleTypeInfo;
        this.selectedVehicle.set(vehicleInfo);
        this.travelForm.patchValue({ vehicleType: vehicleInfo.id });
    }

    // Método para confirmar el viaje
    async confirmTrip(): Promise<void> {
        if (this.travelForm.valid && this.selectedVehicle()) {
            this.isLoading.set(true);

            try {
                const formData: TravelFormData = this.travelForm.value;
                console.log('Creando viaje:', formData);

                // Simular creación del viaje
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Navegar de vuelta al index con mensaje de éxito
                this.router.navigate(['/dashboard/travels'], {
                    queryParams: { created: 'true' }
                });

            } catch (error) {
                console.error('Error al crear viaje:', error);
            } finally {
                this.isLoading.set(false);
            }
        }
    }

    // Método para volver al listado
    goBackToTravels(): void {
        this.router.navigate(['/dashboard/travels']);
    }
}
