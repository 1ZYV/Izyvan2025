import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core'; // Import Injectable for service and signal for reactive state
import { Router } from '@angular/router';

/**
 * Servicio para gestionar el estado y la lógica de reservas de servicios.
 * Utiliza signals para almacenar datos temporales y realiza la petición de reserva.
 */
@Injectable({
  providedIn: 'root',
})
export class BookingServiceService {
  /** Signal para el tipo de vehículo seleccionado */
  selectedVehicleType = signal<number | null>(null);
  /** Signal para la ubicación de origen */
  originLngLtd = signal<google.maps.LatLng | null>(null);
  /** Signal para la ubicación de destino */
  destinyLngLtd = signal<google.maps.LatLng | null>(null);
  /** Dirección de origen en texto */
  originLiteral = signal<string>("");
  /** Dirección de destino en texto */
  destinyLiteral = signal<string>("");
  /** Indica si se requiere guía turística */
  includeTourismGuide = signal<boolean>(false);
  /** Nombre de referencia de la solicitud */
  nameReference = signal<string>("");
  /** Número de pasajeros */
  passengerNumber = signal<number>(0);
  /** Descripción adicional */
  description = signal<string>("");
  /** Fecha de la solicitud */
  date = signal<string>("");
  /** Hora de la solicitud */
  time = signal<string>("");

  /**
   * Constructor que inyecta HttpClient y Router.
   */
  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Realiza la petición de reserva de servicio con los datos actuales.
   * Maneja la navegación y errores tras la respuesta.
   */
  public bookingServiceRequest() {

    this.http.post('http://localhost:8080/api/v1/service-request', this.bookingForm()).subscribe({
      next: (response) => {
        console.log('Service request booked successfully:', response);
        this.router.navigate(['/dashboard/services/tariffs']);
      },
      error: (error) => {
        console.error('Error booking service request:', error);
        this.router.navigate(['/dashboard/services/tariffs']);
      },
    });
  }
}
