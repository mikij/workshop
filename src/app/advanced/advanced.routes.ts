import { Routes } from '@angular/router';
import { CartAdvancedComponent } from './components/cart-advanced.component';
import { CartNgrxSignalsComponent } from './components/cart-ngrx-signals.component';

export const ADVANCED_ROUTES: Routes = [
  {
    path: '',
    component: CartAdvancedComponent,
    title: 'Shopping Cart - Advanced Level'
  },
  {
    path: 'ngrx-signals',
    component: CartNgrxSignalsComponent,
    title: 'Shopping Cart - @ngrx/signals Demo'
  }
];