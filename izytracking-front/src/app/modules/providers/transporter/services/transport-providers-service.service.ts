import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { IProvider } from '../../../core/utils/interfaces/IProvider';

/**
 * Servicio para gestionar proveedores de transporte.
 * Permite obtener la lista de proveedores y buscar uno por ID.
 */
@Injectable({
  providedIn: 'root',
})
export class TransportProvidersServiceService {
  /** URL base de la API (debe configurarse para producción) */
  apiUrl = '';
  http = inject(HttpClient);

  constructor() { }

  /**
   * Obtiene la lista de proveedores de transporte.
   * Actualmente retorna datos mock, en producción debe usarse la API.
   */
  getTransportProviders() {
    // Para producción, descomentar y configurar la llamada HTTP:
    // return toSignal(
    //   this.http.get<ITransportProvider[]>(this.apiUrl).pipe(
    //     map((response) => response.map((provider) => ({ ...provider })))
    //   )
    // );
    return signal<IProvider[]>([
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

  /**
   * Busca un proveedor de transporte por su ID.
   * @param id ID del proveedor
   */
  getTransporterProvider(id: number): IProvider | undefined {
    return this.getTransportProviders()().find(
      (provider) => provider.id === id
    );
  }
}
