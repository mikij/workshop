import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/basic',
    pathMatch: 'full'
  },
  {
    path: 'basic',
    loadChildren: () => import('./basic/basic.routes').then(m => m.BASIC_ROUTES),
    title: 'Shopping Cart - Basic Level (RxJS)'
  },
  {
    path: 'intermediate',
    loadChildren: () => import('./intermediate/intermediate.routes').then(m => m.INTERMEDIATE_ROUTES),
    title: 'Shopping Cart - Intermediate Level (Signals + Computed)'
  },
  {
    path: 'advanced',
    loadChildren: () => import('./advanced/advanced.routes').then(m => m.ADVANCED_ROUTES),
    title: 'Shopping Cart - Advanced Level (Resource API)'
  },
  {
    path: '**',
    redirectTo: '/basic'
  }
];
