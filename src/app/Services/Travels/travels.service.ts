import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
        this.initializeMockData();
    }

    // Método auxiliar para obtener headers de autenticación
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Datos mock para simular API
    private mockTravels: Travel[] = [
        {
            id: 'travel-001',
            name: 'Viaje a Aeropuerto Internacional',
            status: 'en-progreso',
            origin: {
                id: 'origin-1',
                name: 'Centro Comercial Plaza',
                address: 'Av. Principal 456',
                type: 'origin'
            },
            destination: {
                id: 'dest-1',
                name: 'Aeropuerto Internacional',
                address: 'Terminal 1, Salidas',
                type: 'destination'
            },
            createdAt: new Date(Date.now() - 600000), // 10 minutos atrás
            scheduledAt: new Date(),
            estimatedDuration: 25,
            distance: 12.5,
            driverId: 'driver-001',
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
        },
        {
            id: 'travel-002',
            name: 'Viaje al Centro Médico',
            status: 'fin-servicio',
            origin: {
                id: 'origin-2',
                name: 'Residencial Los Pinos',
                address: 'Calle 15 #234',
                type: 'origin'
            },
            destination: {
                id: 'dest-2',
                name: 'Centro Médico San José',
                address: 'Av. Salud 123',
                type: 'destination'
            },
            createdAt: new Date(Date.now() - 86400000), // 1 día atrás
            scheduledAt: new Date(Date.now() - 82800000),
            completedAt: new Date(Date.now() - 82200000),
            estimatedDuration: 15,
            distance: 8.2,
            driverId: 'driver-002',
            price: {
                baseFare: 12.00,
                distanceFee: 6.20,
                timeFee: 8.00,
                serviceFee: 2.50,
                taxes: 4.30,
                discount: 2.00,
                total: 31.00,
                currency: 'USD'
            }
        }, {
            id: 'travel-003',
            name: 'Viaje a Universidad Central',
            status: 'solicitud-servicio',
            origin: {
                id: 'origin-3',
                name: 'Casa',
                address: 'Av. Libertad 789',
                type: 'origin'
            },
            destination: {
                id: 'dest-3',
                name: 'Universidad Central',
                address: 'Campus Principal',
                type: 'destination'
            },
            createdAt: new Date(),
            scheduledAt: new Date(Date.now() + 3600000), // 1 hora en el futuro
            estimatedDuration: 20,
            distance: 11.3, price: {
                baseFare: 14.00,
                distanceFee: 7.80,
                timeFee: 10.00,
                serviceFee: 3.00,
                taxes: 5.20,
                discount: 0,
                total: 40.00,
                currency: 'USD'
            }
        }, {
            id: 'travel-004',
            name: 'Viaje Confirmado al Hotel',
            status: 'asignacion-conductor',
            origin: {
                id: 'origin-4',
                name: 'Aeropuerto Internacional',
                address: 'Terminal 2, Llegadas',
                type: 'origin'
            },
            destination: {
                id: 'dest-4',
                name: 'Hotel Plaza Central',
                address: 'Av. Comercial 567',
                type: 'destination'
            },
            createdAt: new Date(Date.now() - 1800000), // 30 minutos atrás
            scheduledAt: new Date(Date.now() + 1800000), // 30 minutos en el futuro
            estimatedDuration: 18,
            distance: 9.7,
            driverId: 'driver-001',
            price: {
                baseFare: 13.00,
                distanceFee: 6.80,
                timeFee: 9.00,
                serviceFee: 2.80,
                taxes: 4.40,
                discount: 0,
                total: 36.00,
                currency: 'USD'
            }
        }, {
            id: 'travel-005',
            name: 'Viaje Cancelado',
            status: 'cancelado-turismo',
            origin: {
                id: 'origin-5',
                name: 'Casa de Familia',
                address: 'Calle Norte 123',
                type: 'origin'
            },
            destination: {
                id: 'dest-5',
                name: 'Centro Comercial Norte',
                address: 'Av. Norte 456',
                type: 'destination'
            },
            createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
            scheduledAt: new Date(Date.now() - 1800000), // Hace 30 minutos
            cancelledAt: new Date(Date.now() - 1200000), // Hace 20 minutos
            estimatedDuration: 22,
            distance: 13.4,
            price: {
                baseFare: 15.00,
                distanceFee: 8.20,
                timeFee: 11.00,
                serviceFee: 3.20,
                taxes: 5.60,
                discount: 0,
                total: 43.00,
                currency: 'USD'
            }
        },
        {
            id: 'travel-006',
            name: 'Viaje en Progreso',
            status: 'en-progreso',
            origin: {
                id: 'origin-6',
                name: 'Oficina Central',
                address: 'Torre Empresarial, Piso 12',
                type: 'origin'
            },
            destination: {
                id: 'dest-6',
                name: 'Restaurante La Terraza',
                address: 'Zona Rosa, Local 45',
                type: 'destination'
            },
            createdAt: new Date(Date.now() - 900000), // 15 minutos atrás
            scheduledAt: new Date(Date.now() - 300000), // 5 minutos atrás
            startedAt: new Date(Date.now() - 300000), // Comenzó hace 5 minutos
            estimatedDuration: 25,
            distance: 14.8,
            driverId: 'driver-002',
            price: {
                baseFare: 16.00,
                distanceFee: 9.40,
                timeFee: 12.50,
                serviceFee: 3.60,
                taxes: 6.20,
                discount: 0,
                total: 47.70,
                currency: 'USD'
            }
        }
    ];

    private mockDrivers: { [key: string]: DriverInfo } = {
        'driver-001': {
            id: 'driver-001',
            name: 'Carlos Mendoza',
            avatar: 'https://via.placeholder.com/80x80?text=CM',
            rating: 4.8,
            totalTrips: 347,
            yearsExperience: 5,
            vehicleInfo: {
                brand: 'Toyota',
                model: 'Corolla',
                year: 2020,
                color: 'Blanco',
                licensePlate: 'ABC-123'
            },
            phone: '+1-555-0123',
            status: 'active'
        },
        'driver-002': {
            id: 'driver-002',
            name: 'María García',
            avatar: 'https://via.placeholder.com/80x80?text=MG',
            rating: 4.9,
            totalTrips: 523,
            yearsExperience: 7,
            vehicleInfo: {
                brand: 'Honda',
                model: 'Civic',
                year: 2021,
                color: 'Azul',
                licensePlate: 'XYZ-789'
            },
            phone: '+1-555-0456',
            status: 'active'
        }
    };

    private initializeMockData(): void {
        const travelsList: TravelListItem[] = this.mockTravels.map(travel => ({
            id: travel.id,
            name: travel.name,
            status: travel.status,
            origin: travel.origin.name,
            destination: travel.destination.name,
            date: travel.scheduledAt || travel.createdAt,
            price: travel.price.total,
            currency: travel.price.currency
        }));

        this.travelsListSubject.next(travelsList);
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

        // Obtener los dos viajes más recientes basados en la fecha
        const recentTravels = this.travelsListSubject.value
            .sort((a, b) => b.date.getTime() - a.date.getTime()) // Ordenar por fecha descendente
            .slice(0, 2); // Tomar solo los primeros 2

        return of(recentTravels).pipe(
            delay(500), // Simular latencia de red más rápida para el header
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
     * Obtiene información de un conductor específico
     */
    getDriverInfo(driverId: string): Observable<DriverInfo | null> {
        this.isLoadingSubject.next(true);

        const driver = this.mockDrivers[driverId];

        return of(driver || null).pipe(
            delay(600)
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
     * Simula la cancelación de un viaje
     */
    cancelTravel(travelId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const travelIndex = this.mockTravels.findIndex(t => t.id === travelId); if (travelIndex !== -1) {
            this.mockTravels[travelIndex].status = 'cancelado-turismo';
            this.initializeMockData(); // Actualizar la lista reactiva

            return of(true).pipe(delay(800));
        } return of(false).pipe(delay(800));
    }

    /**
     * Obtiene los viajes del historial (completed y cancelled)
     */
    getHistoryTravels(): Observable<TravelListItem[]> {
        this.isLoadingSubject.next(true);

        // Filtrar solo viajes finalizados (completados exitosamente o cancelados)
        const historyTravels = this.travelsListSubject.value
            .filter(travel => TravelStatusUtils.isFinishedStatus(travel.status))
            .sort((a, b) => b.date.getTime() - a.date.getTime()); // Ordenar por fecha descendente

        return of(historyTravels).pipe(
            delay(600) // Simular latencia de red
        );
    }    /**
     * Convierte TravelListItem a HistoryTrip para compatibilidad
     */
    private convertToHistoryTrip(travel: TravelListItem, fullTravel?: Travel): HistoryTrip {
        const mockDriver = fullTravel?.driverId ? this.mockDrivers[fullTravel.driverId] : undefined;

        return {
            id: travel.id,
            destination: travel.destination,
            address: fullTravel?.destination.address || 'Dirección no disponible',
            date: travel.date.toISOString().split('T')[0], // Format: YYYY-MM-DD
            time: travel.date.toTimeString().split(' ')[0].substring(0, 5), // Format: HH:MM
            price: travel.price,
            status: travel.status as 'fin-servicio' | 'cancelado-turismo' | 'cancelado-transportista' | 'cancelado-agencia' | 'sin-proveedores',
            driver: {
                name: mockDriver?.name || 'Conductor no asignado',
                rating: mockDriver?.rating || 0
            },
            route: {
                origin: travel.origin,
                destination: travel.destination,
                coordinates: {
                    origin: { lat: 4.6097, lng: -74.0817 }, // Coordenadas mock
                    destination: { lat: 4.7016, lng: -74.1469 }
                }
            },
            // Información adicional del contexto del flujo
            cancellationReason: TravelStatusUtils.isCancelledStatus(travel.status)
                ? TravelStatusUtils.getCancellationReason(travel.status)
                : undefined,
            includesTourismService: false, // Se puede implementar lógica específica
            reportedIncidents: [] // Se puede implementar funcionalidad de reportes
        };
    }    /**
     * Obtiene los viajes del historial en formato HistoryTrip
     */
    getHistoryTripsFormatted(): Observable<HistoryTrip[]> {
        this.isLoadingSubject.next(true);

        // Filtrar solo viajes finalizados (completados exitosamente o cancelados)
        const historyTravels = this.travelsListSubject.value
            .filter(travel => TravelStatusUtils.isFinishedStatus(travel.status))
            .sort((a, b) => b.date.getTime() - a.date.getTime()); // Ordenar por fecha descendente

        // Convertir a formato HistoryTrip
        const historyTrips = historyTravels.map(travel => {
            const fullTravel = this.mockTravels.find(t => t.id === travel.id);
            return this.convertToHistoryTrip(travel, fullTravel);
        });

        return of(historyTrips).pipe(
            delay(600) // Simular latencia de red
        );
    }

    // Métodos privados auxiliares

    private generateRouteUpdates(travel: Travel): RouteUpdate[] {
        const updates: RouteUpdate[] = [];
        const now = Date.now(); switch (travel.status) {
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
                }); updates.push({
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
     * Elimina un viaje por su ID
     */
    deleteTravel(travelId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const travelIndex = this.mockTravels.findIndex(t => t.id === travelId);

        if (travelIndex !== -1) {
            // Eliminar el viaje del array
            this.mockTravels.splice(travelIndex, 1);

            // Actualizar la lista reactiva
            this.initializeMockData();

            return of(true).pipe(delay(500));
        }

        return of(false).pipe(delay(500));
    }
}
