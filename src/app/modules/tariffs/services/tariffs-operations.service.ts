import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ITariff } from '../../core/utils/interfaces/ITariff';

@Injectable({
  providedIn: 'root'
})
export class TariffsOperationsService {
  tariffs: ITariff[] = [];

  constructor(private http: HttpClient) { }

  getTariffs(): ITariff[] {
    this.http.get<ITariff[]>('http://localhost:3000/tariffs').subscribe({
      next: (response) => {
        console.log('Tariffs fetched successfully:', response);
        this.tariffs = response;
      },
      error: (error) => {
        console.error('Error fetching tariffs:', error);
        this.tariffs = [
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
      }
    });

    return this.tariffs;
  }

  getTariffById(id: number) {
    return this.http.get<ITariff>(`http://localhost:3000/tariffs/${id}`);
  }
}
