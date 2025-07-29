/**
 * Tipos relacionados con métodos de pago
 */

// Tipos de métodos de pago disponibles
export type PaymentMethodType = 'visa' | 'mastercard' | 'paypal' | 'cash' | 'bank_transfer' | 'other';

// Interface principal para un método de pago
export interface PaymentMethod {
    id: string;
    type: PaymentMethodType;
    name: string;
    details: string;
    isDefault: boolean;
    isActive: boolean;
    expiryDate?: string;
    createdAt: string;
    updatedAt: string;
}

// DTO para crear un nuevo método de pago
export interface CreatePaymentMethodDto {
    type: PaymentMethodType;
    name: string;
    details: string;
    isDefault?: boolean;
    expiryDate?: string;
}

// DTO para actualizar un método de pago
export interface UpdatePaymentMethodDto {
    name?: string;
    details?: string;
    isDefault?: boolean;
    expiryDate?: string;
    isActive?: boolean;
}

// Respuesta del API para métodos de pago
export interface PaymentMethodsResponse {
    paymentMethods: PaymentMethod[];
    total: number;
    defaultMethod?: PaymentMethod;
}

// Estados posibles para operaciones de pago
export type PaymentOperationStatus = 'idle' | 'loading' | 'success' | 'error';

// Interface para el estado del componente de pagos
export interface PaymentState {
    paymentMethods: PaymentMethod[];
    selectedMethodId: string | null;
    defaultMethodId: string | null;
    isLoading: boolean;
    error: string | null;
    showEditModal: boolean;
    editingMethod: PaymentMethod | null;
}

// Utilidades para métodos de pago
export class PaymentMethodUtils {

    /**
     * Obtiene el icono correspondiente al tipo de método de pago
     */
    static getIcon(type: PaymentMethodType): string {
        switch (type) {
            case 'visa': return '💳';
            case 'mastercard': return '💳';
            case 'paypal': return '🟦';
            case 'bank_transfer': return '🏦';
            case 'cash': return '💵';
            case 'other': return '💰';
            default: return '💳';
        }
    }

    /**
     * Obtiene el color de fondo para el tipo de método de pago
     */
    static getBackgroundColor(type: PaymentMethodType): string {
        switch (type) {
            case 'visa': return 'bg-blue-100';
            case 'mastercard': return 'bg-orange-100';
            case 'paypal': return 'bg-blue-200';
            case 'bank_transfer': return 'bg-purple-100';
            case 'cash': return 'bg-green-100';
            case 'other': return 'bg-gray-100';
            default: return 'bg-gray-100';
        }
    }

    /**
     * Obtiene el nombre legible del tipo de método de pago
     */
    static getTypeName(type: PaymentMethodType): string {
        switch (type) {
            case 'visa': return 'Visa';
            case 'mastercard': return 'Mastercard';
            case 'paypal': return 'PayPal';
            case 'bank_transfer': return 'Transferencia Bancaria';
            case 'cash': return 'Efectivo';
            case 'other': return 'Otro';
            default: return 'Desconocido';
        }
    }

    /**
     * Valida si un método de pago requiere fecha de expiración
     */
    static requiresExpiryDate(type: PaymentMethodType): boolean {
        return ['visa', 'mastercard'].includes(type);
    }

    /**
     * Formatea la fecha de expiración
     */
    static formatExpiryDate(date: string): string {
        if (!date) return '';
        return `Vence ${date}`;
    }

    /**
     * Verifica si un método de pago está expirado
     */
    static isExpired(method: PaymentMethod): boolean {
        if (!method.expiryDate) return false;

        const [month, year] = method.expiryDate.split('/');
        const expiryDate = new Date(parseInt('20' + year), parseInt(month) - 1);
        const now = new Date();

        return expiryDate < now;
    }

    /**
     * Verifica si un método de pago está próximo a expirar (dentro de 2 meses)
     */
    static isExpiringSoon(method: PaymentMethod): boolean {
        if (!method.expiryDate) return false;

        const [month, year] = method.expiryDate.split('/');
        const expiryDate = new Date(parseInt('20' + year), parseInt(month) - 1);
        const twoMonthsFromNow = new Date();
        twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

        return expiryDate <= twoMonthsFromNow && expiryDate >= new Date();
    }
}
