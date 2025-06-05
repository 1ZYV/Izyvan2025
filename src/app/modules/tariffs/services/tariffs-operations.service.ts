import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITariff } from '../../core/utils/interfaces/ITariff';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IProvider } from '../../core/utils/interfaces/IProvider';
import { ProviderOperationService } from '../../core/services/providers/provider-operation.service';

@Injectable({
  providedIn: 'root'
})
export class TariffsOperationsService {
  private providerOperationService = inject(ProviderOperationService);
  private tariffs: ITariff[] = [];

  constructor(private http: HttpClient) { }

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
            providerId: 1
          },
          {
            price: 20,
            originAddress: 'Unknown',
            destinationAddress: 'Unknown',
            providerId: 1
          },
          {
            price: 30,
            originAddress: 'Unknown',
            destinationAddress: 'Unknown',
            providerId: 1
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

  getTariffProviderId(tariff: ITariff): IProvider | null {
    return this.providerOperationService.getProviderById(tariff.providerId);
  }
}
