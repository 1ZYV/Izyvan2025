import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TravelMapData, TravelLocation } from '../../Components/TravelMap/travel-map.types';
import { TravelRouteInfo, RouteLocation, RouteUpdate } from '../../Components/TravelRoute/travel-route.types';
import { PriceBreakdown } from '../../Pages/Travels/Show/partials/pricing/price-breakdown-section.component';
import { DriverInfo } from '../../Pages/Travels/Show/partials/driver/driver-info-section.component';
import { TravelStatus, RouteStatus, TravelStatusUtils, HistoryTrip } from '../../Types/travel.types';

// Interfaces para el servicio
export interface Travel {
    id: string;
    name: string;
    status: TravelStatus;
    origin: TravelLocation;
    destination: TravelLocation;
    createdAt: Date;
    scheduledAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    startedAt?: Date;
    driverId?: string;
    estimatedDuration: number;
    distance: number;
    price: PriceBreakdown;
}

export interface TravelDetails extends Travel {
    mapData: TravelMapData;
    routeInfo: TravelRouteInfo;
    driverInfo?: DriverInfo;
}

export interface TravelListItem {
    id: string;
    name: string;
    status: TravelStatus;
    origin: string;
    destination: string;
    date: Date;
    price: number;
    currency: string;
}

@Injectable({
    providedIn: 'root'
})
export class TravelsService {
    // Estado reactivo
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private travelsListSubject = new BehaviorSubject<TravelListItem[]>([]);
    public travelsList$ = this.travelsListSubject.asObservable();

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        // Constructor simplificado - Todos los métodos ahora usan endpoints reales
    }

    // Método auxiliar para obtener headers de autenticación
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Métodos públicos para obtener datos

    /**
     * Obtiene la lista de viajes del usuario
     */
    getTravelsList(): Observable<TravelListItem[]> {
        this.isLoadingSubject.next(true);

        return this.http.get<any[]>(`${this.apiUrl}/travels`, { headers: this.getAuthHeaders() })
            .pipe(
                map(travels => travels.map(travel => ({
                    id: travel.id,
                    name: `${travel.origin} → ${travel.destination}`,
                    status: travel.status as TravelStatus,
                    origin: travel.origin,
                    destination: travel.destination,
                    date: new Date(travel.startDate),
                    price: 0, // Por ahora, hasta que implementemos precios
                    currency: 'USD'
                }))),
                catchError(error => {
                    console.error('Error obteniendo lista de viajes:', error);
                    // Fallback a datos mock en caso de error
                    return of(this.travelsListSubject.value);
                })
            );
    }

    /**
     * Obtiene los dos viajes más recientes para mostrar en el header
     */
    getRecentTravels(): Observable<TravelListItem[]> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] getRecentTravels() - Eliminando mock, usando endpoint real');

        return this.http.get<any>(`${this.apiUrl}/travels/recent?limit=2`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Respuesta recientes:', response);
                    const travels = response.data || response;
                    
                    return travels.map((travel: any) => ({
                        id: travel.id,
                        name: `${travel.origin} → ${travel.destination}`,
                        status: travel.status as TravelStatus,
                        origin: travel.origin,
                        destination: travel.destination,
                        date: new Date(travel.createdAt),
                        price: 45.50, // Valor temporal hasta implementar pricing
                        currency: 'USD'
                    } as TravelListItem));
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error obteniendo viajes recientes:', error);
                    this.isLoadingSubject.next(false);
                    return of([]); // Retornar array vacío en caso de error
                })
            );
    }

    /**
     * Obtiene los detalles completos de un viaje específico
     */
    getTravelDetails(travelId: string): Observable<TravelDetails | null> {
        this.isLoadingSubject.next(true);

        return this.http.get<any>(`${this.apiUrl}/travels/${travelId}`, { headers: this.getAuthHeaders() })
            .pipe(
                map(travel => {
                    if (!travel) return null;
                    
                    // Mapear la respuesta del backend al formato esperado por el frontend
                    const travelDetails: TravelDetails = {
                        id: travel.id,
                        name: `${travel.origin} → ${travel.destination}`,
                        status: travel.status as TravelStatus,
                        origin: {
                            id: 'origin-' + travel.id,
                            name: travel.origin,
                            address: travel.origin,
                            type: 'origin'
                        },
                        destination: {
                            id: 'dest-' + travel.id,
                            name: travel.destination,
                            address: travel.destination,
                            type: 'destination'
                        },
                        createdAt: new Date(travel.createdAt),
                        scheduledAt: new Date(travel.startDate),
                        estimatedDuration: 25, // Valor por defecto hasta implementar cálculo
                        distance: 10, // Valor por defecto hasta implementar cálculo
                        price: {
                            baseFare: 15.00,
                            distanceFee: 8.50,
                            timeFee: 12.00,
                            serviceFee: 3.50,
                            taxes: 6.50,
                            discount: 0,
                            total: 45.50,
                            currency: 'USD'
                        },
                        mapData: {
                            id: travel.id,
                            origin: {
                                id: 'origin-' + travel.id,
                                name: travel.origin,
                                address: travel.origin,
                                type: 'origin'
                            },
                            destination: {
                                id: 'dest-' + travel.id,
                                name: travel.destination,
                                address: travel.destination,
                                type: 'destination'
                            },
                            estimatedDuration: 25,
                            distance: 10,
                            routeStatus: this.mapRouteStatus(travel.status as TravelStatus)
                        },
                        routeInfo: {
                            id: travel.id,
                            origin: {
                                id: 'origin-' + travel.id,
                                name: travel.origin,
                                address: travel.origin,
                                type: 'origin'
                            },
                            destination: {
                                id: 'dest-' + travel.id,
                                name: travel.destination,
                                address: travel.destination,
                                type: 'destination'
                            },
                            updates: [], // Por ahora vacío hasta implementar actualizaciones
                            estimatedDuration: 25,
                            distance: 10,
                            status: this.mapRouteStatus(travel.status as TravelStatus)
                        }
                    };
                    
                    return travelDetails;
                }),
                catchError(error => {
                    console.error('Error obteniendo detalles del viaje:', error);
                    this.isLoadingSubject.next(false);
                    return of(null);
                })
            );
    }

    /**
     * Obtiene información de un conductor específico usando endpoint real
     */
    getDriverInfo(driverId: string): Observable<DriverInfo | null> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] getDriverInfo() - Eliminando mock, usando endpoint real');

        return this.http.get<any>(`${this.apiUrl}/drivers/${driverId}`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Respuesta driver:', response);
                    const driver = response.data || response;
                    
                    return {
                        id: driver.id,
                        name: driver.fullName || driver.name,
                        avatar: driver.avatar || 'https://via.placeholder.com/80x80?text=' + (driver.fullName?.[0] || 'D'),
                        rating: driver.rating || 0,
                        totalTrips: driver.totalTrips || 0,
                        license: driver.license || driver.licenseNumber,
                        yearsExperience: driver.experienceYears || driver.yearsExperience || 0,
                        vehicleInfo: {
                            brand: 'Honda', // Temporal hasta implementar relaciones vehículo
                            model: 'Civic',
                            year: 2021,
                            color: 'Azul',
                            licensePlate: 'XYZ-789'
                        },
                        phone: driver.phone,
                        status: driver.status === 'AVAILABLE' ? 'active' : 'inactive'
                    } as DriverInfo;
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error obteniendo información del conductor:', error);
                    this.isLoadingSubject.next(false);
                    return of(null);
                })
            );
    }

    /**
     * Crea un nuevo viaje usando el endpoint del backend
     */
    createTravel(travelData: Partial<Travel>): Observable<Travel> {
        this.isLoadingSubject.next(true);

        // Mapear los datos del frontend al formato esperado por el backend
        const createTravelDto = {
            startDate: travelData.scheduledAt?.toISOString() || new Date().toISOString(),
            origin: travelData.origin?.name || travelData.origin?.address || 'Origen no especificado',
            destination: travelData.destination?.name || travelData.destination?.address || 'Destino no especificado',
            passengersCount: 1, // Valor por defecto
            requirements: 'Viaje creado desde frontend'
        };

        return this.http.post<any>(`${this.apiUrl}/travels`, createTravelDto, { headers: this.getAuthHeaders() })
            .pipe(
                map(travel => ({
                    id: travel.id,
                    name: `${travel.origin} → ${travel.destination}`,
                    status: travel.status as TravelStatus,
                    origin: {
                        id: 'origin-' + travel.id,
                        name: travel.origin,
                        address: travel.origin,
                        type: 'origin'
                    },
                    destination: {
                        id: 'dest-' + travel.id,
                        name: travel.destination,
                        address: travel.destination,
                        type: 'destination'
                    },
                    createdAt: new Date(travel.createdAt),
                    scheduledAt: new Date(travel.startDate),
                    estimatedDuration: 25,
                    distance: 10,
                    price: {
                        baseFare: 15.00,
                        distanceFee: 8.50,
                        timeFee: 12.00,
                        serviceFee: 3.50,
                        taxes: 6.50,
                        discount: 0,
                        total: 45.50,
                        currency: 'USD'
                    }
                } as Travel)),
                catchError(error => {
                    console.error('Error creando viaje:', error);
                    this.isLoadingSubject.next(false);
                    throw error;
                })
            );
    }

    /**
     * Cancela un viaje usando el endpoint del backend
     */
    cancelTravel(travelId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] cancelTravel() - Eliminando mock, usando endpoint real');

        return this.http.patch<any>(`${this.apiUrl}/travels/${travelId}/cancel`, {}, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Viaje cancelado exitosamente:', response);
                    return true;
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error cancelando viaje:', error);
                    this.isLoadingSubject.next(false);
                    return of(false);
                })
            );
    }

    /**
     * Obtiene los viajes del historial usando endpoint real (completed y cancelled)
     */
    getHistoryTravels(): Observable<TravelListItem[]> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] getHistoryTravels() - Eliminando mock, usando endpoint real');

        return this.http.get<any>(`${this.apiUrl}/history/travels`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Respuesta historial:', response);
                    const travels = response.data || response;
                    
                    return travels.map((travel: any) => ({
                        id: travel.id,
                        name: `${travel.origin} → ${travel.destination}`,
                        status: travel.status as TravelStatus,
                        origin: travel.origin,
                        destination: travel.destination,
                        date: new Date(travel.createdAt),
                        price: 45.50, // Valor temporal hasta implementar pricing
                        currency: 'USD'
                    } as TravelListItem));
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error obteniendo historial de viajes:', error);
                    this.isLoadingSubject.next(false);
                    return of([]);
                })
            );
    }

    /**
     * Obtiene el historial de viajes en formato específico para la página de historial
     */
    getHistoryTripsFormatted(): Observable<HistoryTrip[]> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] getHistoryTripsFormatted() - Eliminando mock, usando endpoint real');

        return this.http.get<any>(`${this.apiUrl}/history/travels`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Respuesta historial formateado:', response);
                    const travels = response.data || response;
                    
                    return travels.map((travel: any) => ({
                        id: travel.id,
                        origin: travel.origin,
                        destination: travel.destination,
                        date: new Date(travel.createdAt).toLocaleDateString(),
                        status: travel.status as TravelStatus,
                        driver: { name: 'Conductor asignado', rating: 4.5 }, // Temporal hasta implementar relación
                        rating: 4.5,
                        price: 45.50,
                        currency: 'USD',
                        duration: '45 min',
                        address: travel.destination, // Usar destino como dirección
                        time: new Date(travel.createdAt).toLocaleTimeString(),
                        route: {
                            origin: travel.origin,
                            destination: travel.destination
                        }
                    } as HistoryTrip));
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error obteniendo historial formateado:', error);
                    this.isLoadingSubject.next(false);
                    return of([]);
                })
            );
    }

    // Métodos privados auxiliares

    private generateRouteUpdates(travel: Travel): RouteUpdate[] {
        const updates: RouteUpdate[] = [];
        const now = Date.now();
        
        switch (travel.status) {
            case 'en-progreso':
            case 'comienzo-viaje':
                updates.push({
                    id: 'update-1',
                    timestamp: new Date(now - 300000), // 5 minutos atrás
                    type: 'info',
                    title: 'Inicio del viaje',
                    description: 'El conductor ha llegado al punto de origen'
                });

                updates.push({
                    id: 'update-2',
                    timestamp: new Date(now - 180000), // 3 minutos atrás
                    type: 'warning',
                    title: 'Tráfico moderado',
                    description: 'Se detecta tráfico moderado en la ruta principal',
                    location: 'Av. Principal',
                    estimatedDelay: 5
                });
                break;

            case 'fin-servicio':
                updates.push({
                    id: 'update-1',
                    timestamp: new Date(travel.createdAt.getTime() + 60000),
                    type: 'info',
                    title: 'Viaje iniciado',
                    description: 'El conductor ha recogido al pasajero'
                });
                
                updates.push({
                    id: 'update-2',
                    timestamp: new Date(travel.completedAt!.getTime() - 120000),
                    type: 'info',
                    title: 'Llegando al destino',
                    description: 'El conductor está llegando al destino'
                });

                updates.push({
                    id: 'update-3',
                    timestamp: travel.completedAt!,
                    type: 'info',
                    title: 'Viaje completado',
                    description: 'El viaje ha sido completado exitosamente'
                });
                break;

            case 'solicitud-servicio':
            case 'eleccion-tarifas':
            case 'procesamiento-transportista':
            case 'asignacion-conductor':
                updates.push({
                    id: 'update-1',
                    timestamp: travel.createdAt, type: 'info',
                    title: 'Viaje programado',
                    description: 'Tu viaje ha sido programado y está esperando confirmación'
                });
                break;
        }

        return updates;
    }

    // Métodos auxiliares para mapear tipos
    private mapRouteStatus(status: TravelStatus): RouteStatus {
        return TravelStatusUtils.mapToRouteStatus(status);
    }

    private mapUpdateType(type: string): 'info' | 'warning' | 'delay' | 'accident' | 'construction' {
        switch (type) {
            case 'success':
                return 'info';
            default:
                return type as 'info' | 'warning' | 'delay' | 'accident' | 'construction';
        }
    }

    // Método para limpiar el estado de loading
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }

    /**
     * Elimina un viaje por su ID usando endpoint real
     */
    deleteTravel(travelId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        console.log('[TravelsService] deleteTravel() - Eliminando mock, usando endpoint real');

        return this.http.delete<any>(`${this.apiUrl}/travels/${travelId}`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => {
                    console.log('[TravelsService] Viaje eliminado exitosamente:', response);
                    return true;
                }),
                tap(() => this.isLoadingSubject.next(false)),
                catchError(error => {
                    console.error('[TravelsService] Error eliminando viaje:', error);
                    this.isLoadingSubject.next(false);
                    return of(false);
                })
            );
    }
}
