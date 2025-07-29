import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, map, catchError, throwError } from 'rxjs';
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
import { generateUniqueId } from '../../Utils/form-validation.utils';
import { AuthService } from '../Auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class VehiclesAndDriversService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = 'http://localhost:3000/api';

    // Headers con autenticación JWT
    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Métodos de mapeo para convertir datos del backend al formato del frontend
    private mapBackendVehicleToFrontend(backendVehicle: any): VehicleDetails {
        return {
            id: backendVehicle.id,
            licensePlate: backendVehicle.licensePlate,
            brand: backendVehicle.brand,
            model: backendVehicle.model,
            year: backendVehicle.year,
            type: this.mapVehicleTypeFromBackend(backendVehicle.vehicleType),
            capacity: backendVehicle.capacity,
            status: this.mapVehicleStatusFromBackend(backendVehicle.status),
            photo: backendVehicle.photo || 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop',
            color: backendVehicle.color || 'No especificado',
            features: backendVehicle.features || [],
            fuelType: backendVehicle.fuelType || 'gasoline',
            mileage: backendVehicle.mileage || 0,
            lastMaintenance: backendVehicle.lastMaintenance ? new Date(backendVehicle.lastMaintenance) : new Date(),
            documents: {
                soat: 'valid',
                technicalReview: 'valid',
                circulation: 'valid'
            },
            maintenanceHistory: [],
            tripHistory: backendVehicle.travels || []
        };
    }

    private mapBackendVehiclesToFrontend(backendVehicles: any[]): VehicleDetails[] {
        if (!backendVehicles || !Array.isArray(backendVehicles)) {
            return [];
        }
        return backendVehicles.map(vehicle => this.mapBackendVehicleToFrontend(vehicle));
    }

    private mapVehicleTypeFromBackend(backendType: string): VehicleType {
        const typeMap: { [key: string]: VehicleType } = {
            'carro': 'carro',
            'van': 'van',
            'bus': 'bus'
        };
        return typeMap[backendType] || 'carro';
    }

    private mapVehicleStatusFromBackend(backendStatus: string): VehicleStatus {
        const statusMap: { [key: string]: VehicleStatus } = {
            'AVAILABLE': 'available',
            'BUSY': 'busy',
            'MAINTENANCE': 'maintenance',
            'INACTIVE': 'inactive'
        };
        return statusMap[backendStatus] || 'available';
    }

    private mapVehicleStatusToBackend(frontendStatus: VehicleStatus): string {
        const statusMap: { [key: string]: string } = {
            'available': 'AVAILABLE',
            'busy': 'BUSY',
            'maintenance': 'MAINTENANCE',
            'inactive': 'INACTIVE'
        };
        return statusMap[frontendStatus] || 'AVAILABLE';
    }

    // Métodos de mapeo para convertir datos del backend de conductores al formato del frontend
    private mapBackendDriverToFrontend(backendDriver: any): DriverDetails {
        return {
            id: backendDriver.id,
            name: backendDriver.fullName,
            licenseNumber: backendDriver.license,
            licenseExpiry: new Date(backendDriver.licenseExpiry),
            phone: backendDriver.phone,
            email: backendDriver.email || '',
            address: backendDriver.address || '',
            dateOfBirth: backendDriver.dateOfBirth ? new Date(backendDriver.dateOfBirth) : undefined,
            hireDate: new Date(backendDriver.hiredAt),
            status: this.mapDriverStatusFromBackend(backendDriver.status),
            vehicleTypes: this.mapVehicleTypesFromBackend(backendDriver.vehicleTypes),
            yearsExperience: backendDriver.experienceYears,
            languages: backendDriver.languages || [],
            rating: backendDriver.rating || 0,
            totalTrips: backendDriver.completedTravels || 0,
            photo: backendDriver.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            reviews: [],
            tripHistory: backendDriver.travels?.map((travel: any) => travel.id) || [],
            documents: {
                license: 'valid',
                criminalRecord: 'valid',
                medicalCertificate: 'valid'
            }
        };
    }

    private mapBackendDriversToFrontend(backendDrivers: any[]): DriverDetails[] {
        if (!backendDrivers || !Array.isArray(backendDrivers)) {
            return [];
        }
        return backendDrivers.map(driver => this.mapBackendDriverToFrontend(driver));
    }

    private mapDriverStatusFromBackend(backendStatus: string): DriverStatus {
        const statusMap: { [key: string]: DriverStatus } = {
            'AVAILABLE': 'available',
            'BUSY': 'busy',
            'OFFLINE': 'offline',
            'INACTIVE': 'inactive'
        };
        return statusMap[backendStatus] || 'available';
    }

    private mapDriverStatusToBackend(frontendStatus: DriverStatus): string {
        const statusMap: { [key: string]: string } = {
            'available': 'AVAILABLE',
            'busy': 'BUSY',
            'offline': 'OFFLINE',
            'inactive': 'INACTIVE'
        };
        return statusMap[frontendStatus] || 'AVAILABLE';
    }

    private mapVehicleTypesFromBackend(backendTypes: string[]): VehicleType[] {
        if (!backendTypes || !Array.isArray(backendTypes)) {
            return [];
        }
        return backendTypes.map(type => {
            const typeMap: { [key: string]: VehicleType } = {
                'CAR': 'carro',
                'VAN': 'van',
                'BUS': 'bus',
                'MINIBUS': 'van'
            };
            return typeMap[type] || 'carro';
        });
    }

    private mapVehicleTypesToBackend(frontendTypes: VehicleType[]): string[] {
        if (!frontendTypes || !Array.isArray(frontendTypes)) {
            return [];
        }
        return frontendTypes.map(type => {
            const typeMap: { [key: string]: string } = {
                'carro': 'CAR',
                'van': 'VAN',
                'bus': 'BUS'
            };
            return typeMap[type] || 'CAR';
        });
    }

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

    // Observables públicos - INTEGRACIÓN REAL CON BACKEND
    get vehicles$(): Observable<VehicleDetails[]> {
        return this.http.get<{data: any[], pagination: any}>(
            `${this.apiUrl}/vehicles`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                let vehicles: VehicleDetails[] = [];
                if (response.data && Array.isArray(response.data)) {
                    vehicles = response.data.map(vehicle => this.mapBackendVehicleToFrontend(vehicle));
                }
                this.vehiclesSignal.set(vehicles); // Actualizar signal para compatibilidad
                return vehicles;
            }),
            catchError(error => {
                console.error('Error obteniendo lista de vehículos:', error);
                return of(this.vehiclesSignal()); // Fallback a datos locales si hay error
            })
        );
    }

    get drivers$(): Observable<DriverDetails[]> {
        return this.http.get<any>(
            `${this.apiUrl}/drivers`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                if (!response || !response.data || !Array.isArray(response.data)) {
                    return [];
                }
                return this.mapBackendDriversToFrontend(response.data);
            }),
            catchError(error => {
                console.error('Error obteniendo conductores:', error);
                return of([]);
            })
        );
    }

    // Métodos para obtener vehículos - INTEGRACIÓN REAL CON BACKEND
    getAvailableVehicles(): Observable<VehicleDetails[]> {
        return this.http.get<VehicleDetails[]>(
            `${this.apiUrl}/vehicles/available`,
            { headers: this.getHeaders() }
        ).pipe(
            map(vehicles => {
                if (!vehicles || !Array.isArray(vehicles)) {
                    return [];
                }
                return vehicles.map(vehicle => this.mapBackendVehicleToFrontend(vehicle));
            }),
            catchError(error => {
                console.error('Error obteniendo vehículos disponibles:', error);
                return throwError(() => error);
            })
        );
    }

    getVehicleById(id: string): Observable<VehicleDetails | null> {
        return this.http.get<any>(
            `${this.apiUrl}/vehicles/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(vehicle => this.mapBackendVehicleToFrontend(vehicle)),
            catchError(error => {
                if (error.status === 404) {
                    return of(null);
                }
                console.error('Error obteniendo vehículo por ID:', error);
                return throwError(() => error);
            })
        );
    }

    getVehiclesByType(type: VehicleType): Observable<VehicleDetails[]> {
        return this.http.get<{data: any[], pagination: any}>(
            `${this.apiUrl}/vehicles?type=${type}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                if (!response.data || !Array.isArray(response.data)) {
                    return [];
                }
                return response.data.map(vehicle => this.mapBackendVehicleToFrontend(vehicle));
            }),
            catchError(error => {
                console.error('Error obteniendo vehículos por tipo:', error);
                return throwError(() => error);
            })
        );
    }

    // Métodos para obtener conductores - INTEGRACIÓN REAL CON BACKEND
    getAvailableDrivers(): Observable<DriverDetails[]> {
        return this.http.get<any>(
            `${this.apiUrl}/drivers?status=AVAILABLE`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                if (!response || !response.data || !Array.isArray(response.data)) {
                    return [];
                }
                return this.mapBackendDriversToFrontend(response.data);
            }),
            catchError(error => {
                console.error('Error obteniendo conductores disponibles:', error);
                return of([]);
            })
        );
    }

    getDriverById(id: string): Observable<DriverDetails | null> {
        return this.http.get<any>(
            `${this.apiUrl}/drivers/${id}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(driver => this.mapBackendDriverToFrontend(driver)),
            catchError(error => {
                if (error.status === 404) {
                    return of(null);
                }
                console.error('Error obteniendo conductor por ID:', error);
                return of(null);
            })
        );
    }

    getDriversForVehicleType(vehicleType: VehicleType): Observable<DriverDetails[]> {
        const backendVehicleType = this.mapVehicleTypesToBackend([vehicleType])[0];
        return this.http.get<any>(
            `${this.apiUrl}/drivers?status=AVAILABLE&vehicleType=${backendVehicleType}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                if (!response || !response.data || !Array.isArray(response.data)) {
                    return [];
                }
                return this.mapBackendDriversToFrontend(response.data);
            }),
            catchError(error => {
                console.error('Error obteniendo conductores por tipo de vehículo:', error);
                return of([]);
            })
        );
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

    // Métodos de utilidad - INTEGRACIÓN REAL CON BACKEND
    updateVehicleStatus(vehicleId: string, status: VehicleStatus): Observable<boolean> {
        const backendStatus = this.mapVehicleStatusToBackend(status);
        
        return this.http.patch<any>(
            `${this.apiUrl}/vehicles/${vehicleId}/status`,
            { status: backendStatus },
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                console.log('Estado del vehículo actualizado:', response);
                return true;
            }),
            catchError(error => {
                console.error('Error actualizando estado del vehículo:', error);
                return of(false);
            })
        );
    }

    updateDriverStatus(driverId: string, status: DriverStatus): Observable<boolean> {
        const backendStatus = this.mapDriverStatusToBackend(status);
        
        return this.http.patch<any>(
            `${this.apiUrl}/drivers/${driverId}/status`,
            { status: backendStatus },
            { headers: this.getHeaders() }
        ).pipe(
            map(response => {
                console.log('Estado del conductor actualizado:', response);
                return true;
            }),
            catchError(error => {
                console.error('Error actualizando estado del conductor:', error);
                return of(false);
            })
        );
    }

    // Métodos para crear nuevos recursos
    addVehicle(vehicleData: Omit<VehicleDetails, 'id'>): Observable<VehicleDetails> {
        return new Observable(observer => {
            setTimeout(() => {
                const newVehicle: VehicleDetails = {
                    ...vehicleData,
                    id: generateUniqueId('vehicle')
                };

                this.mockVehicles.push(newVehicle);
                this.vehiclesSignal.set([...this.mockVehicles]);

                observer.next(newVehicle);
                observer.complete();
            }, 1000);
        });
    }

    addDriver(driverData: Omit<DriverDetails, 'id'>): Observable<DriverDetails> {
        // Mapear datos del frontend al formato del backend
        const backendDriverData = {
            fullName: driverData.name,
            license: driverData.licenseNumber,
            licenseExpiry: driverData.licenseExpiry.toISOString(),
            phone: driverData.phone,
            email: driverData.email || undefined,
            address: driverData.address || undefined,
            dateOfBirth: driverData.dateOfBirth?.toISOString() || undefined,
            experienceYears: driverData.yearsExperience,
            languages: driverData.languages,
            vehicleTypes: this.mapVehicleTypesToBackend(driverData.vehicleTypes)
        };

        return this.http.post<any>(
            `${this.apiUrl}/drivers`,
            backendDriverData,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => this.mapBackendDriverToFrontend(response)),
            catchError(error => {
                console.error('Error creando conductor:', error);
                return throwError(() => error);
            })
        );
    }
}
