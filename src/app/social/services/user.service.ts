import { Injectable, Signal, computed, signal } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { Observable, of, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _user = signal<User | undefined>(undefined);
  public user = computed(() => this._user());

  public getUser(): Observable<void> {
    return of({
      id: 1,
      fullName: 'John Smith Doe',
      birthdate: '1990-01-15',
      email: 'john@domain.com',
      password: 'sadfgrgknhfnefjk4t5jnhb5h4',
      createdAt: '2020-01-01',
      updatedAt: '2020-01-01',
    }).pipe(
      tap((user) => this._user.set(user)),
      map(() => {})
    );
  }
}
