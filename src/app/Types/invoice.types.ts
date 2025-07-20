/**
 * Tipos para el sistema de facturas
 * Incluye estados, interfaces y utilidades para manejo de facturas
 */

// Estados de facturas basados en el flujo del sistema
export type InvoiceStatus =
    | 'pendiente'    // Pendiente de pago
    | 'pago'         // Pagada
    | 'revision';    // En revisión

// Información de la factura
export interface Invoice {
    id: string;
    number: string;
    date: string;
    issueDate: string;
    amount: number;
    currency: string;
    status: InvoiceStatus;
    description: string;
    customer: {
        name: string;
        email: string;
        id: string;
    };
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    travel: {
        id: string;
        origin: string;
        destination: string;
        date: string;
    };
    // Nueva propiedad para facturas multi-servicio
    agency?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    // Referencia a los servicios incluidos en la factura
    services?: InvoiceService[];
    items: InvoiceItem[];
    tax?: number;
    taxes: number;
    subtotal: number;
    total: number;
    paymentDate?: string;
    paymentMethod?: string;
    paymentReference?: string;
    notes?: string;
    // Información del proveedor que emite la factura
    provider?: {
        id: string;
        name: string;
        type: 'transport' | 'tourism';
    };
    // Archivos adjuntos (imágenes y/o PDFs)
    attachments?: InvoiceAttachment[];
}

// Elemento de factura
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

// Servicio incluido en la factura
export interface InvoiceService {
    id: string;
    type: 'transport' | 'tourism';
    description: string;
    completedDate: string;
    amount: number;
    serviceDetails: {
        // Para servicios de transporte
        origin?: string;
        destination?: string;
        distance?: number;
        duration?: number;
        vehicleType?: string;
        // Para servicios de turismo
        tourDestination?: string;
        tourDuration?: number;
        groupSize?: number;
        specialtyRequired?: string;
        languageRequired?: string;
    };
    // Referencia al servicio original
    originalServiceId: string;
}

// Archivo adjunto de factura
export interface InvoiceAttachment {
    id: string;
    fileName: string;
    fileType: 'image' | 'pdf';
    fileSize: number; // en bytes
    fileUrl?: string; // URL del archivo almacenado
    fileData?: string; // Base64 data para vista previa
    uploadedAt: string;
    description?: string;
}

// Constantes para estados de factura
export const INVOICE_STATUS_CONSTANTS = {
    PENDIENTE: 'pendiente' as const,
    PAGO: 'pago' as const,
    REVISION: 'revision' as const,
} as const;

// Utilidades para trabajar con estados de facturas
export const InvoiceStatusUtils = {
    /**
     * Verifica si un estado es válido
     */
    isValidInvoiceStatus(status: string): status is InvoiceStatus {
        return Object.values(INVOICE_STATUS_CONSTANTS).includes(status as InvoiceStatus);
    },

    /**
     * Obtiene todos los estados posibles
     */
    getAllInvoiceStatuses(): InvoiceStatus[] {
        return Object.values(INVOICE_STATUS_CONSTANTS);
    },

    /**
     * Verifica si una factura está pendiente
     */
    isPendingStatus(status: InvoiceStatus): boolean {
        return status === INVOICE_STATUS_CONSTANTS.PENDIENTE;
    },

    /**
     * Verifica si una factura está pagada
     */
    isPaidStatus(status: InvoiceStatus): boolean {
        return status === INVOICE_STATUS_CONSTANTS.PAGO;
    },

    /**
     * Verifica si una factura está en revisión
     */
    isReviewStatus(status: InvoiceStatus): boolean {
        return status === INVOICE_STATUS_CONSTANTS.REVISION;
    },

    /**
     * Obtiene la descripción del estado
     */
    getStatusDescription(status: InvoiceStatus): string {
        switch (status) {
            case INVOICE_STATUS_CONSTANTS.PENDIENTE: return 'Pendiente de Pago';
            case INVOICE_STATUS_CONSTANTS.PAGO: return 'Pagado';
            case INVOICE_STATUS_CONSTANTS.REVISION: return 'En Revisión';
            default: return status;
        }
    },

    /**
     * Obtiene la variante de color para el estado
     */
    getStatusVariant(status: InvoiceStatus): 'success' | 'warning' | 'danger' | 'info' {
        switch (status) {
            case INVOICE_STATUS_CONSTANTS.PAGO: return 'success';
            case INVOICE_STATUS_CONSTANTS.PENDIENTE: return 'warning';
            case INVOICE_STATUS_CONSTANTS.REVISION: return 'info';
            default: return 'info';
        }
    }
};
