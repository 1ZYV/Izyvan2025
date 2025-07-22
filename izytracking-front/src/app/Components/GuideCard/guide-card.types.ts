/**
 * Tipos para el componente GuideCard
 */

// Importar el tipo centralizado de estado
import { GuideStatus, GuideSpecialty, GuideLanguage } from '../../Types/guide.types';
import { BadgeVariant, BadgeStyle } from '../../Types/travel.types';

// Información básica del guía para mostrar en la card
export interface GuideCardInfo {
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
    location?: string;
    description?: string;
}

// Configuración del badge según el estado
export interface GuideStatusConfig {
    label: string;
    variant: BadgeVariant;
    style: BadgeStyle;
}

// Mapeo de estados a configuraciones de badge
export type GuideStatusMap = Record<GuideStatus, GuideStatusConfig>;
