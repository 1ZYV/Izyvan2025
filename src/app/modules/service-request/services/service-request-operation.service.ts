import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IServiceRequest } from '../../core/utils/interfaces/IServicerRequest';
import { ServiceStatus } from '../../core/utils/enums/EnumServiceStatus';
import { VehicleType } from '../../core/utils/enums/EnumVehicleTyoe';

/**
 * Servicio para operaciones relacionadas con solicitudes de servicio.
 * Proporciona métodos para obtener solicitudes por ID, usuario, proveedor o todas.
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceRequestOperationService {
  /**
   * Constructor que inyecta HttpClient para llamadas HTTP.
   */
  constructor(private http: HttpClient) { }

  /**
   * Datos mock internos para simular la base de datos.
   */
  private _mockServiceRequests: IServiceRequest[] = [
    {
      id: 1,
      nameReference: 'Viaje 1',
      status: ServiceStatus.COMPLETED,
      originAddress: 'Aeropuerto El Dorado, Bogotá',
      destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
      numberOfPassengers: 3,
      vehicleType: VehicleType.BUS,
      date: '2023-10-01',
      time: '08:00 AM',
      tariffs: [
        {
          destinationAddress: 'Universidad Nacional de Colombia, Bogotá',
          originAddress: 'Aeropuerto El Dorado, Bogotá',
          price: 50000,
          providerId: 1,
        }
      ]
    },
    {
      id: 2,
      nameReference: 'Viaje 2',
      status: ServiceStatus.ACCEPTED,
      originAddress: 'Chicago, IL',
      destinationAddress: 'New York, NY',
      numberOfPassengers: 2,
      vehicleType: VehicleType.AUTOMOVIL,
      date: '2023-10-02',
      time: '10:30 AM',
      tariffs: [
        {
          destinationAddress: 'New York, NY',
          originAddress: 'Chicago, IL',
          price: 150000,
          providerId: 2,
        }
      ]
    },
    {
      id: 3,
      nameReference: 'Viaje 3',
      status: ServiceStatus.IN_PROGRESS,
      originAddress: 'White House, Washington, D.C.',
      destinationAddress: 'Capitol Hill, Washington, D.C.',
      numberOfPassengers: 4,
      vehicleType: VehicleType.VAN,
      date: '2023-10-03',
      time: '11:00 AM',
      tariffs: [
        {
          destinationAddress: 'Capitol Hill, Washington, D.C.',
          originAddress: 'White House, Washington, D.C.',
          price: 20000,
          providerId: 2,
        }
      ]
    },
    {
      id: 4,
      nameReference: 'Viaje 4',
      status: ServiceStatus.AGENCY_CANCELED,
      originAddress: 'Los Angeles, CA',
      destinationAddress: 'San Francisco, CA',
      numberOfPassengers: 1,
      vehicleType: VehicleType.AUTOMOVIL,
      date: '2023-10-04',
      time: '09:00 AM',
      tariffs: [
        {
          destinationAddress: 'San Francisco, CA',
          originAddress: 'Los Angeles, CA',
          price: 80000,
          providerId: 4,
        }
      ]
    },
    {
      id: 5,
      nameReference: 'Viaje 5',
      status: ServiceStatus.PROCESSING,
      originAddress: 'Madrid, España',
      destinationAddress: 'Barcelona, España',
      numberOfPassengers: 5,
      vehicleType: VehicleType.BUS,
      date: '2023-10-05',
      time: '07:00 AM',
    }
  ];

  /**
   * Obtiene una solicitud de servicio por su ID.
   * @param id ID de la solicitud
   */
  getServiceRequestById(id: number): Observable<IServiceRequest | undefined> {
    return of(this._mockServiceRequests.find(req => req.id === id));
  }

  /**
   * Obtiene todas las solicitudes de un usuario por su ID.
   * @param userId ID del usuario
   */
  getServiceRequestsByUserId(userId: number): Observable<IServiceRequest[]> {
    // Para demo, retorna todas
    return of(this._mockServiceRequests);
  }

  /**
   * Obtiene todas las solicitudes de un proveedor por su ID.
   * @param providerId ID del proveedor
   */
  getServiceRequestsByProviderId(providerId: number): Observable<IServiceRequest[]> {
    // Para demo, retorna todas
    return of(this._mockServiceRequests);
  }

  /**
   * Obtiene todas las solicitudes de servicio.
   */
  getAllServiceRequests(): Observable<IServiceRequest[]> {
    return of(this._mockServiceRequests);
  }

  /**
   * Retorna una lista mock de solicitudes de servicio (para demo/desarrollo).
   * (Mantiene compatibilidad con los componentes que usan signals)
   */
  getMockServiceRequests() {
    // Devuelve una signal para compatibilidad con componentes existentes
    return signal<IServiceRequest[]>([...this._mockServiceRequests]);
  }

  /**
   * Calcula el total de tarifas de un viaje de forma recursiva (si hay tarifas anidadas en el futuro).
   * @param travel Viaje a calcular
   */
  getTotalTariffs(travel: IServiceRequest | undefined): number {
    if (!travel?.tariffs) return 0;
    return travel.tariffs.reduce((sum, t) => sum + (t.price ?? 0), 0);
  }
}
