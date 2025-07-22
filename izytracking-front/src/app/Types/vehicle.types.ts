/**
 * Tipos centralizados para vehículos y conductores
 * Este archivo contiene todos los tipos relacionados con transporte
 * para garantizar consistencia en toda la aplicación
 */

// Estado de disponibilidad de vehículos
export type VehicleStatus =
    | 'available'    // Disponible para asignación
    | 'busy'         // Ocupado en servicio
    | 'maintenance'  // En mantenimiento
    | 'inactive';    // Inactivo

// Estado de disponibilidad de conductores
export type DriverStatus =
    | 'available'    // Disponible para asignación
    | 'busy'         // Ocupado en servicio
    | 'offline'      // Sin conexión
    | 'inactive';    // Inactivo

// Tipos de vehículos
export type VehicleType = 'carro' | 'van' | 'bus';

// Información básica del vehículo
export interface VehicleInfo {
    id: string;
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    type: VehicleType;
    capacity: number;
    status: VehicleStatus;
    photo?: string;
    color: string;
    features: string[];
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    mileage: number;
    lastMaintenance: Date;
}

// Información detallada del vehículo
export interface VehicleDetails extends VehicleInfo {
    documents?: {
        soat?: string;
        technicalReview?: string;
        circulation?: string;
    };
    maintenanceHistory?: MaintenanceRecord[];
    tripHistory?: string[];
}

// Registro de mantenimiento
export interface MaintenanceRecord {
    id: string;
    date: Date;
    type: 'preventive' | 'corrective' | 'emergency';
    description: string;
    cost: number;
    mechanic: string;
    nextDue?: Date;
}

// Información básica del conductor
export interface DriverInfo {
    id: string;
    name: string;
    photo?: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phone: string;
    email?: string;
    status: DriverStatus;
    rating: number;
    totalTrips: number;
    yearsExperience: number;
    languages: string[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

// Información detallada del conductor
export interface DriverDetails extends DriverInfo {
    address?: string;
    dateOfBirth?: Date;
    hireDate: Date;
    vehicleTypes: VehicleType[];
    reviews?: DriverReview[];
    tripHistory?: string[];
    documents?: {
        license?: string;
        criminalRecord?: string;
        medicalCertificate?: string;
    };
}

// Reseña de conductor
export interface DriverReview {
    id: string;
    passengerName: string;
    rating: number;
    comment: string;
    date: Date;
    tripId: string;
}

// Asignación de recursos de transporte
export interface TransportAssignment {
    vehicleId: string;
    driverId: string;
    assignedAt: Date;
    assignedBy: string;
}

// Configuración de estado de vehículos
export interface VehicleStatusConfig {
    label: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
    style: 'filled' | 'outline';
    icon: string;
}

// Mapa de configuración de estados de vehículos
export const VehicleStatusMap: Record<VehicleStatus, VehicleStatusConfig> = {
    available: {
        label: 'Disponible',
        variant: 'success',
        style: 'filled',
        icon: '✅'
    },
    busy: {
        label: 'Ocupado',
        variant: 'warning',
        style: 'filled',
        icon: '🚗'
    },
    maintenance: {
        label: 'Mantenimiento',
        variant: 'danger',
        style: 'filled',
        icon: '🔧'
    },
    inactive: {
        label: 'Inactivo',
        variant: 'secondary',
        style: 'outline',
        icon: '⏸️'
    }
};

// Configuración de estado de conductores
export interface DriverStatusConfig {
    label: string;
    variant: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
    style: 'filled' | 'outline';
    icon: string;
}

// Mapa de configuración de estados de conductores
export const DriverStatusMap: Record<DriverStatus, DriverStatusConfig> = {
    available: {
        label: 'Disponible',
        variant: 'success',
        style: 'filled',
        icon: '✅'
    },
    busy: {
        label: 'Ocupado',
        variant: 'warning',
        style: 'filled',
        icon: '🚙'
    },
    offline: {
        label: 'Desconectado',
        variant: 'secondary',
        style: 'outline',
        icon: '📴'
    },
    inactive: {
        label: 'Inactivo',
        variant: 'secondary',
        style: 'outline',
        icon: '⏸️'
    }
};

// Estados activos de vehículos
export const ACTIVE_VEHICLE_STATUSES: VehicleStatus[] = ['available', 'busy'];
export const AVAILABLE_VEHICLE_STATUSES: VehicleStatus[] = ['available'];

// Estados activos de conductores
export const ACTIVE_DRIVER_STATUSES: DriverStatus[] = ['available', 'busy'];
export const AVAILABLE_DRIVER_STATUSES: DriverStatus[] = ['available'];

// Funciones de utilidad
export const VehicleUtils = {
    getStatusConfig(status: VehicleStatus): VehicleStatusConfig {
        return VehicleStatusMap[status];
    },

    isAvailable(status: VehicleStatus): boolean {
        return status === 'available';
    },

    formatCapacity(capacity: number): string {
        return `${capacity} pasajero${capacity !== 1 ? 's' : ''}`;
    },

    formatMileage(mileage: number): string {
        return `${mileage.toLocaleString()} km`;
    }
};

export const DriverUtils = {
    getStatusConfig(status: DriverStatus): DriverStatusConfig {
        return DriverStatusMap[status];
    },

    isAvailable(status: DriverStatus): boolean {
        return status === 'available';
    },

    formatExperience(years: number): string {
        return `${years} año${years !== 1 ? 's' : ''} de experiencia`;
    },

    formatTrips(trips: number): string {
        return `${trips} viaje${trips !== 1 ? 's' : ''} completados`;
    }
};
