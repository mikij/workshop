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
        <p class="page-description">
          Demonstrates field-based dependency injection using the inject() function instead of constructor parameters.
        </p>
        
        <div class="injection-stats">
          <div class="stat-card">
            <span class="stat-label">Services Injected:</span>
            <span class="stat-value">{{ injectionStats().totalServices }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Injection Time:</span>
            <span class="stat-value">{{ injectionStats().injectionTime }}ms</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Injection Method:</span>
            <span class="stat-value">inject() function</span>
          </div>
        </div>
      </header>

      <div class="main-content">
        <!-- Products Section -->
        <section class="products-section">
          <h2>Available Products</h2>
          <div class="products-grid">
            @for (product of sampleProducts(); track product.id) {
              <div class="product-card">
                <img [src]="product.image" [alt]="product.name" class="product-image">
                <div class="product-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-price">\${{ product.price }}</p>
                  <p class="product-category">{{ product.category }}</p>
                  
                  @if (isProductInCart(product.id)) {
                    <span class="in-cart-indicator">✓ In Cart</span>
                  } @else {
                    <button 
                      class="add-to-cart-btn"
                      (click)="addToCart(product)">
                      Add to Cart
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Cart Section -->
        <section class="cart-section">
          <div class="cart-header">
            <h2>Shopping Cart</h2>
            <div class="cart-actions">
              <button 
                class="export-btn"
                (click)="exportCart()"
                [disabled]="cartService.items().length === 0">
                Export Cart
              </button>
              <button 
                class="clear-btn"
                (click)="clearCart()"
                [disabled]="cartService.items().length === 0">
                Clear Cart
              </button>
            </div>
          </div>

          @if (cartService.items().length === 0) {
            <div class="empty-cart">
              <p>Your cart is empty. Add some products to get started!</p>
            </div>
          } @else {
            <div class="cart-items">
              @for (item of cartService.items(); track item.id) {
                <div class="cart-item">
                  <img [src]="item.image" [alt]="item.name" class="item-image">
                  <div class="item-details">
                    <h4 class="item-name">{{ item.name }}</h4>
                    <p class="item-price">\${{ item.price }}</p>
                  </div>
                  <div class="quantity-controls">
                    <button 
                      class="quantity-btn"
                      (click)="decreaseQuantity(item.id)"
                      [disabled]="item.quantity <= 1">
                      -
                    </button>
                    <span class="quantity">{{ item.quantity }}</span>
                    <button 
                      class="quantity-btn"
                      (click)="increaseQuantity(item.id)">
                      +
                    </button>
                  </div>
                  <div class="item-total">
                    \${{ (item.price * item.quantity).toFixed(2) }}
                  </div>
                  <button 
                    class="remove-btn"
                    (click)="removeItem(item.id)">
                    Remove
                  </button>
                </div>
              }
            </div>

            <!-- Cart Summary -->
            <div class="cart-summary">
              <div class="summary-row">
                <span>Total Items:</span>
                <span>{{ cartService.summary().totalItems }}</span>
              </div>
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>\${{ cartService.summary().totalPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Discount:</span>
                <span>-\${{ cartService.summary().totalDiscount.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>\${{ cartService.summary().tax.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Final Total:</span>
                <span>\${{ cartService.summary().finalPrice.toFixed(2) }}</span>
              </div>
            </div>
          }
        </section>
      </div>

      <!-- Injection Information Panel -->
      <section class="injection-info">
        <h2>inject() Pattern Information</h2>
        
        <div class="info-tabs">
          <div class="tab-content">
            <h3>Service Dependencies</h3>
            <div class="dependencies-list">
              @for (dep of Object.entries(serviceDependencies()); track dep[0]) {
                <div class="dependency-item">
                  <span class="dep-name">{{ dep[0] }}:</span>
                  <span class="dep-type">{{ dep[1] }}</span>
                </div>
              }
            </div>
          </div>

          <div class="tab-content">
            <h3>Injection Context</h3>
            <div class="context-info">
              <div class="context-item">
                <span class="context-label">Component:</span>
                <span class="context-value">{{ injectionContext().componentName }}</span>
              </div>
              <div class="context-item">
                <span class="context-label">Method:</span>
                <span class="context-value">{{ injectionContext().injectionMethod }}</span>
              </div>
              <div class="context-item">
                <span class="context-label">Context Type:</span>
                <span class="context-value">{{ injectionContext().contextType }}</span>
              </div>
            </div>
          </div>

          <div class="tab-content">
            <h3>Performance Metrics</h3>
            <div class="performance-info">
              <div class="metric-item">
                <span class="metric-label">Render Count:</span>
                <span class="metric-value">{{ renderCount() }}</span>
              </div>
              <button 
                class="performance-btn"
                (click)="measureInjectionPerformance()">
                Measure inject() Performance
              </button>
            </div>
          </div>
        </div>
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
  
  // Expose Object for template usage
  Object = Object;
  
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