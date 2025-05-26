import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITariff } from '../../core/utils/interfaces/ITariff';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TariffsOperationsService {
  private tariffs: ITariff[] = [];

  constructor(private http: HttpClient) {}

  getTariffs(): Observable<ITariff[]> {
    return this.http.get<ITariff[]>('http://localhost:3000/tariffs').pipe(
      tap((response) => {
        console.log('Tariffs fetched successfully:', response);
        this.tariffs = response;
      }),
      catchError((error) => {
        console.error('Error fetching tariffs:', error);
        const fallbackTariffs: ITariff[] = [
          {
            price: 10,
            originAddress: 'Unknown',
            destinationAddress: 'Unknown',
            providerId: 0
          },
          {
            price: 20,
            originAddress: 'Unknown',
            destinationAddress: 'Unknown',
            providerId: 0
          },
          {
            price: 30,
            originAddress: 'Unknown',
            destinationAddress: 'Unknown',
            providerId: 0
          }
        ];
        this.tariffs = fallbackTariffs;
        return of(fallbackTariffs);
      })
    );
  }

  getTariffById(id: number): Observable<ITariff> {
    return this.http.get<ITariff>(`http://localhost:3000/tariffs/${id}`);
  }
}
