import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, BehaviorSubject } from 'rxjs';
import { Invoice, InvoiceStatus, INVOICE_STATUS_CONSTANTS } from '../../Types/invoice.types';

@Injectable({
    providedIn: 'root'
})
export class InvoicesService {
    // Estado reactivo
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private invoicesListSubject = new BehaviorSubject<Invoice[]>([]);
    public invoicesList$ = this.invoicesListSubject.asObservable();

    // Datos mock para simular API
    private mockInvoices: Invoice[] = [{
        id: 'inv-001',
        number: 'FAC-2025-001',
        date: '2025-06-20',
        dueDate: '2025-07-20',
        issueDate: '2025-06-20',
        amount: 45.50,
        currency: 'USD',
        status: INVOICE_STATUS_CONSTANTS.PAGO,
        description: 'Servicio de transporte - Aeropuerto Internacional',
        customer: {
            name: 'Juan Pérez',
            email: 'juan.perez@email.com',
            id: 'cust-001'
        },
        clientName: 'Juan Pérez',
        clientEmail: 'juan.perez@email.com',
        clientPhone: '+1-555-0123',
        travel: {
            id: 'travel-001',
            origin: 'Centro Comercial Plaza',
            destination: 'Aeropuerto Internacional',
            date: '2025-06-20'
        },
        items: [
            {
                id: 'item-001',
                description: 'Servicio de transporte',
                quantity: 1,
                unitPrice: 38.00,
                total: 38.00
            },
            {
                id: 'item-002',
                description: 'Tarifa nocturna',
                quantity: 1,
                unitPrice: 5.00,
                total: 5.00
            }
        ],
        tax: 2.50,
        taxes: 2.50,
        subtotal: 43.00,
        total: 45.50,
        paymentDate: '2025-06-21',
        paymentMethod: 'Tarjeta de Crédito',
        paymentReference: 'TXN-202506210001',
        notes: 'Pago procesado exitosamente. Cliente satisfecho con el servicio.'
    }, {
        id: 'inv-002',
        number: 'FAC-2025-002',
        date: '2025-06-19',
        dueDate: '2025-07-19',
        issueDate: '2025-06-19',
        amount: 31.00,
        currency: 'USD',
        status: INVOICE_STATUS_CONSTANTS.PENDIENTE,
        description: 'Servicio de transporte - Centro Médico',
        customer: {
            name: 'María González',
            email: 'maria.gonzalez@email.com',
            id: 'cust-002'
        },
        clientName: 'María González',
        clientEmail: 'maria.gonzalez@email.com',
        clientPhone: '+1-555-0124',
        travel: {
            id: 'travel-002',
            origin: 'Residencial Los Pinos',
            destination: 'Centro Médico San José',
            date: '2025-06-19'
        },
        items: [
            {
                id: 'item-003',
                description: 'Servicio de transporte',
                quantity: 1,
                unitPrice: 28.00,
                total: 28.00
            }
        ],
        tax: 3.00,
        taxes: 3.00,
        subtotal: 28.00,
        total: 31.00,
        notes: 'Pendiente de pago. Recordatorio enviado.'
    }, {
        id: 'inv-003',
        number: 'FAC-2025-003',
        date: '2025-06-18',
        dueDate: '2025-07-18',
        issueDate: '2025-06-18',
        amount: 40.00,
        currency: 'USD',
        status: INVOICE_STATUS_CONSTANTS.REVISION,
        description: 'Servicio de transporte - Universidad Central',
        customer: {
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@email.com',
            id: 'cust-003'
        },
        clientName: 'Carlos Rodríguez',
        clientEmail: 'carlos.rodriguez@email.com',
        travel: {
            id: 'travel-003',
            origin: 'Casa',
            destination: 'Universidad Central',
            date: '2025-06-18'
        },
        items: [
            {
                id: 'item-004',
                description: 'Servicio de transporte',
                quantity: 1,
                unitPrice: 35.00,
                total: 35.00
            }
        ],
        tax: 5.00,
        taxes: 5.00,
        subtotal: 35.00,
        total: 40.00,
        notes: 'En proceso de revisión contable.'
    },
    {
        id: 'inv-004',
        number: 'FAC-2025-004',
        date: '2025-06-17',
        dueDate: '2025-07-17',
        issueDate: '2025-06-17',
        amount: 36.00,
        currency: 'USD',
        status: INVOICE_STATUS_CONSTANTS.PAGO,
        description: 'Servicio de transporte - Hotel Plaza Central',
        customer: {
            name: 'Ana López',
            email: 'ana.lopez@email.com',
            id: 'cust-004'
        },
        clientName: 'Ana López',
        clientEmail: 'ana.lopez@email.com',
        clientPhone: '+1-555-0126',
        travel: {
            id: 'travel-004',
            origin: 'Aeropuerto Internacional',
            destination: 'Hotel Plaza Central',
            date: '2025-06-17'
        },
        items: [
            {
                id: 'item-005',
                description: 'Servicio de transporte',
                quantity: 1,
                unitPrice: 32.00,
                total: 32.00
            }
        ],
        tax: 4.00,
        taxes: 4.00,
        subtotal: 32.00,
        total: 36.00,
        paymentDate: '2025-06-18',
        paymentMethod: 'Transferencia Bancaria',
        paymentReference: 'TXN-202506180001'
    },
    {
        id: 'inv-005',
        number: 'FAC-2025-005',
        date: '2025-06-16',
        dueDate: '2025-07-16',
        issueDate: '2025-06-16',
        amount: 25.50,
        currency: 'USD',
        status: INVOICE_STATUS_CONSTANTS.PENDIENTE,
        description: 'Servicio de transporte - Centro Comercial',
        customer: {
            name: 'Roberto Martínez',
            email: 'roberto.martinez@email.com',
            id: 'cust-005'
        },
        clientName: 'Roberto Martínez',
        clientEmail: 'roberto.martinez@email.com',
        travel: {
            id: 'travel-005',
            origin: 'Oficina Central',
            destination: 'Centro Comercial Norte',
            date: '2025-06-16'
        },
        items: [
            {
                id: 'item-006',
                description: 'Servicio de transporte',
                quantity: 1,
                unitPrice: 22.00,
                total: 22.00
            }
        ],
        tax: 3.50,
        taxes: 3.50,
        subtotal: 22.00,
        total: 25.50
    }
    ];

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData(): void {
        this.invoicesListSubject.next(this.mockInvoices);
    }

