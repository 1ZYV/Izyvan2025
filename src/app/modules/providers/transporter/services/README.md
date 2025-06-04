# Servicios de Proveedores de Transporte

Este folder contiene los servicios para la gestión de proveedores de transporte.

## Servicios principales

### TransportProvidersServiceService

- Permite obtener la lista de proveedores de transporte.
- Permite buscar un proveedor por su ID.
- Actualmente retorna datos mock, pero está preparado para integrarse con una API REST.

## Ejemplo de uso

```typescript
constructor(private transportService: TransportProvidersServiceService) {}

const providers = this.transportService.getTransportProviders()();
```
