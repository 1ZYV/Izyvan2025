import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, BehaviorSubject, forkJoin, map, catchError, finalize, tap } from 'rxjs';
import { AuthService } from '../Auth/auth.service';
import { environment } from '../../../environments/environment';

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
    private http = inject(HttpClient);
    private authService = inject(AuthService);
    private apiUrl = `${environment.apiUrl}/service-requests`;

    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    private serviceRequestsSubject = new BehaviorSubject<ServiceRequest[]>([]);

    public isLoading$ = this.isLoadingSubject.asObservable();
    public serviceRequests$ = this.serviceRequestsSubject.asObservable();

    constructor() { }

    // Headers con autenticación JWT
    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // Mapeos BACKEND (UPPERCASE) -> FRONTEND (lowercase)
    private mapTypeFromBackend(type: string): ServiceRequestType {
        const map: Record<string, ServiceRequestType> = {
            'TRANSPORT': 'transport',
            'TOURISM': 'tourism'
        };
        return map[type] ?? 'transport';
    }

    private mapTypeToBackend(type: ServiceRequestType): string {
        const map: Record<ServiceRequestType, string> = {
            'transport': 'TRANSPORT',
            'tourism': 'TOURISM'
        };
        return map[type];
    }

    private mapStatusFromBackend(status: string): ServiceRequestStatus {
        const map: Record<string, ServiceRequestStatus> = {
            'PENDING': 'pending',
            'ACCEPTED': 'accepted',
            'REJECTED': 'rejected',
            'ASSIGNED': 'assigned',
            'COMPLETED': 'completed',
            'CANCELLED': 'cancelled',
        };
        return map[status] ?? 'pending';
    }

    private mapBackendServiceToFrontend(item: any): ServiceRequest {
        const assignedResources = {
            guideId: item.assignedGuide?.id,
            guideName: item.assignedGuide?.fullName,
            vehicleId: item.assignedVehicle?.id,
            vehiclePlate: item.assignedVehicle?.licensePlate,
            driverId: item.assignedDriver?.id,
            driverName: item.assignedDriver?.fullName,
            assignedAt: item.status === 'ASSIGNED' && item.updatedAt ? new Date(item.updatedAt) : undefined,
        } as ServiceRequest['assignedResources'];

        return {
            id: item.id,
            type: this.mapTypeFromBackend(item.type),
            status: this.mapStatusFromBackend(item.status),
            title: item.title,
            description: item.description,
            clientName: item.clientName,
            clientPhone: item.clientPhone,
            clientEmail: item.clientEmail,
            origin: item.origin,
            destination: item.destination,
            scheduledDate: item.scheduledDate ? new Date(item.scheduledDate) : new Date(),
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            price: item.price,
            currency: item.currency,
            estimatedDuration: item.estimatedDuration,
            distance: item.distance,
            vehicleType: item.vehicleType,
            passengerCount: item.passengerCount,
            groupSize: item.groupSize,
            specialRequirements: item.specialRequirements,
            duration: item.duration,
            assignedResources,
            notes: item.notes,
            cancellationReason: item.cancellationReason,
            cancelledAt: item.cancelledAt ? new Date(item.cancelledAt) : undefined,
            cancelledBy: item.cancelledBy,
        };
    }

    /**
     * Obtiene solicitudes de servicio filtradas por tipo de proveedor
     */
    getServiceRequestsByProviderType(providerType: ServiceRequestType): Observable<ServiceRequest[]> {
        this.isLoadingSubject.next(true);

        const backendType = this.mapTypeToBackend(providerType);
        type ApiResponse<T> = { success: boolean; data: T; message: string };

        const headers = this.getHeaders();
        const accepted$ = this.http
            .get<ApiResponse<any[]>>(`${this.apiUrl}/accepted`, { headers, params: { type: backendType } })
            .pipe(map(res => (res.data || []).map(s => this.mapBackendServiceToFrontend(s))));

        const assigned$ = this.http
            .get<ApiResponse<any[]>>(`${this.apiUrl}/assigned`, { headers, params: { type: backendType } })
            .pipe(map(res => (res.data || []).map(s => this.mapBackendServiceToFrontend(s))));

        const completed$ = this.http
            .get<ApiResponse<any[]>>(`${this.apiUrl}/completed`, { headers, params: { type: backendType } })
            .pipe(map(res => (res.data || []).map(s => this.mapBackendServiceToFrontend(s))));

        const pending$ = this.http
            .get<ApiResponse<any[]>>(`${this.apiUrl}/pending/${backendType}`, { headers })
            .pipe(map(res => (res.data || []).map(s => this.mapBackendServiceToFrontend(s))));

        return forkJoin([pending$, accepted$, assigned$, completed$]).pipe(
            map(([p, a, asg, c]) => {
                const combined = [...p, ...a, ...asg, ...c];
                // Ordenar por fecha programada ascendente
                return combined.sort((x, y) => x.scheduledDate.getTime() - y.scheduledDate.getTime());
            }),
            tap(list => this.serviceRequestsSubject.next(list)),
            catchError(err => {
                console.error('Error fetching service requests:', err);
                return of([]);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Obtiene todas las solicitudes pendientes para un tipo de proveedor
     */
    getPendingRequestsByType(providerType: ServiceRequestType): Observable<ServiceRequest[]> {
        this.isLoadingSubject.next(true);

        const backendType = this.mapTypeToBackend(providerType);
        type ApiResponse<T> = { success: boolean; data: T; message: string };

        return this.http
            .get<ApiResponse<any[]>>(`${this.apiUrl}/pending/${backendType}`, { headers: this.getHeaders() })
            .pipe(
                map(res => (res.data || []).map(s => this.mapBackendServiceToFrontend(s))),
                tap(list => this.serviceRequestsSubject.next(list)),
                catchError(err => {
                    console.error('Error fetching pending service requests:', err);
                    return of([]);
                }),
                finalize(() => this.isLoadingSubject.next(false))
            );
    }

    /**
     * Acepta una solicitud de servicio
     */
    acceptServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}/accept`,
            {},
            { headers: this.getHeaders() }
        ).pipe(
            map(res => !!res.success),
            catchError(err => {
                console.error('Error accepting service request:', err);
                return of(false);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Rechaza una solicitud de servicio
     */
    rejectServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}/reject`,
            {},
            { headers: this.getHeaders() }
        ).pipe(
            map(res => !!res.success),
            catchError(err => {
                console.error('Error rejecting service request:', err);
                return of(false);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Obtiene una solicitud específica por ID
     */
    getServiceRequestById(requestId: string): Observable<ServiceRequest | null> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}`,
            { headers: this.getHeaders() }
        ).pipe(
            map(res => res?.data ? this.mapBackendServiceToFrontend(res.data) : null),
            catchError(err => {
                console.error('Error fetching service request by id:', err);
                return of(null);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Asigna recursos a una solicitud aceptada
     * Para turismo: asigna guía y actualiza su estado a 'busy'
     * Para transporte: asigna vehículo y conductor, actualiza ambos estados a 'busy'
     */
    assignResources(requestId: string, resourceIds: { guideId?: string; vehicleId?: string; driverId?: string }): Observable<boolean> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        // Filtrar sólo campos definidos para evitar enviar undefined
        const body: any = {};
        if (resourceIds.guideId) body.guideId = resourceIds.guideId;
        if (resourceIds.vehicleId) body.vehicleId = resourceIds.vehicleId;
        if (resourceIds.driverId) body.driverId = resourceIds.driverId;

        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}/assign`,
            body,
            { headers: this.getHeaders() }
        ).pipe(
            map(res => !!res.success),
            catchError(err => {
                console.error('Error assigning resources to service request:', err);
                return of(false);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Marca una solicitud como completada y libera los recursos asignados
     */
    completeServiceRequest(requestId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}/status`,
            { status: 'COMPLETED' },
            { headers: this.getHeaders() }
        ).pipe(
            map(res => !!res.success),
            catchError(err => {
                console.error('Error completing service request:', err);
                return of(false);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Cancela una solicitud de servicio y libera recursos si están asignados
     */
    cancelServiceRequest(requestId: string, reason: string, cancelledBy: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        type ApiResponse<T> = { success: boolean; data: T; message: string };
        return this.http.patch<ApiResponse<any>>(
            `${this.apiUrl}/${requestId}/cancel`,
            { reason, cancelledBy },
            { headers: this.getHeaders() }
        ).pipe(
            map(res => !!res.success),
            catchError(err => {
                console.error('Error cancelling service request:', err);
                return of(false);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }
}
