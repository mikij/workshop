import { Routes } from '@angular/router';
import { CartBasicComponent } from './components/cart-basic.component';

export const BASIC_ROUTES: Routes = [
  {
    path: '',
    component: CartBasicComponent,
    title: 'Shopping Cart - Basic Level'
  }
];