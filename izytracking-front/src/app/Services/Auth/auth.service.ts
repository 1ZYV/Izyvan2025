import { AuthResponse, Provider, Role, User, UserCredentials } from "@/Types/index.d";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, tap } from "rxjs";
import { isPlatformBrowser } from "@angular/common";


@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable(); private router = inject(Router);
    private platformId = inject(PLATFORM_ID);

    private currentProviderSubject = new BehaviorSubject<Provider | null>(null);
    currentProvider$ = this.currentProviderSubject.asObservable();

    constructor() {
        // Inicializar el estado de autenticación al crear el servicio
        this.initializeAuthState();
    }

    // Método para inicializar el estado de autenticación
    private initializeAuthState(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const token = this.getToken();
        if (token) {
            // Si hay token, restaurar el usuario (en un caso real, validaríamos el token con el backend)
            console.log('AuthService: Token encontrado, restaurando sesión...');
            this.restoreUserFromToken(token);
        }
    }

    // Método para restaurar usuario desde token
    private restoreUserFromToken(token: string): void {
        // En un caso real, aquí haríamos una llamada al backend para validar el token
        // y obtener los datos del usuario actual
        const user: User = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com', // En real vendría del token/backend
            roles: ['provider']
        };

        const provider: Provider | null = {
            id: '1',
            name: 'Provider Name',
            type: 'transport', // Tipo de proveedor, puede ser 'transport', 'tourism' o null si no es un proveedor
            contactInfo: {
                email: 'provider@example.com',
                phone: '123-456-7890'
            },
            userId: user.id // ID del usuario propietario del proveedor
        };


        this.currentUserSubject.next(user);
        console.log('AuthService: Usuario restaurado:', user);

        if (user.roles.includes('provider') && provider) {
            this.currentProviderSubject.next(provider);
            console.log('AuthService: Proveedor restaurado desde token:', provider);
        }
    }

    // Método helper para obtener token de manera segura
    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('auth_token');
            console.log('AuthService: Token obtenido:', token ? 'Sí' : 'No');
            return token;
        }
        console.warn('AuthService: getToken no se puede ejecutar en el servidor');
        return null;
    }    // Método mejorado para verificar autenticación
    isAuthenticated(): boolean {
        const hasUser = !!this.currentUserSubject.value;
        const hasToken = !!this.getToken();

        // Si hay token pero no usuario, intentar restaurar
        if (hasToken && !hasUser && isPlatformBrowser(this.platformId)) {
            console.log('AuthService: Token encontrado pero sin usuario, restaurando...');
            this.restoreUserFromToken(this.getToken()!);
            return true;
        }

        const isAuth = hasUser && hasToken;
        console.log('AuthService: isAuthenticated =', isAuth, { hasUser, hasToken });
        return isAuth;
    }

    isProvider(): boolean {
        const currentUser = this.currentUserSubject.value;
        if (!currentUser) {
            console.warn('AuthService: No hay usuario actual para verificar rol de proveedor');
            return false;
        }
        const isProvider = currentUser.roles.includes('provider');
        console.log('AuthService: isProvider =', isProvider);
        return isProvider;
    }

    getProviderType(): 'transport' | 'tourism' | null {
        const currentProvider = this.currentProviderSubject.value;
        if (!currentProvider) {
            console.warn('AuthService: No hay proveedor actual para verificar tipo');
            return null;
        }
        const providerType = currentProvider.type;
        console.log('AuthService: providerType =', providerType);
        return providerType;
    }

    login(credentials: UserCredentials): Observable<User> {
        // Simular llamada API exitosa
        const user: User = {
            id: '1',
            name: 'John Doe',
            email: credentials.email,
            roles: ['provider'] // Asignar roles según la lógica de tu aplicación
        };

        const provider: Provider | null = {
            id: '1',
            name: 'Provider Name',
            type: 'transport', // Tipo de proveedor, puede ser 'transport', 'tourism' o null si no es un proveedor
            contactInfo: {
                email: 'provider@example.com',
                phone: '123-456-7890'
            },
            userId: user.id // ID del usuario propietario del proveedor
        };

        return of(user).pipe(
            tap(user => {
                this.currentUserSubject.next(user);
                this.setSession('fake-jwt-token');

                if (user.roles.includes('provider') && provider) {
                    of(provider).subscribe(provider => {
                        this.currentProviderSubject.next(provider);
                    });
                }
            })
        );
    }

    getCurrentUserData(): Observable<User | null> {
        // Retornar el usuario actual
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
            return of(currentUser);
        } else {
            return of(null); // Si no hay usuario, retornar null
        }
    }

    // Método para obtener el estado de autenticación de manera síncrona
    getAuthStatus(): { hasUser: boolean; hasToken: boolean; isAuthenticated: boolean } {
        const hasUser = !!this.currentUserSubject.value;
        const hasToken = !!this.getToken();
        const isAuthenticated = this.isAuthenticated();

        return { hasUser, hasToken, isAuthenticated };
    }

    hasRole(role: Role): boolean {
        const currentUser = this.currentUserSubject.value;
        return currentUser ? currentUser.roles.includes(role) : false;
    } private setSession(token: string): void {
        // Verificar que estamos en el navegador antes de acceder a localStorage
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', token);
        }
    } logout(): void {
        console.log('AuthService: Iniciando logout...');

        // Limpiar usuario actual
        this.currentUserSubject.next(null);

        // Limpiar token del localStorage
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
            console.log('AuthService: Token removido del localStorage');
        }

        console.log('AuthService: Logout exitoso');

        // Redirigir al login
        this.router.navigate(['/auth/login']);
    }

    // Método para debugging - puedes llamarlo desde la consola
    debugAuthState(): void {
        const status = this.getAuthStatus();
        const currentUser = this.currentUserSubject.value;

        console.group('🔍 AuthService Debug State');
        console.log('Current User:', currentUser);
        console.log('Auth Status:', status);
        console.log('Platform Browser:', isPlatformBrowser(this.platformId));
        console.log('Token Raw:', localStorage.getItem('auth_token'));
        console.groupEnd();
    }
}