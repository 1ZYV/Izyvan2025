/**
 * Barrel export para el módulo de Payments
 * Facilita las importaciones de los componentes relacionados con métodos de pago
 */

// Exportar tipos
export * from '../../Types/payment.types';

// Exportar servicios
export { PaymentsService } from '../../Services/Payments/payments.service';

// Exportar componentes
export { PaymentMethodsComponent } from './payment-methods.component';
export { PaymentMethodCardComponent } from './payment-method-card/payment-method-card.component';
export { PaymentMethodModalComponent } from './payment-method-modal/payment-method-modal.component';
