import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, delay, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../../core/utils/interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _currentUser = new BehaviorSubject<IUser | null>(this.decodeToken());

  currentUser$ = this._currentUser.asObservable();

  router = inject(Router);

  // Hardcoded users for demonstration purposes

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

  logout() {
    this.removeToken();
    this.router.navigateByUrl('/auth/sign-in');
  }

  private saveToken(user: IUser) {
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private removeToken() {
    localStorage.removeItem('userData');
  }

  private decodeToken() {
    const userData = localStorage.getItem('userData');

    return userData ? JSON.parse(userData) : null;
  }
}
