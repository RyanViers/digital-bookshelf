// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  // Standalone authentication routes (no shell)
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },

  // Main application routes that use the shell layout
  {
    path: '', 
    loadComponent: () => import('./shell/shell').then((m) => m.Shell),
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
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      }
    ],
  },
];