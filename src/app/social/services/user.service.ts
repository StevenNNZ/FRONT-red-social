import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserUpdate } from '../interfaces/user-update.interface';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { User } from '../../auth/interface/user-login.interface';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = environment.apiUrl;

  updateUser(id: string, user: UserUpdate): Observable<User> {
    if (!user.password) delete user.password;
    return this.http.patch<User>(`${this.apiUrl}/auth/${id}`, user, {
      headers: { Authorization: 'Bearer ' + this.auth.token() },
    });
  }
}
