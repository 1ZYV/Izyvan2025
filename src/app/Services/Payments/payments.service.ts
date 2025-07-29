import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map, throwError } from 'rxjs';
import {
    PaymentMethod,
    PaymentMethodsResponse,
    CreatePaymentMethodDto,
    UpdatePaymentMethodDto,
    PaymentMethodType
} from '@/Types/payment.types';

/**
 * Servicio para gestionar métodos de pago
 * Incluye operaciones CRUD y lógica de negocio para métodos de pago
 */
@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    // Señales para el estado del servicio
    private _isLoading = signal<boolean>(false);
    private _error = signal<string | null>(null);

    // Propiedades públicas de solo lectura
    public readonly isLoading = this._isLoading.asReadonly();
    public readonly error = this._error.asReadonly();

    // Mock data para desarrollo
    private mockPaymentMethods: PaymentMethod[] = [
        {
            id: 'pm-001',
            type: 'visa',
            name: 'Visa •••• 4532',
            details: 'Vence 12/2026 • Juan Pérez',
            isDefault: true,
            isActive: true,
            expiryDate: '12/2026',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
        },
        {
            id: 'pm-002',
            type: 'mastercard',
            name: 'Mastercard •••• 8901',
            details: 'Vence 08/2025 • Juan Pérez',
            isDefault: false,
            isActive: true,
            expiryDate: '08/2025',
            createdAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-10T14:30:00Z'
        },
        {
            id: 'pm-003',
            type: 'paypal',
            name: 'PayPal',
            details: 'juan@email.com',
            isDefault: false,
            isActive: true,
            createdAt: '2024-01-05T09:15:00Z',
            updatedAt: '2024-01-05T09:15:00Z'
        },
        {
            id: 'pm-004',
            type: 'cash',
            name: 'Efectivo',
            details: 'Pagar al conductor',
            isDefault: false,
            isActive: true,
            createdAt: '2024-01-01T16:45:00Z',
            updatedAt: '2024-01-01T16:45:00Z'
        }
    ];

    /**
     * Obtiene todos los métodos de pago del usuario
     */
    getPaymentMethods(): Observable<PaymentMethodsResponse> {
        this._isLoading.set(true);
        this._error.set(null);

        return of(this.mockPaymentMethods).pipe(
            delay(800), // Simular latencia de red
            map(methods => {
                const defaultMethod = methods.find(m => m.isDefault);
                return {
                    paymentMethods: methods.filter(m => m.isActive),
                    total: methods.length,
                    defaultMethod
                };
            }),
            map(response => {
                this._isLoading.set(false);
                return response;
            })
        );
    }

    /**
     * Obtiene un método de pago específico por ID
     */
    getPaymentMethodById(id: string): Observable<PaymentMethod | null> {
        this._isLoading.set(true);
        this._error.set(null);

        return of(this.mockPaymentMethods.find(method => method.id === id) || null).pipe(
            delay(300),
            map(method => {
                this._isLoading.set(false);
                return method;
            })
        );
    }

    /**
     * Crea un nuevo método de pago
     */
    createPaymentMethod(paymentMethodData: CreatePaymentMethodDto): Observable<PaymentMethod> {
        this._isLoading.set(true);
        this._error.set(null);

        // Validar datos
        if (!paymentMethodData.name || !paymentMethodData.type) {
            this._error.set('Nombre y tipo son requeridos');
            this._isLoading.set(false);
            return throwError(() => new Error('Datos incompletos'));
        }

        // Simular creación
        const newMethod: PaymentMethod = {
            id: `pm-${Date.now()}`,
            type: paymentMethodData.type,
            name: paymentMethodData.name,
            details: paymentMethodData.details,
            isDefault: paymentMethodData.isDefault || false,
            isActive: true,
            expiryDate: paymentMethodData.expiryDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return of(newMethod).pipe(
            delay(1000),
            map(method => {
                // Si es predeterminado, quitar flag de otros métodos
                if (method.isDefault) {
                    this.mockPaymentMethods.forEach(m => m.isDefault = false);
                }

                this.mockPaymentMethods.push(method);
                this._isLoading.set(false);
                return method;
            })
        );
    }

    /**
     * Actualiza un método de pago existente
     */
    updatePaymentMethod(id: string, updateData: UpdatePaymentMethodDto): Observable<PaymentMethod> {
        this._isLoading.set(true);
        this._error.set(null);

        const methodIndex = this.mockPaymentMethods.findIndex(m => m.id === id);

        if (methodIndex === -1) {
            this._error.set('Método de pago no encontrado');
            this._isLoading.set(false);
            return throwError(() => new Error('Método no encontrado'));
        }

        return of(this.mockPaymentMethods[methodIndex]).pipe(
            delay(800),
            map(method => {
                // Actualizar campos
                const updatedMethod = {
                    ...method,
                    ...updateData,
                    updatedAt: new Date().toISOString()
                };

                // Si se establece como predeterminado, quitar flag de otros
                if (updateData.isDefault) {
                    this.mockPaymentMethods.forEach(m => m.isDefault = false);
                }

                this.mockPaymentMethods[methodIndex] = updatedMethod;
                this._isLoading.set(false);
                return updatedMethod;
            })
        );
    }

    /**
     * Elimina un método de pago (marca como inactivo)
     */
    deletePaymentMethod(id: string): Observable<boolean> {
        this._isLoading.set(true);
        this._error.set(null);

        const methodIndex = this.mockPaymentMethods.findIndex(m => m.id === id);

        if (methodIndex === -1) {
            this._error.set('Método de pago no encontrado');
            this._isLoading.set(false);
            return throwError(() => new Error('Método no encontrado'));
        }

        const method = this.mockPaymentMethods[methodIndex];

        // No permitir eliminar el método predeterminado si es el único
        if (method.isDefault && this.mockPaymentMethods.filter(m => m.isActive).length === 1) {
            this._error.set('No se puede eliminar el único método de pago');
            this._isLoading.set(false);
            return throwError(() => new Error('No se puede eliminar el único método'));
        }

        return of(true).pipe(
            delay(600),
            map(() => {
                // Marcar como inactivo en lugar de eliminar
                this.mockPaymentMethods[methodIndex].isActive = false;
                this.mockPaymentMethods[methodIndex].updatedAt = new Date().toISOString();

                // Si era el predeterminado, establecer otro como predeterminado
                if (method.isDefault) {
                    const nextDefault = this.mockPaymentMethods.find(m => m.isActive && m.id !== id);
                    if (nextDefault) {
                        nextDefault.isDefault = true;
                        nextDefault.updatedAt = new Date().toISOString();
                    }
                }

                this._isLoading.set(false);
                return true;
            })
        );
    }

    /**
     * Establece un método de pago como predeterminado
     */
    setDefaultPaymentMethod(id: string): Observable<PaymentMethod> {
        this._isLoading.set(true);
        this._error.set(null);

        const method = this.mockPaymentMethods.find(m => m.id === id);

        if (!method || !method.isActive) {
            this._error.set('Método de pago no encontrado o inactivo');
            this._isLoading.set(false);
            return throwError(() => new Error('Método no válido'));
        }

        return of(method).pipe(
            delay(500),
            map(targetMethod => {
                // Quitar flag predeterminado de todos los métodos
                this.mockPaymentMethods.forEach(m => m.isDefault = false);

                // Establecer el nuevo predeterminado
                targetMethod.isDefault = true;
                targetMethod.updatedAt = new Date().toISOString();

                this._isLoading.set(false);
                return targetMethod;
            })
        );
    }

    /**
     * Obtiene el método de pago predeterminado
     */
    getDefaultPaymentMethod(): Observable<PaymentMethod | null> {
        return of(this.mockPaymentMethods.find(m => m.isDefault && m.isActive) || null).pipe(
            delay(200)
        );
    }

    /**
     * Obtiene tipos de métodos de pago disponibles
     */
    getAvailablePaymentTypes(): Observable<PaymentMethodType[]> {
        const availableTypes: PaymentMethodType[] = [
            'visa',
            'mastercard',
            'paypal',
            'bank_transfer',
            'cash',
            'other'
        ];

        return of(availableTypes).pipe(delay(100));
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this._isLoading.set(false);
    }

    /**
     * Limpia errores
     */
    clearError(): void {
        this._error.set(null);
    }

    /**
     * Obtiene estadísticas de métodos de pago
     */
    getPaymentMethodsStats(): Observable<{
        total: number;
        active: number;
        inactive: number;
        hasDefault: boolean;
        expiringCount: number;
    }> {
        const stats = {
            total: this.mockPaymentMethods.length,
            active: this.mockPaymentMethods.filter(m => m.isActive).length,
            inactive: this.mockPaymentMethods.filter(m => !m.isActive).length,
            hasDefault: this.mockPaymentMethods.some(m => m.isDefault),
            expiringCount: this.mockPaymentMethods.filter(m => {
                if (!m.expiryDate) return false;
                const [month, year] = m.expiryDate.split('/');
                const expiryDate = new Date(parseInt('20' + year), parseInt(month) - 1);
                const twoMonthsFromNow = new Date();
                twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
                return expiryDate <= twoMonthsFromNow && expiryDate >= new Date();
            }).length
        };

        return of(stats).pipe(delay(200));
    }
}
