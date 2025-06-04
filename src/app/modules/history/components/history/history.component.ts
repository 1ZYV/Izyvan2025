import {
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { RefreshIconComponent } from '../../../core/utils/icons/refresh-icon/refresh-icon.component';
import { SearchIconComponent } from '../../../core/utils/icons/search-icon/search-icon.component';

import { IServiceRequest } from '../../../core/utils/interfaces/IServicerRequest';
import { ServiceRequestMapDirectionComponent } from '../../../service-request/utils/service-request-map-direction/service-request-map-direction.component';
import { ServiceRequestOperationService } from '../../../service-request/services/service-request-operation.service';

/**
 * Componente para mostrar el historial de viajes del usuario.
 * Permite buscar, refrescar y visualizar detalles de cada viaje.
 */
@Component({
  selector: 'app-history',
  imports: [
    RefreshIconComponent,
    SearchIconComponent,
    ServiceRequestMapDirectionComponent,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  /** Referencia al servicio de operaciones de solicitudes de servicio */
  serviceRequestOperationService = inject(ServiceRequestOperationService);

  /** Lista reactiva de viajes (mock, ahora provista por el servicio) */
  travels = this.serviceRequestOperationService.getMockServiceRequests();

  /** Referencia al componente de mapa para mostrar direcciones */
  private serviceRequestMapDirectionComponent = viewChild(
    ServiceRequestMapDirectionComponent
  );

  /** Centro y zoom del mapa */
  center = signal<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  zoom = signal<number>(5);

  constructor() { }

  /**
   * Inicializa el historial refrescando los datos.
   */
  ngOnInit(): void {
    this.handleRefresh();
  }

  /**
   * Calcula el total de tarifas de un viaje de forma recursiva (si hay tarifas anidadas en el futuro).
   * @param travel Viaje a calcular
   */
  getTotalTariffs(travel: IServiceRequest): number {
    return this.serviceRequestOperationService.getTotalTariffs(travel);
  }

  /**
   * Al hacer click en un viaje, solicita direcciones en el mapa.
   * @param travel Viaje seleccionado
   */
  handleTravelClick(travel: IServiceRequest) {
    this.serviceRequestMapDirectionComponent()?.handleRequestDirections(
      travel.originAddress,
      travel.destinationAddress
    );
  }

  /**
   * Filtra los viajes por dirección de origen o destino.
   * @param event Evento de input de búsqueda
   */
  handleSearch(event: Event) {
    const input = (event.target as HTMLInputElement)?.value
      .trim()
      .toLowerCase();

    if (!input) {
      this.handleRefresh();
      return;
    }

    const filteredTravels = this.travels().filter(
      (travel) =>
        travel.originAddress.toLowerCase().includes(input) ||
        travel.destinationAddress.toLowerCase().includes(input)
    );

    if (filteredTravels.length > 0) {
      this.travels.set(filteredTravels);
    } else {
      this.handleRefresh();
    }
  }

  /**
   * Refresca la lista de viajes (mock, en producción debe obtenerse del backend).
   */
  handleRefresh() {
    // Simplemente resetea la señal a los datos mock originales
    this.travels.set(this.serviceRequestOperationService.getMockServiceRequests()());
  }
}
