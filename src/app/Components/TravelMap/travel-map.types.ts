/**
 * Tipos para el componente TravelMap
 */

// Ubicación del viaje
export interface TravelLocation {
    id: string;
    name: string;
    address?: string;
    type: 'origin' | 'destination';
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

// Información del mapa de viaje
export interface TravelMapData {
    id: string;
    origin: TravelLocation;
    destination: TravelLocation;
    estimatedDuration?: number; // en minutos
    distance?: number; // en kilómetros
    routeStatus: 'active' | 'completed' | 'planned' | 'cancelled';
}

// Configuración del componente
export interface TravelMapConfig {
    showRoute: boolean;
    showDuration: boolean;
    showDistance: boolean;
    interactive: boolean;
    height: string;
}

// Eventos del componente
export interface TravelMapEvents {
    locationClick: (location: TravelLocation) => void;
    mapClick: () => void;
    routeClick: () => void;
}
