/**
 * Tipos compartidos para formularios de creación de recursos
 */

import { VehicleTypeDetailed as VehicleType, VehicleDriverStatus as DriverStatus } from './index';

// Datos del formulario de vehículo
export interface VehicleFormData {
    licensePlate: string;
    brand: string;
    model: string;
    year: number;
    type: VehicleType;
    capacity: number;
    color: string;
    features: string[];
    fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
    mileage: number;
    photo?: string;
}

// Datos del formulario de conductor
export interface DriverFormData {
    name: string;
    licenseNumber: string;
    licenseExpiry: Date;
    phone: string;
    email?: string;
    address?: string;
    dateOfBirth?: Date;
    yearsExperience: number;
    languages: string[];
    vehicleTypes: VehicleType[];
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    photo?: string;
}

// Configuración para formularios
export interface FormFieldConfig {
    required: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
}

// Opciones para selects
export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

// Configuración de validación de formularios
export const FORM_VALIDATION_CONFIG = {
    vehicle: {
        licensePlate: {
            required: true,
            pattern: '^[A-Z0-9]{3}-[A-Z0-9]{3}$'
        },
        brand: {
            required: true,
            minLength: 2
        },
        model: {
            required: true,
            minLength: 2
        },
        year: {
            required: true,
            min: 1990,
            max: new Date().getFullYear() + 1
        },
        capacity: {
            required: true,
            min: 1,
            max: 50
        },
        color: {
            required: true,
            minLength: 3
        },
        mileage: {
            required: true,
            min: 0
        }
    },
    driver: {
        name: {
            required: true,
            minLength: 3
        },
        licenseNumber: {
            required: true,
            pattern: '^LIC-[A-Z0-9]{5}$'
        },
        phone: {
            required: true,
            pattern: '^\\+?[0-9\\s\\-]{9,15}$'
        },
        yearsExperience: {
            required: true,
            min: 0,
            max: 50
        }
    }
} as const;

// Constantes para opciones de formularios
export const VEHICLE_TYPE_OPTIONS: SelectOption<VehicleType>[] = [
    { value: 'carro', label: 'Automóvil' },
    { value: 'van', label: 'Van/Minivan' },
    { value: 'bus', label: 'Bus/Ómnibus' }
];

export const FUEL_TYPE_OPTIONS: SelectOption[] = [
    { value: 'gasoline', label: 'Gasolina' },
    { value: 'diesel', label: 'Diésel' },
    { value: 'electric', label: 'Eléctrico' },
    { value: 'hybrid', label: 'Híbrido' }
];

export const AVAILABLE_LANGUAGES: string[] = [
    'Español',
    'Inglés',
    'Francés',
    'Portugués',
    'Italiano',
    'Alemán',
    'Japonés',
    'Chino',
    'Quechua',
    'Aimara'
];

export const RELATIONSHIP_TYPES: string[] = [
    'Esposo/a',
    'Padre/Madre',
    'Hijo/a',
    'Hermano/a',
    'Amigo/a',
    'Otro familiar'
];

export const AVAILABLE_VEHICLE_FEATURES: string[] = [
    'Aire acondicionado',
    'WiFi',
    'USB',
    'Música',
    'GPS',
    'Asientos reclinables',
    'Televisión',
    'Refrigerador',
    'Baño',
    'Cinturones de seguridad'
];
