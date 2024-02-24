import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';
import { sweetAlert } from '../func/form-errors';

export const authLoggedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getStorageUserData().pipe(
    tap((authStatus) => {
      if (authStatus.expired === false || authStatus.noToken === false) {
        router.navigateByUrl('/social');

        sweetAlert('¡Espera!', 'Tienes una sesión activa, actualmente');
      }
    }),
    map((authStatus) => {
      if (!authStatus.expired || !authStatus.noToken) return true;

      return false;
    })
  );
};
