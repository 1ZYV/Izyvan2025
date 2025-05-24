import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestOperationService {

  constructor(private http : HttpClient) { }

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
    return this.http.get(`http://localhost:8080/api/v1/service-request`);
  }
}
