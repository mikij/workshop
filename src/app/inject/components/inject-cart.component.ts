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
        <p class="subtitle">Demonstrating field-based dependency injection with inject() function</p>
        <div class="navigation-hint">
          <p><strong>Learning Focus:</strong> Modern Angular DI patterns, optional injection, configuration tokens</p>
          <button class="btn btn-secondary" routerLink="/inject-intro" 
                  title="Return to inject() introduction">← Back to inject() Intro</button>
        </div>
      </header>

      <!-- Product Grid -->
      <section class="products-section">
        <h2>Sample Products</h2>
        <div class="product-grid">
          @for (product of sampleProducts(); track product.id) {
            <div class="product-card">
              <img [src]="product.image" [alt]="product.name" class="product-image" />
              <div class="product-info">
                <h3>{{ product.name }}</h3>
                <p class="product-category">{{ product.category }}</p>
                <p class="product-price">\${{ product.price.toFixed(2) }}</p>
                <p class="product-description">{{ product.description }}</p>
                <div class="product-actions">
                  @if (isProductInCart(product.id)) {
                    <span class="in-cart-indicator">✓ In Cart</span>
                  } @else {
                    <button class="btn btn-primary" (click)="addToCart(product)">
                      Add to Cart
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Cart Display -->
      <section class="cart-section">
        <div class="cart-header">
          <h2>Shopping Cart ({{ cartService.items().length }} items)</h2>
          @if (cartService.items().length > 0) {
            <button class="btn btn-secondary" (click)="clearCart()">Clear Cart</button>
          }
        </div>

        @if (cartService.items().length === 0) {
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <p class="helper-text">Add some products to see inject() service in action!</p>
          </div>
        } @else {
          <div class="cart-items">
            @for (item of cartService.items(); track item.id) {
              <div class="cart-item">
                <img [src]="item.image" [alt]="item.name" class="item-image" />
                <div class="item-details">
                  <h4>{{ item.name }}</h4>
                  <p class="item-category">{{ item.category }}</p>
                  <p class="item-price">\${{ item.price.toFixed(2) }}</p>
                </div>
                <div class="quantity-controls">
                  <button class="btn btn-sm" (click)="decreaseQuantity(item.id)" 
                          [disabled]="item.quantity <= 1">-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button class="btn btn-sm" (click)="increaseQuantity(item.id)">+</button>
                </div>
                <div class="item-total">
                  \${{ (item.price * item.quantity).toFixed(2) }}
                </div>
                <button class="btn btn-danger btn-sm" (click)="removeItem(item.id)">Remove</button>
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
            <div class="summary-row total-row">
              <span><strong>Total:</strong></span>
              <span><strong>\${{ cartService.summary().finalPrice.toFixed(2) }}</strong></span>
            </div>
          </div>
        }
      </section>

      <!-- Injection Statistics -->
      <section class="injection-stats-section">
        <h2>inject() Function Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Service Dependencies</h3>
            @for (dep of Object.entries(serviceDependencies()); track dep[0]) {
              <div class="dependency-item">
                <code>{{ dep[0] }}</code>: {{ dep[1] }}
              </div>
            }
          </div>
          
          <div class="stat-card">
            <h3>Injection Metrics</h3>
            <div class="metric-item">
              <span>Total Services:</span>
              <span>{{ injectionStats().totalServices }}</span>
            </div>
            <div class="metric-item">
              <span>Optional Services:</span>
              <span>{{ injectionStats().optionalServices }}</span>
            </div>
            <div class="metric-item">
              <span>Config Tokens:</span>
              <span>{{ injectionStats().configTokens }}</span>
            </div>
            <div class="metric-item">
              <span>Injection Time:</span>
              <span>{{ injectionStats().injectionTime }}ms</span>
            </div>
          </div>

          <div class="stat-card">
            <h3>Context Information</h3>
            <div class="context-item">
              <span>Component:</span>
              <span>{{ injectionContext().componentName }}</span>
            </div>
            <div class="context-item">
              <span>Method:</span>
              <span>{{ injectionContext().injectionMethod }}</span>
            </div>
            <div class="context-item">
              <span>Type:</span>
              <span>{{ injectionContext().contextType }}</span>
            </div>
            <div class="context-item">
              <span>Renders:</span>
              <span>{{ renderCount() }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Educational Panel -->
      <section class="educational-panel">
        <h2>inject() Function Benefits</h2>
        <div class="benefits-grid">
          <div class="benefit-card">
            <h3>🎯 Field-Based Injection</h3>
            <p>No constructor boilerplate - inject services directly as class fields</p>
            <code>cartService = inject(InjectCartService);</code>
          </div>
          
          <div class="benefit-card">
            <h3>🔧 Optional Dependencies</h3>
            <p>Gracefully handle missing services with optional injection</p>
            <code>analytics = inject(AnalyticsService, &#123; optional: true &#125;);</code>
          </div>
          
          <div class="benefit-card">
            <h3>⚙️ Configuration Injection</h3>
            <p>Inject configuration tokens with fallback values</p>
            <code>config = inject(CONFIG_TOKEN) ?? defaults;</code>
          </div>
          
          <div class="benefit-card">
            <h3>🚀 Better Tree-Shaking</h3>
            <p>Improved build optimization and smaller bundle sizes</p>
            <code>Functional composition support</code>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <section class="actions-section">
        <button class="btn btn-primary" (click)="measureInjectionPerformance()">
          Measure inject() Performance
        </button>
        @if (cartService.items().length > 0) {
          <button class="btn btn-secondary" (click)="exportCart()">
            Export Cart Data
          </button>
        }
      </section>
    </div>
  `,
  styleUrls: ['./inject-cart.component.css']
})
export class InjectCartComponent {
  // Object utility for template usage
  Object = Object;
  
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