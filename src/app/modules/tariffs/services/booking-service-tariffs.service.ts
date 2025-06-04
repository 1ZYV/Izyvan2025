import { Injectable, signal } from '@angular/core';
import { ITariff } from '../../core/utils/interfaces/ITariff';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceTariffsService {
  // Signal to store the selected tariff (Tarrif | null if not set)
  selectedTariff = signal<ITariff[] | null>(null);

  serviceRequestInformation = signal

  constructor() { }
}
