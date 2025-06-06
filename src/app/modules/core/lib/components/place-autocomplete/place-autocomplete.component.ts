import {
  Component,
  effect,
  viewChild,
  Signal,
  ElementRef,
  output,
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
  origenInput = viewChild<ElementRef<HTMLInputElement>>('origen');
  destinoInput = viewChild<ElementRef<HTMLInputElement>>('destino');

  constructor(
    protected bookingService: BookingServiceService,
  ) {
    effect(() => {
      this.initAutocomplete(this.origenInput, (location) => {
        this.origen = location?.geometry?.location || null;
        this.bookingService.originLngLtd.set(this.origen);
        this.bookingService.originLiteral.set(location?.name ?? "");
        this.checkAndEmitUbicaciones();
      });

      this.initAutocomplete(this.destinoInput, (location) => {
        this.destino = location?.geometry?.location || null;
        this.bookingService.destinyLngLtd.set(this.destino);
        this.bookingService.destinyLiteral.set(location?.name ?? "");
        this.checkAndEmitUbicaciones();
      });
    });
  }


  /**
   * Verifica si ambas ubicaciones están seleccionadas y emite el evento.
   */
  private checkAndEmitUbicaciones() {
    if (this.origen && this.destino) {
      this.ubicacionesSeleccionadas.emit({
        origen: this.origen,
        destino: this.destino,
      });
    }
  }

  /**
   * Inicializa Google Places Autocomplete en un input dado.
   * @param inputRef Referencia reactiva al input HTML.
   * @param callback Función a ejecutar cuando se selecciona un lugar.
   */
  private initAutocomplete(
    inputRef: Signal<ElementRef<HTMLInputElement> | undefined>,
    callback: (location: google.maps.places.PlaceResult | null) => void
  ) {
    const input = inputRef()?.nativeElement;
    if (!input) return;
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'CO' },
      fields: ['geometry', 'name'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      callback(place || null);
    });
  }
}
