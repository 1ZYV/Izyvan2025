import { Component } from '@angular/core';
import { BookingServiceTariffsService } from '../../services/booking-service-tariffs.service';
import { ITariff } from '../../../core/utils/interfaces/ITariff';
import { TariffsOperationsService } from '../../services/tariffs-operations.service';

@Component({
  selector: 'app-request-tariffs',
  imports: [],
  templateUrl: './request-tariffs.component.html',
  styleUrl: './request-tariffs.component.css'
})
export class RequestTariffsComponent {
  selectedTariffs: ITariff[] = [];
  tariffsRequest: ITariff[] | null = [];

  constructor(private bookingServiceTariffs: BookingServiceTariffsService, private tariffOperations: TariffsOperationsService) {
    this.tariffsRequest = this.tariffOperations.getTariffs();
  }

  handleTariffsSelection(tariff: ITariff) {
    this.selectedTariffs.push(tariff);
    this.selectedTariffs = Array.from(new Set(this.selectedTariffs));
    this.bookingServiceTariffs.selectedTariff.set(this.selectedTariffs);
  }


}
