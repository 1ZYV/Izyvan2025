import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
   * Obtiene una solicitud de servicio por su ID.
   * @param id ID de la solicitud
   */
  getServiceRequestById(id: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/${id}`);
  }

  /**
   * Obtiene todas las solicitudes de un usuario por su ID.
   * @param userId ID del usuario
   */
  getServiceRequestsByUserId(userId: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/user/${userId}`);
  }

  /**
   * Obtiene todas las solicitudes de un proveedor por su ID.
   * @param providerId ID del proveedor
   */
  getServiceRequestsByProviderId(providerId: number) {
    return this.http.get(`http://localhost:8080/api/v1/service-request/provider/${providerId}`);
  }

  /**
   * Obtiene todas las solicitudes de servicio.
   */
  getAllServiceRequests() {
    return this.http.get(`http://localhost:8080/api/v1/service-request`);
  }
}
