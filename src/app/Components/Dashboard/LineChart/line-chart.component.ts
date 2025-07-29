import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

export interface LineChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
      <div class="relative" [style.height.px]="height">
        <canvas #chartCanvas></canvas>
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
export class LineChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() title: string = 'Gráfica';
  @Input() data: LineChartData[] = [];
  @Input() height: number = 300;
  @Input() chartType: 'line' | 'bar' = 'line';
  @Input() color: string = '#3B82F6';
  @Input() backgroundColor: string = 'rgba(59, 130, 246, 0.1)';
  @Input() isCurrency: boolean = false;

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
        label: this.title,
        data: this.data.map(item => item.value),
        borderColor: this.color,
        backgroundColor: this.chartType === 'line' ? this.backgroundColor : this.color,
        borderWidth: 2,
        fill: this.chartType === 'line',
        tension: 0.4
      }]
    };

    const config: ChartConfiguration = {
      type: this.chartType as ChartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                if (this.isCurrency) {
                  return `${this.title}: $${this.formatCurrency(value)}`;
                }
                return `${this.title}: ${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                if (this.isCurrency) {
                  return '$' + this.formatCurrency(Number(value));
                }
                return value;
              }
            }
          },
          x: {
            grid: {
              display: false
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
    this.chart.data.datasets[0].data = this.data.map(item => item.value);
    
    this.chart.update();
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
}
