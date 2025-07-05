import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
    VehicleInfo,
    VehicleDetails,
    DriverInfo,
    DriverDetails,
    VehicleStatus,
    VehicleDriverStatus as DriverStatus,
    VehicleTypeDetailed as VehicleType,
    TransportAssignment
} from '../../Types';

@Injectable({
    providedIn: 'root'
})
export class VehiclesAndDriversService {
    // Mock data - En una aplicación real vendría de una API
    private mockVehicles: VehicleDetails[] = [
        {
            id: 'vehicle-1',
            licensePlate: 'ABC-123',
            brand: 'Toyota',
            model: 'Hiace',
            year: 2022,
            type: 'van',
            capacity: 12,
            status: 'available',
            photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
            color: 'Blanco',
            features: ['Aire acondicionado', 'WiFi', 'USB', 'Música'],
            fuelType: 'gasoline',
            mileage: 45000,
            lastMaintenance: new Date('2024-06-15'),
            documents: {
                soat: 'valid',
                technicalReview: 'valid',
                circulation: 'valid'
            },
            maintenanceHistory: [],
            tripHistory: []
        },
        {
            id: 'vehicle-2',
            licensePlate: 'DEF-456',
            brand: 'Ford',
            model: 'Transit',
            year: 2021,
            type: 'van',
            capacity: 15,
            status: 'available',
            photo: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
            color: 'Azul',
            features: ['Aire acondicionado', 'GPS', 'Asientos reclinables'],
            fuelType: 'diesel',
            mileage: 52000,
            lastMaintenance: new Date('2024-05-20'),
            documents: {
                soat: 'valid',
                technicalReview: 'valid',
                circulation: 'valid'
            },
            maintenanceHistory: [],
            tripHistory: []
        },
        {
            id: 'vehicle-3',
            licensePlate: 'GHI-789',
            brand: 'Chevrolet',
            model: 'Aveo',
            year: 2020,
            type: 'carro',
            capacity: 4,
            status: 'busy',
            photo: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop',
            color: 'Rojo',
            features: ['Aire acondicionado', 'Música', 'GPS'],
            fuelType: 'gasoline',
            mileage: 78000,
            lastMaintenance: new Date('2024-04-10'),
            documents: {
                soat: 'valid',
                technicalReview: 'valid',
                circulation: 'valid'
            },
            maintenanceHistory: [],
            tripHistory: []
        }
    ];

    private mockDrivers: DriverDetails[] = [
        {
            id: 'driver-1',
            name: 'Carlos Mendoza',
            photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            licenseNumber: 'LIC-12345',
            licenseExpiry: new Date('2025-12-31'),
            phone: '+51 987 654 321',
            email: 'carlos.mendoza@email.com',
            status: 'available',
            rating: 4.8,
            totalTrips: 156,
            yearsExperience: 8,
            languages: ['Español', 'Inglés'],
            emergencyContact: {
                name: 'María Mendoza',
                phone: '+51 987 123 456',
                relationship: 'Esposa'
            },
            address: 'Av. Principal 123, Lima',
            dateOfBirth: new Date('1985-03-15'),
            hireDate: new Date('2020-01-15'),
            vehicleTypes: ['carro', 'van'],
            reviews: [],
            tripHistory: [],
            documents: {
                license: 'valid',
                criminalRecord: 'valid',
                medicalCertificate: 'valid'
            }
        },
        {
            id: 'driver-2',
            name: 'Ana García',
            photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face',
            licenseNumber: 'LIC-67890',
            licenseExpiry: new Date('2026-06-30'),
            phone: '+51 987 111 222',
            email: 'ana.garcia@email.com',
            status: 'available',
            rating: 4.9,
            totalTrips: 203,
            yearsExperience: 12,
            languages: ['Español', 'Inglés', 'Francés'],
            emergencyContact: {
                name: 'Luis García',
                phone: '+51 987 333 444',
                relationship: 'Hermano'
            },
            address: 'Jr. Los Andes 456, Lima',
            dateOfBirth: new Date('1980-07-22'),
            hireDate: new Date('2018-03-10'),
            vehicleTypes: ['van', 'bus'],
            reviews: [],
            tripHistory: [],
            documents: {
                license: 'valid',
                criminalRecord: 'valid',
                medicalCertificate: 'valid'
            }
        },
        {
            id: 'driver-3',
            name: 'Roberto Silva',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            licenseNumber: 'LIC-11111',
            licenseExpiry: new Date('2024-12-31'),
            phone: '+51 987 555 666',
            email: 'roberto.silva@email.com',
            status: 'busy',
            rating: 4.6,
            totalTrips: 89,
            yearsExperience: 5,
            languages: ['Español'],
            emergencyContact: {
                name: 'Carmen Silva',
                phone: '+51 987 777 888',
                relationship: 'Madre'
            },
            address: 'Calle Libertad 789, Lima',
            dateOfBirth: new Date('1990-11-05'),
            hireDate: new Date('2022-06-01'),
            vehicleTypes: ['carro'],
            reviews: [],
            tripHistory: [],
            documents: {
                license: 'valid',
                criminalRecord: 'valid',
                medicalCertificate: 'valid'
            }
        }
    ];

    // Signals para estado reactivo
    private vehiclesSignal = signal<VehicleDetails[]>(this.mockVehicles);
    private driversSignal = signal<DriverDetails[]>(this.mockDrivers);

