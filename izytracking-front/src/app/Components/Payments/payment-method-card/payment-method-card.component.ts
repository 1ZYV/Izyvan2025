import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentMethod, PaymentMethodUtils } from '@/Types/payment.types';

/**
 * Componente para mostrar una tarjeta individual de método de pago
 * Incluye información del método, estado de selección y acciones disponibles
 */
@Component({
    selector: 'cp-payment-method-card',
    templateUrl: './payment-method-card.component.html',
    standalone: true,
    imports: [CommonModule],
})
export class PaymentMethodCardComponent {

    // Inputs
    method = input.required<PaymentMethod>();
    isSelected = input<boolean>(false);
    isDefault = input<boolean>(false);
    allowSelection = input<boolean>(true);
    allowEdit = input<boolean>(true);
    showActions = input<boolean>(true);

    // Outputs
    selected = output<void>();
    editRequested = output<void>();
    setAsDefault = output<void>();
    deleteRequested = output<void>();

    /**
     * Maneja el clic en la tarjeta para selección
     */
    onCardClick(): void {
        if (this.allowSelection()) {
            this.selected.emit();
        }
    }

    /**
     * Maneja el clic en el botón de editar
     */
    onEditClick(event: Event): void {
        event.stopPropagation();
        if (this.allowEdit()) {
            this.editRequested.emit();
        }
    }

    /**
     * Maneja el clic en establecer como predeterminado
     */
    onSetAsDefaultClick(event: Event): void {
        event.stopPropagation();
        if (!this.isDefault()) {
            this.setAsDefault.emit();
        }
    }

    /**
     * Maneja el clic en eliminar
     */
    onDeleteClick(event: Event): void {
        event.stopPropagation();
        this.deleteRequested.emit();
    }

    /**
     * Obtiene las clases CSS para el contenedor de la tarjeta
     */
    getCardClasses(): string {
        const baseClasses = 'relative p-3 transition-all duration-200 border rounded-lg';
        const interactiveClasses = this.allowSelection() ? 'cursor-pointer' : '';
        const selectionClasses = this.isSelected()
            ? 'border-blue-500 bg-blue-50 shadow-sm'
            : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300';

        return `${baseClasses} ${interactiveClasses} ${selectionClasses}`;
    }

    /**
     * Verifica si el método está expirado
     */
    isExpired(): boolean {
        return PaymentMethodUtils.isExpired(this.method());
    }

    /**
     * Verifica si el método está próximo a expirar
     */
    isExpiringSoon(): boolean {
        return PaymentMethodUtils.isExpiringSoon(this.method());
    }

    /**
     * Obtiene el texto del estado de expiración
     */
    getExpirationStatus(): string {
        const method = this.method();

        if (this.isExpired()) {
            return 'Expirado';
        } else if (this.isExpiringSoon()) {
            return 'Expira pronto';
        } else if (method.expiryDate) {
            return PaymentMethodUtils.formatExpiryDate(method.expiryDate);
        }

        return '';
    }

    /**
     * Obtiene las clases CSS para el estado de expiración
     */
    getExpirationClasses(): string {
        if (this.isExpired()) {
            return 'text-red-600 bg-red-100';
        } else if (this.isExpiringSoon()) {
            return 'text-yellow-600 bg-yellow-100';
        }
        return '';
    }

    /**
     * Utilidades de PaymentMethod para el template
     */
    protected readonly PaymentMethodUtils = PaymentMethodUtils;
}
