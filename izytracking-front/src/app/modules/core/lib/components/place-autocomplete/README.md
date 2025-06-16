# PlaceAutocompleteComponent

Componente Angular para autocompletar lugares usando Google Places API.

## Descripción

Permite seleccionar origen y destino mediante autocompletado, integrando Google Maps y emitiendo eventos cuando ambas ubicaciones están seleccionadas.

## Uso

Incluye este componente en el módulo correspondiente y utilízalo en la vista para capturar ubicaciones.

## Props principales

- `origen`, `destino`: Ubicaciones seleccionadas.
- `ubicacionesSeleccionadas`: Evento emitido cuando ambas ubicaciones están listas.

## Dependencias

- `BookingServiceService`
- Google Maps JavaScript API

## Ejemplo de uso

```html
<app-place-autocomplete (ubicacionesSeleccionadas)="onUbicaciones($event)"></app-place-autocomplete>
```
