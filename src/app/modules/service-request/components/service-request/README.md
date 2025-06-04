# ServiceRequestComponent

Componente Angular para la creación de nuevas solicitudes de servicio.

## Descripción

Permite a los usuarios crear una nueva solicitud de servicio, seleccionando origen, destino, tipo de vehículo, número de pasajeros, fecha, hora y otros detalles. Utiliza formularios reactivos y servicios para gestionar el estado y la lógica de negocio.

## Uso

Incluye este componente en el módulo correspondiente y utilízalo en la vista para permitir la creación de solicitudes de servicio.

## Props principales

- `serviceRequestForm`: Formulario reactivo para la solicitud.
- `center`, `zoom`: Señales para el mapa.

## Dependencias

- `BookingServiceService`
- `GoogleMapsModule`
- `PlaceAutocompleteComponent`
- `VehicleTypeSelectorComponent`

## Ejemplo de uso

```html
<app-service-request></app-service-request>
```
