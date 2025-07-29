import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

export interface PieChartData {
  label: string;
  count: number;
  color?: string;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
      <div class="relative" [style.height.px]="height">
        <canvas #chartCanvas></canvas>
      </div>
      <div *ngIf="showLegend" class="mt-4">
        <div class="flex flex-wrap gap-4 justify-center">
          <div *ngFor="let item of data" class="flex items-center">
            <div 
              class="w-3 h-3 rounded-full mr-2"
              [style.background-color]="getColorForItem(item)"
            ></div>
            <span class="text-sm text-gray-600">{{ item.label }}: {{ item.count }}</span>
          </div>
        </div>
      </div>
      <div *ngIf="data.length === 0" class="flex items-center justify-center h-64">
        <div class="text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="text-sm">No hay datos disponibles</p>
        </div>
      </div>
    </div>
  `
})
export class PieChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() title: string = 'Gráfica';
  @Input() data: PieChartData[] = [];
  @Input() height: number = 300;
  @Input() showLegend: boolean = true;
  @Input() colors: string[] = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // violet-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316'  // orange-500
  ];

  private chart: Chart | null = null;

  ngOnInit() {
    this.createChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  private createChart() {
    if (this.data.length === 0) {
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const chartData = {
      labels: this.data.map(item => item.label),
      datasets: [{
        data: this.data.map(item => item.count),
        backgroundColor: this.data.map((item, index) => 
          item.color || this.colors[index % this.colors.length]
        ),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };

    const config: ChartConfiguration = {
      type: 'pie' as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Usamos nuestra propia leyenda
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart() {
    if (!this.chart) {
      this.createChart();
      return;
    }

    if (this.data.length === 0) {
      this.chart.destroy();
      this.chart = null;
      return;
    }

    this.chart.data.labels = this.data.map(item => item.label);
    this.chart.data.datasets[0].data = this.data.map(item => item.count);
    this.chart.data.datasets[0].backgroundColor = this.data.map((item, index) => 
      item.color || this.colors[index % this.colors.length]
    );
    
    this.chart.update();
  }

  getColorForItem(item: PieChartData): string {
    const index = this.data.indexOf(item);
    return item.color || this.colors[index % this.colors.length];
  }
}
