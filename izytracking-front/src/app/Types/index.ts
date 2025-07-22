/**
 * Índice de tipos centralizados
 * 
 * Este archivo exporta todos los tipos relacionados con viajes y guías
 * de manera organizada para facilitar las importaciones
 */

// Tipos principales de viajes
export {
    TravelStatus,
    RouteStatus,
    DriverStatus as TravelDriverStatus,
    AllTravelStatuses,
    TravelStatusUtils,
    VehicleType as TravelVehicleType,
    VehicleTypeInfo,
    VEHICLE_TYPES
} from './travel.types';

// Tipos principales de guías
export {
    GuideStatus,
    GuideSpecialty,
    GuideLanguage,
    GuideInfo,
    GuideDetails,
    GuideReview,
    TourHistory,
    GuideStatusConfig,
    GuideStatusMap,
    GuideSpecialtyInfo,
    GuideLanguageInfo,
    GuideStatusUtils,
    GUIDE_SPECIALTIES,
    GUIDE_LANGUAGES,
    ALL_GUIDE_STATUSES,
    ACTIVE_GUIDE_STATUSES,
    AVAILABLE_GUIDE_STATUSES
} from './guide.types';

// Tipos de servicios de turismo
export {
    TourismServiceStatus,
    TourismService,
    GuideAssignment
} from './tourism-service.types';

// Tipos de vehículos y conductores
export {
    VehicleStatus,
    DriverStatus as VehicleDriverStatus,
    VehicleType as VehicleTypeDetailed,
    VehicleInfo,
    VehicleDetails,
    MaintenanceRecord,
    DriverInfo,
    DriverDetails,
    DriverReview,
    TransportAssignment,
    VehicleStatusConfig,
    DriverStatusConfig,
    VehicleStatusMap,
    DriverStatusMap,
    ACTIVE_VEHICLE_STATUSES,
    AVAILABLE_VEHICLE_STATUSES,
    ACTIVE_DRIVER_STATUSES,
    AVAILABLE_DRIVER_STATUSES,
    VehicleUtils,
    DriverUtils
} from './vehicle.types';

// Tipos de Badge (re-exportados desde el componente Badge)
export {
    BadgeVariant,
    BadgeStyle
} from './travel.types';

// Tipos de formularios
export {
    VehicleFormData,
    DriverFormData,
    FormFieldConfig,
    SelectOption,
    FORM_VALIDATION_CONFIG,
    VEHICLE_TYPE_OPTIONS,
    FUEL_TYPE_OPTIONS,
    AVAILABLE_LANGUAGES,
    RELATIONSHIP_TYPES,
    AVAILABLE_VEHICLE_FEATURES
} from './form.types';

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
