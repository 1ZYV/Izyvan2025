# Nuevo Flujo de Solicitudes de Servicios para Proveedores

## Descripción del Cambio

Se ha eliminado la funcionalidad de contratar guía directamente y el modal de servicios. Ahora el flujo funciona de la siguiente manera:

### Flujo Anterior (Eliminado)

1. Las agencias podían contratar guías directamente desde la página de guías
2. Existía un modal para asignar servicios a guías
3. Los guías se asignaban antes de que los proveedores aceptaran las solicitudes

### Nuevo Flujo

1. **Solicitud de Servicio**: Las agencias crean solicitudes de servicio que aparecen en la página de "Servicios" de los proveedores
2. **Filtrado por Tipo**: Los proveedores solo ven solicitudes relevantes a su tipo:
   - **Proveedores de Transporte**: Solo ven solicitudes de transporte
   - **Proveedores de Turismo**: Solo ven solicitudes de turismo
3. **Aceptación/Rechazo**: Los proveedores pueden aceptar o rechazar solicitudes pendientes
4. **Asignación de Recursos**: Solo después de aceptar una solicitud, los proveedores pueden asignar recursos:
   - **Turismo**: Asignar guías turísticos
   - **Transporte**: Asignar vehículos y conductores

## Estados de las Solicitudes

- **Pending**: Solicitud pendiente de respuesta del proveedor
- **Accepted**: Solicitud aceptada, pendiente de asignación de recursos
- **Rejected**: Solicitud rechazada por el proveedor
- **Assigned**: Recursos asignados, servicio en progreso
- **Completed**: Servicio completado

## Archivos Modificados

### Nuevos Archivos

- `src/app/Services/ServiceRequests/service-requests.service.ts`: Servicio para gestionar solicitudes
- `src/app/Components/ServiceRequestCard/`: Componente para mostrar tarjetas de solicitudes

### Archivos Modificados

- `src/app/Pages/Services/Index/`: Página principal para proveedores
- `src/app/Pages/Guides/Show/`: Eliminada funcionalidad de contratación directa
- `src/app/Services/Travels/travels.service.ts`: Eliminados métodos de asignación de guías
- `src/app/Services/TourismServices/tourism-services.service.ts`: Eliminados métodos de asignación

### Archivos Eliminados (Funcionalidad)

- Modal de asignación de guías (funcionalidad removida)
- Botón "Contratar Guía" (removido de la UI)

## Navegación

Los proveedores acceden a las solicitudes desde:

- **Sidebar** → **Servicios**

La página de servicios muestra diferentes secciones:

1. **Solicitudes Pendientes**: Para aceptar/rechazar
2. **Solicitudes Aceptadas**: Para asignar recursos
3. **Recursos Asignados**: Servicios en progreso
4. **Servicios Completados**: Historial de servicios finalizados

## Beneficios del Nuevo Flujo

1. **Mejor Control**: Los proveedores tienen control total sobre qué solicitudes aceptar
2. **Gestión de Capacidad**: Pueden evaluar su capacidad antes de comprometerse
3. **Separación de Responsabilidades**: Clara distinción entre tipos de proveedores
4. **Flujo Lógico**: Primero aceptación, luego asignación de recursos
5. **Transparencia**: Estado claro de cada solicitud en todo momento
