import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Invoice, InvoiceStatusUtils, INVOICE_STATUS_CONSTANTS } from '../../../Types/invoice.types';
import { InvoicesService } from '../../../Services/Invoices/invoices.service';
import { CardComponent } from '../../../Components/Card/card.component';
import { BadgeComponent } from '../../../Components/Badge/badge.component';
import { LoaderComponent } from '../../../Components/Loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'cp-invoices-show',
    templateUrl: './show.component.html',
    styleUrl: './show.component.css',
    standalone: true,
    imports: [
        CardComponent,
        BadgeComponent,
        LoaderComponent,
        CommonModule
    ],
})
export class InvoicesShowComponent implements OnInit, OnDestroy {
    // Señales para el estado del componente
    invoiceId = signal<string>('');
    isLoading = signal<boolean>(true);
    invoice = signal<Invoice | null>(null);

    private subscriptions: Subscription[] = [];

    // Computed properties
    statusInfo = computed(() => {
        const inv = this.invoice();
        if (!inv) return null;

        return {
            description: InvoiceStatusUtils.getStatusDescription(inv.status),
            variant: InvoiceStatusUtils.getStatusVariant(inv.status)
        };
    });

    formattedTotal = computed(() => {
        const inv = this.invoice();
        return inv ? `${inv.currency} $${inv.total.toFixed(2)}` : '';
    });

    hasServices = computed(() => {
        const inv = this.invoice();
        return inv?.services && inv.services.length > 0;
    });

    hasAttachments = computed(() => {
        const inv = this.invoice();
        return inv?.attachments && inv.attachments.length > 0;
    });

    attachmentsCount = computed(() => {
        const inv = this.invoice();
        return inv?.attachments?.length || 0;
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private invoicesService: InvoicesService
    ) { }

    ngOnInit(): void {
        // Obtener ID de la factura desde la ruta
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.invoiceId.set(id);
            this.loadInvoiceData(id);
        } else {
            this.router.navigate(['/dashboard/invoices']);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private loadInvoiceData(id: string): void {
        const invoiceSub = this.invoicesService.getInvoiceById(id).subscribe({
            next: (invoice) => {
                if (invoice) {
                    this.invoice.set(invoice);
                } else {
                    // Factura no encontrada, redirigir a la lista
                    this.router.navigate(['/dashboard/invoices']);
                }
            },
            error: (error) => {
                console.error('Error al cargar factura:', error);
                this.router.navigate(['/dashboard/invoices']);
            },
            complete: () => {
                this.isLoading.set(false);
                this.invoicesService.clearLoading();
            }
        });
        this.subscriptions.push(invoiceSub);
    }

    // Método para regresar a la lista de facturas
    onBackToInvoices(): void {
        this.router.navigate(['/dashboard/invoices']);
    }

    // Método para actualizar estado de factura
    onUpdateStatus(newStatus: string): void {
        const inv = this.invoice();
        if (!inv) return;

        const invoiceSub = this.invoicesService.updateInvoiceStatus(inv.id, newStatus as any).subscribe({
            next: (success) => {
                if (success) {
                    // Recargar los datos de la factura
                    this.loadInvoiceData(inv.id);
                    console.log('Estado actualizado exitosamente');
                }
            },
            error: (error) => {
                console.error('Error al actualizar estado:', error);
            }
        });
        this.subscriptions.push(invoiceSub);
    }

    // Método para descargar/imprimir factura (placeholder)
    onDownloadInvoice(): void {
        console.log('Descargar factura:', this.invoice()?.number);
        // TODO: Implementar descarga de PDF
    }

    // Formatear fechas
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
