# Travel Show - Componentes Partials

Esta carpeta contiene todos los componentes individuales que conforman la página de detalles del viaje. Cada componente es independiente y reutilizable, organizados en subcarpetas lógicas.

## Estructura de Carpetas

```
partials/
├── header/          # Componente de encabezado/navegación
├── map/            # Componente de mapa visual
├── route/          # Componente de ruta y actualizaciones
├── info/           # Componente de información del viaje
├── pricing/        # Componente de desglose de precios
└── driver/         # Componente de información del conductor
```

## Componentes

### 🏠 **TravelShowHeaderComponent**

- **Archivo**: `header/travel-show-header.component.*`
- **Propósito**: Header con navegación y título del viaje
- **Props**: `travelId`, `isLoading`
- **Eventos**: `backToTravels`

### 🗺️ **TravelMapSectionComponent**

- **Archivo**: `map/travel-map-section.component.*`
- **Propósito**: Sección del mapa visual de la ruta
- **Props**: `mapData`, `height`
- **Eventos**: `locationClick`, `mapClick`, `routeClick`

### 🛣️ **TravelRouteSectionComponent**

- **Archivo**: `route/travel-route-section.component.*`
- **Propósito**: Información detallada de la ruta con novedades
- **Props**: `routeInfo`, `maxUpdates`
- **Eventos**: `locationClick`, `updateClick`

### ℹ️ **TravelInfoSectionComponent**

- **Archivo**: `info/travel-info-section.component.*`
- **Propósito**: Información general del viaje (estado, duración, etc.)
- **Props**: `travelData`, `currentDate`

### 💰 **PriceBreakdownSectionComponent**

- **Archivo**: `pricing/price-breakdown-section.component.*`
- **Propósito**: Desglose detallado del precio del viaje
- **Props**: `priceData`
- **Características**:
  - Tarifa base, distancia, tiempo, servicio, impuestos
  - Descuentos (si aplican)
  - Total con badge de estado
  - Formateo de moneda automático

### 👨‍✈️ **DriverInfoSectionComponent**

- **Archivo**: `driver/driver-info-section.component.*`
- **Propósito**: Información completa del conductor y vehículo
- **Props**: `driverData`
- **Características**:
  - Foto/avatar del conductor
  - Rating con estrellas
  - Información del vehículo
  - Botones de acción (llamar, mensaje) - Estado del conductor

> **Nota**: El estado de carga ahora se maneja con el componente global `LoaderComponent` ubicado en `src/app/Components/Loader/`.

## Layout de la Página

```
┌─────────────────────────────────────┐
│          Header Navigation          │
├─────────────────────────────────────┤
│            Travel Map               │
├─────────────────┬───────────────────┤
│   Travel Info   │  Price Breakdown  │
├─────────────────┼───────────────────┤
│   Route Info    │   Driver Info     │
└─────────────────┴───────────────────┘
```

## Tipos de Datos

### PriceBreakdown

```typescript
interface PriceBreakdown {
  baseFare: number;
  distanceFee: number;
  timeFee: number;
  serviceFee: number;
  taxes: number;
  discount?: number;
  total: number;
  currency: string;
}
```

### DriverInfo

```typescript
interface DriverInfo {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  totalTrips: number;
  yearsExperience: number;
  vehicleInfo: {
    brand: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  phone: string;
  status: "active" | "completed" | "en_route";
}
```

## Uso en el Componente Principal

```typescript
// show.component.ts
import { TravelShowHeaderComponent } from "./partials/travel-show-header.component";
import { PriceBreakdownSectionComponent } from "./partials/price-breakdown-section.component";
// ... otros imports

@Component({
  imports: [
    TravelShowHeaderComponent,
    TravelMapSectionComponent,
    TravelRouteSectionComponent,
    TravelInfoSectionComponent,
    PriceBreakdownSectionComponent,
    DriverInfoSectionComponent,
    TravelLoadingComponent
  ]
})
```

```html
<!-- show.component.html -->
<cp-travel-show-header [travelId]="travelId()" (backToTravels)="onBackToTravels()"> </cp-travel-show-header>

<cp-price-breakdown-section [priceData]="priceData()"> </cp-price-breakdown-section>

<cp-driver-info-section [driverData]="driverData()"> </cp-driver-info-section>
```

## Características Técnicas

- ✅ **Standalone Components**: Todos son componentes independientes
- ✅ **Signal-based**: Uso de Angular Signals para reactividad
- ✅ **Typed Props**: TypeScript estricto con interfaces
- ✅ **Responsive Design**: Adaptación automática a diferentes pantallas
- ✅ **Event Handling**: Comunicación con componente padre via outputs
- ✅ **Modular CSS**: Cada componente tiene sus propios estilos
- ✅ **Accessibility**: Elementos semánticamente correctos

## Responsive Behavior

- **Desktop (>1024px)**: Layout de 2 columnas para info y precio/conductor
- **Tablet (768-1024px)**: Columna única, componentes apilados
- **Mobile (<768px)**: Diseño optimizado para pantallas pequeñas

## Futuras Mejoras

- [ ] Añadir modo oscuro a todos los componentes
- [ ] Implementar lazy loading para optimización
- [ ] Agregar animaciones de entrada más sofisticadas
- [ ] Soporte para internacionalización (i18n)
- [ ] Tests unitarios para cada componente
- [ ] Storybook para documentación visual
