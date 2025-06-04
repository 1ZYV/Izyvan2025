import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../../core/utils/interfaces/IUser';

/**
 * Servicio para autenticación de usuarios y gestión del usuario actual.
 * Permite login, logout y persistencia de sesión en localStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  /** BehaviorSubject con el usuario actual decodificado del token */
  private _currentUser = new BehaviorSubject<IUser | null>(this.decodeToken());
  /** Observable del usuario actual */
  currentUser$ = this._currentUser.asObservable();
  router = inject(Router);
  
  /**
   * Usuarios hardcodeados para demo. En producción, usar backend seguro.
   */
  users: IUser[] = [
    {
      username: 'transportist',
      password: 'transportist',
      role: 'provider',
      providerType: 'transportist',
    },
    {
      username: 'agency',
      password: 'agency',
      role: 'agency',
    },
    {
      username: 'tourist',
      password: 'tourist',
      role: 'provider',
      providerType: 'tourism',
    },
  ];

  /**
   * Realiza login y actualiza el usuario actual si las credenciales coinciden.
   * @param username Nombre de usuario
   * @param password Contraseña
   */
  login(username: string, password: string) {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    return of(user || null).pipe(
      delay(150),
      tap((user) => {
        if (user) {
          this.saveToken(user);
          this._currentUser.next(user);
          this.router.navigateByUrl('/dashboard/services');
        } else {
          this.removeToken();
        }
      })
    );
  }

  /**
   * Cierra la sesión y elimina el usuario actual.
   */
  logout() {
    this.removeToken();
    this.router.navigateByUrl('/auth/sign-in');
  }

  /**
   * Guarda el usuario en localStorage (solo para demo, no seguro para producción).
   */
  private saveToken(user: IUser) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /**
   * Elimina el usuario de localStorage.
   */
  private removeToken() {
    localStorage.removeItem('userData');
  }

  /**
   * Decodifica el usuario desde localStorage.
   */
  private decodeToken() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
}
