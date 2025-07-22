/**
 * Tipos centralizados para los viajes
 * Este archivo contiene todos los tipos relacionados con viajes
 * para garantizar consistencia en toda la aplicación
 */

// Importar tipos del Badge component
import { BadgeVariant, BadgeStyle } from '../Components/Badge/badge.types';

// Re-export para fácil acceso
export { BadgeVariant, BadgeStyle } from '../Components/Badge/badge.types';

// Estado principal de los viajes basado en el flujo del sistema
export type TravelStatus =
    | 'solicitud-servicio'           // Solicitud de Servicio (inicio)
    | 'eleccion-tarifas'            // Elección de Tarifas
    | 'procesamiento-transportista'  // Procesamiento de Transportista
    | 'asignacion-conductor'        // Asignación de Conductor
    | 'llegada-conductor'           // Llegada del Conductor
    | 'comienzo-viaje'              // Comienzo del Viaje
    | 'en-progreso'                 // En Progreso
    | 'fin-viaje'                   // Fin del Viaje
    | 'cancelado-turismo'           // Cancelado por el Turismo
    | 'cancelado-transportista'     // Cancelado por el Transportista
    | 'cancelado-agencia'           // Cancelado por la Agencia
    | 'sin-proveedores'             // No hay proveedores disponibles
    | 'fin-servicio';               // Fin del Servicio (completado)

// Estados específicos para rutas (mapeo simplificado)
export type RouteStatus =
    | 'planned'        // Planificado
    | 'active'         // En curso
    | 'completed'      // Completado (mantener para compatibilidad con componentes de ruta)
    | 'cancelled';     // Cancelado (mantener para compatibilidad con componentes de ruta)

// Estados de conductor
export type DriverStatus =
    | 'active'       // Activo y disponible
    | 'busy'         // Ocupado en viaje
    | 'offline'      // Sin conexión
    | 'inactive';    // Inactivo

// Tipos de vehículos estandarizados
export type VehicleType = 'van' | 'carro' | 'bus';

// Información detallada de tipos de vehículos
export interface VehicleTypeInfo {
    id: VehicleType;
    name: string;
    description: string;
    icon: string;
    capacity: number;
    basePrice: number;
    features: string[];
}

// Configuración de vehículos disponibles
export const VEHICLE_TYPES: Record<VehicleType, VehicleTypeInfo> = {
    carro: {
        id: 'carro',
        name: 'Carro',
        description: 'Vehículo estándar para hasta 4 pasajeros',
        icon: '🚗',
        capacity: 4,
        basePrice: 12.50,
        features: ['Aire acondicionado', 'Música', 'Asientos cómodos']
    },
    van: {
        id: 'van',
        name: 'Van',
        description: 'Vehículo espacioso para hasta 7 pasajeros',
        icon: '🚐',
        capacity: 7,
        basePrice: 18.75,
        features: ['Extra espacio', 'Aire acondicionado', 'Equipaje adicional']
    },
    bus: {
        id: 'bus',
        name: 'Bus',
        description: 'Transporte grupal para hasta 20 pasajeros',
        icon: '🚌',
        capacity: 20,
        basePrice: 35.00,
        features: ['Grupos grandes', 'Aire acondicionado', 'WiFi', 'Baño']
    }
};

// Union type para todos los estados posibles en la aplicación
export type AllTravelStatuses = TravelStatus | RouteStatus;

/**
 * Funciones de utilidad para trabajar con estados basados en el flujo del sistema
 */
