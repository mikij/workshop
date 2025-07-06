import { Routes } from '@angular/router';

export const STANDALONE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/standalone-cart.component').then(m => m.StandaloneCartComponent),
    title: 'Standalone Cart - Module-Free Architecture'
  },
  {
    path: 'products',
    loadComponent: () => import('./components/standalone-product-list.component').then(m => m.StandaloneProductListComponent),
    title: 'Products - Standalone'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./components/standalone-checkout.component').then(m => m.StandaloneCheckoutComponent),
    title: 'Checkout - Standalone'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./components/standalone-product-detail.component').then(m => m.StandaloneProductDetailComponent),
    title: 'Product Details - Standalone'
  },
  {
    path: 'migration',
    loadComponent: () => import('./components/migration-demo.component').then(m => m.MigrationDemoComponent),
    title: 'Migration Demo - NgModule to Standalone'
  }
];