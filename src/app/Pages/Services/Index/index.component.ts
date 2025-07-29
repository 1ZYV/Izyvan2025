import { Component, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ServiceRequest, ServiceRequestsService, ServiceRequestType } from '../../../Services/ServiceRequests/service-requests.service';
import { AuthService } from '../../../Services/Auth/auth.service';
import { VehiclesAndDriversService } from '../../../Services/VehiclesAndDrivers/vehicles-and-drivers.service';
import { ServiceRequestCardComponent } from '../../../Components/ServiceRequestCard/service-request-card.component';
import { LoaderComponent } from '../../../Components/Loader/loader.component';
import { AssignGuideModalComponent } from '../../../Components/AssignGuideModal/assign-guide-modal.component';
import { AssignTransportModalComponent } from '../../../Components/AssignTransportModal/assign-transport-modal.component';
import { ServiceDetailsModalComponent } from '../../../Components/ServiceDetailsModal/service-details-modal.component';

@Component({
    selector: 'pg-services-index',
    templateUrl: './index.component.html',
    styleUrl: './index.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ServiceRequestCardComponent, LoaderComponent, AssignGuideModalComponent, AssignTransportModalComponent, ServiceDetailsModalComponent]
})
export class ServicesIndexComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Injected services
    private serviceRequestsService = inject(ServiceRequestsService);
    private authService = inject(AuthService);
    private vehiclesAndDriversService = inject(VehiclesAndDriversService);

    // Signals
    isLoading = signal<boolean>(true);
    serviceRequests = signal<ServiceRequest[]>([]);
    currentProviderType = signal<ServiceRequestType | null>(null);

    // Modal signals for guides
    showAssignGuideModal = signal<boolean>(false);
    selectedRequestForAssignment = signal<ServiceRequest | null>(null);
    isAssigningGuide = signal<boolean>(false);

    // Modal signals for transport
    showAssignTransportModal = signal<boolean>(false);
    selectedRequestForTransport = signal<ServiceRequest | null>(null);
    isAssigningTransport = signal<boolean>(false);

    // Modal signals for service details
    showServiceDetailsModal = signal<boolean>(false);
    selectedRequestForDetails = signal<ServiceRequest | null>(null);
    isCancellingService = signal<boolean>(false);

    // Computed properties
    pendingRequests = computed(() =>
        this.serviceRequests().filter(req => req.status === 'pending')
    );

    acceptedRequests = computed(() =>
        this.serviceRequests().filter(req => req.status === 'accepted')
    );

    assignedRequests = computed(() =>
        this.serviceRequests().filter(req => req.status === 'assigned')
    );

    completedRequests = computed(() =>
        this.serviceRequests().filter(req => req.status === 'completed')
    );

    // Page title and description based on provider type
    pageTitle = computed(() => {
        const type = this.currentProviderType();
        switch (type) {
            case 'transport':
                return 'Solicitudes de Transporte';
            case 'tourism':
                return 'Solicitudes de Turismo';
            default:
                return 'Solicitudes de Servicio';
        }
    });

    pageDescription = computed(() => {
        const type = this.currentProviderType();
        switch (type) {
            case 'transport':
                return 'Gestiona las solicitudes de servicios de transporte de las agencias';
            case 'tourism':
                return 'Gestiona las solicitudes de servicios turísticos de las agencias';
            default:
                return 'Gestiona las solicitudes de servicios';
        }
    });

    ngOnInit(): void {
        this.loadProviderType();
        this.loadServiceRequests();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadProviderType(): void {
        // Get current provider information from auth service
        this.authService.currentProvider$
            .pipe(takeUntil(this.destroy$))
            .subscribe((provider: any) => {
                if (provider?.type) {
                    this.currentProviderType.set(provider.type as ServiceRequestType);
                }
            });
    }

    private loadServiceRequests(): void {
        const providerType = this.currentProviderType();

        if (!providerType) {
            this.isLoading.set(false);
            return;
        }

        this.serviceRequestsService.getServiceRequestsByProviderType(providerType)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (requests) => {
                    this.serviceRequests.set(requests);
                },
                error: (error) => {
                    console.error('Error loading service requests:', error);
                },
                complete: () => {
                    this.isLoading.set(false);
                }
            });
    }

    // Event handlers
    onAcceptRequest(requestId: string): void {
        this.serviceRequestsService.acceptServiceRequest(requestId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Request accepted successfully');
                        this.loadServiceRequests(); // Reload to get updated data
                    } else {
                        console.error('Failed to accept request');
                    }
                },
                error: (error) => {
                    console.error('Error accepting request:', error);
                }
            });
    }

    onRejectRequest(requestId: string): void {
        if (confirm('¿Estás seguro de que deseas rechazar esta solicitud?')) {
            this.serviceRequestsService.rejectServiceRequest(requestId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (success) => {
                        if (success) {
                            console.log('Request rejected successfully');
                            this.loadServiceRequests(); // Reload to get updated data
                        } else {
                            console.error('Failed to reject request');
                        }
                    },
                    error: (error) => {
                        console.error('Error rejecting request:', error);
                    }
                });
        }
    }

    onViewRequestDetails(requestId: string): void {
        const request = this.serviceRequests().find(r => r.id === requestId);
        if (request) {
            this.selectedRequestForDetails.set(request);
            this.showServiceDetailsModal.set(true);
        } else {
            console.error('Request not found:', requestId);
        }
    }

    onAssignResources(requestId: string): void {
        const request = this.serviceRequests().find(r => r.id === requestId);
        if (!request) {
            console.error('Request not found:', requestId);
            return;
        }

        // For tourism providers, open the guide assignment modal
        if (this.currentProviderType() === 'tourism') {
            this.selectedRequestForAssignment.set(request);
            this.showAssignGuideModal.set(true);
        } else if (this.currentProviderType() === 'transport') {
            // For transport providers, open the vehicle and driver assignment modal
            this.selectedRequestForTransport.set(request);
            this.showAssignTransportModal.set(true);
        }
    }

    onRefresh(): void {
        this.isLoading.set(true);
        this.loadServiceRequests();
    }

    // Modal event handlers
    onCloseAssignGuideModal(): void {
        this.showAssignGuideModal.set(false);
        this.selectedRequestForAssignment.set(null);
        this.isAssigningGuide.set(false);
    }

    onAssignGuide(event: { requestId: string; guideId: string }): void {
        this.isAssigningGuide.set(true);

        this.serviceRequestsService.assignResources(event.requestId, { guideId: event.guideId })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Guide assigned successfully');
                        this.loadServiceRequests(); // Reload to get updated data
                        this.onCloseAssignGuideModal();
                    } else {
                        console.error('Failed to assign guide');
                        this.isAssigningGuide.set(false);
                    }
                },
                error: (error) => {
                    console.error('Error assigning guide:', error);
                    this.isAssigningGuide.set(false);
                }
            });
    }

    // Transport modal event handlers
    onCloseAssignTransportModal(): void {
        this.showAssignTransportModal.set(false);
        this.selectedRequestForTransport.set(null);
        this.isAssigningTransport.set(false);
    }

    onAssignTransport(event: { requestId: string; vehicleId: string; driverId: string }): void {
        this.isAssigningTransport.set(true);

        this.serviceRequestsService.assignResources(event.requestId, {
            vehicleId: event.vehicleId,
            driverId: event.driverId
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Transport resources assigned successfully');
                        this.loadServiceRequests(); // Reload to get updated data
                        this.onCloseAssignTransportModal();
                    } else {
                        console.error('Failed to assign transport resources');
                        this.isAssigningTransport.set(false);
                    }
                },
                error: (error) => {
                    console.error('Error assigning transport resources:', error);
                    this.isAssigningTransport.set(false);
                }
            });
    }

    // Service details modal event handlers
    onCloseServiceDetailsModal(): void {
        this.showServiceDetailsModal.set(false);
        this.selectedRequestForDetails.set(null);
        this.isCancellingService.set(false);
    }

    onCancelService(event: { requestId: string; reason: string }): void {
        this.isCancellingService.set(true);

        // Get current provider type for cancelledBy field
        const providerType = this.currentProviderType();
        const cancelledBy = `Proveedor de ${providerType === 'transport' ? 'Transporte' : 'Turismo'}`;

        this.serviceRequestsService.cancelServiceRequest(event.requestId, event.reason, cancelledBy)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('Service cancelled successfully');
                        this.loadServiceRequests(); // Reload to get updated data
                        this.onCloseServiceDetailsModal();
                    } else {
                        console.error('Failed to cancel service');
                        this.isCancellingService.set(false);
                    }
                },
                error: (error) => {
                    console.error('Error cancelling service:', error);
                    this.isCancellingService.set(false);
                }
            });
    }
}