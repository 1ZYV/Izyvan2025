/**
 * Tipos centralizados para guías turísticos
 * Este archivo contiene todos los tipos relacionados con guías
 * para garantizar consistencia en toda la aplicación
 */

// Importar tipos del Badge component
import { BadgeVariant, BadgeStyle } from '../Components/Badge/badge.types';

// Estado de disponibilidad de las guías
export type GuideStatus =
    | 'available'    // Disponible para asignación
    | 'busy'         // Ocupado en servicio
    | 'offline'      // Sin conexión
    | 'inactive';    // Inactivo

// Especialidades de guías turísticos
export type GuideSpecialty =
    | 'history'      // Historia
    | 'nature'       // Naturaleza
    | 'culture'      // Cultura
    | 'adventure'    // Aventura
    | 'gastronomy'   // Gastronomía
    | 'architecture' // Arquitectura
    | 'general';     // General

// Idiomas que puede hablar el guía
export type GuideLanguage =
    | 'es'           // Español
    | 'en'           // Inglés
    | 'fr'           // Francés
    | 'de'           // Alemán
    | 'it'           // Italiano
    | 'pt';          // Portugués

// Información básica del guía
export interface GuideInfo {
    id: string;
    name: string;
    photo?: string;
    status: GuideStatus;
    rating: number;
    totalTours: number;
    yearsExperience: number;
    specialties: GuideSpecialty[];
    languages: GuideLanguage[];
    hourlyRate: number;
    description?: string;
    phone: string;
    email?: string;
    certifications?: string[];
    location?: string;
    availableFrom?: string; // Horario de disponibilidad
    availableTo?: string;
}

// Información detallada del guía
export interface GuideDetails extends GuideInfo {
    portfolio?: string[];           // URLs de fotos del portafolio
    reviews?: GuideReview[];        // Reseñas de turistas
    completedTours?: TourHistory[]; // Historial de tours completados
    serviceArea?: string[];         // Áreas de servicio
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
}

// Reseña de guía
export interface GuideReview {
    id: string;
    touristName: string;
    rating: number;
    comment: string;
    date: Date;
    tourType: string;
}

// Historial de tours
export interface TourHistory {
    id: string;
    date: Date;
    duration: number;
    groupSize: number;
    location: string;
    type: GuideSpecialty;
    rating: number;
}

// Configuración del badge según el estado
export interface GuideStatusConfig {
    label: string;
    variant: BadgeVariant;
    style: BadgeStyle;
}

// Mapeo de estados a configuraciones de badge
export type GuideStatusMap = Record<GuideStatus, GuideStatusConfig>;

// Especialidades con información detallada
export interface GuideSpecialtyInfo {
    id: GuideSpecialty;
    name: string;
    description: string;
    icon: string;
    demandLevel: 'low' | 'medium' | 'high';
    averageRate: number;
}

// Mapeo de especialidades
export const GUIDE_SPECIALTIES: Record<GuideSpecialty, GuideSpecialtyInfo> = {
    history: {
        id: 'history',
        name: 'Historia',
        description: 'Especialista en historia y patrimonio cultural',
        icon: '🏛️',
        demandLevel: 'high',
        averageRate: 25
    },
    nature: {
        id: 'nature',
        name: 'Naturaleza',
        description: 'Experto en ecoturismo y naturaleza',
        icon: '🌿',
        demandLevel: 'high',
        averageRate: 30
    },
    culture: {
        id: 'culture',
        name: 'Cultura',
        description: 'Conocedor de tradiciones y cultura local',
        icon: '🎭',
        demandLevel: 'medium',
        averageRate: 22
    },
    adventure: {
        id: 'adventure',
        name: 'Aventura',
        description: 'Guía de turismo de aventura y deportes extremos',
        icon: '🏔️',
        demandLevel: 'medium',
        averageRate: 35
    },
    gastronomy: {
        id: 'gastronomy',
        name: 'Gastronomía',
        description: 'Especialista en tours gastronómicos',
        icon: '🍽️',
        demandLevel: 'medium',
        averageRate: 28
    },
    architecture: {
        id: 'architecture',
        name: 'Arquitectura',
        description: 'Experto en arquitectura y urbanismo',
        icon: '🏗️',
        demandLevel: 'low',
        averageRate: 26
    },
    general: {
        id: 'general',
        name: 'General',
        description: 'Guía general de turismo',
        icon: '📍',
        demandLevel: 'high',
        averageRate: 20
    }
};

// Información de idiomas
export interface GuideLanguageInfo {
    id: GuideLanguage;
    name: string;
    flag: string;
    demandLevel: 'low' | 'medium' | 'high';
}

// Mapeo de idiomas
export const GUIDE_LANGUAGES: Record<GuideLanguage, GuideLanguageInfo> = {
    es: { id: 'es', name: 'Español', flag: '🇪🇸', demandLevel: 'high' },
    en: { id: 'en', name: 'Inglés', flag: '🇺🇸', demandLevel: 'high' },
    fr: { id: 'fr', name: 'Francés', flag: '🇫🇷', demandLevel: 'medium' },
    de: { id: 'de', name: 'Alemán', flag: '🇩🇪', demandLevel: 'medium' },
    it: { id: 'it', name: 'Italiano', flag: '🇮🇹', demandLevel: 'medium' },
    pt: { id: 'pt', name: 'Portugués', flag: '🇵🇹', demandLevel: 'low' }
};

// Utilidades para trabajar con estados de guías
export class GuideStatusUtils {
    // Mapeo de estados a configuraciones de badge
    private static readonly statusMap: GuideStatusMap = {
        available: {
            label: 'Disponible',
            variant: 'primary',
            style: 'filled'
        },
        busy: {
            label: 'Ocupado',
            variant: 'warning',
            style: 'filled'
        },
        offline: {
            label: 'Sin conexión',
            variant: 'secondary',
            style: 'outline'
        },
        inactive: {
            label: 'Inactivo',
            variant: 'secondary',
            style: 'ghost'
        }
    };

    // Obtener configuración de badge para un estado
    static getStatusConfig(status: GuideStatus): GuideStatusConfig {
        return this.statusMap[status];
    }

    // Verificar si un guía está disponible para ser asignado
    static isAvailable(status: GuideStatus): boolean {
        return status === 'available';
    }

    // Verificar si un guía está activo (disponible u ocupado)
    static isActive(status: GuideStatus): boolean {
        return status === 'available' || status === 'busy';
    }

    // Obtener todos los estados disponibles
    static getAllStatuses(): GuideStatus[] {
        return Object.keys(this.statusMap) as GuideStatus[];
    }

    // Type guard para verificar si un string es un GuideStatus válido
    static isValidStatus(status: string): status is GuideStatus {
        return this.getAllStatuses().includes(status as GuideStatus);
    }
}

// Constantes útiles
export const ALL_GUIDE_STATUSES: GuideStatus[] = ['available', 'busy', 'offline', 'inactive'];
export const ACTIVE_GUIDE_STATUSES: GuideStatus[] = ['available', 'busy'];
export const AVAILABLE_GUIDE_STATUSES: GuideStatus[] = ['available'];

// Tipos para crear un nuevo guía
export interface CreateGuideRequest {
    name: string;
    email: string;
    phone: string;
    photo: string;
    location: string;
    yearsExperience: number;
    hourlyRate: number;
    description: string;
    specialties: GuideSpecialty[];
    languages: GuideLanguage[];
    certifications: string[];
}
