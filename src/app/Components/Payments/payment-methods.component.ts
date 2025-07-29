import { Component, OnInit, OnDestroy, signal, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CardComponent } from '@/Components/Card/card.component';
import { PaymentsService } from '@/Services/Payments/payments.service';
import { PaymentMethod, PaymentMethodUtils } from '@/Types/payment.types';
import { PaymentMethodCardComponent } from './payment-method-card/payment-method-card.component';
import { PaymentMethodModalComponent } from './payment-method-modal/payment-method-modal.component';

/**
 * Componente principal para gestionar métodos de pago
 * Maneja la lista de métodos, selección, y operaciones CRUD
 */
@Component({
    selector: 'cp-payment-methods',
    templateUrl: './payment-methods.component.html',
    standalone: true,
    imports: [
        CommonModule,
        CardComponent,
        PaymentMethodCardComponent,
        PaymentMethodModalComponent
    ],
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {

    // Inputs
    showHeader = input<boolean>(true);
    allowSelection = input<boolean>(true);
    allowEdit = input<boolean>(true);
    maxMethods = input<number | null>(null);

    // Outputs
    methodSelected = output<PaymentMethod>();
    methodUpdated = output<PaymentMethod>();
    methodDeleted = output<string>();
    methodCreated = output<PaymentMethod>();

    // Servicios inyectados
    private paymentsService = inject(PaymentsService);

    // Señales para el estado del componente
    paymentMethods = signal<PaymentMethod[]>([]);
    selectedMethodId = signal<string | null>(null);
    defaultMethodId = signal<string | null>(null);
    isLoading = signal<boolean>(true);
    error = signal<string | null>(null);

    // Modal states
    showEditModal = signal<boolean>(false);
    showCreateModal = signal<boolean>(false);
    editingMethod = signal<PaymentMethod | null>(null);

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadPaymentMethods();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.paymentsService.clearLoading();
    }

    /**
     * Carga los métodos de pago desde el servicio
     */
    private loadPaymentMethods(): void {
        this.isLoading.set(true);
        this.error.set(null);

        const subscription = this.paymentsService.getPaymentMethods().subscribe({
            next: (response) => {
                this.paymentMethods.set(response.paymentMethods);
                this.defaultMethodId.set(response.defaultMethod?.id || null);

                // Si hay un método predeterminado y se permite selección, seleccionarlo
                if (response.defaultMethod && this.allowSelection()) {
                    this.selectedMethodId.set(response.defaultMethod.id);
                }
            },
            error: (error) => {
                console.error('Error al cargar métodos de pago:', error);
                this.error.set('Error al cargar métodos de pago');
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Maneja la selección de un método de pago
     */
    onSelectMethod(method: PaymentMethod): void {
        if (!this.allowSelection()) return;

        this.selectedMethodId.set(method.id);
        this.methodSelected.emit(method);
    }

    /**
     * Verifica si un método está seleccionado
     */
    isMethodSelected(methodId: string): boolean {
        return this.selectedMethodId() === methodId;
    }

    /**
     * Verifica si un método es el predeterminado
     */
    isMethodDefault(methodId: string): boolean {
        return this.defaultMethodId() === methodId;
    }

    /**
     * Abre el modal para editar un método de pago
     */
    onEditMethod(method: PaymentMethod): void {
        if (!this.allowEdit()) return;

        this.editingMethod.set(method);
        this.showEditModal.set(true);
    }

    /**
     * Abre el modal para crear un nuevo método de pago
     */
    onAddMethod(): void {
        if (!this.allowEdit()) return;

        // Verificar límite máximo si está configurado
        if (this.maxMethods() && this.paymentMethods().length >= this.maxMethods()!) {
            this.error.set(`Máximo ${this.maxMethods()} métodos de pago permitidos`);
            return;
        }

        this.showCreateModal.set(true);
    }

    /**
     * Establece un método como predeterminado
     */
    onSetAsDefault(methodId: string): void {
        const subscription = this.paymentsService.setDefaultPaymentMethod(methodId).subscribe({
            next: (updatedMethod) => {
                this.defaultMethodId.set(updatedMethod.id);

                // Actualizar la lista local
                const methods = this.paymentMethods();
                const updatedMethods = methods.map(m => ({
                    ...m,
                    isDefault: m.id === updatedMethod.id
                }));
                this.paymentMethods.set(updatedMethods);

                this.methodUpdated.emit(updatedMethod);
            },
            error: (error) => {
                console.error('Error al establecer método predeterminado:', error);
                this.error.set('Error al establecer método predeterminado');
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Elimina un método de pago
     */
    onDeleteMethod(methodId: string): void {
        if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) {
            return;
        }

        const subscription = this.paymentsService.deletePaymentMethod(methodId).subscribe({
            next: () => {
                // Remover de la lista local
                const methods = this.paymentMethods().filter(m => m.id !== methodId);
                this.paymentMethods.set(methods);

                // Actualizar método predeterminado si era el eliminado
                if (this.defaultMethodId() === methodId) {
                    const newDefault = methods.find(m => m.isDefault);
                    this.defaultMethodId.set(newDefault?.id || null);
                }

                // Limpiar selección si era el método seleccionado
                if (this.selectedMethodId() === methodId) {
                    this.selectedMethodId.set(null);
                }

                this.methodDeleted.emit(methodId);
            },
            error: (error) => {
                console.error('Error al eliminar método de pago:', error);
                this.error.set('Error al eliminar método de pago');
            }
        });

        this.subscriptions.push(subscription);
    }

    /**
     * Maneja la actualización de un método de pago desde el modal
     */
    onMethodUpdatedFromModal(updatedMethod: PaymentMethod): void {
        // Actualizar la lista local
        const methods = this.paymentMethods();
        const updatedMethods = methods.map(m =>
            m.id === updatedMethod.id ? updatedMethod : m
        );
        this.paymentMethods.set(updatedMethods);

        // Actualizar método predeterminado si cambió
        if (updatedMethod.isDefault) {
            this.defaultMethodId.set(updatedMethod.id);
        }

        this.closeEditModal();
        this.methodUpdated.emit(updatedMethod);
    }

    /**
     * Maneja la creación de un nuevo método de pago desde el modal
     */
    onMethodCreatedFromModal(newMethod: PaymentMethod): void {
        // Agregar a la lista local
        const methods = [...this.paymentMethods(), newMethod];
        this.paymentMethods.set(methods);

        // Actualizar método predeterminado si es el nuevo predeterminado
        if (newMethod.isDefault) {
            this.defaultMethodId.set(newMethod.id);
        }

        this.closeCreateModal();
        this.methodCreated.emit(newMethod);
    }

    /**
     * Cierra el modal de edición
     */
    closeEditModal(): void {
        this.showEditModal.set(false);
        this.editingMethod.set(null);
    }

    /**
     * Cierra el modal de creación
     */
    closeCreateModal(): void {
        this.showCreateModal.set(false);
    }

    /**
     * Limpia errores
     */
    clearError(): void {
        this.error.set(null);
    }

    /**
     * Obtiene el método seleccionado actualmente
     */
    getSelectedMethod(): PaymentMethod | null {
        const selectedId = this.selectedMethodId();
        if (!selectedId) return null;
        return this.paymentMethods().find(m => m.id === selectedId) || null;
    }

    /**
     * Obtiene el método predeterminado
     */
    getDefaultMethod(): PaymentMethod | null {
        const defaultId = this.defaultMethodId();
        if (!defaultId) return null;
        return this.paymentMethods().find(m => m.id === defaultId) || null;
    }

    /**
     * Utilidades de PaymentMethod para el template
     */
    protected readonly PaymentMethodUtils = PaymentMethodUtils;
}
