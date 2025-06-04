import {
  Component,
  NgZone,
  AfterViewInit,
  Output,
  EventEmitter,
  WritableSignal,
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
export class PlaceAutocompleteComponent implements AfterViewInit {
  /** Ubicación de origen seleccionada */
  origen: google.maps.LatLng | null = null;
  /** Ubicación de destino seleccionada */
  destino: google.maps.LatLng | null = null;

  /** Evento emitido cuando ambas ubicaciones están seleccionadas */
  ubicacionesSeleccionadas = output<{
    origen: google.maps.LatLng;
    destino: google.maps.LatLng;
  }>();

  /**
   * Constructor del componente.
   * @param ngZone Servicio de Angular para ejecutar código dentro o fuera de la zona.
   * @param bookingService Servicio para gestionar el estado de la reserva.
   */

  constructor(
    private ngZone: NgZone,
    protected bookingService: BookingServiceService
  ) { }

  /**
   * Hook de ciclo de vida que inicializa los autocompletados de origen y destino.
   */
  ngAfterViewInit(): void {
    // Inicializa el autocompletado para el input de origen
    this.initAutocomplete('origen', (location) => {
      this.ngZone.run(() => {
        this.origen = location?.geometry?.location || null;
        this.bookingService.originLngLtd.set(location?.geometry?.location || null);
        this.bookingService.originLiteral.set(location?.name ?? "");
        this.checkAndEmitUbicaciones();
      });
    });
    // Inicializa el autocompletado para el input de destino
    this.initAutocomplete('destino', (location) => {
      this.ngZone.run(() => {
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
      const location = place || null;
      callback(location);
    });
  }
}
