# TravelMap Component

Componente que replica exactamente el diseño de mapa de viajes mostrado en la imagen proporcionada. Muestra un mapa visual simple con origen y destino conectados por una línea de ruta animada.

## Características

- **Diseño limpio y moderno**: Replica exactamente el diseño de la imagen
- **Puntos de origen y destino**: Marcadores visuales diferenciados por color
- **Línea de ruta animada**: Conexión visual entre origen y destino con puntos pulsantes
- **Totalmente responsivo**: Se adapta a diferentes tamaños de pantalla
- **Interactivo**: Clickeable con eventos personalizables
- **Tipado fuerte**: TypeScript completo con interfaces bien definidas

## Props de Entrada

| Prop           | Tipo            | Requerido | Default   | Descripción                             |
| -------------- | --------------- | --------- | --------- | --------------------------------------- |
| `mapData`      | `TravelMapData` | ✅ Sí     | -         | Datos del viaje (origen, destino, etc.) |
| `height`       | `string`        | ❌ No     | `'200px'` | Altura del componente                   |
| `showRoute`    | `boolean`       | ❌ No     | `true`    | Mostrar línea de ruta                   |
| `showDuration` | `boolean`       | ❌ No     | `false`   | Mostrar duración estimada               |
| `showDistance` | `boolean`       | ❌ No     | `false`   | Mostrar distancia                       |
| `interactive`  | `boolean`       | ❌ No     | `true`    | Habilitar interacciones                 |

## Eventos

| Evento          | Tipo             | Descripción                                             |
| --------------- | ---------------- | ------------------------------------------------------- |
| `locationClick` | `TravelLocation` | Se emite cuando se hace click en origen o destino       |
| `mapClick`      | `void`           | Se emite cuando se hace click en el contenedor del mapa |
| `routeClick`    | `void`           | Se emite cuando se hace click en la línea de ruta       |

## Uso Básico

```html
<cp-travel-map [mapData]="travelMapData" [height]="'200px'" [showRoute]="true" [interactive]="true" (locationClick)="onLocationClick($event)" (mapClick)="onMapClick()" (routeClick)="onRouteClick()"> </cp-travel-map>
```

## Ejemplo de Datos

```typescript
const travelMapData: TravelMapData = {
  id: "map-1",
  origin: {
    id: "origin-1",
    name: "Centro Comercial Plaza",
    address: "Av. Principal 456",
    type: "origin",
  },
  destination: {
    id: "dest-1",
    name: "Aeropuerto Internacional",
    address: "Terminal 1, Salidas",
    type: "destination",
  },
  estimatedDuration: 25, // minutos
  distance: 12.5, // km
  routeStatus: "active",
};
```

## Manejo de Eventos

```typescript
onLocationClick(location: TravelLocation): void {
    console.log('Location clicked:', location);
    // Manejar click en ubicación
}

onMapClick(): void {
    console.log('Map clicked');
    // Abrir mapa completo, etc.
}

onRouteClick(): void {
    console.log('Route clicked');
    // Mostrar detalles de ruta
}
```

## Estructura de Tipos

```typescript
interface TravelMapData {
  id: string;
  origin: TravelLocation;
  destination: TravelLocation;
  estimatedDuration?: number;
  distance?: number;
  routeStatus: "active" | "completed" | "planned" | "cancelled";
}

interface TravelLocation {
  id: string;
  name: string;
  address?: string;
  type: "origin" | "destination";
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
```

## Personalización

El componente está diseñado con CSS custom properties que pueden ser sobrescritas:

```css
cp-travel-map {
  --origin-color: #10b981;
  --destination-color: #ef4444;
  --route-gradient: linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #ef4444 100%);
  --background-gradient: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}
```

## Estados Responsive

- **Desktop**: Diseño completo con todas las funcionalidades
- **Tablet**: Elementos ligeramente más pequeños
- **Mobile**: Diseño compacto optimizado para pantallas pequeñas

## Futuras Mejoras

- Integración con APIs de mapas reales (Google Maps, Mapbox)
- Support para waypoints intermedios
- Animaciones más avanzadas
- Modo oscuro
- Información de tráfico en tiempo real
