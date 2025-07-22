import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    VehicleDetails,
    VehicleTypeDetailed as VehicleType,
    VehicleStatus,
    VehicleFormData as IVehicleFormData,
    VEHICLE_TYPE_OPTIONS,
    FUEL_TYPE_OPTIONS,
    AVAILABLE_VEHICLE_FEATURES,
    FORM_VALIDATION_CONFIG
} from '../../Types';
import { VehiclesAndDriversService } from '../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';
import {
    getFieldError,
    isFieldInvalid,
    CustomValidators,
    generateUniqueId,
    sanitizeFormData
} from '../../Utils/form-validation.utils';

export type VehicleFormData = IVehicleFormData;

@Component({
    selector: 'cp-add-vehicle-modal',
    templateUrl: './add-vehicle-modal.component.html',
    styleUrl: './add-vehicle-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class AddVehicleModalComponent {
    // Injected services
    private fb = inject(FormBuilder);
    private vehiclesService = inject(VehiclesAndDriversService);

    // Inputs
    isOpen = input<boolean>(false);

    // Outputs
    close = output<void>();
    vehicleCreated = output<VehicleDetails>();

    // Signals
    isSubmitting = signal<boolean>(false);
    availableFeatures = signal<string[]>(AVAILABLE_VEHICLE_FEATURES);

    // Form
    vehicleForm: FormGroup;

    // Form data options (using imported constants)
    vehicleTypes = VEHICLE_TYPE_OPTIONS;
    fuelTypes = FUEL_TYPE_OPTIONS;

    selectedFeatures = signal<string[]>([]);

    constructor() {
        const config = FORM_VALIDATION_CONFIG.vehicle;
        this.vehicleForm = this.fb.group({
            licensePlate: ['', [Validators.required, CustomValidators.licensePlate]],
            brand: ['', [Validators.required, Validators.minLength(config.brand.minLength)]],
            model: ['', [Validators.required, Validators.minLength(config.model.minLength)]],
            year: [new Date().getFullYear(), [Validators.required, CustomValidators.currentOrFutureYear]],
            type: ['carro', Validators.required],
            capacity: [4, [Validators.required, Validators.min(config.capacity.min), Validators.max(config.capacity.max)]],
            color: ['', [Validators.required, Validators.minLength(config.color.minLength)]],
            fuelType: ['gasoline', Validators.required],
            mileage: [0, [Validators.required, Validators.min(config.mileage.min)]],
            photo: ['']
        });
    }

    onClose(): void {
        this.close.emit();
        this.resetForm();
    }

    toggleFeature(feature: string): void {
        const currentFeatures = this.selectedFeatures();
        const index = currentFeatures.indexOf(feature);

        if (index > -1) {
            // Remove feature
            this.selectedFeatures.set(currentFeatures.filter(f => f !== feature));
        } else {
            // Add feature
            this.selectedFeatures.set([...currentFeatures, feature]);
        }
    }

    isFeatureSelected(feature: string): boolean {
        return this.selectedFeatures().includes(feature);
    }

    onSubmit(): void {
        if (this.vehicleForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            const rawData = this.vehicleForm.value;
            const sanitizedData = sanitizeFormData(rawData);

            const vehicleData: VehicleFormData = {
                ...sanitizedData,
                features: this.selectedFeatures()
            };

            // Create new vehicle object
            const newVehicle: VehicleDetails = {
                id: generateUniqueId('vehicle'),
                ...vehicleData,
                status: 'available' as VehicleStatus,
                lastMaintenance: new Date(),
                documents: {
                    soat: 'pending',
                    technicalReview: 'pending',
                    circulation: 'pending'
                },
                maintenanceHistory: [],
                tripHistory: []
            };

            // Simulate API call
            setTimeout(() => {
                this.vehicleCreated.emit(newVehicle);
                this.isSubmitting.set(false);
                this.onClose();
            }, 1500);
        } else {
            // Mark all fields as touched to show validation errors
            this.vehicleForm.markAllAsTouched();
        }
    }

    private resetForm(): void {
        this.vehicleForm.reset({
            licensePlate: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            type: 'carro',
            capacity: 4,
            color: '',
            fuelType: 'gasoline',
            mileage: 0,
            photo: ''
        });
        this.selectedFeatures.set([]);
        this.isSubmitting.set(false);
    }

    // Helper methods for form validation (using shared utilities)
    getFieldError(fieldName: string): string | null {
        const field = this.vehicleForm.get(fieldName);
        return getFieldError(field, fieldName);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.vehicleForm.get(fieldName);
        return isFieldInvalid(field);
    }
}
