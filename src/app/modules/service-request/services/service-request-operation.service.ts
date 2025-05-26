import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { ServiceStatus } from '../../core/utils/enums/EnumServiceStatus';
import { IServiceRequest } from '../../core/utils/interfaces/IServicerRequest';
import { VehicleType } from '../../core/utils/enums/EnumVehicleTyoe';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestOperationService {
  travels = signal<IServiceRequest[]>([
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
          price: 100000,
          providerId: 0
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
      time: '09:00 AM',
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
      time: '10:00 AM',
    },
  ]);

  constructor(private http: HttpClient) { }

  getServiceRequestById(id: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/${id}`);
  }

  getServiceRequestsByUserId(userId: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/user/${userId}`);
  }

  getServiceRequestsByProviderId(providerId: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/provider/${providerId}`);
  }

  getAllServiceRequests() {
    this.http.get<IServiceRequest[]>(`http://localhost:8080/api/v1/service-request`).subscribe({
      next: (response) => {
        this.travels.set(response);
      },
      error: (error) => {
        console.error('Error fetching service requests:', error);
      }
    })
  }
}