    /**
     * Obtiene la lista de facturas
     */
    getInvoices(): Observable<Invoice[]> {
        this.isLoadingSubject.next(true);

        return of(this.invoicesListSubject.value).pipe(
            delay(600) // Simular latencia de red
        );
    }

    /**
     * Obtiene una factura por ID
     */
    getInvoiceById(invoiceId: string): Observable<Invoice | null> {
        this.isLoadingSubject.next(true);

        const invoice = this.mockInvoices.find(inv => inv.id === invoiceId);

        return of(invoice || null).pipe(
            delay(400)
        );
    }

    /**
     * Obtiene facturas filtradas por estado
     */
    getInvoicesByStatus(status: InvoiceStatus): Observable<Invoice[]> {
        this.isLoadingSubject.next(true);

        const filteredInvoices = this.invoicesListSubject.value
            .filter(invoice => invoice.status === status)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return of(filteredInvoices).pipe(
            delay(500)
        );
    }

    /**
     * Actualiza el estado de una factura
     */
    updateInvoiceStatus(invoiceId: string, newStatus: InvoiceStatus): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const invoiceIndex = this.mockInvoices.findIndex(inv => inv.id === invoiceId);

        if (invoiceIndex !== -1) {
            this.mockInvoices[invoiceIndex].status = newStatus;
            this.initializeMockData(); // Actualizar la lista reactiva

            return of(true).pipe(delay(800));
        }

        return of(false).pipe(delay(800));
    }

    /**
     * Obtiene estadísticas de facturas
     */
    getInvoiceStats(): Observable<{
        total: number;
        paid: number;
        pending: number;
        review: number;
        totalAmount: number;
        pendingAmount: number;
    }> {
        this.isLoadingSubject.next(true);

        const invoices = this.invoicesListSubject.value;
        const stats = {
            total: invoices.length,
            paid: invoices.filter(inv => inv.status === INVOICE_STATUS_CONSTANTS.PAGO).length,
            pending: invoices.filter(inv => inv.status === INVOICE_STATUS_CONSTANTS.PENDIENTE).length,
            review: invoices.filter(inv => inv.status === INVOICE_STATUS_CONSTANTS.REVISION).length,
            totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
            pendingAmount: invoices
                .filter(inv => inv.status === INVOICE_STATUS_CONSTANTS.PENDIENTE)
                .reduce((sum, inv) => sum + inv.total, 0)
        };

        return of(stats).pipe(delay(300));
    }

    /**
     * Limpiar el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }
}
