import { Component, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { VehiclesAndDriversService } from '../../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';
import { DriverDetails, VehicleDriverStatus as DriverStatus, DriverUtils } from '../../../Types';
import { LoaderComponent } from '../../../Components/Loader/loader.component';
import { BadgeComponent } from '../../../Components/Badge/badge.component';
import { AddDriverModalComponent } from '../../../Components/AddDriverModal/add-driver-modal.component';

@Component({
    selector: "pg-drivers-index",
    templateUrl: "./index.component.html",
    styleUrl: "./index.component.css",
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoaderComponent, BadgeComponent, AddDriverModalComponent],
})
export class DriversIndexComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private vehiclesAndDriversService = inject(VehiclesAndDriversService);

    // Signals
    isLoading = signal<boolean>(true);
    drivers = signal<DriverDetails[]>([]);
    searchQuery = signal<string>('');
    selectedStatus = signal<DriverStatus | 'all'>('all');

    // Modal signals
    showAddDriverModal = signal<boolean>(false);

    // Computed properties
    filteredDrivers = computed(() => {
        const drivers = this.drivers();
        const query = this.searchQuery().toLowerCase();
        const status = this.selectedStatus();

        return drivers.filter(driver => {
            const matchesSearch = !query ||
                driver.name.toLowerCase().includes(query) ||
                driver.licenseNumber.toLowerCase().includes(query) ||
                driver.phone.includes(query);

            const matchesStatus = status === 'all' || driver.status === status;

            return matchesSearch && matchesStatus;
        });
    });

    availableDrivers = computed(() =>
        this.drivers().filter(d => d.status === 'available')
    );

    busyDrivers = computed(() =>
        this.drivers().filter(d => d.status === 'busy')
    );

    offlineDrivers = computed(() =>
        this.drivers().filter(d => d.status === 'offline')
    );

    inactiveDrivers = computed(() =>
        this.drivers().filter(d => d.status === 'inactive')
    );

    statusOptions = [
        { value: 'all' as const, label: 'Todos los conductores' },
        { value: 'available' as const, label: 'Disponibles' },
        { value: 'busy' as const, label: 'Ocupados' },
        { value: 'offline' as const, label: 'Desconectados' },
        { value: 'inactive' as const, label: 'Inactivos' }
    ];

    ngOnInit(): void {
        this.loadDrivers();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadDrivers(): void {
        this.isLoading.set(true);

        this.vehiclesAndDriversService.drivers$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (drivers) => {
                    this.drivers.set(drivers);
                    this.isLoading.set(false);
                },
                error: (error) => {
                    console.error('Error loading drivers:', error);
                    this.isLoading.set(false);
                }
            });
    }

    // Event handlers
    onSearch(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.searchQuery.set(target.value);
    }

    onStatusFilter(status: DriverStatus | 'all'): void {
        this.selectedStatus.set(status);
    }

    onRefresh(): void {
        this.loadDrivers();
    }

    onUpdateDriverStatus(driverId: string, status: DriverStatus): void {
        this.vehiclesAndDriversService.updateDriverStatus(driverId, status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Driver status updated successfully');
                        this.loadDrivers();
                    } else {
                        console.error('Failed to update driver status');
                    }
                },
                error: (error) => {
                    console.error('Error updating driver status:', error);
                }
            });
    }

    // Utility methods
    getDriverStatusConfig(status: DriverStatus) {
        return DriverUtils.getStatusConfig(status);
    }

    formatExperience(years: number): string {
        return DriverUtils.formatExperience(years);
    }

    formatTrips(trips: number): string {
        return DriverUtils.formatTrips(trips);
    }

    formatVehicleTypes(types: string[]): string {
        const typeNames = types.map(type => {
            switch (type) {
                case 'carro': return 'Automóvil';
                case 'van': return 'Van';
                case 'bus': return 'Bus';
                default: return type;
            }
        });
        return typeNames.join(', ');
    }

    getLicenseExpiryStatus(expiryDate: Date): { status: 'valid' | 'warning' | 'expired'; daysUntilExpiry: number } {
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return { status: 'expired', daysUntilExpiry };
        } else if (daysUntilExpiry <= 30) {
            return { status: 'warning', daysUntilExpiry };
        } else {
            return { status: 'valid', daysUntilExpiry };
        }
    }

    getStatusActions(status: DriverStatus): { label: string; status: DriverStatus; variant: string }[] {
        switch (status) {
            case 'available':
                return [
                    { label: 'Marcar como ocupado', status: 'busy', variant: 'warning' },
                    { label: 'Marcar como desconectado', status: 'offline', variant: 'secondary' },
                    { label: 'Desactivar', status: 'inactive', variant: 'danger' }
                ];
            case 'busy':
                return [
                    { label: 'Marcar como disponible', status: 'available', variant: 'success' }
                ];
            case 'offline':
                return [
                    { label: 'Marcar como disponible', status: 'available', variant: 'success' },
                    { label: 'Desactivar', status: 'inactive', variant: 'danger' }
                ];
            case 'inactive':
                return [
                    { label: 'Activar conductor', status: 'available', variant: 'success' }
                ];
            default:
                return [];
        }
    }

    // Modal event handlers
    onAddDriver(): void {
        this.showAddDriverModal.set(true);
    }

    onCloseAddDriverModal(): void {
        this.showAddDriverModal.set(false);
    }

    onDriverCreated(driver: DriverDetails): void {
        // Add the new driver to the service
        this.vehiclesAndDriversService.addDriver(driver)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (createdDriver) => {
                    console.log('Driver created successfully:', createdDriver);
                    this.loadDrivers(); // Refresh the list
                },
                error: (error) => {
                    console.error('Error creating driver:', error);
                }
            });
    }
}