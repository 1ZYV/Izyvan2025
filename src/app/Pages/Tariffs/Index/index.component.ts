import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  TariffsService, 
  TariffDetails, 
  TariffType, 
  TariffFilters,
  CreateTariffData 
} from '../../../Services/Tariffs/tariffs.service';

@Component({
  selector: 'pg-tariffs-index',
  templateUrl: './index.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TariffsIndexComponent implements OnInit {
  private tariffsService = inject(TariffsService);

  // Signals para el estado reactivo
  tariffs = signal<TariffDetails[]>([]);
  tariffTypes = signal<TariffType[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // Paginación
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  itemsPerPage = 10;

  // Filtros
  filters: TariffFilters = {
    search: '',
    type: '',
    zone: '',
    isActive: undefined,
    currency: '',
    page: 1,
    limit: this.itemsPerPage
  };

  // Modal states
  showCreateModal = signal<boolean>(false);
  showEditModal = signal<boolean>(false);
  showDeleteModal = signal<boolean>(false);
  selectedTariff = signal<TariffDetails | null>(null);

  // Form data para crear/editar
  formData: CreateTariffData = {
    name: '',
    description: '',
    type: 'TRAVEL',
    basePrice: 0,
    pricePerKm: 0,
    pricePerHour: 0,
    zone: '',
    origin: '',
    destination: '',
    currency: 'USD',
    isActive: true,
    validFrom: '',
    validTo: '',
    minPrice: 0,
    maxPrice: 0,
    vehicleTypes: [],
    serviceTypes: []
  };

  constructor() {}

  ngOnInit() {
    this.loadTariffs();
    this.loadTariffTypes();
  }

  // Cargar tarifas desde el backend
  loadTariffs() {
    this.loading.set(true);
    this.error.set(null);

    this.filters.page = this.currentPage();
    this.filters.limit = this.itemsPerPage;

    this.tariffsService.getTariffs(this.filters).subscribe({
      next: (response) => {
        this.tariffs.set(response.data);
        this.currentPage.set(response.pagination.page);
        this.totalPages.set(response.pagination.totalPages);
        this.totalItems.set(response.pagination.total);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error cargando tarifas:', error);
        this.error.set('Error al cargar las tarifas. Por favor, intenta nuevamente.');
        this.loading.set(false);
      }
    });
  }

  // Cargar tipos de tarifa
  loadTariffTypes() {
    this.tariffsService.getTariffTypes().subscribe({
      next: (response) => {
        this.tariffTypes.set(response.types);
      },
      error: (error) => {
        console.error('Error cargando tipos de tarifa:', error);
      }
    });
  }

  // Aplicar filtros
  applyFilters() {
    this.currentPage.set(1);
    this.loadTariffs();
  }

  // Limpiar filtros
  clearFilters() {
    this.filters = {
      search: '',
      type: '',
      zone: '',
      isActive: undefined,
      currency: '',
      page: 1,
      limit: this.itemsPerPage
    };
    this.loadTariffs();
  }

  // Paginación
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadTariffs();
    }
  }

  // Abrir modal de crear
  openCreateModal() {
    this.resetFormData();
    this.showCreateModal.set(true);
  }

  // Abrir modal de editar
  openEditModal(tariff: TariffDetails) {
    this.selectedTariff.set(tariff);
    this.formData = {
      name: tariff.name,
      description: tariff.description || '',
      type: tariff.type,
      basePrice: tariff.basePrice,
      pricePerKm: tariff.pricePerKm || 0,
      pricePerHour: tariff.pricePerHour || 0,
      zone: tariff.zone || '',
      origin: tariff.origin || '',
      destination: tariff.destination || '',
      currency: tariff.currency,
      isActive: tariff.isActive,
      validFrom: tariff.validFrom || '',
      validTo: tariff.validTo || '',
      minPrice: tariff.minPrice || 0,
      maxPrice: tariff.maxPrice || 0,
      vehicleTypes: tariff.vehicleTypes || [],
      serviceTypes: tariff.serviceTypes || []
    };
    this.showEditModal.set(true);
  }

  // Abrir modal de eliminar
  openDeleteModal(tariff: TariffDetails) {
    this.selectedTariff.set(tariff);
    this.showDeleteModal.set(true);
  }

  // Cerrar modales
  closeModals() {
    this.showCreateModal.set(false);
    this.showEditModal.set(false);
    this.showDeleteModal.set(false);
    this.selectedTariff.set(null);
    this.resetFormData();
  }

  // Resetear datos del formulario
  resetFormData() {
    this.formData = {
      name: '',
      description: '',
      type: 'TRAVEL',
      basePrice: 0,
      pricePerKm: 0,
      pricePerHour: 0,
      zone: '',
      origin: '',
      destination: '',
      currency: 'USD',
      isActive: true,
      validFrom: '',
      validTo: '',
      minPrice: 0,
      maxPrice: 0,
      vehicleTypes: [],
      serviceTypes: []
    };
  }

  // Crear tarifa
  createTariff() {
    this.loading.set(true);
    
    this.tariffsService.createTariff(this.formData).subscribe({
      next: (response) => {
        console.log('Tarifa creada:', response);
        this.closeModals();
        this.loadTariffs();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error creando tarifa:', error);
        this.error.set('Error al crear la tarifa. Por favor, verifica los datos.');
        this.loading.set(false);
      }
    });
  }

  // Actualizar tarifa
  updateTariff() {
    const tariff = this.selectedTariff();
    if (!tariff) return;

    this.loading.set(true);
    
    this.tariffsService.updateTariff(tariff.id, this.formData).subscribe({
      next: (response) => {
        console.log('Tarifa actualizada:', response);
        this.closeModals();
        this.loadTariffs();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error actualizando tarifa:', error);
        this.error.set('Error al actualizar la tarifa. Por favor, verifica los datos.');
        this.loading.set(false);
      }
    });
  }

  // Eliminar tarifa
  deleteTariff() {
    const tariff = this.selectedTariff();
    if (!tariff) return;

    this.loading.set(true);
    
    this.tariffsService.deleteTariff(tariff.id).subscribe({
      next: (response) => {
        console.log('Tarifa eliminada:', response);
        this.closeModals();
        this.loadTariffs();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error eliminando tarifa:', error);
        this.error.set('Error al eliminar la tarifa.');
        this.loading.set(false);
      }
    });
  }

  // Métodos de utilidad
  formatPrice(price: number, currency: string = 'USD'): string {
    return this.tariffsService.formatPrice(price, currency);
  }

  formatTariffType(type: string): string {
    return this.tariffsService.formatTariffType(type);
  }

  getStatusLabel(isActive: boolean): string {
    return this.tariffsService.getStatusLabel(isActive);
  }

  getStatusClass(isActive: boolean): string {
    return this.tariffsService.getStatusClass(isActive);
  }

  // Validar formulario
  isFormValid(): boolean {
    return this.formData.name.trim() !== '' && 
           this.formData.basePrice > 0 && 
           this.formData.type !== '';
  }
}