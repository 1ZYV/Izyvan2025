import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ITransportProvider } from '../../../core/utils/interfaces/ITransportProvider';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportProvidersServiceService {
  apiUrl = '';
  http = inject(HttpClient);

  constructor() {}

  getTransportProviders() {
    // return toSignal(
    //   this.http.get<ITransportProvider[]>(this.apiUrl).pipe(
    //     map((response) => {
    //       return response.map((provider) => ({
    //         id: provider.id,
    //         name: provider.name,
    //         phone: provider.phone,
    //         email: provider.email,
    //         rating: provider.rating,
    //       }));
    //     })
    //   )
    // );

    return signal<ITransportProvider[]>([
      {
        id: 1,
        name: 'Mock Transport Provider',
        phone: '123-456-7890',
        email: 'mock@provider.com',
        rating: 5,
      },
      {
        id: 2,
        name: 'Another Transport Provider',
        phone: '987-654-3210',
        email: 'another@provider.com',
        rating: 4,
      },
    ]);
  }
  getTransporterProvider(id: number): ITransportProvider | undefined {
    return this.getTransportProviders()().find(
      (provider) => provider.id === id
    );
  }
}
