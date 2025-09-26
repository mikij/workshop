import { Routes } from '@angular/router';

export const signalFormsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./signal-forms.component').then(m => m.SignalFormsComponent),
    title: 'Signal Forms Workshop - Angular Shopping Cart'
  }
];