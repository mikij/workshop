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
    path: 'control-flow',
    loadChildren: () => import('./control-flow/control-flow.routes').then(m => m.CONTROL_FLOW_ROUTES),
    title: 'Control Flow - Modern Template Syntax (@if, @for, @switch, @defer)'
  },
  {
    path: 'standalone',
    loadChildren: () => import('./standalone/standalone.routes').then(m => m.STANDALONE_ROUTES),
    title: 'Standalone Components - Module-Free Architecture'
  },
  {
    path: 'inject',
    loadChildren: () => import('./inject/inject.routes').then(m => m.INJECT_ROUTES),
    title: 'Modern DI - inject() Patterns and Advanced Providers'
  },
  {
    path: 'signal-forms',
    loadChildren: () => import('./signal-forms/signal-forms.routes').then(m => m.signalFormsRoutes),
    title: 'Signal Forms Workshop - Angular Shopping Cart'
  },
  {
    path: '**',
    redirectTo: '/basic'
  }
];
