/**
 * Tipos para el componente TravelRoute
 */

import { RouteStatus } from '../../Types/travel.types';

// Información de una ubicación en la ruta
export interface RouteLocation {
    id: string;
    name: string;
    address?: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
    type: 'origin' | 'destination' | 'waypoint';
}

// Novedad durante el trayecto
export interface RouteUpdate {
    id: string;
    timestamp: Date;
    type: 'info' | 'warning' | 'delay' | 'accident' | 'construction';
    title: string;
    description: string;
    location?: string;
    estimatedDelay?: number; // en minutos
}

// Información completa de la ruta
export interface TravelRouteInfo {
    id: string;
    origin: RouteLocation;
    destination: RouteLocation;
    waypoints?: RouteLocation[];
    updates: RouteUpdate[];
    estimatedDuration?: number; // en minutos
    distance?: number; // en kilómetros
    status: RouteStatus;
}

// Configuración del mapa (para futuro uso)
export interface MapConfig {
    showTraffic: boolean;
    showWaypoints: boolean;
    zoomLevel: number;
    mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

// Configuración del componente
export interface TravelRouteConfig {
    showMap: boolean;
    mapHeight: string;
    showUpdates: boolean;
    maxUpdates?: number;
    autoRefresh?: boolean;
    refreshInterval?: number; // en segundos
}
