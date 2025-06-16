import { Injectable } from "@angular/core";
import { IProvider } from "../../utils/interfaces/IProvider";
import { HttpClient } from "@angular/common/http";
import { catchError, of, tap } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ProviderOperationService {
    constructor(private http: HttpClient) { }

    // This service can be expanded with methods to handle provider operations
    // such as fetching providers, updating provider information, etc.
    // Currently, it serves as a placeholder for future provider-related operations.

    private providers: IProvider[] = [
        { id: 1, name: 'Provider One', phone: '123-456-7890', email: 'provider1@example.com' },
        { id: 2, name: 'Provider Two', phone: '987-654-3210', email: 'provider2@example.com' },
        { id: 3, name: 'Provider Three', phone: '555-555-5555', email: 'provider3@example.com' }
    ];

    getProviderById(providerId: number): IProvider | null {
        return this.providers.find(provider => provider.id === providerId) || null;
    }

    getAllProviders() {
        return this.http.get<IProvider[]>('http://localhost:3000/providers').pipe(
            tap((response) => {
                console.log('Providers fetched successfully:', response);
                this.providers = response;
            }),
            catchError((error) => {
                console.error('Error fetching providers:', error);
                this.providers = this.providers; // Fallback to existing providers
                return of(this.providers);
            })
        );
    }
}