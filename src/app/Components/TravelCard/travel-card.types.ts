/**
 * Tipos para el componente TravelCard
 */

// Importar el tipo centralizado de estado
import { TravelStatus, BadgeVariant, BadgeStyle } from '../../Types/travel.types';

// Información básica del viaje
export interface TravelInfo {
    id: string;
    title: string;
    date: string;
    time: string;
    price: number;
    status: TravelStatus;
    imageUrl?: string;
    destination?: string;
    driver?: string;
}

// Configuración del badge según el estado
export interface TravelStatusConfig {
    label: string;
    variant: BadgeVariant;
    style: BadgeStyle;
}

// Mapeo de estados a configuraciones de badge
export type TravelStatusMap = Record<TravelStatus, TravelStatusConfig>;
