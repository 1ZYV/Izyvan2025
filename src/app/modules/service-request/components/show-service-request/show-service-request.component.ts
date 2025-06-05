import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from '../../../core/utils/enums/EnumServiceStatus';
import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceRequestMapDirectionComponent } from '../../utils/service-request-map-direction/service-request-map-direction.component';
import { TransportProvidersServiceService } from '../../../providers/transporter/services/transport-providers-service.service';
import { ServiceRequestRatingComponent } from '../../utils/service-request-rating/service-request-rating.component';
import { NgClass } from '@angular/common';
import { ServiceRequestOperationService } from '../../services/service-request-operation.service';
import { IProvider } from '../../../core/utils/interfaces/IProvider';

@Component({
  selector: 'app-show-service-request',
  imports: [
    ServiceRequestMapDirectionComponent,
    ServiceRequestRatingComponent,
    NgClass,
  ],
  templateUrl: './show-service-request.component.html',
  styleUrl: './show-service-request.component.css',
})
/**
 * Componente para mostrar el detalle de una solicitud de servicio.
 * Muestra información del viaje, proveedor y permite calificar el servicio.
 */
export class ShowServiceRequestComponent implements OnInit {
  /** Servicio para obtener proveedores de transporte */
  transportProvicerService = inject(TransportProvidersServiceService);
  route = inject(ActivatedRoute);
  serviceRequestOperationService = inject(ServiceRequestOperationService);
  /** Señal con la información del viaje actual (mock, demo: primer elemento) */
  travel = signal<IServiceRequest | undefined>(undefined);

  /** Señal con el proveedor de transporte asociado al viaje */
  transporterProvider = signal<IProvider | undefined>(undefined);

  constructor() {
    // Usar effect en el constructor para cumplir con el contexto de inyección
    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.serviceRequestOperationService.getServiceRequestById(id).subscribe((req) => {
          this.travel.set(req);
          if (req?.tariffs?.[0]?.providerId) {
            this.transporterProvider.set(
              this.transportProvicerService.getTransporterProvider(
                req.tariffs[0].providerId
              )
            );
          }
        });
      }
    });
  }

  /**
   * Al inicializar, busca el proveedor de transporte del viaje actual.
   */
  ngOnInit(): void {
    // No es necesario usar effect aquí
  }

  /**
   * Calcula el total de tarifas de un viaje de forma recursiva (si hay tarifas anidadas en el futuro).
   * @param travel Viaje a calcular
   */
  getTotalTariffs(travel: IServiceRequest | undefined): number {
    return this.serviceRequestOperationService.getTotalTariffs(travel);
  }

  /**
   * Simula la cancelación de la solicitud de servicio (mock/demo).
   */
  handleCancelServiceRequest() {
    const travel = this.travel();
    if (!travel) return;
    this.travel.set({ ...travel, status: ServiceStatus.AGENCY_CANCELED });
    // Opcional: mostrar feedback visual o notificación
    // alert('Solicitud cancelada (mock)');
  }
}
