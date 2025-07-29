/**
 * Tipos para servicios de turismo
 */

export type TourismServiceStatus =
    | 'solicitud-servicio'     // Solicitud pendiente
    | 'asignado'               // Asignado a guía
    | 'en-progreso'            // En curso
    | 'completado'             // Completado
    | 'cancelado';             // Cancelado

export interface TourismService {
    id: string;
    clientName: string;
    destination: string;
    date: Date;
    duration: number; // horas
    groupSize: number;
    specialtyRequired: string;
    languageRequired: string;
    description: string;
    status: TourismServiceStatus;
    priceOffered: number;
    notes?: string;
}

export interface GuideAssignment {
    serviceId: string;
    guideId: string;
    assignedAt: Date;
}
