import { Component } from '@angular/core';
import { BookingServiceTariffsService } from '../../services/booking-service-tariffs.service';
import { ITariff } from '../../../core/utils/interfaces/ITariff';
import { TariffsOperationsService } from '../../services/tariffs-operations.service';
import { CurrencyPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-request-tariffs',
  imports: [CurrencyPipe],
  templateUrl: './request-tariffs.component.html',
  styleUrl: './request-tariffs.component.css'
})
export class RequestTariffsComponent {
  selectedTariffs: Set<ITariff> = new Set();
  tariffsRequest: ITariff[] | null = [];

  constructor(private bookingServiceTariffs: BookingServiceTariffsService, private tariffOperations: TariffsOperationsService) {
    this.tariffOperations.getTariffs().pipe(
      tap((response) => {
        this.tariffsRequest = response;
      })
    ).subscribe();
  }

  handleTariffsSelection(tariff: ITariff) {
    if (this.selectedTariffs.has(tariff)) {
      this.selectedTariffs.delete(tariff);
    } else {
      this.selectedTariffs.add(tariff);
    }
    this.bookingServiceTariffs.selectedTariff.set(Array.from(this.selectedTariffs));
    console.log('Selected Tariffs:', this.bookingServiceTariffs.selectedTariff());
  }


}
