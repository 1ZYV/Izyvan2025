import {
  Component,
  NgZone,
  AfterViewInit,
  Output,
  EventEmitter,
  WritableSignal,
} from '@angular/core';
import { BookingServiceService } from '../../../../service-request/services/booking-service.service';

@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css'],
})
export class PlaceAutocompleteComponent implements AfterViewInit {
  origen: google.maps.LatLng | null = null;
  destino: google.maps.LatLng | null = null;

  @Output()
  ubicacionesSeleccionadas = new EventEmitter<{
    origen: google.maps.LatLngLiteral;
    destino: google.maps.LatLngLiteral;
  }>();

  constructor(
    private ngZone: NgZone,
    protected bookingService: BookingServiceService
  ) { }

  ngAfterViewInit(): void {
    this.initAutocomplete('origen', (location) => {
      this.ngZone.run(() => {
        this.origen = location?.geometry?.location || null;
        this.setBookingOrigin(location);
        this.checkAndEmitUbicaciones();
      });
    });

    this.initAutocomplete('destino', (location) => {
      this.ngZone.run(() => {
        this.destino = location?.geometry?.location || null;
        this.setBookingDestiny(location);
        this.checkAndEmitUbicaciones();
      });
    });
  }

  private setBookingOrigin(location: google.maps.places.PlaceResult | null) {
    const loc = location?.geometry?.location?.toJSON() ?? null;
    this.bookingService.bookingForm().originLngLtd = loc;
    this.bookingService.bookingForm().originLiteral = location?.name ?? '';
    this.bookingService.originLatLng.set(loc);
  }

  private setBookingDestiny(location: google.maps.places.PlaceResult | null) {
    const loc = location?.geometry?.location?.toJSON() ?? null;
    this.bookingService.bookingForm().destinyLngLtd = loc;
    this.bookingService.bookingForm().destinyLiteral = location?.name ?? '';
    this.bookingService.destinyLatLng.set(loc);
  }

  private checkAndEmitUbicaciones() {
    const currentOrigin = this.bookingService.bookingForm().originLngLtd;
    const currentDestiny = this.bookingService.bookingForm().destinyLngLtd;
    if (currentOrigin && currentDestiny) {
      this.ubicacionesSeleccionadas.emit({
        origen: currentOrigin,
        destino: currentDestiny,
      });
    }
  }

  private initAutocomplete(
    inputId: string,
    callback: (location: google.maps.places.PlaceResult | null) => void
  ) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'COL' },
      fields: ['geometry', 'name'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      callback(place || null);
    });
  }
}
