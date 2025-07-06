import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { InjectCartService } from '../services/inject-cart.service';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

// TODO: These will be created as part of the workshop
// import { CART_CONFIG, CartConfig } from '../config/cart-config';
// import { Logger } from '../services/logger.service';
// import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'inject-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="inject-cart-container">
      <header class="page-header">
        <h1>Modern inject() Cart</h1>
        <p>TODO: Full template implementation</p>
      </header>
      
      <section class="cart-section">
        <h2>Shopping Cart Items: {{ cartService.items().length }}</h2>
      </section>
    </div>
  `,
  styleUrls: ['./inject-cart.component.css']
})
export class InjectCartComponent {
  // Modern inject() pattern - field-based injection
  cartService = inject(InjectCartService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // TODO: These will be implemented in the workshop
  // Optional injection with fallbacks
  // private analytics = inject(AnalyticsService, { optional: true }) ?? this.createNoOpAnalytics();
  // private logger = inject(Logger, { optional: true });
  // private config = inject(CART_CONFIG, { optional: true }) ?? this.getDefaultConfig();
  
  // Component state
  sampleProducts = signal<Product[]>([]);
  renderCount = signal(0);
  injectionStartTime = performance.now();

  // Computed values
  injectionStats = computed(() => ({
    totalServices: 4, // cartService, productService, router, http
    optionalServices: 0, // Will be updated when optional services are added
    configTokens: 0, // Will be updated when config tokens are added
    injectionTime: Math.round(performance.now() - this.injectionStartTime)
  }));

  serviceDependencies = computed(() => ({
    cartService: 'InjectCartService',
    productService: 'ProductService', 
    router: 'Router',
    http: 'HttpClient'
    // analytics: this.analytics ? 'AnalyticsService' : 'NoOpAnalytics',
    // logger: this.logger ? 'Logger' : 'Console',
    // config: 'CART_CONFIG token'
  }));

  injectionContext = computed(() => ({
    componentName: 'InjectCartComponent',
    injectionMethod: 'inject() function',
    contextType: 'Component injection context',
    timestamp: new Date().toISOString()
  }));

  constructor() {
    this.loadSampleProducts();
    this.updateRenderMetrics();
  }

  // Event handlers
  addToCart(product: Product) {
    this.cartService.addItem(product);
    this.updateRenderMetrics();
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
    this.updateRenderMetrics();
  }

  increaseQuantity(itemId: string) {
    const item = this.cartService.items().find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
    this.updateRenderMetrics();
  }

  decreaseQuantity(itemId: string) {
    const item = this.cartService.items().find(i => i.id === itemId);
    if (item && item.quantity > 1) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
    this.updateRenderMetrics();
  }

  clearCart() {
    this.cartService.clearCart();
    this.updateRenderMetrics();
  }

  exportCart() {
    const cartData = this.cartService.exportCart();
    
    // Create download
    const blob = new Blob([cartData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inject-cart-export.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.items().some(item => item.productId === productId);
  }

  measureInjectionPerformance() {
    const start = performance.now();
    
    // Simulate injection operations
    this.cartService.summary();
    this.serviceDependencies();
    this.injectionContext();
    
    const end = performance.now();
    console.log(`inject() operations took ${end - start} milliseconds`);
    this.updateRenderMetrics();
  }

  // Track by functions
  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  // Private methods
  private loadSampleProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.sampleProducts.set(products.slice(0, 6));
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        // Fallback products for demonstration
        this.sampleProducts.set([
          {
            id: 'inject-1',
            name: 'inject() Guide',
            price: 29.99,
            category: 'books',
            image: '/assets/images/inject-guide.jpg',
            inStock: true,
            description: 'Learn modern DI patterns',
            rating: 5.0,
            tags: ['angular', 'inject']
          },
          {
            id: 'inject-2', 
            name: 'DI Masterclass',
            price: 99.99,
            category: 'courses',
            image: '/assets/images/di-masterclass.jpg',
            inStock: true,
            description: 'Advanced dependency injection',
            rating: 4.8,
            tags: ['angular', 'dependency-injection']
          }
        ]);
      }
    });
  }

  private updateRenderMetrics() {
    this.renderCount.update(count => count + 1);
  }
}