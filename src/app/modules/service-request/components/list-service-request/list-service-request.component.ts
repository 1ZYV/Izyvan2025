import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecentServiceRequestComponent } from '../../utils/recent-service-request/recent-service-request.component';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../../core/utils/enums/EnumVehicleTyoe';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { NgClass } from '@angular/common';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { ServiceRequestOperationService } from '../../services/service-request-operation.service';

@Component({
  selector: 'app-list-service-request',
  imports: [
    RouterLink,
    RecentServiceRequestComponent,
    RefreshIconComponent,
    SearchIconComponent,
    NgClass,
  ],
  templateUrl: './list-service-request.component.html',
  styleUrl: './list-service-request.component.css',
})
/**
 * Componente para mostrar la lista de solicitudes de servicio.
 * Permite visualizar detalles de cada solicitud y adapta la vista según el rol del usuario.
 */
export class ListServiceRequestComponent {
  /** Servicio de autenticación inyectado para obtener información del usuario actual */
  authenticationService = inject(AuthenticationService);
  serviceRequestOperationService = inject(ServiceRequestOperationService);

  /** Rol del usuario autenticado */
  userRole: string | undefined;
  /** Tipo de proveedor del usuario autenticado */
  providerType: string | undefined;

  /**
   * Suscripción al observable del usuario actual para actualizar el rol y tipo de proveedor.
   * Se recomienda desuscribirse en ngOnDestroy para evitar fugas de memoria.
   */
  private userSubscription = this.authenticationService.currentUser$.subscribe((user) => {
    this.userRole = user?.role;
    this.providerType = user?.providerType ? user.providerType : undefined;
  });

  /**
   * Lista reactiva de solicitudes de servicio (mock, ahora provista por el servicio).
   */
  serviceRequests = this.serviceRequestOperationService.getMockServiceRequests();

  /**
   * Limpia la suscripción al destruir el componente para evitar memory leaks.
   */
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  /**
   * Simula la cancelación de una solicitud de servicio (mock/demo) por id.
   */
  handleCancelServiceRequest(id: number) {
    const current = this.serviceRequests();
    this.serviceRequests.set(
      current.map(req => req.id === id ? { ...req, status: ServiceStatus.AGENCY_CANCELED } : req)
    );
  }
}
