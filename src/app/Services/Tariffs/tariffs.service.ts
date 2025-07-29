import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { AuthService } from '../Auth/auth.service';

// Interfaces para las tarifas
export interface TariffType {
  value: string;
  label: string;
  description: string;
}

export interface TariffDetails {
  id: string;
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerHour?: number;
  zone?: string;
  origin?: string;
  destination?: string;
  currency: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  minPrice?: number;
  maxPrice?: number;
  vehicleTypes?: string[];
  serviceTypes?: string[];
  createdAt: string;
  updatedAt: string;
  provider?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateTariffData {
  name: string;
  description?: string;
  type: string;
  basePrice: number;
  pricePerKm?: number;
  pricePerHour?: number;
  zone?: string;
  origin?: string;
  destination?: string;
  currency: string;
  isActive: boolean;
  validFrom?: string;
  validTo?: string;
  minPrice?: number;
  maxPrice?: number;
  vehicleTypes?: string[];
  serviceTypes?: string[];
}

export interface UpdateTariffData extends Partial<CreateTariffData> {}

export interface TariffFilters {
  search?: string;
  type?: string;
  zone?: string;
  isActive?: boolean;
  currency?: string;
  providerId?: string;
  validFrom?: string;
  validTo?: string;
  page?: number;
  limit?: number;
}

export interface TariffListResponse {
  data: TariffDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TariffsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api';

  // Headers con autenticación JWT
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todas las tarifas con filtros
  getTariffs(filters?: TariffFilters): Observable<TariffListResponse> {
    let params = new HttpParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof TariffFilters];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<TariffListResponse>(
      `${this.apiUrl}/tariffs`,
      { 
        headers: this.getHeaders(),
        params: params
      }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo tarifas:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener tipos de tarifa disponibles
  getTariffTypes(): Observable<{ types: TariffType[] }> {
    return this.http.get<{ types: TariffType[] }>(
      `${this.apiUrl}/tariffs/types`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo tipos de tarifa:', error);
        return throwError(() => error);
      })
    );
  }

  // Obtener una tarifa por ID
  getTariffById(id: string): Observable<TariffDetails> {
    return this.http.get<TariffDetails>(
      `${this.apiUrl}/tariffs/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error obteniendo tarifa:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nueva tarifa
  createTariff(tariffData: CreateTariffData): Observable<TariffDetails> {
    return this.http.post<TariffDetails>(
      `${this.apiUrl}/tariffs`,
      tariffData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        console.log('Tarifa creada exitosamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error creando tarifa:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar tarifa existente
  updateTariff(id: string, tariffData: UpdateTariffData): Observable<TariffDetails> {
    return this.http.patch<TariffDetails>(
      `${this.apiUrl}/tariffs/${id}`,
      tariffData,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        console.log('Tarifa actualizada exitosamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error actualizando tarifa:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar tarifa
  deleteTariff(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/tariffs/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      map(response => {
        console.log('Tarifa eliminada exitosamente:', response);
        return response;
      }),
      catchError(error => {
        console.error('Error eliminando tarifa:', error);
        return throwError(() => error);
      })
    );
  }

  // Métodos de utilidad para formateo
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(price);
  }

  formatTariffType(type: string): string {
    const typeLabels: { [key: string]: string } = {
      'VEHICLE': 'Vehículo',
      'GUIDE': 'Guía Turístico',
      'TRAVEL': 'Viaje/Trayecto',
      'DISTANCE': 'Distancia',
      'TIME': 'Tiempo/Hora',
      'ZONE': 'Zona Geográfica',
      'CUSTOM': 'Personalizada'
    };
    return typeLabels[type] || type;
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Activa' : 'Inactiva';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'text-green-600' : 'text-red-600';
  }
}
