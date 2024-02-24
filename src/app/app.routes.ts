import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { authLoggedGuard } from './auth/guards/auth-logged.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
    canActivate: [authLoggedGuard],
    children: [
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./auth/components/sign-in/sign-in.component'),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./auth/components/sign-up/sign-up.component'),
      },
      {
        path: '**',
        redirectTo: 'sign-in',
      },
    ],
  },
  {
    path: 'social',
    loadComponent: () => import('./social/social.component'),
    canActivate: [authGuard],
    children: [
      {
        path: 'wall',
        loadComponent: () => import('./social/components/wall/wall.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
