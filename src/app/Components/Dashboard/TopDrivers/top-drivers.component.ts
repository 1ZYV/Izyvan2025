import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverData } from '../../../Services/Dashboard/dashboard.service';

@Component({
  selector: 'app-top-drivers',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
      
      <div *ngIf="drivers && drivers.length > 0; else noData">
        <div *ngFor="let driver of drivers; let i = index" 
             class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
             [class.bg-yellow-50]="i === 0"
             [class.bg-gray-50]="i === 1"
             [class.bg-orange-50]="i === 2">
          
          <!-- Posición y Avatar -->
          <div class="flex items-center">
            <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3"
                 [class.bg-yellow-500]="i === 0"
                 [class.bg-gray-400]="i === 1" 
                 [class.bg-orange-500]="i === 2"
                 [class.bg-blue-500]="i > 2">
              <span class="text-white font-bold text-sm">{{ i + 1 }}</span>
            </div>
            
            <div>
              <h4 class="font-semibold text-gray-900">{{ driver.name }}</h4>
              <p class="text-sm text-gray-500">Licencia: {{ driver.license }}</p>
            </div>
          </div>

          <!-- Estadísticas -->
          <div class="text-right">
            <div class="flex items-center mb-1">
              <span class="text-lg font-bold text-gray-900 mr-2">{{ driver.completedTrips }}</span>
              <span class="text-sm text-gray-500">viajes</span>
            </div>
            
            <!-- Rating con estrellas -->
            <div class="flex items-center justify-end">
              <div class="flex items-center mr-1">
                <ng-container *ngFor="let star of getStarArray(driver.rating); let starIndex = index">
                  <svg class="w-4 h-4" 
                       [class.text-yellow-400]="starIndex < Math.floor(driver.rating)"
                       [class.text-gray-300]="starIndex >= Math.floor(driver.rating)"
                       fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </ng-container>
              </div>
              <span class="text-sm text-gray-600">{{ driver.rating.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </div>

      <ng-template #noData>
        <div class="flex items-center justify-center h-32">
          <div class="text-center text-gray-500">
            <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <p class="text-sm">No hay conductores disponibles</p>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class TopDriversComponent {
  @Input() title: string = 'Top Conductores';
  @Input() drivers: DriverData[] = [];

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i);
  }

  Math = Math; // Para usar Math.floor en el template
}