export const TravelStatusUtils = {
    /**
     * Verifica si un estado es válido según el flujo del sistema
     */
    isValidTravelStatus(status: string): status is TravelStatus {
        return [
            'solicitud-servicio', 'eleccion-tarifas', 'procesamiento-transportista',
            'asignacion-conductor', 'llegada-conductor', 'comienzo-viaje',
            'en-progreso', 'fin-viaje', 'cancelado-turismo', 'cancelado-transportista',
            'cancelado-agencia', 'sin-proveedores', 'fin-servicio'
        ].includes(status);
    },

    /**
     * Mapea un estado de viaje a un estado de ruta
     */
    mapToRouteStatus(status: TravelStatus): RouteStatus {
        switch (status) {
            case 'solicitud-servicio':
            case 'eleccion-tarifas':
            case 'procesamiento-transportista':
            case 'asignacion-conductor':
                return 'planned';
            case 'llegada-conductor':
            case 'comienzo-viaje':
            case 'en-progreso':
                return 'active';
            case 'fin-viaje':
            case 'fin-servicio':
                return 'completed';
            case 'cancelado-turismo':
            case 'cancelado-transportista':
            case 'cancelado-agencia':
            case 'sin-proveedores':
                return 'cancelled';
            default:
                return 'planned';
        }
    },

    /**
     * Obtiene todos los estados de viaje posibles según el flujo
     */
    getAllTravelStatuses(): TravelStatus[] {
        return [
            'solicitud-servicio', 'eleccion-tarifas', 'procesamiento-transportista',
            'asignacion-conductor', 'llegada-conductor', 'comienzo-viaje',
            'en-progreso', 'fin-viaje', 'cancelado-turismo', 'cancelado-transportista',
            'cancelado-agencia', 'sin-proveedores', 'fin-servicio'
        ];
    },

    /**
     * Verifica si un viaje está en un estado activo (en curso)
     */
    isActiveStatus(status: TravelStatus): boolean {
        return status === 'comienzo-viaje' || status === 'en-progreso';
    },

    /**
     * Verifica si un viaje está en un estado finalizado
     */
    isFinishedStatus(status: TravelStatus): boolean {
        return status === 'fin-viaje' || status === 'fin-servicio' ||
            status === 'cancelado-turismo' || status === 'cancelado-transportista' ||
            status === 'cancelado-agencia' || status === 'sin-proveedores';
    },

    /**
     * Verifica si un viaje está en proceso inicial
     */
    isPendingStatus(status: TravelStatus): boolean {
        return status === 'solicitud-servicio' || status === 'eleccion-tarifas' ||
            status === 'procesamiento-transportista' || status === 'asignacion-conductor';
    },

    /**
     * Verifica si un viaje fue cancelado
     */
    isCancelledStatus(status: TravelStatus): boolean {
        return status === 'cancelado-turismo' || status === 'cancelado-transportista' ||
            status === 'cancelado-agencia' || status === 'sin-proveedores';
    },

    /**
     * Obtiene el motivo de cancelación
     */
    getCancellationReason(status: TravelStatus): string {
        switch (status) {
            case 'cancelado-turismo': return 'Cancelado por el Turismo';
            case 'cancelado-transportista': return 'Cancelado por el Transportista';
            case 'cancelado-agencia': return 'Cancelado por la Agencia';
            case 'sin-proveedores': return 'No hay proveedores disponibles';
            default: return '';
        }
    },

    /**
     * Obtiene la descripción del estado
     */
    getStatusDescription(status: TravelStatus): string {
        switch (status) {
            case 'solicitud-servicio': return 'Solicitud de Servicio';
            case 'eleccion-tarifas': return 'Elección de Tarifas';
            case 'procesamiento-transportista': return 'Procesamiento de Transportista';
            case 'asignacion-conductor': return 'Asignación de Conductor';
            case 'llegada-conductor': return 'Llegada del Conductor';
            case 'comienzo-viaje': return 'Comienzo del Viaje';
            case 'en-progreso': return 'En Progreso';
            case 'fin-viaje': return 'Fin del Viaje';
            case 'fin-servicio': return 'Fin del Servicio';
            case 'cancelado-turismo': return 'Cancelado por el Turismo';
            case 'cancelado-transportista': return 'Cancelado por el Transportista';
            case 'cancelado-agencia': return 'Cancelado por la Agencia';
            case 'sin-proveedores': return 'No hay proveedores disponibles';
            default: return status;
        }
    }
};

// Interface para los viajes del historial (solo viajes finalizados)
export interface HistoryTrip {
    id: string;
    destination: string;
    address: string;
    date: string;
    time: string;
    price: number;
    status: 'fin-servicio' | 'cancelado-turismo' | 'cancelado-transportista' | 'cancelado-agencia' | 'sin-proveedores';
    driver: {
        name: string;
        rating: number;
    };
    route: {
        origin: string;
        destination: string;
        coordinates?: {
            origin: { lat: number; lng: number };
            destination: { lat: number; lng: number };
        };
    };
    // Información adicional del contexto del flujo
    cancellationReason?: string;
    includesTourismService?: boolean;
    reportedIncidents?: string[];
}
