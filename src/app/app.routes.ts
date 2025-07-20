import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/account/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/account/register/register').then((m) => m.Register),
  },
  {
    path: '', 
    loadComponent: () => import('./shell/shell').then((m) => m.Shell),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/dashboards/dashboards').then((m) => m.Dashboards),
      },
      {
        path: 'my-books',
        loadComponent: () => import('./pages/my-books/my-books').then((m) => m.MyBooks),
      },
      {
        path: 'discover',
        // This single route handles both the master and detail views.
        loadComponent: () => import('./pages/discover/discover').then((m) => m.Discover),
      },
      // The discover/:id route is correctly removed.
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      }
    ],
  },
];