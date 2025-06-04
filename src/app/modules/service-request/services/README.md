# Servicios de Service Request

Este folder contiene los servicios relacionados con la gestión y operación de solicitudes de servicio.

## Servicios principales

### BookingServiceService

- Gestiona el estado temporal de la reserva de un servicio.
- Utiliza signals para almacenar datos como origen, destino, tipo de vehículo, fecha, hora, etc.
- Realiza la petición HTTP para crear una nueva solicitud de servicio.

### ServiceRequestOperationService

- Proporciona métodos para consultar solicitudes de servicio por ID, usuario, proveedor o todas.
- Utiliza HttpClient para interactuar con la API backend.

## Ejemplo de uso

```typescript
constructor(private bookingService: BookingServiceService) {}

this.bookingService.bookingServiceRequest();
```
