import { CommonModule, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { BookingServiceService } from '../../../../service-request/services/booking-service.service';

@Component({
  selector: 'app-vehicle-type-selector',
  imports: [NgClass, FormsModule],
  templateUrl: './vehicle-type-selector.component.html',
  styleUrl: './vehicle-type-selector.component.css',
})
export class VehicleTypeSelectorComponent {
  selectedVehicleType: number | null = null;
  bookingService = inject(BookingServiceService);

  constructor() {
    this.selectedVehicleType = this.bookingService.selectedVehicleType();
  }

  vehicleTypes = [
    {
      value: 1,
      label: 'Automóvil',
      description: 'Servicio de automóvil',
      image: 'renders/automovil-render.png',
      alt: 'Automóvil',
    },
    {
      value: 2,
      label: 'Bus',
      description: 'Servicio de Bus',
      image: 'renders/bus-render.png',
      alt: 'Bus',
    },
    {
      value: 3,
      label: 'Van',
      description: 'Servicio de Van',
      image: 'renders/van-render.png',
      alt: 'van',
    },
  ];

  selectVehicleType(type: number) {
    this.selectedVehicleType = type;
    this.bookingService.selectedVehicleType.set(type);
  }
}
