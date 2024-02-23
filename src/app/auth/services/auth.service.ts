import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User, UserLogin } from '../interface/user-login.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { RegisterRequest } from '../interface/user-register.interface';
import { sweetAlert } from './form-errors';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Signals data
  private user = signal<User | undefined>(undefined);
  public currentUser = computed(() => this.user());

  public loginUser(email: string, password: string): Observable<boolean> {
    return this.http
      .post<UserLogin>(`${this.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => this.user.set(res.user)),
        map((res) => {
          sessionStorage.setItem('token', res.token);
          return true;
        })
      );
  }

  public registerUser(data: RegisterRequest): Observable<boolean> {
    return this.http.post<UserLogin>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res) => this.user.set(res.user)),
      map((res) => {
        sessionStorage.setItem('token', res.token);
        return true;
      })
    );
  }

  public validateToken(): Observable<boolean> {
    const token = sessionStorage.getItem('token');

    if (!token) return of(false);

    return this.http
      .get<UserLogin>(`${this.apiUrl}/auth/check-token`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .pipe(
        tap((res) => this.user.set(res.user)),
        map((res) => {
          sessionStorage.setItem('token', res.token);
          return true;
        }),
        catchError((e) => {
          sweetAlert('oops', 'Hubo un error de autenticacion');
          return of(false);
        })
      );
  }

  public logOut() {
    this.user.set(undefined);
    sessionStorage.removeItem('token');
  }
}
