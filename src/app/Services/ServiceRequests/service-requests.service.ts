import { Injectable, signal, inject } from '@angular/core';
import { Observable, of, delay, BehaviorSubject, tap, switchMap } from 'rxjs';
import { VehiclesAndDriversService } from '../VehiclesAndDrivers/vehicles-and-drivers.service';
import { GuidesService } from '../Guides/guides.service';
import { GuideDetails } from '../../Types/guide.types';
import { VehicleDetails, DriverDetails } from '../../Types/vehicle.types';

export type ServiceRequestType = 'transport' | 'tourism';
export type ServiceRequestStatus = 'pending' | 'accepted' | 'rejected' | 'assigned' | 'completed' | 'cancelled';

export interface ServiceRequest {
    id: string;
    type: ServiceRequestType;
    status: ServiceRequestStatus;
    title: string;
    description: string;
    clientName: string;
    clientPhone?: string;
    clientEmail?: string;
    origin: string;
    destination: string;
    scheduledDate: Date;
    createdAt: Date;
    price: number;
    currency: string;
    // Información específica para transporte
    estimatedDuration?: number;
    distance?: number;
    vehicleType?: string;
    passengerCount?: number;
    // Información específica para turismo
    groupSize?: number;
    specialRequirements?: string;
    duration?: number; // en horas
    // Información de asignación
    assignedResources?: {
        guideId?: string;
        guideName?: string;
        vehicleId?: string;
        vehiclePlate?: string;
        driverId?: string;
        driverName?: string;
        assignedAt?: Date;
    };
    // Información adicional
    notes?: string;
    cancellationReason?: string;
    cancelledAt?: Date;
    cancelledBy?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ServiceRequestsService {
    private vehiclesAndDriversService = inject(VehiclesAndDriversService);
    private guidesService = inject(GuidesService);

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private serviceRequestsSubject = new BehaviorSubject<ServiceRequest[]>([]);

    public isLoading$ = this.isLoadingSubject.asObservable();
    public serviceRequests$ = this.serviceRequestsSubject.asObservable();

    private mockServiceRequests: ServiceRequest[] = [
        {
            id: 'req-001',
            type: 'transport',
            status: 'pending',
            title: 'Traslado Aeropuerto - Hotel',
            description: 'Traslado desde el aeropuerto internacional hasta hotel en el centro',
            clientName: 'María García',
            clientPhone: '+57 300 123 4567',
            clientEmail: 'maria.garcia@email.com',
            origin: 'Aeropuerto Internacional',
            destination: 'Hotel Plaza Centro',
            scheduledDate: new Date(Date.now() + 86400000), // Mañana
            createdAt: new Date(),
            price: 45.00,
            currency: 'USD',
            estimatedDuration: 45,
            distance: 25.5,
            vehicleType: 'carro',
            passengerCount: 2,
            notes: 'Vuelo llega a las 15:30, favor estar 10 minutos antes en la zona de llegadas'
        },
        {
            id: 'req-002',
            type: 'tourism',
            status: 'pending',
            title: 'Tour Ciudad Histórica',
            description: 'Recorrido guiado por el centro histórico con explicaciones culturales',
            clientName: 'Carlos Rodríguez',
            clientPhone: '+57 301 987 6543',
            clientEmail: 'carlos.rodriguez@email.com',
            origin: 'Plaza Principal',
            destination: 'Catedral Metropolitana',
            scheduledDate: new Date(Date.now() + 172800000), // Pasado mañana
            createdAt: new Date(),
            price: 120.00,
            currency: 'USD',
            groupSize: 4,
            duration: 3,
            specialRequirements: 'Grupo familiar con niños',
            notes: 'Prefieren explicaciones en español, los niños tienen 8 y 12 años'
        },
        {
            id: 'req-003',
            type: 'transport',
            status: 'accepted',
            title: 'Traslado Ejecutivo',
            description: 'Servicio de transporte ejecutivo para reunión de negocios',
            clientName: 'Ana López',
            clientPhone: '+57 302 456 7890',
            clientEmail: 'ana.lopez@company.com',
            origin: 'Hotel Business',
            destination: 'Centro de Convenciones',
            scheduledDate: new Date(Date.now() + 43200000), // En 12 horas
            createdAt: new Date(),
            price: 60.00,
            currency: 'USD',
            estimatedDuration: 30,
            distance: 15.2,
            vehicleType: 'carro',
            passengerCount: 1,
            notes: 'Cliente empresarial VIP, requiere puntualidad estricta'
        },
        {
            id: 'req-004',
            type: 'tourism',
            status: 'pending',
            title: 'Excursión Naturaleza',
            description: 'Tour eco-turístico por senderos naturales con observación de flora y fauna',
            clientName: 'Roberto Martínez',
            origin: 'Centro de Visitantes',
            destination: 'Mirador Natural',
            scheduledDate: new Date(Date.now() + 259200000), // En 3 días
            createdAt: new Date(),
            price: 180.00,
            currency: 'USD',
            groupSize: 6,
            duration: 6,
            specialRequirements: 'Caminata moderada, llevar zapatos cómodos'
        },
        {
            id: 'req-005',
            type: 'transport',
            status: 'accepted',
            title: 'Traslado Familiar',
            description: 'Transporte para familia con equipaje desde hotel a aeropuerto',
            clientName: 'Familia Torres',
            clientPhone: '+57 303 789 0123',
            clientEmail: 'torres.family@email.com',
            origin: 'Hotel Familiar',
            destination: 'Aeropuerto Internacional',
            scheduledDate: new Date(Date.now() + 86400000),
            createdAt: new Date(Date.now() - 3600000), // Hace 1 hora
            price: 55.00,
            currency: 'USD',
            estimatedDuration: 50,
            distance: 28.0,
            vehicleType: 'van',
            passengerCount: 4,
            notes: 'Familia con 2 niños pequeños y mucho equipaje'
        },
        {
            id: 'req-006',
            type: 'tourism',
            status: 'assigned',
            title: 'Tour Gastronómico',
            description: 'Recorrido por los mejores restaurantes y mercados locales',
            clientName: 'Sophie Wilson',
            clientPhone: '+1 555 123 4567',
            clientEmail: 'sophie.wilson@email.com',
            origin: 'Hotel Central',
            destination: 'Mercado Gourmet',
            scheduledDate: new Date(Date.now() + 7200000), // En 2 horas
            createdAt: new Date(Date.now() - 7200000), // Hace 2 horas
            price: 95.00,
            currency: 'USD',
            groupSize: 2,
            duration: 4,
            specialRequirements: 'Una persona es vegetariana',
            notes: 'Turistas internacionales, prefieren explicaciones en inglés',
            assignedResources: {
                guideId: 'guide-001',
                guideName: 'María Elena Rodríguez',
                assignedAt: new Date(Date.now() - 1800000) // Hace 30 minutos
            }
        },
        {
            id: 'req-007',
            type: 'transport',
            status: 'assigned',
            title: 'Servicio Corporativo',
            description: 'Transporte ejecutivo para reunión de negocios importante',
            clientName: 'Empresa TechCorp',
            clientPhone: '+57 304 456 7890',
            clientEmail: 'transport@techcorp.com',
            origin: 'Oficina Central TechCorp',
            destination: 'Centro de Convenciones',
            scheduledDate: new Date(Date.now() + 10800000), // En 3 horas
            createdAt: new Date(Date.now() - 5400000), // Hace 1.5 horas
            price: 85.00,
            currency: 'USD',
            estimatedDuration: 25,
            distance: 12.5,
            vehicleType: 'carro',
            passengerCount: 2,
            notes: 'Ejecutivos VIP, puntualidad crítica',
            assignedResources: {
                vehicleId: 'vehicle-1',
                vehiclePlate: 'ABC-123',
                driverId: 'driver-1',
                driverName: 'Carlos Mendoza',
                assignedAt: new Date(Date.now() - 900000) // Hace 15 minutos
            }
        }
    ];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData(): void {
        this.serviceRequestsSubject.next([...this.mockServiceRequests]);
    }

    /**
     * Obtiene solicitudes de servicio filtradas por tipo de proveedor
     */
    getServiceRequestsByProviderType(providerType: ServiceRequestType): Observable<ServiceRequest[]> {
        this.isLoadingSubject.next(true);

        const filteredRequests = this.mockServiceRequests
            .filter(request => request.type === providerType);

        return of(filteredRequests).pipe(
            delay(600),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Obtiene todas las solicitudes pendientes para un tipo de proveedor
     */
    getPendingRequestsByType(providerType: ServiceRequestType): Observable<ServiceRequest[]> {
        this.isLoadingSubject.next(true);

        const pendingRequests = this.mockServiceRequests
            .filter(request =>
                request.type === providerType &&
                request.status === 'pending'
            );

        return of(pendingRequests).pipe(
            delay(600),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Acepta una solicitud de servicio
     */
    acceptServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const requestIndex = this.mockServiceRequests.findIndex(r => r.id === requestId);

        if (requestIndex !== -1 && this.mockServiceRequests[requestIndex].status === 'pending') {
            this.mockServiceRequests[requestIndex].status = 'accepted';
            this.initializeMockData();

            return of(true).pipe(
                delay(800),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        return of(false).pipe(
            delay(800),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Rechaza una solicitud de servicio
     */
    rejectServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const requestIndex = this.mockServiceRequests.findIndex(r => r.id === requestId);

        if (requestIndex !== -1 && this.mockServiceRequests[requestIndex].status === 'pending') {
            this.mockServiceRequests[requestIndex].status = 'rejected';
            this.initializeMockData();

            return of(true).pipe(
                delay(800),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        return of(false).pipe(
            delay(800),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Obtiene una solicitud específica por ID
     */
    getServiceRequestById(requestId: string): Observable<ServiceRequest | null> {
        this.isLoadingSubject.next(true);

        const request = this.mockServiceRequests.find(r => r.id === requestId);

        return of(request || null).pipe(
            delay(400),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Asigna recursos a una solicitud aceptada
     * Para turismo: asigna guía y actualiza su estado a 'busy'
     * Para transporte: asigna vehículo y conductor, actualiza ambos estados a 'busy'
     */
    assignResources(requestId: string, resourceIds: { guideId?: string; vehicleId?: string; driverId?: string }): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const requestIndex = this.mockServiceRequests.findIndex(r => r.id === requestId);

        if (requestIndex === -1 || this.mockServiceRequests[requestIndex].status !== 'accepted') {
            return of(false).pipe(
                delay(1000),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        const request = this.mockServiceRequests[requestIndex];

        // Asignar recursos según el tipo de servicio
        if (request.type === 'tourism' && resourceIds.guideId) {
            // Para turismo: asignar guía
            return this.guidesService.getGuideById(resourceIds.guideId).pipe(
                switchMap((guide: GuideDetails | null) => {
                    if (guide) {
                        return this.guidesService.updateGuideStatus(resourceIds.guideId!, 'busy').pipe(
                            switchMap((guideStatusUpdated) => {
                                if (guideStatusUpdated) {
                                    // Actualizar estado de la solicitud y guardar información del guía
                                    this.mockServiceRequests[requestIndex].status = 'assigned';
                                    this.mockServiceRequests[requestIndex].assignedResources = {
                                        guideId: guide.id,
                                        guideName: guide.name,
                                        assignedAt: new Date()
                                    };
                                    this.initializeMockData();

                                    console.log(`Guía ${guide.name} asignado y marcado como ocupado para solicitud ${requestId}`);
                                    return of(true);
                                } else {
                                    console.error('Error al actualizar estado del guía');
                                    return of(false);
                                }
                            })
                        );
                    } else {
                        console.error('Guía no encontrado');
                        return of(false);
                    }
                }),
                delay(1000),
                tap(() => this.isLoadingSubject.next(false))
            );
        } else if (request.type === 'transport' && resourceIds.vehicleId && resourceIds.driverId) {
            // Para transporte: asignar vehículo y conductor
            return this.vehiclesAndDriversService.getVehicleById(resourceIds.vehicleId).pipe(
                switchMap((vehicle: VehicleDetails | null) => {
                    if (vehicle) {
                        return this.vehiclesAndDriversService.getDriverById(resourceIds.driverId!).pipe(
                            switchMap((driver: DriverDetails | null) => {
                                if (driver) {
                                    return this.vehiclesAndDriversService.assignTransportResources(requestId, resourceIds.vehicleId!, resourceIds.driverId!).pipe(
                                        switchMap((transportAssigned) => {
                                            if (transportAssigned) {
                                                // Actualizar estado de la solicitud y guardar información de recursos
                                                this.mockServiceRequests[requestIndex].status = 'assigned';
                                                this.mockServiceRequests[requestIndex].assignedResources = {
                                                    vehicleId: vehicle.id,
                                                    vehiclePlate: vehicle.licensePlate,
                                                    driverId: driver.id,
                                                    driverName: driver.name,
                                                    assignedAt: new Date()
                                                };
                                                this.initializeMockData();

                                                console.log(`Vehículo ${vehicle.licensePlate} y conductor ${driver.name} asignados para solicitud ${requestId}`);
                                                return of(true);
                                            } else {
                                                console.error('Error al asignar recursos de transporte');
                                                return of(false);
                                            }
                                        })
                                    );
                                } else {
                                    console.error('Conductor no encontrado');
                                    return of(false);
                                }
                            })
                        );
                    } else {
                        console.error('Vehículo no encontrado');
                        return of(false);
                    }
                }),
                delay(1000),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        // Si no se cumplen las condiciones, retornar false
        return of(false).pipe(
            delay(1000),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Marca una solicitud como completada y libera los recursos asignados
     */
    completeServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const requestIndex = this.mockServiceRequests.findIndex(r => r.id === requestId);

        if (requestIndex === -1 || this.mockServiceRequests[requestIndex].status !== 'assigned') {
            return of(false).pipe(
                delay(600),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        const request = this.mockServiceRequests[requestIndex];

        // TODO: En una implementación real, necesitaríamos guardar los IDs de los recursos
        // asignados en la solicitud para poder liberarlos aquí
        // Por ahora, solo cambiamos el estado de la solicitud

        this.mockServiceRequests[requestIndex].status = 'completed';
        this.initializeMockData();

        console.log(`Solicitud ${requestId} completada. Los recursos deberían ser liberados automáticamente.`);

        return of(true).pipe(
            delay(600),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Cancela una solicitud de servicio y libera recursos si están asignados
     */
    cancelServiceRequest(requestId: string, reason: string, cancelledBy: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const requestIndex = this.mockServiceRequests.findIndex(r => r.id === requestId);

        if (requestIndex === -1) {
            return of(false).pipe(
                delay(600),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        const request = this.mockServiceRequests[requestIndex];

        // Solo se pueden cancelar solicitudes que no estén completadas o ya canceladas
        if (request.status === 'completed' || request.status === 'cancelled') {
            return of(false).pipe(
                delay(600),
                tap(() => this.isLoadingSubject.next(false))
            );
        }

        // Si la solicitud está asignada, necesitamos liberar los recursos
        if (request.status === 'assigned' && request.assignedResources) {
            const resources = request.assignedResources;

            if (request.type === 'tourism' && resources.guideId) {
                // Liberar guía
                return this.guidesService.releaseGuide(resources.guideId).pipe(
                    switchMap((guideReleased) => {
                        if (guideReleased) {
                            // Actualizar solicitud como cancelada
                            this.mockServiceRequests[requestIndex].status = 'cancelled';
                            this.mockServiceRequests[requestIndex].cancellationReason = reason;
                            this.mockServiceRequests[requestIndex].cancelledAt = new Date();
                            this.mockServiceRequests[requestIndex].cancelledBy = cancelledBy;
                            this.initializeMockData();

                            console.log(`Solicitud ${requestId} cancelada. Guía ${resources.guideId} liberado.`);
                            return of(true);
                        } else {
                            console.error('Error al liberar guía durante cancelación');
                            return of(false);
                        }
                    }),
                    delay(800),
                    tap(() => this.isLoadingSubject.next(false))
                );
            } else if (request.type === 'transport' && resources.vehicleId && resources.driverId) {
                // Liberar vehículo y conductor
                return this.vehiclesAndDriversService.releaseTransportResources(resources.vehicleId, resources.driverId).pipe(
                    switchMap((transportReleased) => {
                        if (transportReleased) {
                            // Actualizar solicitud como cancelada
                            this.mockServiceRequests[requestIndex].status = 'cancelled';
                            this.mockServiceRequests[requestIndex].cancellationReason = reason;
                            this.mockServiceRequests[requestIndex].cancelledAt = new Date();
                            this.mockServiceRequests[requestIndex].cancelledBy = cancelledBy;
                            this.initializeMockData();

                            console.log(`Solicitud ${requestId} cancelada. Vehículo ${resources.vehicleId} y conductor ${resources.driverId} liberados.`);
                            return of(true);
                        } else {
                            console.error('Error al liberar recursos de transporte durante cancelación');
                            return of(false);
                        }
                    }),
                    delay(800),
                    tap(() => this.isLoadingSubject.next(false))
                );
            }
        }

        // Si no hay recursos asignados, simplemente cancelar
        this.mockServiceRequests[requestIndex].status = 'cancelled';
        this.mockServiceRequests[requestIndex].cancellationReason = reason;
        this.mockServiceRequests[requestIndex].cancelledAt = new Date();
        this.mockServiceRequests[requestIndex].cancelledBy = cancelledBy;
        this.initializeMockData();

        console.log(`Solicitud ${requestId} cancelada.`);

        return of(true).pipe(
            delay(600),
            tap(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }
}
