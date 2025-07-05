import { Component, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { VehiclesAndDriversService } from '../../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';
import { VehicleDetails, VehicleStatus, VehicleUtils } from '../../../Types';
import { LoaderComponent } from '../../../Components/Loader/loader.component';
import { BadgeComponent } from '../../../Components/Badge/badge.component';
import { AddVehicleModalComponent } from '../../../Components/AddVehicleModal/add-vehicle-modal.component';

@Component({
    selector: "pg-vehicles-index",
    templateUrl: "./index.component.html",
    styleUrl: "./index.component.css",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoaderComponent, BadgeComponent, AddVehicleModalComponent],
})
export class VehiclesIndexComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private vehiclesAndDriversService = inject(VehiclesAndDriversService);

    // Signals
    isLoading = signal<boolean>(true);
    vehicles = signal<VehicleDetails[]>([]);
    searchQuery = signal<string>('');
    selectedStatus = signal<VehicleStatus | 'all'>('all');

    // Modal signals
    showAddVehicleModal = signal<boolean>(false);

    // Computed properties
    filteredVehicles = computed(() => {
        const vehicles = this.vehicles();
        const query = this.searchQuery().toLowerCase();
        const status = this.selectedStatus();

        return vehicles.filter(vehicle => {
            const matchesSearch = !query ||
                vehicle.brand.toLowerCase().includes(query) ||
                vehicle.model.toLowerCase().includes(query) ||
                vehicle.licensePlate.toLowerCase().includes(query);

            const matchesStatus = status === 'all' || vehicle.status === status;

            return matchesSearch && matchesStatus;
        });
    });

    availableVehicles = computed(() =>
        this.vehicles().filter(v => v.status === 'available')
    );

    busyVehicles = computed(() =>
        this.vehicles().filter(v => v.status === 'busy')
    );

    maintenanceVehicles = computed(() =>
        this.vehicles().filter(v => v.status === 'maintenance')
    );

    inactiveVehicles = computed(() =>
        this.vehicles().filter(v => v.status === 'inactive')
    );

    statusOptions = [
        { value: 'all' as const, label: 'Todos los vehículos' },
        { value: 'available' as const, label: 'Disponibles' },
        { value: 'busy' as const, label: 'Ocupados' },
        { value: 'maintenance' as const, label: 'En mantenimiento' },
        { value: 'inactive' as const, label: 'Inactivos' }
    ];

    ngOnInit(): void {
        this.loadVehicles();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadVehicles(): void {
        this.isLoading.set(true);

        this.vehiclesAndDriversService.vehicles$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (vehicles) => {
                    this.vehicles.set(vehicles);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('Error loading vehicles:', error);
                    this.isLoading.set(false);
                }
            });
    }

    // Event handlers
    onSearch(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchQuery.set(target.value);
    }

    onStatusFilter(status: VehicleStatus | 'all'): void {
        this.selectedStatus.set(status);
    }

    onRefresh(): void {
        this.loadVehicles();
    }

    onUpdateVehicleStatus(vehicleId: string, status: VehicleStatus): void {
        this.vehiclesAndDriversService.updateVehicleStatus(vehicleId, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Vehicle status updated successfully');
                        this.loadVehicles();
                    } else {
                        console.error('Failed to update vehicle status');
                    }
                },
                error: (error) => {
                    console.error('Error updating vehicle status:', error);
                }
            });
    }

    // Utility methods
    getVehicleStatusConfig(status: VehicleStatus) {
        return VehicleUtils.getStatusConfig(status);
    }

    formatCapacity(capacity: number): string {
        return VehicleUtils.formatCapacity(capacity);
    }

    formatMileage(mileage: number): string {
        return VehicleUtils.formatMileage(mileage);
    }

    getVehicleTypeIcon(type: string): string {
        switch (type) {
            case 'carro': return '🚗';
            case 'van': return '🚐';
            case 'bus': return '🚌';
            default: return '🚗';
        }
    }

    formatVehicleType(type: string): string {
        switch (type) {
            case 'carro': return 'Automóvil';
            case 'van': return 'Van';
            case 'bus': return 'Bus';
            default: return type;
        }
    }

    getStatusActions(status: VehicleStatus): { label: string; status: VehicleStatus; variant: string }[] {
        switch (status) {
            case 'available':
                return [
                    { label: 'Marcar como ocupado', status: 'busy', variant: 'warning' },
                    { label: 'Enviar a mantenimiento', status: 'maintenance', variant: 'danger' },
                    { label: 'Desactivar', status: 'inactive', variant: 'secondary' }
                ];
            case 'busy':
                return [
                    { label: 'Marcar como disponible', status: 'available', variant: 'success' }
                ];
            case 'maintenance':
                return [
                    { label: 'Marcar como disponible', status: 'available', variant: 'success' },
                    { label: 'Desactivar', status: 'inactive', variant: 'secondary' }
                ];
            case 'inactive':
                return [
                    { label: 'Activar vehículo', status: 'available', variant: 'success' }
                ];
            default:
                return [];
        }
    }

    // Modal event handlers
    onAddVehicle(): void {
        this.showAddVehicleModal.set(true);
    }

    onCloseAddVehicleModal(): void {
        this.showAddVehicleModal.set(false);
    }

    onVehicleCreated(vehicle: VehicleDetails): void {
        // Add the new vehicle to the service
        this.vehiclesAndDriversService.addVehicle(vehicle)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (createdVehicle) => {
                    console.log('Vehicle created successfully:', createdVehicle);
                    this.loadVehicles(); // Refresh the list
                },
                error: (error) => {
                    console.error('Error creating vehicle:', error);
                }
            });
    }
}