    // Observables públicos
    get vehicles$(): Observable<VehicleDetails[]> {
        return of(this.vehiclesSignal());
    }

    get drivers$(): Observable<DriverDetails[]> {
        return of(this.driversSignal());
    }

    // Métodos para obtener vehículos
    getAvailableVehicles(): Observable<VehicleDetails[]> {
        const availableVehicles = this.mockVehicles.filter(vehicle => vehicle.status === 'available');
        return of(availableVehicles).pipe(delay(300));
    }

    getVehicleById(id: string): Observable<VehicleDetails | null> {
        const vehicle = this.mockVehicles.find(v => v.id === id);
        return of(vehicle || null).pipe(delay(200));
    }

    getVehiclesByType(type: VehicleType): Observable<VehicleDetails[]> {
        const vehicles = this.mockVehicles.filter(vehicle => vehicle.type === type);
        return of(vehicles).pipe(delay(300));
    }

    // Métodos para obtener conductores
    getAvailableDrivers(): Observable<DriverDetails[]> {
        const availableDrivers = this.mockDrivers.filter(driver => driver.status === 'available');
        return of(availableDrivers).pipe(delay(300));
    }

    getDriverById(id: string): Observable<DriverDetails | null> {
        const driver = this.mockDrivers.find(d => d.id === id);
        return of(driver || null).pipe(delay(200));
    }

    getDriversForVehicleType(vehicleType: VehicleType): Observable<DriverDetails[]> {
        const drivers = this.mockDrivers.filter(driver =>
            driver.status === 'available' &&
            driver.vehicleTypes.includes(vehicleType)
        );
        return of(drivers).pipe(delay(300));
    }

    // Métodos para obtener conductores y vehículos compatibles
    getCompatibleResources(vehicleType?: VehicleType): Observable<{ vehicles: VehicleDetails[], drivers: DriverDetails[] }> {
        let vehicles = this.mockVehicles.filter(v => v.status === 'available');
        let drivers = this.mockDrivers.filter(d => d.status === 'available');

        if (vehicleType) {
            vehicles = vehicles.filter(v => v.type === vehicleType);
            drivers = drivers.filter(d => d.vehicleTypes.includes(vehicleType));
        }

        return of({ vehicles, drivers }).pipe(delay(400));
    }

    // Métodos para asignación
    assignTransportResources(requestId: string, vehicleId: string, driverId: string): Observable<boolean> {
        // Simular API call
        return new Observable(observer => {
            setTimeout(() => {
                // Actualizar estado de vehículo y conductor
                const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
                const driver = this.mockDrivers.find(d => d.id === driverId);

                if (vehicle && driver) {
                    vehicle.status = 'busy';
                    driver.status = 'busy';

                    // Actualizar signals
                    this.vehiclesSignal.set([...this.mockVehicles]);
                    this.driversSignal.set([...this.mockDrivers]);

                    observer.next(true);
                } else {
                    observer.next(false);
                }
                observer.complete();
            }, 1000);
        });
    }

    // Método para liberar recursos
    releaseTransportResources(vehicleId: string, driverId: string): Observable<boolean> {
        return new Observable(observer => {
            setTimeout(() => {
                const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
                const driver = this.mockDrivers.find(d => d.id === driverId);

                if (vehicle && driver) {
                    vehicle.status = 'available';
                    driver.status = 'available';

                    // Actualizar signals
                    this.vehiclesSignal.set([...this.mockVehicles]);
                    this.driversSignal.set([...this.mockDrivers]);

                    observer.next(true);
                } else {
                    observer.next(false);
                }
                observer.complete();
            }, 500);
        });
    }

    // Métodos de utilidad
    updateVehicleStatus(vehicleId: string, status: VehicleStatus): Observable<boolean> {
        const vehicle = this.mockVehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            vehicle.status = status;
            this.vehiclesSignal.set([...this.mockVehicles]);
            return of(true).pipe(delay(200));
        }
        return of(false);
    }

    updateDriverStatus(driverId: string, status: DriverStatus): Observable<boolean> {
        const driver = this.mockDrivers.find(d => d.id === driverId);
        if (driver) {
            driver.status = status;
            this.driversSignal.set([...this.mockDrivers]);
            return of(true).pipe(delay(200));
        }
        return of(false);
    }

    // Métodos para crear nuevos recursos
    addVehicle(vehicleData: Omit<VehicleDetails, 'id'>): Observable<VehicleDetails> {
        return new Observable(observer => {
            setTimeout(() => {
                const newVehicle: VehicleDetails = {
                    ...vehicleData,
                    id: `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                };

                this.mockVehicles.push(newVehicle);
                this.vehiclesSignal.set([...this.mockVehicles]);

                observer.next(newVehicle);
                observer.complete();
            }, 1000);
        });
    }

    addDriver(driverData: Omit<DriverDetails, 'id'>): Observable<DriverDetails> {
        return new Observable(observer => {
            setTimeout(() => {
                const newDriver: DriverDetails = {
                    ...driverData,
                    id: `driver-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                };

                this.mockDrivers.push(newDriver);
                this.driversSignal.set([...this.mockDrivers]);

                observer.next(newDriver);
                observer.complete();
            }, 1000);
        });
    }
}
