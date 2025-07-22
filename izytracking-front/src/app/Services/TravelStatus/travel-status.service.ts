import { Injectable } from '@angular/core';
import { TravelStatus, BadgeVariant, BadgeStyle, RouteStatus, TravelStatusUtils } from '../../Types/travel.types';
import { TRAVEL_STATUS_CONSTANTS } from '../../Types/index';

// Re-export para compatibilidad hacia atrás
export { TravelStatus, BadgeVariant, BadgeStyle } from '../../Types/travel.types';

// Constantes para evitar magic strings
const STATUS_CONFIG = {
    DEFAULT_STATUS: TRAVEL_STATUS_CONSTANTS.SOLICITUD_SERVICIO,
    COLORS: {
        AMBER: { text: '#d97706', bg: '#fef3c7' },
        CYAN: { text: '#0891b2', bg: '#cffafe' },
        VIOLET: { text: '#7c3aed', bg: '#ede9fe' },
        BLUE: { text: '#2563eb', bg: '#dbeafe' },
        EMERALD: { text: '#059669', bg: '#d1fae5' },
        RED: { text: '#dc2626', bg: '#fee2e2' },
        ORANGE: { text: '#ea580c', bg: '#fed7aa' },
        YELLOW: { text: '#ca8a04', bg: '#fef3c7' },
        GRAY: { text: '#6b7280', bg: '#f9fafb' }
    }
} as const;

// Interface para la información completa del estado
export interface TravelStatusInfo {
    label: string;
    variant: BadgeVariant;
    style: BadgeStyle;
    description: string;
    color: string;
    bgColor: string;
    actions: TravelStatusActions;
}

