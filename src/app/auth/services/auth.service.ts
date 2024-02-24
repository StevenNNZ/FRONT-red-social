import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User, UserLogin } from '../interface/user-login.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { RegisterRequest } from '../interface/user-register.interface';
import { sweetAlert } from '../func/form-errors';

interface statusAuth {
  expired?: boolean;
  noToken?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals data
  private user = signal<User | undefined>(undefined);
  public currentUser = computed(() => this.user());
  private _token = signal<string | undefined>(undefined);
  public token = computed(() => this._token());

  public setUser(user: User) {
    this.user.set(user);
  }

  public getStorageUserData(): Observable<statusAuth> {
    const token = sessionStorage.getItem('token');

    if (!token) return of({ noToken: true });

    this._token.set(token);
    return this.validateToken(token).pipe(
      tap((user) => this.user.set(user)),
      map((_) => ({ expired: false })),
      catchError(() => {
        this.logOut();
        return of({ expired: true });
      })
    );
  }

  public loginUser(email: string, password: string): Observable<boolean> {
    return this.http
      .post<UserLogin>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => this.saveAuth(res)),
        map((res) => {
          sessionStorage.setItem('token', res.token);
          return true;
        })
      );
  }

  public registerUser(data: RegisterRequest): Observable<boolean> {
    return this.http.post<UserLogin>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.saveAuth(res)),
      map((res) => {
        sessionStorage.setItem('token', res.token);
        return true;
      })
    );
  }

  public validateToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/check-token`, {
      headers: { Authorization: 'Bearer ' + token },
    });
  }

  private saveAuth(res: UserLogin) {
    this.user.set(res.user);
    this._token.set(res.token);
  }

  public logOut(): void {
    this.user.set(undefined);
    sessionStorage.removeItem('token');
  }
}
