import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../Components/Card/card.component';
import { BadgeComponent } from '../../../Components/Badge/badge.component';
import { LoaderComponent } from '../../../Components/Loader/loader.component';
import { InvoiceService } from '../../../Types/invoice.types';
import { InvoicesService } from '../../../Services/Invoices/invoices.service';
import { TourismService } from '../../../Types/tourism-service.types';

interface CompletedService {
    id: string;
    type: 'transport' | 'tourism';
    description: string;
    completedDate: string;
    amount: number;
    agencyId: string;
    agencyName: string;
    selected: boolean;
    serviceDetails: any;
}

@Component({
    selector: 'cp-invoice-create',
    templateUrl: './create.component.html',
    styleUrl: './create.component.css',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardComponent,
        BadgeComponent,
        LoaderComponent
    ]
})
export class InvoiceCreateComponent implements OnInit {
    private formBuilder = inject(FormBuilder);
    private router = inject(Router);
    private invoicesService = inject(InvoicesService);

    // Signals
    isLoading = signal<boolean>(false);
    isCreating = signal<boolean>(false);
    selectedAgency = signal<string>('');
    completedServices = signal<CompletedService[]>([]);
    selectedServices = signal<CompletedService[]>([]);
    attachedFiles = signal<File[]>([]);

    // Form
    invoiceForm!: FormGroup;

    // Mock agencies data
    agencies = signal([
        { id: 'agency-001', name: 'Agencia TurAventura', email: 'info@turavventura.com', phone: '+1-555-0100' },
        { id: 'agency-002', name: 'Viajes del Sol', email: 'contacto@viajesdelssol.com', phone: '+1-555-0101' },
        { id: 'agency-003', name: 'Exploradores Unidos', email: 'admin@exploradoresunidos.com', phone: '+1-555-0102' }
    ]);

    // Computed values
    totalAmount = computed(() => {
        return this.selectedServices().reduce((total, service) => total + service.amount, 0);
    });

    subtotal = computed(() => {
        const total = this.totalAmount();
        const taxRate = 0.12; // 12% tax
        return total / (1 + taxRate);
    });

    taxes = computed(() => {
        return this.totalAmount() - this.subtotal();
    });

    hasSelectedServices = computed(() => {
        return this.selectedServices().some(service => service.selected);
    });

    ngOnInit(): void {
        this.initForm();
        this.loadCompletedServices();
    }

    private initForm(): void {
        this.invoiceForm = this.formBuilder.group({
            agencyId: ['', Validators.required],
            description: ['Cargo por servicios completados', Validators.required],
            notes: ['']
        });

        // Watch for agency changes
        this.invoiceForm.get('agencyId')?.valueChanges.subscribe(agencyId => {
            this.selectedAgency.set(agencyId);
            this.filterServicesByAgency(agencyId);
        });
    }

    private loadCompletedServices(): void {
        this.isLoading.set(true);

        // Mock completed services
        const mockServices: CompletedService[] = [
            {
                id: 'service-001',
                type: 'transport',
                description: 'Transporte Aeropuerto - Hotel Plaza',
                completedDate: '2025-07-15',
                amount: 45.50,
                agencyId: 'agency-001',
                agencyName: 'Agencia TurAventura',
                selected: false,
                serviceDetails: {
                    origin: 'Aeropuerto Internacional',
                    destination: 'Hotel Plaza',
                    distance: 25,
                    duration: 35,
                    vehicleType: 'van'
                }
            },
            {
                id: 'service-002',
                type: 'tourism',
                description: 'Tour por el Centro Histórico',
                completedDate: '2025-07-16',
                amount: 120.00,
                agencyId: 'agency-001',
                agencyName: 'Agencia TurAventura',
                selected: false,
                serviceDetails: {
                    tourDestination: 'Centro Histórico',
                    tourDuration: 4,
                    groupSize: 8,
                    specialtyRequired: 'Historia',
                    languageRequired: 'Español'
                }
            },
            {
                id: 'service-003',
                type: 'transport',
                description: 'Transporte Hotel - Museo Nacional',
                completedDate: '2025-07-17',
                amount: 32.00,
                agencyId: 'agency-001',
                agencyName: 'Agencia TurAventura',
                selected: false,
                serviceDetails: {
                    origin: 'Hotel Plaza',
                    destination: 'Museo Nacional',
                    distance: 15,
                    duration: 20,
                    vehicleType: 'carro'
                }
            },
            {
                id: 'service-004',
                type: 'tourism',
                description: 'Tour Gastronómico',
                completedDate: '2025-07-18',
                amount: 85.00,
                agencyId: 'agency-002',
                agencyName: 'Viajes del Sol',
                selected: false,
                serviceDetails: {
                    tourDestination: 'Zona Rosa',
                    tourDuration: 3,
                    groupSize: 6,
                    specialtyRequired: 'Gastronomía',
                    languageRequired: 'Inglés'
                }
            }
        ];

        setTimeout(() => {
            this.completedServices.set(mockServices);
            this.isLoading.set(false);
        }, 1000);
    }

