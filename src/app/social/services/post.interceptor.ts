import {
  HttpRequest,
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { sweetAlert } from '../../auth/func/form-errors';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';

export const PostInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = sessionStorage.getItem('token');
  const auth = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('post') && token) {
    req = addToken(req, token);
    return next(req).pipe(
      catchError((e) => {
        verifiedAuthentication(e, auth, router);
        return throwError(() => e);
      })
    );
  }

  return next(req).pipe(
    catchError((e) => {
      verifiedAuthentication(e, auth, router);
      return throwError(() => e);
    })
  );
};

const verifiedAuthentication = (e: any, auth: AuthService, router: Router) => {
  const token = sessionStorage.getItem('token');

  if (e.status === 401 && token) {
    sweetAlert('¡Oops!', 'Tu sesión ha expirado, porfavor vuelve a ingresar');

    auth.logOut();
    router.navigateByUrl('/auth');
  }
};

const addToken = (req: HttpRequest<any>, token: string): HttpRequest<any> => {
  return req.clone({
    headers: req.headers
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json'),
  });
};
