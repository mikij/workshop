import { Routes } from '@angular/router';

export const CONTROL_FLOW_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/cart-control-flow.component').then(m => m.CartControlFlowComponent),
    title: 'Control Flow - Modern Template Syntax'
  },
  {
    path: 'demo',
    loadComponent: () => import('./components/control-flow-demo.component').then(m => m.ControlFlowDemoComponent),
    title: 'Control Flow Demo'
  },
  {
    path: 'performance',
    loadComponent: () => import('./components/performance-monitor.component').then(m => m.PerformanceMonitorComponent),
    title: 'Performance Monitor'
  }
];