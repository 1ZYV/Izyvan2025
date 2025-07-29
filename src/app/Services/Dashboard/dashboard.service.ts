import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../Auth/auth.service';

export interface DashboardSummary {
  summary: {
    totalTravels: number;
    totalServices: number;
    totalInvoices: number;
    totalDrivers: number;
    totalVehicles: number;
    totalGuides: number;
    totalIncome: number;
    todayTravels: number;
  };
  period: {
    startDate?: string;
    endDate?: string;
  };
}

export interface MetricData {
  status: string;
  count: number;
  amount?: number;
  label: string;
}

export interface TravelMetrics {
  data: MetricData[];
  total: number;
}

export interface ServiceMetrics {
  data: MetricData[];
  total: number;
}

export interface ChargeMetrics {
  data: MetricData[];
  total: number;
  totalAmount: number;
}

export interface DriverData {
  id: string;
  name: string;
  license: string;
  rating: number;
  completedTrips: number;
}

export interface TopDrivers {
  data: DriverData[];
  total: number;
}

export interface MonthlyIncomeData {
  month: string;
  amount: number;
  label: string;
}

export interface MonthlyIncome {
  data: MonthlyIncomeData[];
  total: number;
  period: {
    months: number;
    startDate: string;
    endDate: string;
  };
}

export interface DailyTripData {
  date: string;
  count: number;
  label: string;
}

export interface DailyTrips {
  data: DailyTripData[];
  total: number;
  period: {
    days: number;
    startDate: string;
    endDate: string;
  };
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  months?: number;
  days?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = 'http://localhost:3000/api/dashboard';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Obtener headers con autenticación
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Construir parámetros de consulta
   */
  private buildParams(filters?: DashboardFilters): HttpParams {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
      if (filters.months) {
        params = params.set('months', filters.months.toString());
      }
      if (filters.days) {
        params = params.set('days', filters.days.toString());
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
    }
    
    return params;
  }

  /**
   * Manejo de errores
   */
  private handleError(error: any): Observable<never> {
    console.error('Error en DashboardService:', error);
    return throwError(() => error);
  }

  /**
   * Obtener resumen general del dashboard
   */
  getSummary(filters?: DashboardFilters): Observable<DashboardSummary> {
    const params = this.buildParams(filters);
    
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener métricas de viajes por estado
   */
  getTravelMetrics(filters?: DashboardFilters): Observable<TravelMetrics> {
    const params = this.buildParams(filters);
    
    return this.http.get<TravelMetrics>(`${this.baseUrl}/metrics/travels`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener métricas de servicios por estado
   */
  getServiceMetrics(filters?: DashboardFilters): Observable<ServiceMetrics> {
    const params = this.buildParams(filters);
    
    return this.http.get<ServiceMetrics>(`${this.baseUrl}/metrics/services`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener métricas de cargos por estado
   */
  getChargeMetrics(filters?: DashboardFilters): Observable<ChargeMetrics> {
    const params = this.buildParams(filters);
    
    return this.http.get<ChargeMetrics>(`${this.baseUrl}/metrics/charges`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener top conductores por viajes completados
   */
  getTopDrivers(filters?: DashboardFilters): Observable<TopDrivers> {
    const params = this.buildParams(filters);
    
    return this.http.get<TopDrivers>(`${this.baseUrl}/metrics/drivers/top`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener ingresos mensuales
   */
  getMonthlyIncome(filters?: DashboardFilters): Observable<MonthlyIncome> {
    const params = this.buildParams(filters);
    
    return this.http.get<MonthlyIncome>(`${this.baseUrl}/metrics/income/monthly`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener viajes por día (últimos N días)
   */
  getDailyTrips(filters?: DashboardFilters): Observable<DailyTrips> {
    const params = this.buildParams(filters);
    
    return this.http.get<DailyTrips>(`${this.baseUrl}/metrics/daily-trips`, {
      headers: this.getHeaders(),
      params
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener todos los datos del dashboard de una vez
   */
  getAllDashboardData(filters?: DashboardFilters): Observable<{
    summary: DashboardSummary;
    travelMetrics: TravelMetrics;
    serviceMetrics: ServiceMetrics;
    chargeMetrics: ChargeMetrics;
    topDrivers: TopDrivers;
    monthlyIncome: MonthlyIncome;
    dailyTrips: DailyTrips;
  }> {
    return new Observable(observer => {
      Promise.all([
        this.getSummary(filters).toPromise(),
        this.getTravelMetrics(filters).toPromise(),
        this.getServiceMetrics(filters).toPromise(),
        this.getChargeMetrics(filters).toPromise(),
        this.getTopDrivers(filters).toPromise(),
        this.getMonthlyIncome(filters).toPromise(),
        this.getDailyTrips(filters).toPromise()
      ]).then(([summary, travelMetrics, serviceMetrics, chargeMetrics, topDrivers, monthlyIncome, dailyTrips]) => {
        observer.next({
          summary: summary!,
          travelMetrics: travelMetrics!,
          serviceMetrics: serviceMetrics!,
          chargeMetrics: chargeMetrics!,
          topDrivers: topDrivers!,
          monthlyIncome: monthlyIncome!,
          dailyTrips: dailyTrips!
        });
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
