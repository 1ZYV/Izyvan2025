# ListServiceRequestComponent

Componente Angular para mostrar y gestionar la lista de solicitudes de servicio.

## Descripción

Muestra una lista de solicitudes de servicio, permitiendo visualizar detalles como origen, destino, estado, tipo de vehículo, fecha y hora. Integra íconos y componentes auxiliares para mejorar la experiencia de usuario.

## Uso

Incluye este componente en el módulo correspondiente y utilízalo en la vista para mostrar las solicitudes de servicio.

## Props principales

- `serviceRequests`: Lista reactiva de solicitudes de servicio.
- `userRole`: Rol del usuario autenticado.
- `providerType`: Tipo de proveedor autenticado.

## Dependencias

- `AuthenticationService`
- `RecentServiceRequestComponent`
- `RefreshIconComponent`
- `SearchIconComponent`

## Ejemplo de uso

```html
<app-list-service-request></app-list-service-request>
```
