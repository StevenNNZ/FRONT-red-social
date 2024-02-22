import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component'),
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
