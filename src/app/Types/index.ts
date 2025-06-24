/**
 * Índice de tipos centralizados
 * 
 * Este archivo exporta todos los tipos relacionados con viajes
 * de manera organizada para facilitar las importaciones
 */

// Tipos principales de viajes
export {
    TravelStatus,
    RouteStatus,
    DriverStatus,
    AllTravelStatuses,
    TravelStatusUtils,
    VehicleType,
    VehicleTypeInfo,
    VEHICLE_TYPES
} from './travel.types';

// Tipos de Badge (re-exportados desde el componente Badge)
export {
    BadgeVariant,
    BadgeStyle
} from './travel.types';

// Importar para uso interno
import { TravelStatus, RouteStatus } from './travel.types';

// Tipos de componentes específicos
export type { TravelInfo } from '../Components/TravelCard/travel-card.types';
export type { TravelRouteInfo, RouteLocation, RouteUpdate } from '../Components/TravelRoute/travel-route.types';
export type { TravelMapData, TravelLocation } from '../Components/TravelMap/travel-map.types';

// Tipos de servicios
export type { Travel, TravelDetails, TravelListItem } from '../Services/Travels/travels.service';
export type { TravelStatusInfo, TravelStatusActions } from '../Services/TravelStatus/travel-status.service';

/**
 * Constantes para estados basadas en el flujo del sistema
 */
export const TRAVEL_STATUS_CONSTANTS = {
    SOLICITUD_SERVICIO: 'solicitud-servicio' as const,
    ELECCION_TARIFAS: 'eleccion-tarifas' as const,
    PROCESAMIENTO_TRANSPORTISTA: 'procesamiento-transportista' as const,
    ASIGNACION_CONDUCTOR: 'asignacion-conductor' as const,
    LLEGADA_CONDUCTOR: 'llegada-conductor' as const,
    COMIENZO_VIAJE: 'comienzo-viaje' as const,
    EN_PROGRESO: 'en-progreso' as const,
    FIN_VIAJE: 'fin-viaje' as const,
    CANCELADO_TURISMO: 'cancelado-turismo' as const,
    CANCELADO_TRANSPORTISTA: 'cancelado-transportista' as const,
    CANCELADO_AGENCIA: 'cancelado-agencia' as const,
    SIN_PROVEEDORES: 'sin-proveedores' as const,
    FIN_SERVICIO: 'fin-servicio' as const,
} as const;

export const ROUTE_STATUS_CONSTANTS = {
    PLANNED: 'planned' as const,
    ACTIVE: 'active' as const,
    COMPLETED: 'completed' as const,
    CANCELLED: 'cancelled' as const,
} as const;

/**
 * Type guards para verificación de tipos en runtime
 */
export const isValidTravelStatus = (status: string): status is TravelStatus => {
    return Object.values(TRAVEL_STATUS_CONSTANTS).includes(status as TravelStatus);
};

export const isValidRouteStatus = (status: string): status is RouteStatus => {
    return Object.values(ROUTE_STATUS_CONSTANTS).includes(status as RouteStatus);
};
