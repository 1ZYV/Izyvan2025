import { Component, OnInit, OnDestroy, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentsService } from '@/Services/Payments/payments.service';
import {
    PaymentMethod,
    PaymentMethodType,
    CreatePaymentMethodDto,
    UpdatePaymentMethodDto,
    PaymentMethodUtils
} from '@/Types/payment.types';

/**
 * Modal para crear o editar métodos de pago
 * Soporta ambos modos: 'create' y 'edit'
 */
@Component({
    selector: 'cp-payment-method-modal',
    templateUrl: './payment-method-modal.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule],
})
export class PaymentMethodModalComponent implements OnInit, OnDestroy {

    // Inputs
    mode = input.required<'create' | 'edit'>();
    method = input<PaymentMethod | null>(null);

    // Outputs
    methodCreated = output<PaymentMethod>();
    methodUpdated = output<PaymentMethod>();
    modalClosed = output<void>();

    // Servicios inyectados
    private paymentsService = inject(PaymentsService);

    // Señales para el estado del modal
    isLoading = signal<boolean>(false);
    error = signal<string | null>(null);
    availableTypes = signal<PaymentMethodType[]>([]);

    // Formulario
    formData = signal<{
        type: PaymentMethodType;
        name: string;
        details: string;
        isDefault: boolean;
        expiryDate: string;
    }>({
        type: 'visa',
        name: '',
        details: '',
        isDefault: false,
        expiryDate: ''
    });

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadAvailableTypes();
        this.initializeForm();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    /**
     * Carga los tipos de métodos de pago disponibles
     */
    private loadAvailableTypes(): void {
        const subscription = this.paymentsService.getAvailablePaymentTypes().subscribe({
            next: (types) => {
                this.availableTypes.set(types);
            },
            error: (error) => {
                console.error('Error al cargar tipos de pago:', error);
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Inicializa el formulario según el modo
     */
    private initializeForm(): void {
        if (this.mode() === 'edit' && this.method()) {
            const method = this.method()!;
            this.formData.set({
                type: method.type,
                name: method.name,
                details: method.details,
                isDefault: method.isDefault,
                expiryDate: method.expiryDate || ''
            });
        }
    }

    /**
     * Maneja el envío del formulario
     */
    onSubmit(): void {
        if (!this.validateForm()) {
            return;
        }

        this.isLoading.set(true);
        this.error.set(null);

        if (this.mode() === 'create') {
            this.createPaymentMethod();
        } else {
            this.updatePaymentMethod();
        }
    }

    /**
     * Crea un nuevo método de pago
     */
    private createPaymentMethod(): void {
        const data = this.formData();
        const createDto: CreatePaymentMethodDto = {
            type: data.type,
            name: data.name,
            details: data.details,
            isDefault: data.isDefault,
            expiryDate: data.expiryDate || undefined
        };

        const subscription = this.paymentsService.createPaymentMethod(createDto).subscribe({
            next: (newMethod) => {
                this.methodCreated.emit(newMethod);
                this.closeModal();
            },
            error: (error) => {
                console.error('Error al crear método de pago:', error);
                this.error.set('Error al crear método de pago');
                this.isLoading.set(false);
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Actualiza un método de pago existente
     */
    private updatePaymentMethod(): void {
        if (!this.method()) return;

        const data = this.formData();
        const updateDto: UpdatePaymentMethodDto = {
            name: data.name,
            details: data.details,
            isDefault: data.isDefault,
            expiryDate: data.expiryDate || undefined
        };

        const subscription = this.paymentsService.updatePaymentMethod(this.method()!.id, updateDto).subscribe({
            next: (updatedMethod) => {
                this.methodUpdated.emit(updatedMethod);
                this.closeModal();
            },
            error: (error) => {
                console.error('Error al actualizar método de pago:', error);
                this.error.set('Error al actualizar método de pago');
                this.isLoading.set(false);
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Valida el formulario
     */
    private validateForm(): boolean {
        const data = this.formData();

        if (!data.name.trim()) {
            this.error.set('El nombre es requerido');
            return false;
        }

        if (!data.details.trim()) {
            this.error.set('Los detalles son requeridos');
            return false;
        }

        // Validar fecha de expiración para tarjetas
        if (PaymentMethodUtils.requiresExpiryDate(data.type) && !data.expiryDate) {
            this.error.set('La fecha de expiración es requerida para tarjetas');
            return false;
        }

        // Validar formato de fecha de expiración
        if (data.expiryDate && !this.isValidExpiryDate(data.expiryDate)) {
            this.error.set('Formato de fecha inválido (MM/YY)');
            return false;
        }

        return true;
    }

    /**
     * Valida el formato de fecha de expiración
     */
    private isValidExpiryDate(date: string): boolean {
        const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!regex.test(date)) return false;

        const [month, year] = date.split('/');
        const expiry = new Date(parseInt('20' + year), parseInt(month) - 1);
        const now = new Date();

        return expiry > now;
    }

    /**
     * Maneja el cambio de tipo de método de pago
     */
    onTypeChange(newType: PaymentMethodType): void {
        const current = this.formData();
        this.formData.set({
            ...current,
            type: newType,
            // Limpiar fecha de expiración si no es requerida
            expiryDate: PaymentMethodUtils.requiresExpiryDate(newType) ? current.expiryDate : ''
        });
    }    /**
     * Maneja cambios en los campos del formulario
     */
    onFieldChange(field: string, value: any): void {
        const current = this.formData();
        this.formData.set({
            ...current,
            [field]: value
        });
    }

    /**
     * Cierra el modal
     */
    closeModal(): void {
        this.modalClosed.emit();
    }

    /**
     * Maneja el clic en el backdrop
     */
    onBackdropClick(event: Event): void {
        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }

    /**
     * Limpia errores
     */
    clearError(): void {
        this.error.set(null);
    }

    /**
     * Obtiene el título del modal
     */
    getModalTitle(): string {
        return this.mode() === 'create' ? 'Añadir método de pago' : 'Editar método de pago';
    }

    /**
     * Obtiene el texto del botón de envío
     */
    getSubmitButtonText(): string {
        if (this.isLoading()) {
            return this.mode() === 'create' ? 'Creando...' : 'Guardando...';
        }
        return this.mode() === 'create' ? 'Crear método' : 'Guardar cambios';
    }

    /**
     * Verifica si el formulario es válido
     */
    isFormValid(): boolean {
        const data = this.formData();
        return !!(data.name.trim() && data.details.trim());
    }

    /**
     * Utilidades de PaymentMethod para el template
     */
    protected readonly PaymentMethodUtils = PaymentMethodUtils;
}