    private filterServicesByAgency(agencyId: string): void {
        const allServices = this.completedServices();
        if (!agencyId) {
            this.selectedServices.set([]);
            return;
        }

        const filteredServices = allServices.filter(service => service.agencyId === agencyId);
        this.selectedServices.set(filteredServices);
    }

    toggleServiceSelection(service: CompletedService): void {
        const services = this.selectedServices();
        const updatedServices = services.map(s =>
            s.id === service.id ? { ...s, selected: !s.selected } : s
        );
        this.selectedServices.set(updatedServices);
    }

    onSubmit(): void {
        if (this.invoiceForm.invalid) {
            return;
        }

        const selectedServicesForInvoice = this.selectedServices().filter(s => s.selected);
        if (selectedServicesForInvoice.length === 0) {
            alert('Debe seleccionar al menos un servicio para el cargo');
            return;
        }

        this.isCreating.set(true);

        const formData = this.invoiceForm.value;
        const selectedAgencyData = this.agencies().find(a => a.id === formData.agencyId);

        const invoiceData = {
            agencyId: formData.agencyId,
            agency: selectedAgencyData,
            description: formData.description,
            notes: formData.notes,
            services: selectedServicesForInvoice.map(service => ({
                id: service.id,
                type: service.type,
                description: service.description,
                completedDate: service.completedDate,
                amount: service.amount,
                serviceDetails: service.serviceDetails,
                originalServiceId: service.id
            })),
            subtotal: this.subtotal(),
            taxes: this.taxes(),
            total: this.totalAmount(),
            attachments: this.attachedFiles().map((file, index) => ({
                id: `attachment-${Date.now()}-${index}`,
                fileName: file.name,
                fileType: file.type.startsWith('image/') ? 'image' as const : 'pdf' as const,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                description: `Archivo adjunto: ${file.name}`
            }))
        };

        // Use the service to create the invoice
        this.invoicesService.createMultiServiceInvoice(invoiceData).subscribe({
            next: (createdInvoice) => {
                console.log('Invoice created successfully:', createdInvoice);
                this.isCreating.set(false);
                this.router.navigate(['/dashboard/invoices']);
            },
            error: (error) => {
                console.error('Error creating invoice:', error);
                this.isCreating.set(false);
                alert('Error al crear el cargo. Por favor, inténtalo de nuevo.');
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/dashboard/invoices']);
    }

    getServiceIcon(type: 'transport' | 'tourism'): string {
        return type === 'transport' ? '🚗' : '🏛️';
    }

    formatCurrency(amount: number): string {
        return `$${amount.toFixed(2)}`;
    }

    // Métodos para manejo de archivos
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            const files = Array.from(input.files);
            const validFiles = files.filter(file => this.isValidFile(file));

            if (validFiles.length !== files.length) {
                alert('Algunos archivos fueron rechazados. Solo se permiten imágenes (JPG, PNG, WEBP) y PDFs hasta 10MB.');
            }

            const currentFiles = this.attachedFiles();
            this.attachedFiles.set([...currentFiles, ...validFiles]);
        }
    }

    private isValidFile(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        return allowedTypes.includes(file.type) && file.size <= maxSize;
    }

    removeFile(index: number): void {
        const files = this.attachedFiles();
        files.splice(index, 1);
        this.attachedFiles.set([...files]);
    }

    getFileIcon(file: File): string {
        if (file.type.startsWith('image/')) {
            return '🖼️';
        } else if (file.type === 'application/pdf') {
            return '📄';
        }
        return '📎';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
