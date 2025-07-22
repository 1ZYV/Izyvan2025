import { Component, OnInit, OnDestroy, signal, inject } from "@angular/core";
import { InvoiceHeaderComponent } from "./partials/header/invoice-header.component";
import { InvoiceCardComponent } from "../../../Components/InvoiceCard/invoice-card.component";
import { Invoice, InvoiceStatus, INVOICE_STATUS_CONSTANTS } from "../../../Types/invoice.types";
import { Router } from "@angular/router";
import { InvoicesService } from "../../../Services/Invoices/invoices.service";
import { AuthService } from "../../../Services/Auth/auth.service";
import { Subscription } from "rxjs";
import { LoaderComponent } from "../../../Components/Loader/loader.component";
import { EmptyStateComponent } from "../../../Components/EmptyState/empty-state.component";
import { User, Role } from "../../../Types/index.d";

@Component({
    selector: "pg-invoices-index",
    templateUrl: "./index.component.html",
    standalone: true,
    imports: [
        InvoiceHeaderComponent,
        InvoiceCardComponent,
        LoaderComponent,
        EmptyStateComponent
    ],
})
export class InvoicesIndexComponent implements OnInit, OnDestroy {
    // Services
    private invoicesService = inject(InvoicesService);
    private authService = inject(AuthService);

    // Señales para el estado del componente
    isLoading = signal<boolean>(true);
    invoicesList = signal<Invoice[]>([]);
    filteredInvoices = signal<Invoice[]>([]);
    selectedStatus = signal<InvoiceStatus | 'all'>('all');

    // Estado del usuario y roles
    currentUser = signal<User | null>(null);
    userRoles = signal<Role[]>([]);

    // Opciones de filtro
    statusOptions = [
        { value: 'all' as const, label: 'Todas los cargos' },
        { value: INVOICE_STATUS_CONSTANTS.PENDIENTE, label: 'Pendientes' },
        { value: INVOICE_STATUS_CONSTANTS.PAGO, label: 'Pagadas' },
        { value: INVOICE_STATUS_CONSTANTS.REVISION, label: 'En Revisión' }
    ];

    private subscriptions: Subscription[] = [];

    constructor(private router: Router) { } ngOnInit(): void {
        this.loadInvoicesList();

        // Suscribirse al estado de loading del servicio
        const loadingSub = this.invoicesService.isLoading$.subscribe(loading => {
            this.isLoading.set(loading);
        });

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

        this.subscriptions.push(loadingSub, userSub, currentUserSub);
        this.subscriptions.push(loadingSub);
    }

    ngOnDestroy(): void {
        // Limpiar suscripciones para evitar memory leaks
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.invoicesService.clearLoading();
    }

    private loadInvoicesList(): void {
        const invoicesSub = this.invoicesService.getInvoices().subscribe({
            next: (invoices) => {
                // Ordenar por fecha más reciente primero
                const sortedInvoices = invoices.sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                this.invoicesList.set(sortedInvoices);
                this.applyStatusFilter();
            },
            error: (error) => {
                console.error('Error al cargar lista de cargos:', error);
                this.isLoading.set(false);
            },
            complete: () => {
                this.invoicesService.clearLoading();
            }
        });
        this.subscriptions.push(invoicesSub);
    }

    // Método para filtrar facturas por estado
    onStatusFilterChange(status: InvoiceStatus | 'all'): void {
        this.selectedStatus.set(status);
        this.applyStatusFilter();
    }

    private applyStatusFilter(): void {
        const status = this.selectedStatus();
        const allInvoices = this.invoicesList();

        if (status === 'all') {
            this.filteredInvoices.set(allInvoices);
        } else {
            const filtered = allInvoices.filter(invoice => invoice.status === status);
            this.filteredInvoices.set(filtered);
        }
    }

    // Métodos para manejar eventos del InvoiceCard
    onViewDetails(invoice: Invoice): void {
        console.log('Ver detalles del cargo:', invoice);
        this.router.navigate(['/dashboard/invoices', invoice.id]);
    }

    onCardClick(invoice: Invoice): void {
        console.log('Cargo clickeado:', invoice);
        this.router.navigate(['/dashboard/invoices', invoice.id]);
    }    // Método para crear nuevo cargo (placeholder)
    onCreateInvoice = (): void => {
        console.log('Crear nuevo cargo');
        // TODO: Implementar navegación a página de creación de cargos
        this.router.navigate(['/dashboard/invoices/create']);
    }

    // Método para mostrar todos los cargos
    onShowAllInvoices = (): void => {
        this.onStatusFilterChange('all');
    }    // Obtener texto del filtro seleccionado
    getSelectedFilterLabel(): string {
        const option = this.statusOptions.find(opt => opt.value === this.selectedStatus());
        return option ? option.label : 'Todos los cargos';
    }

    // Verificar si el usuario puede crear cargos (solo admin y provider)
    canCreateInvoices(): boolean {
        const roles = this.userRoles();
        return roles.includes('admin') || roles.includes('provider');
    }
}