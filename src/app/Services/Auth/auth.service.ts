import { AuthResponse, Provider, Role, User, UserCredentials } from "@/Types/index.d";
import { Injectable, inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, tap, catchError, throwError, map } from "rxjs";
import { isPlatformBrowser } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    private router = inject(Router);
    private platformId = inject(PLATFORM_ID);
    private apiUrl = `${environment.apiUrl}/auth`;

    private currentProviderSubject = new BehaviorSubject<Provider | null>(null);
    currentProvider$ = this.currentProviderSubject.asObservable();

    constructor(private http: HttpClient) {
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
            console.log('AuthService: Token encontrado, restaurando sesión...');
            this.restoreUserFromToken(token);
        }
    }

    // Método para restaurar usuario desde token
    private restoreUserFromToken(token: string): void {
        // Realizar una llamada al backend para validar el token y obtener datos del usuario
        this.http.get<{user: User, provider?: Provider}>(`${this.apiUrl}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error al validar token:', error);
                this.logout();
                return throwError(() => new Error('Token inválido'));
            })
        ).subscribe(response => {
            const { user, provider } = response;
            
            if (user) {
                this.currentUserSubject.next(user);
                console.log('AuthService: Usuario restaurado:', user);
                
                if (user.roles.includes('PROVIDER') && provider) {
                    this.currentProviderSubject.next(provider);
                    console.log('AuthService: Proveedor restaurado desde token:', provider);
                }
            }
        });
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
    }

    // Método mejorado para verificar autenticación
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
        const isProvider = currentUser.roles.includes('PROVIDER');
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

    login(credentials: UserCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                const { user, access_token, provider } = response;
                
                if (user && access_token) {
                    this.currentUserSubject.next(user);
                    this.setSession(access_token);
                    
                    if (user.roles.includes('PROVIDER') && provider) {
                        this.currentProviderSubject.next(provider);
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                console.error('Error en login:', error);
                return throwError(() => new Error('Credenciales inválidas'));
            })
        );
    }

    getCurrentUserData(): Observable<User | null> {
        const token = this.getToken();
        if (!token) {
            return of(null);
        }
        
        // Obtener datos actualizados del usuario desde el backend
        return this.http.get<{user: User}>(`${this.apiUrl}/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).pipe(
            tap(response => {
                // Actualizar el subject con los datos más recientes
                this.currentUserSubject.next(response.user);
            }),
            map(response => response.user),
            catchError(() => {
                // Si hay error, puede ser que el token haya expirado
                return of(null);
            })
        );
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
    }

    private setSession(token: string): void {
        // Verificar que estamos en el navegador antes de acceder a localStorage
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', token);
        }
    }

    logout(): void {
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
        const token = this.getToken();

        console.group('🔍 AuthService Debug State');
        console.log('Current User:', currentUser);
        console.log('Auth Status:', status);
        console.log('Platform Browser:', isPlatformBrowser(this.platformId));
        console.log('Token Raw:', token);
        console.log('API URL:', this.apiUrl);
        console.groupEnd();
    }
    
    // Método para registrar un nuevo usuario
    register(userData: {name: string; email: string; password: string;}): Observable<User> {
        return this.http.post<{user: User}>(`${this.apiUrl}/register`, userData).pipe(
            map(response => response.user),
            catchError((error: HttpErrorResponse) => {
                console.error('Error al registrar usuario:', error);
                return throwError(() => new Error('No se pudo registrar el usuario'));
            })
        );
    }
}

// La interfaz CreateUserDto se ha movido al archivo Types/index.d.ts