import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
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

    constructor() {
        this.initializeMockData();
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
        return of(this.guidesListSubject.value).pipe(
            delay(800), // Simular latencia de red
        );
    }

    /**
     * Obtiene los detalles completos de un guía específico
     */
    getGuideDetails(guideId: string): Observable<GuideDetails | null> {
        this.isLoadingSubject.next(true);
        const guide = this.mockGuides.find(g => g.id === guideId);
        return of(guide || null).pipe(
            delay(600)
        );
    }

    /**
     * Obtiene los guías disponibles
     */
    getAvailableGuides(): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        const availableGuides = this.guidesListSubject.value
            .filter(guide => GuideStatusUtils.isAvailable(guide.status));

        return of(availableGuides).pipe(
            delay(500)
        );
    }

    /**
     * Busca guías por especialidad
     */
    getGuidesBySpecialty(specialty: GuideSpecialty): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        const specialtyGuides = this.guidesListSubject.value
            .filter(guide => guide.specialties.includes(specialty));

        return of(specialtyGuides).pipe(
            delay(600)
        );
    }

    /**
     * Busca guías por idioma
     */
    getGuidesByLanguage(language: GuideLanguage): Observable<GuideListItem[]> {
        this.isLoadingSubject.next(true);
        const languageGuides = this.guidesListSubject.value
            .filter(guide => guide.languages.includes(language));

        return of(languageGuides).pipe(
            delay(600)
        );
    }

    /**
     * Simula la contratación de un guía
     */
    hireGuide(guideId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        const guideIndex = this.mockGuides.findIndex(g => g.id === guideId);

        if (guideIndex !== -1 && GuideStatusUtils.isAvailable(this.mockGuides[guideIndex].status)) {
            this.mockGuides[guideIndex].status = 'busy';
            this.initializeMockData(); // Actualizar la lista reactiva
            return of(true).pipe(delay(800));
        }

        return of(false).pipe(delay(800));
    }

    /**
     * Simula finalizar el servicio de un guía
     */
    completeGuideService(guideId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);
        const guideIndex = this.mockGuides.findIndex(g => g.id === guideId);

        if (guideIndex !== -1 && this.mockGuides[guideIndex].status === 'busy') {
            this.mockGuides[guideIndex].status = 'available';
            this.mockGuides[guideIndex].totalTours += 1;
            this.initializeMockData(); // Actualizar la lista reactiva
            return of(true).pipe(delay(800));
        }

        return of(false).pipe(delay(800));
    }

    /**
     * Crea un nuevo guía
     */
    createGuide(guideData: CreateGuideRequest): Observable<boolean> {
        this.isLoadingSubject.next(true);

        // Generar un ID único para el nuevo guía
        const newId = `guide-${Date.now().toString().slice(-6)}`;

        // Crear el objeto GuideDetails completo
        const newGuide: GuideDetails = {
            id: newId,
            name: guideData.name,
            photo: guideData.photo,
            status: 'available', // Los nuevos guías empiezan disponibles
            rating: 5.0, // Rating inicial
            totalTours: 0, // Sin tours inicialmente
            yearsExperience: guideData.yearsExperience,
            specialties: guideData.specialties,
            languages: guideData.languages,
            hourlyRate: guideData.hourlyRate,
            description: guideData.description,
            phone: guideData.phone,
            email: guideData.email,
            location: guideData.location,
            certifications: guideData.certifications,
            reviews: [], // Sin reseñas inicialmente
            portfolio: [], // Portfolio vacío inicialmente
            availableFrom: '08:00',
            availableTo: '18:00'
        };

        // Añadir el nuevo guía al array
        this.mockGuides.push(newGuide);

        // Actualizar la lista reactiva
        this.initializeMockData();

        return of(true).pipe(delay(800));
    }

    /**
     * Elimina un guía por su ID
     */
    deleteGuide(guideId: string): Observable<boolean> {
        this.isLoadingSubject.next(true);

        const guideIndex = this.mockGuides.findIndex(g => g.id === guideId);

        if (guideIndex !== -1) {
            // Eliminar el guía del array
            this.mockGuides.splice(guideIndex, 1);

            // Actualizar la lista reactiva
            this.initializeMockData();

            return of(true).pipe(delay(600));
        }

        return of(false).pipe(delay(600));
    }

    /**
     * Limpia el estado de loading
     */
    clearLoading(): void {
        this.isLoadingSubject.next(false);
    }
}
