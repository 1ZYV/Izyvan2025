import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, interval, startWith, switchMap } from 'rxjs';
import { DashboardService, DashboardSummary, TravelMetrics, ServiceMetrics, ChargeMetrics, TopDrivers, MonthlyIncome, DailyTrips } from '../../shared/services/Dashboard/dashboard.service';
import { OverviewCardsComponent } from '../../Components/Dashboard/OverviewCards/overview-cards.component';
import { PieChartComponent, PieChartData } from '../../Components/Dashboard/PieChart/pie-chart.component';
import { LineChartComponent, LineChartData } from '../../Components/Dashboard/LineChart/line-chart.component';
import { TopDriversComponent } from '../../Components/Dashboard/TopDrivers/top-drivers.component';

@Component({
    selector: 'pg-dashboard',
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [
        CommonModule,
        OverviewCardsComponent,
        PieChartComponent,
        LineChartComponent,
        TopDriversComponent
    ],
})
export class DashboardPage implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Estados de carga
    isLoading = true;
    hasError = false;
    errorMessage = '';

    // Datos del dashboard
    summary: DashboardSummary | null = null;
    travelMetrics: TravelMetrics | null = null;
    serviceMetrics: ServiceMetrics | null = null;
    chargeMetrics: ChargeMetrics | null = null;
    topDrivers: TopDrivers | null = null;
    monthlyIncome: MonthlyIncome | null = null;
    dailyTrips: DailyTrips | null = null;

    // Datos formateados para gráficas
    travelChartData: PieChartData[] = [];
    serviceChartData: PieChartData[] = [];
    chargeChartData: PieChartData[] = [];
    monthlyIncomeData: LineChartData[] = [];
    dailyTripsData: LineChartData[] = [];

    // Auto-refresh
    autoRefreshEnabled = true;
    refreshInterval = 60000; // 60 segundos

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.loadDashboardData();
        this.startAutoRefresh();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Cargar todos los datos del dashboard
     */
    loadDashboardData() {
        this.isLoading = true;
        this.hasError = false;

        this.dashboardService.getAllDashboardData()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.summary = data.summary;
                    this.travelMetrics = data.travelMetrics;
                    this.serviceMetrics = data.serviceMetrics;
                    this.chargeMetrics = data.chargeMetrics;
                    this.topDrivers = data.topDrivers;
                    this.monthlyIncome = data.monthlyIncome;
                    this.dailyTrips = data.dailyTrips;

                    this.formatChartData();
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error al cargar datos del dashboard:', error);
                    this.hasError = true;
                    this.errorMessage = 'Error al cargar los datos del dashboard';
                    this.isLoading = false;
                }
            });
    }

    /**
     * Formatear datos para las gráficas
     */
    private formatChartData() {
        // Formatear datos de viajes
        if (this.travelMetrics) {
            this.travelChartData = this.travelMetrics.data.map(item => ({
                label: item.label,
                count: item.count,
                color: this.getColorForTravelStatus(item.status)
            }));
        }

        // Formatear datos de servicios
        if (this.serviceMetrics) {
            this.serviceChartData = this.serviceMetrics.data.map(item => ({
                label: item.label,
                count: item.count,
                color: this.getColorForServiceStatus(item.status)
            }));
        }

        // Formatear datos de cargos
        if (this.chargeMetrics) {
            this.chargeChartData = this.chargeMetrics.data.map(item => ({
                label: item.label,
                count: item.count,
                color: this.getColorForChargeStatus(item.status)
            }));
        }

        // Formatear datos de ingresos mensuales
        if (this.monthlyIncome) {
            this.monthlyIncomeData = this.monthlyIncome.data.map(item => ({
                label: item.label,
                value: item.amount
            }));
        }

        // Formatear datos de viajes diarios
        if (this.dailyTrips) {
            this.dailyTripsData = this.dailyTrips.data.map(item => ({
                label: item.label,
                value: item.count
            }));
        }
    }

    /**
     * Iniciar auto-refresh
     */
    private startAutoRefresh() {
        if (this.autoRefreshEnabled) {
            interval(this.refreshInterval)
                .pipe(
                    startWith(0),
                    switchMap(() => this.dashboardService.getAllDashboardData()),
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    next: (data) => {
                        if (!this.isLoading) { // Solo actualizar si no está en carga inicial
                            this.summary = data.summary;
                            this.travelMetrics = data.travelMetrics;
                            this.serviceMetrics = data.serviceMetrics;
                            this.chargeMetrics = data.chargeMetrics;
                            this.topDrivers = data.topDrivers;
                            this.monthlyIncome = data.monthlyIncome;
                            this.dailyTrips = data.dailyTrips;
                            this.formatChartData();
                        }
                    },
                    error: (error) => {
                        console.error('Error en auto-refresh:', error);
                    }
                });
        }
    }

    /**
     * Refrescar manualmente
     */
    refreshData() {
        this.loadDashboardData();
    }

    /**
     * Alternar auto-refresh
     */
    toggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        if (this.autoRefreshEnabled) {
            this.startAutoRefresh();
        }
    }

    // Métodos para colores de estado
    private getColorForTravelStatus(status: string): string {
        const colors: { [key: string]: string } = {
            'SCHEDULED': '#3B82F6',    // blue
            'IN_PROGRESS': '#F59E0B',  // amber
            'COMPLETED': '#10B981',   // emerald
            'CANCELLED': '#EF4444'    // red
        };
        return colors[status] || '#6B7280';
    }

    private getColorForServiceStatus(status: string): string {
        const colors: { [key: string]: string } = {
            'PENDING': '#F59E0B',     // amber
            'ACCEPTED': '#3B82F6',    // blue
            'ASSIGNED': '#8B5CF6',    // violet
            'COMPLETED': '#10B981',   // emerald
            'CANCELLED': '#EF4444'    // red
        };
        return colors[status] || '#6B7280';
    }

    private getColorForChargeStatus(status: string): string {
        const colors: { [key: string]: string } = {
            'DRAFT': '#6B7280',       // gray
            'PENDIENTE': '#F59E0B',   // amber
            'PAGO': '#10B981'         // emerald
        };
        return colors[status] || '#6B7280';
    }

    /**
     * Obtener cantidad de cargos pendientes
     */
    getPendingChargesCount(): number {
        if (!this.chargeMetrics) return 0;

        const pendingCharge = this.chargeMetrics.data.find(item => item.status === 'PENDIENTE');
        return pendingCharge ? pendingCharge.count : 0;
    }
}