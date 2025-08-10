import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, tap, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Auth/auth.service';
import { environment } from '../../../environments/environment';
import {
    GuideInfo,
    GuideDetails,
    GuideStatus,
    GuideSpecialty,
    GuideLanguage,
    GuideReview,
    TourHistory,
    GuideStatusUtils,
    CreateGuideRequest
} from '../../Types/guide.types';

// Información extendida del guía para la lista
export interface GuideListItem extends GuideInfo {
    // Propiedades adicionales específicas para la lista
}

@Injectable({
    providedIn: 'root'
})
export class GuidesService {
    // Estado reactivo
    private isLoadingSubject = new BehaviorSubject<boolean>(false);
    public isLoading$ = this.isLoadingSubject.asObservable();

    private guidesListSubject = new BehaviorSubject<GuideListItem[]>([]);
    public guidesList$ = this.guidesListSubject.asObservable();

    // Backend integration
    private readonly apiUrl = `${environment.apiUrl}/guides`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        // Eliminado initializeMockData() - ahora usa backend real
    }

    // Configuración de headers JWT
    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    // Datos mock para simular API
    private mockGuides: GuideDetails[] = [
        {
            id: 'guide-001',
            name: 'María Elena Rodríguez',
            photo: 'https://via.placeholder.com/150x150?text=MR',
            status: 'available',
            rating: 4.8,
            totalTours: 247,
            yearsExperience: 8,
            specialties: ['history', 'culture'],
            languages: ['es', 'en', 'fr'],
            hourlyRate: 35,
            description: 'Guía especializada en historia colonial y arquitectura de la ciudad. Apasionada por compartir la rica cultura local.',
            phone: '+57-300-123-4567',
            email: 'maria.rodriguez@guide.com',
            certifications: ['Guía Oficial de Turismo', 'Especialización en Historia del Arte'],
            location: 'Centro Histórico',
            availableFrom: '08:00',
            availableTo: '18:00',
            portfolio: [
                'https://via.placeholder.com/400x300?text=Tour1',
                'https://via.placeholder.com/400x300?text=Tour2'
            ],
            serviceArea: ['Centro Histórico', 'Zona Colonial', 'Museos'],
            reviews: [
                {
                    id: 'review-001',
                    touristName: 'Ana García',
                    rating: 5,
                    comment: 'Excelente guía, muy conocedora de la historia local. Altamente recomendada.',
                    date: new Date('2024-11-15'),
                    tourType: 'history'
                },
                {
                    id: 'review-002',
                    touristName: 'John Smith',
                    rating: 4.5,
                    comment: 'Great knowledge of local culture and history. Very professional.',
                    date: new Date('2024-10-28'),
                    tourType: 'culture'
                }
            ],
            emergencyContact: {
                name: 'Carlos Rodríguez',
                phone: '+57-310-987-6543',
                relationship: 'Esposo'
            }
        },
        {
            id: 'guide-002',
            name: 'Alejandro Méndez',
            photo: 'https://via.placeholder.com/150x150?text=AM',
            status: 'busy',
            rating: 4.6,
            totalTours: 189,
            yearsExperience: 5,
            specialties: ['nature', 'adventure'],
            languages: ['es', 'en'],
            hourlyRate: 40,
            description: 'Experto en ecoturismo y actividades de aventura. Conocedor de la flora y fauna local.',
            phone: '+57-301-234-5678',
            email: 'alejandro.mendez@guide.com',
            certifications: ['Guía de Ecoturismo', 'Primeros Auxilios en Montaña'],
            location: 'Zona Natural',
            availableFrom: '06:00',
            availableTo: '20:00',
            portfolio: [
                'https://via.placeholder.com/400x300?text=Nature1',
                'https://via.placeholder.com/400x300?text=Adventure1'
            ],
            serviceArea: ['Parque Nacional', 'Reservas Naturales', 'Senderos Ecológicos'],
            reviews: [
                {
                    id: 'review-003',
                    touristName: 'María Torres',
                    rating: 4.8,
                    comment: 'Increíble experiencia en la naturaleza. Alejandro conoce muy bien la fauna local.',
                    date: new Date('2024-11-10'),
                    tourType: 'nature'
                }
            ],
            emergencyContact: {
                name: 'Isabel Méndez',
                phone: '+57-320-111-2233',
                relationship: 'Hermana'
            }
        },
        {
            id: 'guide-003',
            name: 'Carmen Delgado',
            photo: 'https://via.placeholder.com/150x150?text=CD',
            status: 'available',
            rating: 4.9,
            totalTours: 312,
            yearsExperience: 12,
            specialties: ['gastronomy', 'culture'],
            languages: ['es', 'en', 'it'],
            hourlyRate: 32,
            description: 'Especialista en tours gastronómicos y tradiciones culinarias. Chef de formación con amplio conocimiento cultural.',
            phone: '+57-302-345-6789',
            email: 'carmen.delgado@guide.com',
            certifications: ['Chef Profesional', 'Guía Gastronómica Certificada'],
            location: 'Zona Gastronómica',
            availableFrom: '10:00',
            availableTo: '22:00',
            serviceArea: ['Restaurantes Tradicionales', 'Mercados Locales', 'Tours Culinarios']
        },
        {
            id: 'guide-004',
            name: 'Diego Herrera',
            photo: 'https://via.placeholder.com/150x150?text=DH',
            status: 'offline',
            rating: 4.5,
            totalTours: 156,
            yearsExperience: 4,
            specialties: ['architecture', 'history'],
            languages: ['es', 'en', 'de'],
            hourlyRate: 28,
            description: 'Arquitecto especializado en patrimonio histórico. Experto en tours arquitectónicos y urbanos.',
            phone: '+57-303-456-7890',
            email: 'diego.herrera@guide.com',
            certifications: ['Arquitecto', 'Especialista en Patrimonio'],
            location: 'Zona Moderna',
            availableFrom: '09:00',
            availableTo: '17:00',
            serviceArea: ['Distrito Arquitectónico', 'Edificios Históricos', 'Zona Moderna']
        },
        {
            id: 'guide-005',
            name: 'Sofía Ramírez',
            photo: 'https://via.placeholder.com/150x150?text=SR',
            status: 'available',
            rating: 4.7,
            totalTours: 203,
            yearsExperience: 6,
            specialties: ['general', 'culture'],
            languages: ['es', 'en', 'pt'],
            hourlyRate: 25,
            description: 'Guía general con amplio conocimiento de la ciudad. Especializada en tours personalizados.',
            phone: '+57-304-567-8901',
            email: 'sofia.ramirez@guide.com',
            certifications: ['Guía General de Turismo'],
            location: 'Ciudad',
            availableFrom: '08:00',
            availableTo: '19:00',
            serviceArea: ['Toda la Ciudad', 'Tours Personalizados']
        }
    ];

    private initializeMockData(): void {
        const guidesList: GuideListItem[] = this.mockGuides.map(guide => ({
            id: guide.id,
            name: guide.name,
            photo: guide.photo,
            status: guide.status,
            rating: guide.rating,
            totalTours: guide.totalTours,
            yearsExperience: guide.yearsExperience,
            specialties: guide.specialties,
            languages: guide.languages,
            hourlyRate: guide.hourlyRate,
            location: guide.location,
            description: guide.description,
            phone: guide.phone,
            email: guide.email,
            certifications: guide.certifications,
            availableFrom: guide.availableFrom,
            availableTo: guide.availableTo
        }));

        this.guidesListSubject.next(guidesList);
    }

    // Métodos públicos para obtener datos

    /**
     * Obtiene la lista de guías turísticos
     */
    getGuidesList(): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        return this.http.get<any>(`${this.apiUrl}`, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log('Guías obtenidos exitosamente:', response.guides?.length || 0);
                    const guides = this.mapBackendGuidesToFrontend(response.guides || []);
                    this.guidesListSubject.next(guides);
                    this.isLoadingSubject.next(false);
                    return guides;
                }),
                catchError(error => {
                    console.error('Error obteniendo guías:', error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Obtiene los detalles completos de un guía específico
     */
    getGuideDetails(guideId: string): Observable<GuideDetails | null> {
        this.isLoadingSubject.next(true);
        return this.http.get<GuideDetails>(`${this.apiUrl}/${guideId}`, { headers: this.getHeaders() })
            .pipe(
                map(guide => {
                    console.log('Detalles de guía obtenidos:', guide.id);
                    const mappedGuide = this.mapBackendGuideToFrontend(guide);
                    this.isLoadingSubject.next(false);
                    return mappedGuide;
                }),
                catchError(error => {
                    console.error('Error obteniendo detalles de guía:', error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Obtiene un guía específico por ID
     */
    getGuideById(guideId: string): Observable<GuideDetails | null> {
        // Reutilizar getGuideDetails para evitar duplicación
        return this.getGuideDetails(guideId);
    }

    /**
     * Obtiene los guías disponibles
     */
    getAvailableGuides(): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        return this.http.get<any>(`${this.apiUrl}/available`, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log('Guías disponibles obtenidos:', response.guides?.length || 0);
                    const guides = this.mapBackendGuidesToFrontend(response.guides || []);
                    this.isLoadingSubject.next(false);
                    return guides;
                }),
                catchError(error => {
                    console.error('Error obteniendo guías disponibles:', error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Busca guías por especialidad
     */
    getGuidesBySpecialty(specialty: GuideSpecialty): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        return this.http.get<any>(`${this.apiUrl}/specialty/${specialty}`, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log(`Guías con especialidad ${specialty} obtenidos:`, response.guides?.length || 0);
                    const guides = this.mapBackendGuidesToFrontend(response.guides || []);
                    this.isLoadingSubject.next(false);
                    return guides;
                }),
                catchError(error => {
                    console.error(`Error obteniendo guías por especialidad ${specialty}:`, error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Busca guías por idioma
     */
    getGuidesByLanguage(language: GuideLanguage): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        return this.http.get<any>(`${this.apiUrl}/language/${language}`, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log(`Guías con idioma ${language} obtenidos:`, response.guides?.length || 0);
                    const guides = this.mapBackendGuidesToFrontend(response.guides || []);
                    this.isLoadingSubject.next(false);
                    return guides;
                }),
                catchError(error => {
                    console.error(`Error obteniendo guías por idioma ${language}:`, error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Contrata un guía (actualiza estado a BUSY)
     */
    hireGuide(guideId: string): Observable<boolean> {
        return this.updateGuideStatus(guideId, 'busy');
    }

    /**
     * Finaliza el servicio de un guía (marca como disponible)
     */
    completeGuideService(guideId: string): Observable<boolean> {
        return this.updateGuideStatus(guideId, 'available');
    }

    /**
     * Crea un nuevo guía
     */
    createGuide(guideData: CreateGuideRequest): Observable<boolean> {
        this.isLoadingSubject.next(true);
        
        const createPayload = {
            fullName: guideData.name,
            photo: guideData.photo,
            experienceYears: guideData.yearsExperience,
            specialties: guideData.specialties,
            languages: guideData.languages, 
            hourlyRate: guideData.hourlyRate,
            description: guideData.description,
            phone: guideData.phone,
            email: guideData.email,
            location: guideData.location,
            certifications: guideData.certifications
        };

        return this.http.post<any>(`${this.apiUrl}`, createPayload, { headers: this.getHeaders() })
            .pipe(
                map(response => {
                    console.log('Guía creado exitosamente:', response.id);
                    this.isLoadingSubject.next(false);
                    // Actualizar lista tras crear nuevo guía
                    this.getGuidesList().subscribe();
                    return true;
                }),
                catchError(error => {
                    console.error('Error creando guía:', error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Elimina un guía por su ID
     */
    deleteGuide(guideId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        
        return this.http.delete(`${this.apiUrl}/${guideId}`, { headers: this.getHeaders() })
            .pipe(
                map(() => {
                    console.log('Guía eliminado exitosamente:', guideId);
                    this.isLoadingSubject.next(false);
                    // Actualizar lista tras eliminar guía
                    this.getGuidesList().subscribe();
                    return true;
                }),
                catchError(error => {
                    console.error('Error eliminando guía:', error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Actualiza el estado de un guía
     */
    updateGuideStatus(guideId: string, status: GuideStatus): Observable<boolean> {
        this.isLoadingSubject.next(true);
        
        const statusPayload = {
            status: this.mapGuideStatusToBackend(status)
        };

        return this.http.patch(`${this.apiUrl}/${guideId}/status`, statusPayload, { headers: this.getHeaders() })
            .pipe(
                map(() => {
                    console.log(`Estado del guía ${guideId} actualizado a ${status}`);
                    this.isLoadingSubject.next(false);
                    // Actualizar lista tras cambio de estado
                    this.getGuidesList().subscribe();
                    return true;
                }),
                catchError(error => {
                    console.error(`Error actualizando estado del guía ${guideId}:`, error);
                    this.isLoadingSubject.next(false);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Libera un guía (marca como disponible)
     */
    releaseGuide(guideId: string): Observable<boolean> {
        return this.updateGuideStatus(guideId, 'available');
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }

    // Métodos de mapeo entre backend y frontend

    /**
     * Mapea array de guías del backend al formato frontend
     */
    private mapBackendGuidesToFrontend(backendGuides: any[]): GuideListItem[] {
        return backendGuides.map(guide => this.mapBackendGuideToFrontend(guide));
    }

    /**
     * Mapea un guía del backend al formato frontend
     */
    private mapBackendGuideToFrontend(backendGuide: any): GuideDetails {
        return {
            id: backendGuide.id,
            name: backendGuide.fullName || backendGuide.name,
            photo: backendGuide.photo || `https://via.placeholder.com/150x150?text=${(backendGuide.fullName || backendGuide.name || '?').charAt(0)}`,
            status: this.mapGuideStatusFromBackend(backendGuide.status),
            rating: parseFloat(backendGuide.rating) || 0,
            totalTours: parseInt(backendGuide.totalTours) || 0,
            yearsExperience: parseInt(backendGuide.experienceYears || backendGuide.yearsExperience) || 0,
            specialties: Array.isArray(backendGuide.specialties) ? backendGuide.specialties : [backendGuide.specialties].filter(Boolean),
            languages: Array.isArray(backendGuide.languages) ? backendGuide.languages : [backendGuide.languages].filter(Boolean),
            hourlyRate: parseFloat(backendGuide.hourlyRate) || 0,
            description: backendGuide.description || '',
            phone: backendGuide.phone || '',
            email: backendGuide.email || '',
            certifications: Array.isArray(backendGuide.certifications) ? backendGuide.certifications : [],
            location: backendGuide.location || '',
            availableFrom: backendGuide.availableFrom || '08:00',
            availableTo: backendGuide.availableTo || '18:00',
            portfolio: Array.isArray(backendGuide.portfolio) ? backendGuide.portfolio : [],
            serviceArea: Array.isArray(backendGuide.serviceArea) ? backendGuide.serviceArea : [],
            reviews: Array.isArray(backendGuide.reviews) ? backendGuide.reviews.map((review: any) => ({
                id: review.id,
                touristName: review.touristName || review.customerName || 'Anónimo',
                rating: parseFloat(review.rating) || 0,
                comment: review.comment || '',
                date: review.date ? new Date(review.date) : new Date(),
                tourType: review.tourType || review.serviceType || 'general'
            })) : [],
            emergencyContact: backendGuide.emergencyContact || undefined
        };
    }

    /**
     * Mapea el estado del guía del backend al frontend
     */
    private mapGuideStatusFromBackend(backendStatus: string): GuideStatus {
        if (!backendStatus) return 'offline';
        
        const statusMap: Record<string, GuideStatus> = {
            'AVAILABLE': 'available',
            'BUSY': 'busy', 
            'OFFLINE': 'offline',
            'INACTIVE': 'inactive',
            'available': 'available',
            'busy': 'busy',
            'offline': 'offline',
            'inactive': 'inactive'
        };

        return statusMap[backendStatus] || 'offline';
    }

    /**
     * Mapea el estado del guía del frontend al backend
     */
    private mapGuideStatusToBackend(frontendStatus: GuideStatus): string {
        const statusMap: Record<GuideStatus, string> = {
            'available': 'AVAILABLE',
            'busy': 'BUSY',
            'offline': 'OFFLINE', 
            'inactive': 'INACTIVE'
        };

        return statusMap[frontendStatus] || 'OFFLINE';
    }
}
