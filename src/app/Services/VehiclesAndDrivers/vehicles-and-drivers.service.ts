import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, map, catchError, throwError, switchMap } from 'rxjs';
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
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class VehiclesAndDriversService {
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = environment.apiUrl;

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
                console.log('Vehículos obtenidos del backend:', vehicles.length);
                return vehicles;
            }),
            catchError(error => {
                console.error('Error obteniendo lista de vehículos:', error);
                return of([]); // Retornar array vacío en caso de error
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

    // Métodos para obtener conductores y vehículos compatibles - INTEGRACIÓN REAL CON BACKEND
    getCompatibleResources(vehicleType?: VehicleType): Observable<{ vehicles: VehicleDetails[], drivers: DriverDetails[] }> {
        const vehiclesQuery = vehicleType ? `?status=AVAILABLE&vehicleType=${vehicleType}` : '?status=AVAILABLE';
        const driversQuery = vehicleType ? `?status=AVAILABLE&vehicleType=${vehicleType}` : '?status=AVAILABLE';

        const vehicles$ = this.http.get<{data: any[]}>(
            `${this.apiUrl}/vehicles${vehiclesQuery}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => this.mapBackendVehiclesToFrontend(response.data)),
            catchError(error => {
                console.error('Error obteniendo vehículos compatibles:', error);
                return of([]);
            })
        );

        const drivers$ = this.http.get<{data: any[]}>(
            `${this.apiUrl}/drivers${driversQuery}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => this.mapBackendDriversToFrontend(response.data)),
            catchError(error => {
                console.error('Error obteniendo conductores compatibles:', error);
                return of([]);
            })
        );

        return vehicles$.pipe(
            switchMap(vehicles => 
                drivers$.pipe(
                    map(drivers => ({ vehicles, drivers }))
                )
            )
        );
    }

    // Métodos para asignación - INTEGRACIÓN REAL CON BACKEND
    assignTransportResources(requestId: string, vehicleId: string, driverId: string): Observable<boolean> {
        // Actualizar estado del vehículo a BUSY
        const vehicleUpdate$ = this.updateVehicleStatus(vehicleId, 'busy');
        
        // Actualizar estado del conductor a BUSY  
        const driverUpdate$ = this.updateDriverStatus(driverId, 'busy');

        return vehicleUpdate$.pipe(
            switchMap(vehicleUpdated => {
                if (!vehicleUpdated) {
                    console.error('Error actualizando estado del vehículo');
                    return of(false);
                }
                
                return driverUpdate$.pipe(
                    map(driverUpdated => {
                        if (!driverUpdated) {
                            console.error('Error actualizando estado del conductor');
                            return false;
                        }
                        
                        console.log(`Recursos asignados exitosamente - Viaje: ${requestId}, Vehículo: ${vehicleId}, Conductor: ${driverId}`);
                        return true;
                    })
                );
            }),
            catchError(error => {
                console.error('Error en asignación de recursos:', error);
                return of(false);
            })
        );
    }

    // Método para liberar recursos - INTEGRACIÓN REAL CON BACKEND
    releaseTransportResources(vehicleId: string, driverId: string): Observable<boolean> {
        // Actualizar estado del vehículo a AVAILABLE
        const vehicleUpdate$ = this.updateVehicleStatus(vehicleId, 'available');
        
        // Actualizar estado del conductor a AVAILABLE
        const driverUpdate$ = this.updateDriverStatus(driverId, 'available');

        return vehicleUpdate$.pipe(
            switchMap(vehicleUpdated => {
                if (!vehicleUpdated) {
                    console.error('Error liberando vehículo');
                    return of(false);
                }
                
                return driverUpdate$.pipe(
                    map(driverUpdated => {
                        if (!driverUpdated) {
                            console.error('Error liberando conductor');
                            return false;
                        }
                        
                        console.log(`Recursos liberados exitosamente - Vehículo: ${vehicleId}, Conductor: ${driverId}`);
                        return true;
                    })
                );
            }),
            catchError(error => {
                console.error('Error en liberación de recursos:', error);
                return of(false);
            })
        );
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

    // Métodos para crear nuevos recursos - INTEGRACIÓN REAL CON BACKEND
    addVehicle(vehicleData: Omit<VehicleDetails, 'id'>): Observable<VehicleDetails> {
        // Mapear datos del frontend al formato del backend
        const backendVehicleData = {
            licensePlate: vehicleData.licensePlate,
            brand: vehicleData.brand,
            model: vehicleData.model,
            year: vehicleData.year,
            vehicleType: vehicleData.type, // frontend: 'carro'/'van'/'bus' -> backend: 'carro'/'van'/'bus'
            capacity: vehicleData.capacity,
            color: vehicleData.color,
            features: vehicleData.features,
            fuelType: vehicleData.fuelType,
            mileage: vehicleData.mileage,
            lastMaintenance: vehicleData.lastMaintenance?.toISOString()
        };

        return this.http.post<any>(
            `${this.apiUrl}/vehicles`,
            backendVehicleData,
            { headers: this.getHeaders() }
        ).pipe(
            map(response => this.mapBackendVehicleToFrontend(response)),
            catchError(error => {
                console.error('Error creando vehículo:', error);
                return throwError(() => error);
            })
        );
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
