import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
    DriverDetails,
    VehicleTypeDetailed as VehicleType,
    VehicleDriverStatus as DriverStatus,
    DriverFormData as IDriverFormData,
    VEHICLE_TYPE_OPTIONS,
    AVAILABLE_LANGUAGES,
    RELATIONSHIP_TYPES,
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

export type DriverFormData = IDriverFormData;

@Component({
    selector: 'cp-add-driver-modal',
    templateUrl: './add-driver-modal.component.html',
    styleUrl: './add-driver-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class AddDriverModalComponent {
    // Injected services
    private fb = inject(FormBuilder);
    private vehiclesService = inject(VehiclesAndDriversService);

    // Inputs
    isOpen = input<boolean>(false);

    // Outputs
    close = output<void>();
    driverCreated = output<DriverDetails>();    // Signals
    isSubmitting = signal<boolean>(false);
    availableLanguages = signal<string[]>(AVAILABLE_LANGUAGES);

    // Form
    driverForm: FormGroup;

    // Form data options (using imported constants)
    vehicleTypes = VEHICLE_TYPE_OPTIONS;
    relationshipTypes = RELATIONSHIP_TYPES;

    selectedLanguages = signal<string[]>(['Español']);
    selectedVehicleTypes = signal<VehicleType[]>(['carro']);

    constructor() {
        const config = FORM_VALIDATION_CONFIG.driver;
        this.driverForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(config.name.minLength)]],
            licenseNumber: ['', [Validators.required, CustomValidators.licenseNumber]],
            licenseExpiry: ['', Validators.required],
            phone: ['', [Validators.required, CustomValidators.phone]],
            email: ['', [Validators.email]],
            address: [''],
            dateOfBirth: [''],
            yearsExperience: [1, [Validators.required, Validators.min(config.yearsExperience.min), Validators.max(config.yearsExperience.max)]],
            photo: [''],
            // Emergency contact
            emergencyContactName: [''],
            emergencyContactPhone: ['', [CustomValidators.phone]],
            emergencyContactRelationship: ['']
        });
    }

    onClose(): void {
        this.close.emit();
        this.resetForm();
    }

    toggleLanguage(language: string): void {
        const currentLanguages = this.selectedLanguages();
        const index = currentLanguages.indexOf(language);

        if (index > -1) {
            // Don't allow removing the last language
            if (currentLanguages.length > 1) {
                this.selectedLanguages.set(currentLanguages.filter(l => l !== language));
            }
        } else {
            // Add language
            this.selectedLanguages.set([...currentLanguages, language]);
        }
    }

    isLanguageSelected(language: string): boolean {
        return this.selectedLanguages().includes(language);
    }

    toggleVehicleType(vehicleType: VehicleType): void {
        const currentTypes = this.selectedVehicleTypes();
        const index = currentTypes.indexOf(vehicleType);

        if (index > -1) {
            // Don't allow removing the last vehicle type
            if (currentTypes.length > 1) {
                this.selectedVehicleTypes.set(currentTypes.filter(t => t !== vehicleType));
            }
        } else {
            // Add vehicle type
            this.selectedVehicleTypes.set([...currentTypes, vehicleType]);
        }
    }

    isVehicleTypeSelected(vehicleType: VehicleType): boolean {
        return this.selectedVehicleTypes().includes(vehicleType);
    } onSubmit(): void {
        if (this.driverForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            const rawData = this.driverForm.value;
            const sanitizedData = sanitizeFormData(rawData);

            // Prepare emergency contact (only if name is provided)
            let emergencyContact = undefined;
            if (sanitizedData.emergencyContactName?.trim()) {
                emergencyContact = {
                    name: sanitizedData.emergencyContactName.trim(),
                    phone: sanitizedData.emergencyContactPhone || '',
                    relationship: sanitizedData.emergencyContactRelationship || 'No especificado'
                };
            }

            const driverData: DriverFormData = {
                name: sanitizedData.name,
                licenseNumber: sanitizedData.licenseNumber,
                licenseExpiry: new Date(sanitizedData.licenseExpiry),
                phone: sanitizedData.phone,
                email: sanitizedData.email || undefined,
                address: sanitizedData.address || undefined,
                dateOfBirth: sanitizedData.dateOfBirth ? new Date(sanitizedData.dateOfBirth) : undefined,
                yearsExperience: sanitizedData.yearsExperience,
                languages: this.selectedLanguages(),
                vehicleTypes: this.selectedVehicleTypes(),
                emergencyContact,
                photo: sanitizedData.photo || undefined
            };

            // Create new driver object
            const newDriver: DriverDetails = {
                id: generateUniqueId('driver'),
                ...driverData,
                status: 'available' as DriverStatus,
                rating: 0, // New drivers start with 0 rating
                totalTrips: 0,
                hireDate: new Date(),
                reviews: [],
                tripHistory: [],
                documents: {
                    license: 'pending',
                    criminalRecord: 'pending',
                    medicalCertificate: 'pending'
                }
            };

            // Simulate API call
            setTimeout(() => {
                this.driverCreated.emit(newDriver);
                this.isSubmitting.set(false);
                this.onClose();
            }, 1500);
        } else {
            // Mark all fields as touched to show validation errors
            this.driverForm.markAllAsTouched();
        }
    }

    private resetForm(): void {
        this.driverForm.reset({
            name: '',
            licenseNumber: '',
            licenseExpiry: '',
            phone: '',
            email: '',
            address: '',
            dateOfBirth: '',
            yearsExperience: 1,
            photo: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelationship: ''
        });
        this.selectedLanguages.set(['Español']);
        this.selectedVehicleTypes.set(['carro']);
        this.isSubmitting.set(false);
    }

    // Helper methods for form validation (using shared utilities)
    getFieldError(fieldName: string): string | null {
        const field = this.driverForm.get(fieldName);
        return getFieldError(field, fieldName);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.driverForm.get(fieldName);
        return isFieldInvalid(field);
    }
}
