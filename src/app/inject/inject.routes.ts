import { Routes } from '@angular/router';

export const INJECT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/inject-cart.component').then(m => m.InjectCartComponent),
    title: 'inject() - Modern Dependency Injection'
  },
  {
    path: 'patterns',
    loadComponent: () => import('./components/injection-patterns.component').then(m => m.InjectionPatternsComponent),
    title: 'Injection Patterns Demo'
  },
  {
    path: 'providers',
    loadComponent: () => import('./components/provider-functions.component').then(m => m.ProviderFunctionsComponent),
    title: 'Provider Functions'
  },
];