// Interface para las acciones disponibles según el estado
export interface TravelStatusActions {
    canView: boolean;
    canEdit: boolean;
    canCancel: boolean;
    canStart: boolean;
    canComplete: boolean;
    canReview: boolean;
    canRebook: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TravelStatusService {
        private readonly statusMap: Record<TravelStatus, TravelStatusInfo> = {
            [TRAVEL_STATUS_CONSTANTS.SOLICITUD_SERVICIO]: {
                label: 'Solicitud de Servicio',
                variant: 'warning',
                style: 'filled',
                description: 'Se ha iniciado la solicitud del servicio de transporte', color: STATUS_CONFIG.COLORS.AMBER.text,
                bgColor: STATUS_CONFIG.COLORS.AMBER.bg,
                actions: {
                    canView: true,
                    canEdit: true,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.ELECCION_TARIFAS]: {
                label: 'Elección de Tarifas',
                variant: 'info',
                style: 'filled',
                description: 'El cliente está seleccionando la tarifa para el servicio',
                color: STATUS_CONFIG.COLORS.CYAN.text,
                bgColor: STATUS_CONFIG.COLORS.CYAN.bg,
                actions: {
                    canView: true,
                    canEdit: true,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.PROCESAMIENTO_TRANSPORTISTA]: {
                label: 'Procesando Transportista',
                variant: 'info',
                style: 'filled',
                description: 'Se está procesando la asignación del transportista',
                color: STATUS_CONFIG.COLORS.CYAN.text,
                bgColor: STATUS_CONFIG.COLORS.CYAN.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.ASIGNACION_CONDUCTOR]: {
                label: 'Asignando Conductor',
                variant: 'info',
                style: 'filled', description: 'Se está asignando un conductor para el viaje',
                color: STATUS_CONFIG.COLORS.CYAN.text,
                bgColor: STATUS_CONFIG.COLORS.CYAN.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.LLEGADA_CONDUCTOR]: {
                label: 'Llegada del Conductor',
                variant: 'primary',
                style: 'filled', description: 'El conductor está llegando al punto de origen',
                color: STATUS_CONFIG.COLORS.VIOLET.text,
                bgColor: STATUS_CONFIG.COLORS.VIOLET.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.COMIENZO_VIAJE]: {
                label: 'Iniciando Viaje',
                variant: 'primary',
                style: 'filled', description: 'El viaje está por comenzar',
                color: STATUS_CONFIG.COLORS.BLUE.text,
                bgColor: STATUS_CONFIG.COLORS.BLUE.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: true,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.EN_PROGRESO]: {
                label: 'En Progreso',
                variant: 'primary',
                style: 'filled', description: 'El viaje está actualmente en progreso',
                color: STATUS_CONFIG.COLORS.BLUE.text,
                bgColor: STATUS_CONFIG.COLORS.BLUE.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: true,
                    canStart: false,
                    canComplete: true,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.FIN_VIAJE]: {
                label: 'Finalizando Viaje',
                variant: 'success',
                style: 'filled', description: 'El viaje está llegando a su fin',
                color: STATUS_CONFIG.COLORS.EMERALD.text,
                bgColor: STATUS_CONFIG.COLORS.EMERALD.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: true,
                    canReview: false,
                    canRebook: false
                }
            },
            [TRAVEL_STATUS_CONSTANTS.FIN_SERVICIO]: {
                label: 'Servicio Completado',
                variant: 'success',
                style: 'filled', description: 'El servicio ha sido completado exitosamente',
                color: STATUS_CONFIG.COLORS.EMERALD.text,
                bgColor: STATUS_CONFIG.COLORS.EMERALD.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: false,
                    canReview: true,
                    canRebook: true
                }
            },
            [TRAVEL_STATUS_CONSTANTS.CANCELADO_TURISMO]: {
                label: 'Cancelado por Turismo',
                variant: 'danger',
                style: 'outline', description: 'El viaje fue cancelado por el turismo',
                color: STATUS_CONFIG.COLORS.RED.text,
                bgColor: STATUS_CONFIG.COLORS.RED.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: true
                }
            },
            [TRAVEL_STATUS_CONSTANTS.CANCELADO_TRANSPORTISTA]: {
                label: 'Cancelado por Transportista',
                variant: 'danger',
                style: 'outline', description: 'El viaje fue cancelado por el transportista',
                color: STATUS_CONFIG.COLORS.ORANGE.text,
                bgColor: STATUS_CONFIG.COLORS.ORANGE.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: true
                }
            },
            [TRAVEL_STATUS_CONSTANTS.CANCELADO_AGENCIA]: {
                label: 'Cancelado por Agencia',
                variant: 'danger',
                style: 'outline', description: 'El viaje fue cancelado por la agencia',
                color: STATUS_CONFIG.COLORS.YELLOW.text,
                bgColor: STATUS_CONFIG.COLORS.YELLOW.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: true
                }
            },
            [TRAVEL_STATUS_CONSTANTS.SIN_PROVEEDORES]: {
                label: 'Sin Proveedores Disponibles',
                variant: 'secondary',
                style: 'outline', description: 'No hay proveedores disponibles para el servicio',
                color: STATUS_CONFIG.COLORS.GRAY.text,
                bgColor: STATUS_CONFIG.COLORS.GRAY.bg,
                actions: {
                    canView: true,
                    canEdit: false,
                    canCancel: false,
                    canStart: false,
                    canComplete: false,
                    canReview: false,
                    canRebook: true
                }
            }
        };    /**
     * Obtiene la información completa del estado
     */    getStatusInfo(status: TravelStatus): TravelStatusInfo {
        return this.statusMap[status] || this.statusMap[STATUS_CONFIG.DEFAULT_STATUS];
    }

    /**
     * Obtiene solo el label del estado
     */
    getStatusLabel(status: TravelStatus): string {
        return this.getStatusInfo(status).label;
    }

    /**
     * Obtiene solo la variante del badge
     */
    getStatusVariant(status: TravelStatus): BadgeVariant {
        return this.getStatusInfo(status).variant;
    }

    /**
     * Obtiene solo el estilo del badge
     */
    getStatusStyle(status: TravelStatus): BadgeStyle {
        return this.getStatusInfo(status).style;
    }

    /**
     * Obtiene solo la descripción del estado
     */
    getStatusDescription(status: TravelStatus): string {
        return this.getStatusInfo(status).description;
    }

    /**
     * Obtiene las acciones disponibles para un estado
     */
    getStatusActions(status: TravelStatus): TravelStatusActions {
        return this.getStatusInfo(status).actions;
    }

    /**
     * Verifica si una acción específica está disponible
     */
    canPerformAction(status: TravelStatus, action: keyof TravelStatusActions): boolean {
        return this.getStatusActions(status)[action];
    }

    /**
     * Obtiene todos los estados disponibles
     */
    getAllStatuses(): TravelStatus[] {
        return Object.keys(this.statusMap) as TravelStatus[];
    }    /**
     * Mapea estados del servicio a estados de display (para compatibilidad)
     */    mapServiceStatus(serviceStatus: TravelStatus): TravelStatus {
        // Validar que el estado sea válido
        return TravelStatusUtils.isValidTravelStatus(serviceStatus) ? serviceStatus : STATUS_CONFIG.DEFAULT_STATUS;
    }

    /**
     * Mapea estados de ruta (para el componente TravelRoute)
     */
    mapRouteStatus(status: TravelStatus): RouteStatus {
        return TravelStatusUtils.mapToRouteStatus(status);
    }

    /**
     * Valida que todos los estados del sistema estén configurados
     */
    private validateStatusMap(): void {
        const requiredStatuses = Object.values(TRAVEL_STATUS_CONSTANTS);
        const configuredStatuses = Object.keys(this.statusMap) as TravelStatus[];

        const missingStatuses = requiredStatuses.filter(status => !configuredStatuses.includes(status));

        if (missingStatuses.length > 0) {
            console.warn('Estados no configurados en statusMap:', missingStatuses);
        }

        const extraStatuses = configuredStatuses.filter(status => !requiredStatuses.includes(status));

        if (extraStatuses.length > 0) {
            console.warn('Estados configurados pero no definidos en constantes:', extraStatuses);
        }
    }

    constructor() {
        // Validar configuración en desarrollo
        if (typeof window !== 'undefined' && window.console) {
            this.validateStatusMap();
        }
    }    /**
     * Verifica si un estado es de tipo cancelación
     */
    isCancellationStatus(status: TravelStatus): boolean {
        const cancellationStatuses = [
            TRAVEL_STATUS_CONSTANTS.CANCELADO_TURISMO,
            TRAVEL_STATUS_CONSTANTS.CANCELADO_TRANSPORTISTA,
            TRAVEL_STATUS_CONSTANTS.CANCELADO_AGENCIA,
            TRAVEL_STATUS_CONSTANTS.SIN_PROVEEDORES
        ] as const;
        return (cancellationStatuses as readonly TravelStatus[]).includes(status);
    }    /**
     * Verifica si un estado es de finalización exitosa
     */
    isCompletionStatus(status: TravelStatus): boolean {
        const completionStatuses = [
            TRAVEL_STATUS_CONSTANTS.FIN_VIAJE,
            TRAVEL_STATUS_CONSTANTS.FIN_SERVICIO
        ] as const;
        return (completionStatuses as readonly TravelStatus[]).includes(status);
    }    /**
     * Verifica si un estado es de proceso activo
     */
    isActiveStatus(status: TravelStatus): boolean {
        const activeStatuses = [
            TRAVEL_STATUS_CONSTANTS.LLEGADA_CONDUCTOR,
            TRAVEL_STATUS_CONSTANTS.COMIENZO_VIAJE,
            TRAVEL_STATUS_CONSTANTS.EN_PROGRESO
        ] as const;
        return (activeStatuses as readonly TravelStatus[]).includes(status);
    }    /**
     * Verifica si un estado es de proceso inicial
     */
    isInitialStatus(status: TravelStatus): boolean {
        const initialStatuses = [
            TRAVEL_STATUS_CONSTANTS.SOLICITUD_SERVICIO,
            TRAVEL_STATUS_CONSTANTS.ELECCION_TARIFAS,
            TRAVEL_STATUS_CONSTANTS.PROCESAMIENTO_TRANSPORTISTA,
            TRAVEL_STATUS_CONSTANTS.ASIGNACION_CONDUCTOR
        ] as const;
        return (initialStatuses as readonly TravelStatus[]).includes(status);
    }

    /**
     * Obtiene el siguiente estado lógico en el flujo (si existe)
     */
    getNextStatus(currentStatus: TravelStatus): TravelStatus | null {
        const flowSequence: TravelStatus[] = [
            TRAVEL_STATUS_CONSTANTS.SOLICITUD_SERVICIO,
            TRAVEL_STATUS_CONSTANTS.ELECCION_TARIFAS,
            TRAVEL_STATUS_CONSTANTS.PROCESAMIENTO_TRANSPORTISTA,
            TRAVEL_STATUS_CONSTANTS.ASIGNACION_CONDUCTOR,
            TRAVEL_STATUS_CONSTANTS.LLEGADA_CONDUCTOR,
            TRAVEL_STATUS_CONSTANTS.COMIENZO_VIAJE,
            TRAVEL_STATUS_CONSTANTS.EN_PROGRESO,
            TRAVEL_STATUS_CONSTANTS.FIN_VIAJE,
            TRAVEL_STATUS_CONSTANTS.FIN_SERVICIO
        ];

        const currentIndex = flowSequence.indexOf(currentStatus);
        return currentIndex !== -1 && currentIndex < flowSequence.length - 1
            ? flowSequence[currentIndex + 1]
            : null;
    }
}

/**
 * Función helper para crear configuraciones de estado de manera consistente
 */
function createStatusConfig(
    label: string,
    variant: BadgeVariant,
    style: BadgeStyle,
    description: string,
    colorConfig: { text: string; bg: string },
    actions: Partial<TravelStatusActions> = {}
): TravelStatusInfo {
    return {
        label,
        variant,
        style,
        description,
        color: colorConfig.text,
        bgColor: colorConfig.bg,
        actions: {
            canView: true,
            canEdit: false,
            canCancel: false,
            canStart: false,
            canComplete: false,
            canReview: false,
            canRebook: false,
            ...actions
        }
    };
}
