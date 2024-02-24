import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';
import { sweetAlert } from '../func/form-errors';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getStorageUserData().pipe(
    tap((authStatus) => {
      if (authStatus.expired || authStatus.noToken) {
        router.navigateByUrl('/auth');

        if (authStatus.expired)
          sweetAlert(
            '¡Oops!',
            'Tu sesión ha expirado, porfavor vuelve a ingresar'
          );

        if (authStatus.noToken)
          sweetAlert(
            '¡Uy!',
            'Aún no has iniciado sesión, porfavor hazlo para ingresar a nuestra red'
          );
      }
    }),
    map((authStatus) => {
      if (authStatus.expired || authStatus.noToken) return false;

      return true;
    })
  );
};
