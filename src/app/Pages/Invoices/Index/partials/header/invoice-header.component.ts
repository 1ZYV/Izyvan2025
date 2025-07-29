import { BadgeComponent } from "@/Components/Badge/badge.component";
import { CardComponent } from "@/Components/Card/card.component";
import { PaymentMethodsComponent } from "@/Components/Payments/payment-methods.component";
import { Component, OnInit, OnDestroy, signal, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { InvoicesService } from "@/Services/Invoices/invoices.service";
import { AuthService } from "@/Services/Auth/auth.service";
import { Invoice, InvoiceStatusUtils } from "@/Types/invoice.types";
import { PaymentMethod } from "@/Types/payment.types";
import { User, Role } from "@/Types/index.d";

@Component({
    selector: 'cp-invoice-header',
    templateUrl: './invoice-header.component.html',
    standalone: true,
    imports: [CardComponent, BadgeComponent, CommonModule, PaymentMethodsComponent],
})
export class InvoiceHeaderComponent implements OnInit, OnDestroy {
    // Services
    private invoicesService = inject(InvoicesService);
    private authService = inject(AuthService);

    // Señales para el estado del componente
    isLoading = signal<boolean>(true);
    recentInvoices = signal<Invoice[]>([]);
    currentUser = signal<User | null>(null);
    userRoles = signal<Role[]>([]);
    selectedPaymentMethod = signal<PaymentMethod | null>(null);

    invoiceStats = signal<{
        total: number;
        paid: number;
        pending: number;
        review: number;
        totalAmount: number;
        pendingAmount: number;
    }>({
        total: 0,
        paid: 0,
        pending: 0,
        review: 0,
        totalAmount: 0,
        pendingAmount: 0
    });

    private subscriptions: Subscription[] = [];

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.loadUserData();
        this.loadInvoiceStats();
        this.loadRecentInvoices();
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.invoicesService.clearLoading();
    }

    private loadUserData(): void {
        // Suscribirse al usuario actual para obtener roles
        const userSub = this.authService.currentUser$.subscribe(user => {
            this.currentUser.set(user);
            this.userRoles.set(user?.roles || []);
        });

        // También obtener los datos actuales del usuario si existe
        const currentUserSub = this.authService.getCurrentUserData().subscribe(user => {
            if (user) {
                this.currentUser.set(user);
                this.userRoles.set(user.roles || []);
            }
        });

        this.subscriptions.push(userSub, currentUserSub);
    }

    private loadInvoiceStats(): void {
        const statsSub = this.invoicesService.getInvoiceStats().subscribe({
            next: (stats) => {
                this.invoiceStats.set(stats);
            },
            error: (error) => {
                console.error('Error al cargar estadísticas de cargos:', error);
            }
        });
        this.subscriptions.push(statsSub);
    }

    private loadRecentInvoices(): void {
        const invoicesSub = this.invoicesService.getInvoices().subscribe({
            next: (invoices) => {
                // Mostrar las 3 facturas más recientes
                const recent = invoices
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 3);
                this.recentInvoices.set(recent);
            },
            error: (error) => {
                console.error('Error al cargar cargos recientes:', error);
            },
            complete: () => {
                this.isLoading.set(false);
            }
        });
        this.subscriptions.push(invoicesSub);
    }

    // Método para navegar al detalle de un cargo
    onViewInvoiceDetails(invoiceId: string): void {
        console.log('Ver detalles de cargo:', invoiceId);
        this.router.navigate(['/dashboard/invoices', invoiceId]);
    }

    // Método para navegar a crear nuevo cargo
    onCreateInvoice(): void {
        this.router.navigate(['/dashboard/invoices/create']);
    }

    // Método para obtener información de estado usando utilidades centralizadas
    getStatusInfo(invoice: Invoice) {
        return {
            description: InvoiceStatusUtils.getStatusDescription(invoice.status),
            variant: InvoiceStatusUtils.getStatusVariant(invoice.status)
        };
    }

    // Formatear montos
    formatAmount(amount: number): string {
        return `$${amount.toFixed(2)}`;
    }

    // Formatear fechas
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
        });
    }

    // Verificar si el usuario es de tipo agencia
    isAgencyUser(): boolean {
        const roles = this.userRoles();
        return roles.includes('AGENCY');
    }

    /**
     * Maneja la selección de método de pago desde el componente de pagos
     */
    onPaymentMethodSelected(method: PaymentMethod): void {
        this.selectedPaymentMethod.set(method);
        console.log('Método de pago seleccionado:', method);
    }

    /**
     * Maneja la actualización de un método de pago
     */
    onPaymentMethodUpdated(method: PaymentMethod): void {
        console.log('Método de pago actualizado:', method);
        // Aquí podrías manejar la lógica adicional si es necesaria
    }

    /**
     * Maneja la creación de un nuevo método de pago
     */
    onPaymentMethodCreated(method: PaymentMethod): void {
        console.log('Nuevo método de pago creado:', method);
        // Aquí podrías manejar la lógica adicional si es necesaria
    }

    /**
     * Maneja la eliminación de un método de pago
     */
    onPaymentMethodDeleted(methodId: string): void {
        console.log('Método de pago eliminado:', methodId);
        // Limpiar selección si era el método seleccionado
        if (this.selectedPaymentMethod()?.id === methodId) {
            this.selectedPaymentMethod.set(null);
        }
    }
}