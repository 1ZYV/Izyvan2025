import {
  Component,
  NgZone,
  AfterViewInit,
  Output,
  EventEmitter,
  WritableSignal,
  output,
  effect,
  viewChild,
  Signal,
} from '@angular/core';
import { BookingServiceService } from '../../../../service-request/services/booking-service.service';

/**
 * Componente para autocompletar lugares usando Google Places API.
 * Permite seleccionar origen y destino, emitiendo un evento cuando ambas ubicaciones están listas.
 */
@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  templateUrl: './place-autocomplete.component.html',
  styleUrls: ['./place-autocomplete.component.css'],
})
export class PlaceAutocompleteComponent {
  /** Ubicación de origen seleccionada */
  origen: google.maps.LatLng | null = null;
  /** Ubicación de destino seleccionada */
  destino: google.maps.LatLng | null = null;

  /** Evento emitido cuando ambas ubicaciones están seleccionadas */
  ubicacionesSeleccionadas = output<{
    origen: google.maps.LatLng;
    destino: google.maps.LatLng;
  }>();

  // Referencias a los inputs usando la nueva API de @ViewChild (Angular 16+)
  origenInput = viewChild<HTMLInputElement>('origen');
  destinoInput = viewChild<HTMLInputElement>('destino');

  /**
   * Constructor del componente.
   * @param ngZone Servicio de Angular para ejecutar código dentro o fuera de la zona.
   * @param bookingService Servicio para gestionar el estado de la reserva.
   */

  constructor(
    protected bookingService: BookingServiceService
  ) {
    effect(() => {
      // Inicializa el autocompletado para el input de origen
      this.initAutocomplete(this.origenInput, (location) => {
        this.origen = location?.geometry?.location || null;
        this.bookingService.originLngLtd.set(location?.geometry?.location || null);
        this.bookingService.originLiteral.set(location?.name ?? "");
        this.checkAndEmitUbicaciones();
      });
      // Inicializa el autocompletado para el input de destino
      this.initAutocomplete(this.destinoInput, (location) => {
        this.destino = location?.geometry?.location || null;
        this.bookingService.destinyLngLtd.set(location?.geometry?.location || null);
        this.bookingService.destinyLiteral.set(location?.name ?? "");

        this.checkAndEmitUbicaciones();
      });
    });
  }


  /**
   * Verifica si ambas ubicaciones están seleccionadas y emite el evento.
   */
  private checkAndEmitUbicaciones() {
    const currentOrigin = this.bookingService.originLngLtd();
    const currentDestiny = this.bookingService.destinyLngLtd();
    if (currentOrigin && currentDestiny) {
      this.ubicacionesSeleccionadas.emit({
        origen: currentOrigin,
        destino: currentDestiny,
      });
    }
  }

  /**
   * Inicializa Google Places Autocomplete en un input dado.
   * @param inputId ID del input HTML.
   * @param callback Función a ejecutar cuando se selecciona un lugar.
   */



  private initAutocomplete(
    inputRef: Signal<HTMLInputElement | undefined>,
    callback: (location: google.maps.places.PlaceResult | null) => void
  ) {
    const input = inputRef();
    if (!input) return;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'COL' },
      fields: ['geometry', 'name'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const location = place || null;
      callback(location);
    });
  }
}
