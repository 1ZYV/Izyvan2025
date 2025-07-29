import { Component, input, output, signal, computed, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServiceRequest } from '../../Services/ServiceRequests/service-requests.service';
import { VehiclesAndDriversService } from '../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';
import { VehicleDetails, DriverDetails, VehicleUtils, DriverUtils } from '../../Types';
import { LoaderComponent } from '../Loader/loader.component';
import { BadgeComponent } from '../Badge/badge.component';

@Component({
    selector: 'cp-assign-transport-modal',
    templateUrl: './assign-transport-modal.component.html',
    styleUrl: './assign-transport-modal.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoaderComponent, BadgeComponent]
})
export class AssignTransportModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private vehiclesAndDriversService = inject(VehiclesAndDriversService);

    // Inputs
    isOpen = input.required<boolean>();
    serviceRequest = input.required<ServiceRequest>();
    isAssigning = input<boolean>(false);

    // Outputs
    close = output<void>();
    assignResources = output<{ requestId: string; vehicleId: string; driverId: string }>();

    // Signals
    availableVehicles = signal<VehicleDetails[]>([]);
    availableDrivers = signal<DriverDetails[]>([]);
    isLoading = signal<boolean>(false);
    selectedVehicle = signal<VehicleDetails | null>(null);
    selectedDriver = signal<DriverDetails | null>(null);

    // Computed properties
    canAssign = computed(() => {
        return this.selectedVehicle() !== null && this.selectedDriver() !== null && !this.isAssigning();
    });

    modalTitle = computed(() => {
        return `Asignar Vehículo y Conductor - ${this.serviceRequest().title}`;
    });

    compatibleDrivers = computed(() => {
        const vehicle = this.selectedVehicle();
        if (!vehicle) return this.availableDrivers();

        return this.availableDrivers().filter(driver =>
            driver.vehicleTypes.includes(vehicle.type)
        );
    });

    ngOnInit(): void {
        if (this.isOpen()) {
            this.loadAvailableResources();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadAvailableResources(): void {
        this.isLoading.set(true);

        // Cargar vehículos y conductores disponibles
        this.vehiclesAndDriversService.getAvailableVehicles()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (vehicles) => {
                    this.availableVehicles.set(vehicles);
                },
                error: (error) => {
                    console.error('Error loading vehicles:', error);
                }
            });

        this.vehiclesAndDriversService.getAvailableDrivers()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (drivers) => {
                    this.availableDrivers.set(drivers);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('Error loading drivers:', error);
                    this.isLoading.set(false);
                }
            });
    }

    // Event handlers
    onVehicleSelect(vehicle: VehicleDetails): void {
        this.selectedVehicle.set(vehicle);
        // Si el conductor seleccionado no es compatible, lo deseleccionamos
        const selectedDriver = this.selectedDriver();
        if (selectedDriver && !selectedDriver.vehicleTypes.includes(vehicle.type)) {
            this.selectedDriver.set(null);
        }
    }

    onDriverSelect(driver: DriverDetails): void {
        this.selectedDriver.set(driver);
    }

    onAssign(): void {
        const vehicle = this.selectedVehicle();
        const driver = this.selectedDriver();

        if (vehicle && driver) {
            this.assignResources.emit({
                requestId: this.serviceRequest().id,
                vehicleId: vehicle.id,
                driverId: driver.id
            });
        }
    }

    onCancel(): void {
        this.selectedVehicle.set(null);
        this.selectedDriver.set(null);
        this.close.emit();
    }

    // Utility methods
    formatVehicleCapacity(capacity: number): string {
        return VehicleUtils.formatCapacity(capacity);
    }

    formatVehicleMileage(mileage: number): string {
        return VehicleUtils.formatMileage(mileage);
    }

    formatDriverExperience(years: number): string {
        return DriverUtils.formatExperience(years);
    }

    formatDriverTrips(trips: number): string {
        return DriverUtils.formatTrips(trips);
    }

    formatVehicleType(type: string): string {
        switch (type) {
            case 'carro': return 'Automóvil';
            case 'van': return 'Van';
            case 'bus': return 'Bus';
            default: return type;
        }
    }

    getVehicleTypeIcon(type: string): string {
        switch (type) {
            case 'carro': return '🚗';
            case 'van': return '🚐';
            case 'bus': return '🚌';
            default: return '🚗';
        }
    }
}
