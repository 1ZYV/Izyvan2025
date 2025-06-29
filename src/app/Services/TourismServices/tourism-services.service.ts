import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { TourismService, TourismServiceStatus, GuideAssignment } from '../../Types/tourism-service.types';

@Injectable({
    providedIn: 'root'
})
export class TourismServicesService {
    // Estado reactivo
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private servicesListSubject = new BehaviorSubject<TourismService[]>([]);
    public servicesList$ = this.servicesListSubject.asObservable();

    constructor() {
        this.initializeMockData();
    }

    // Datos mock para servicios de turismo
    private mockServices: TourismService[] = [
        {
            id: 'service-001',
            clientName: 'Familia González',
            destination: 'Centro Histórico y Museos',
            date: new Date('2025-07-05T09:00:00'),
            duration: 4,
            groupSize: 5,
            specialtyRequired: 'Historia',
            languageRequired: 'Español',
            description: 'Tour familiar por el centro histórico incluyendo visita a 3 museos principales. Interés especial en arquitectura colonial.',
            status: 'solicitud-servicio',
            priceOffered: 120,
            notes: 'Cliente prefiere tours interactivos para niños'
        },
        {
            id: 'service-002',
            clientName: 'Mr. & Mrs. Johnson',
            destination: 'Parque Nacional y Senderos Ecológicos',
            date: new Date('2025-07-08T07:00:00'),
            duration: 6,
            groupSize: 2,
            specialtyRequired: 'Naturaleza',
            languageRequired: 'Inglés',
            description: 'Ecoturismo y observación de aves. Pareja de adultos mayores interesados en flora y fauna local.',
            status: 'solicitud-servicio',
            priceOffered: 200,
            notes: 'Requieren caminatas suaves, sin dificultad'
        },
        {
            id: 'service-003',
            clientName: 'Grupo Gastronómico Lisboa',
            destination: 'Tour Culinario - Mercados y Restaurantes',
            date: new Date('2025-07-10T11:00:00'),
            duration: 5,
            groupSize: 8,
            specialtyRequired: 'Gastronomía',
            languageRequired: 'Español',
            description: 'Tour gastronómico especializado incluyendo mercados locales, cocina tradicional y degustaciones.',
            status: 'solicitud-servicio',
            priceOffered: 180,
            notes: 'Incluye presupuesto para degustaciones'
        },
        {
            id: 'service-004',
            clientName: 'Arquitectos de Madrid',
            destination: 'Distrito Arquitectónico y Edificios Modernos',
            date: new Date('2025-07-12T14:00:00'),
            duration: 3,
            groupSize: 6,
            specialtyRequired: 'Arquitectura',
            languageRequired: 'Español',
            description: 'Grupo de arquitectos profesionales interesados en la evolución urbana y arquitectónica de la ciudad.',
            status: 'solicitud-servicio',
            priceOffered: 150,
            notes: 'Requieren acceso a interiores de edificios emblemáticos'
        },
        {
            id: 'service-005',
            clientName: 'Estudiantes Franceses',
            destination: 'Tour Cultural Completo',
            date: new Date('2025-07-15T10:00:00'),
            duration: 4,
            groupSize: 12,
            specialtyRequired: 'Cultura',
            languageRequired: 'Francés',
            description: 'Grupo de estudiantes universitarios de intercambio. Interés en cultura, historia y tradiciones locales.',
            status: 'solicitud-servicio',
            priceOffered: 160,
            notes: 'Presupuesto estudiantil, grupo joven y energético'
        }
    ];

    private initializeMockData(): void {
        this.servicesListSubject.next([...this.mockServices]);
    }

    // Métodos públicos

    /**
     * Obtiene todos los servicios de turismo
     */
    getAllServices(): Observable<TourismService[]> {
        this.isLoadingSubject.next(true);
        return of(this.servicesListSubject.value).pipe(
            delay(500)
        );
    }

    /**
     * Obtiene los servicios disponibles (en estado de solicitud)
     */
    getAvailableServices(): Observable<TourismService[]> {
        this.isLoadingSubject.next(true);
        const availableServices = this.servicesListSubject.value
            .filter(service => service.status === 'solicitud-servicio');

        return of(availableServices).pipe(
            delay(600)
        );
    }

    /**
     * Asigna un servicio a un guía
     */
    assignServiceToGuide(serviceId: string, guideId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const serviceIndex = this.mockServices.findIndex(s => s.id === serviceId);

        if (serviceIndex !== -1 && this.mockServices[serviceIndex].status === 'solicitud-servicio') {
            // Cambiar el estado del servicio
            this.mockServices[serviceIndex].status = 'asignado';
            this.mockServices[serviceIndex].notes = `${this.mockServices[serviceIndex].notes || ''} - Asignado a guía ${guideId}`;

            // Actualizar la lista reactiva
            this.initializeMockData();

            return of(true).pipe(delay(800));
        }

        return of(false).pipe(delay(800));
    }

    /**
     * Obtiene servicios por estado
     */
    getServicesByStatus(status: TourismServiceStatus): Observable<TourismService[]> {
        this.isLoadingSubject.next(true);
        const filteredServices = this.servicesListSubject.value
            .filter(service => service.status === status);

        return of(filteredServices).pipe(
            delay(500)
        );
    }

    /**
     * Obtiene un servicio específico por ID
     */
    getServiceById(serviceId: string): Observable<TourismService | null> {
        this.isLoadingSubject.next(true);
        const service = this.servicesListSubject.value.find(s => s.id === serviceId);

        return of(service || null).pipe(
            delay(400)
        );
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }
}
