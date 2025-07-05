import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DriverDetails, VehicleTypeDetailed as VehicleType, VehicleDriverStatus as DriverStatus } from '../../Types';
import { VehiclesAndDriversService } from '../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';

export interface DriverFormData {
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phone: string;
    email?: string;
    address?: string;
    dateOfBirth?: Date;
    yearsExperience: number;
    languages: string[];
    vehicleTypes: VehicleType[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    photo?: string;
}

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
    driverCreated = output<DriverDetails>();

    // Signals
    isSubmitting = signal<boolean>(false);

    availableLanguages = signal<string[]>([
        'Español',
        'Inglés',
        'Francés',
        'Portugués',
        'Italiano',
        'Alemán',
        'Japonés',
        'Chino',
        'Quechua',
        'Aimara'
    ]);

    // Form
    driverForm: FormGroup;

    // Form data options
    vehicleTypes: { value: VehicleType; label: string }[] = [
        { value: 'carro', label: 'Automóvil' },
        { value: 'van', label: 'Van/Minivan' },
        { value: 'bus', label: 'Bus/Ómnibus' }
    ];

    relationshipTypes: string[] = [
        'Esposo/a',
        'Padre/Madre',
        'Hijo/a',
        'Hermano/a',
        'Amigo/a',
        'Otro familiar'
    ];

    selectedLanguages = signal<string[]>(['Español']);
    selectedVehicleTypes = signal<VehicleType[]>(['carro']);

    constructor() {
        this.driverForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            licenseNumber: ['', [Validators.required, Validators.pattern(/^LIC-[A-Z0-9]{5}$/)]],
            licenseExpiry: ['', Validators.required],
            phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{9,15}$/)]],
            email: ['', [Validators.email]],
            address: [''],
            dateOfBirth: [''],
            yearsExperience: [1, [Validators.required, Validators.min(0), Validators.max(50)]],
            photo: [''],
            // Emergency contact
            emergencyContactName: [''],
            emergencyContactPhone: ['', [Validators.pattern(/^\+?[0-9\s\-]{9,15}$/)]],
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
    }

    onSubmit(): void {
        if (this.driverForm.valid && !this.isSubmitting()) {
            this.isSubmitting.set(true);

            const formData = this.driverForm.value;

            // Prepare emergency contact (only if name is provided)
            let emergencyContact = undefined;
            if (formData.emergencyContactName?.trim()) {
                emergencyContact = {
                    name: formData.emergencyContactName.trim(),
                    phone: formData.emergencyContactPhone || '',
                    relationship: formData.emergencyContactRelationship || 'No especificado'
                };
            }

            const driverData: DriverFormData = {
                name: formData.name,
                licenseNumber: formData.licenseNumber,
                licenseExpiry: new Date(formData.licenseExpiry),
                phone: formData.phone,
                email: formData.email || undefined,
                address: formData.address || undefined,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
                yearsExperience: formData.yearsExperience,
                languages: this.selectedLanguages(),
                vehicleTypes: this.selectedVehicleTypes(),
                emergencyContact,
                photo: formData.photo || undefined
            };

            // Create new driver object
            const newDriver: DriverDetails = {
                id: `driver-${Date.now()}`, // In real app, this would be generated by the backend
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

    // Helper methods for form validation
    getFieldError(fieldName: string): string | null {
        const field = this.driverForm.get(fieldName);
        if (field && field.invalid && field.touched) {
            if (field.errors?.['required']) {
                return 'Este campo es obligatorio';
            }
            if (field.errors?.['pattern']) {
                if (fieldName === 'licenseNumber') {
                    return 'Formato inválido (ej: LIC-12345)';
                } else if (fieldName.includes('Phone')) {
                    return 'Formato de teléfono inválido';
                }
                return 'Formato inválido';
            }
            if (field.errors?.['email']) {
                return 'Email inválido';
            }
            if (field.errors?.['minlength']) {
                return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
            }
            if (field.errors?.['min']) {
                return `Valor mínimo: ${field.errors['min'].min}`;
            }
            if (field.errors?.['max']) {
                return `Valor máximo: ${field.errors['max'].max}`;
            }
        }
        return null;
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.driverForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }
}
