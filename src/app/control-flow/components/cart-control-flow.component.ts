import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// TODO: Import these components when they're created in the workshop
// import { ProductCardComponent } from '../../shared/components/product-card.component';
// import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton.component';
// import { ErrorMessageComponent } from '../../shared/components/error-message.component';
import { ControlFlowCartService } from '../services/control-flow-cart.service';
import { ProductService } from '../../shared/services/product.service';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

@Component({
  selector: 'cart-control-flow',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
    // TODO: Add component imports when they're created
    // ProductCardComponent,
    // LoadingSkeletonComponent,
    // ErrorMessageComponent
  ],
  template: `
    <div class="control-flow-container">
      <header class="page-header">
        <h1>Control Flow - Modern Template Syntax</h1>
<!--        <p>Learn @if, @for, @switch, and @defer patterns</p>-->
      </header>

      <!-- TODO: Convert these structural directives to new control flow -->
      <!--
      Educational Note: Angular's new control flow syntax provides:
      - @if / @else - Replaces *ngIf with cleaner syntax
      - @for - Replaces *ngFor with mandatory track expression
      - @switch / @case / @default - Replaces ngSwitch directives
      - @defer - New feature for lazy loading parts of templates
      -->

      <!-- Filter Controls Section -->
      <div class="filter-section">
        <h2>Filter Controls</h2>

        <!-- TODO: Convert ngSwitch to @switch syntax -->
        <!--
        Educational Note: The new @switch syntax looks like:
        @switch (expression) - switches on expression value
        @case (value1) - matches specific value
        @case (value2) - matches another value
        @default - default case when no match
        -->
        <div [ngSwitch]="activeFilterType()">
          <div *ngSwitchCase="'category'">
            <h3>Filter by Category</h3>
            <!-- TODO: Convert ngFor to @for with track -->
            <!--
            Educational Note: @for requires a track expression:
            @for (item of items; track item.id) - loops with tracking
            -->
            <button *ngFor="let category of availableCategories(); trackBy: trackByCategory"
                    [class.active]="selectedCategory() === category"
                    (click)="setCategory(category)">
              {{ category }}
            </button>
          </div>

          <div *ngSwitchCase="'price'">
            <h3>Filter by Price Range</h3>
            <input type="range"
                   [value]="priceRange().max"
                   min="0"
                   max="1000"
                   (input)="updatePriceRange($event)">
            <span>Up to {{ priceRange().max | currency }}</span>
          </div>

          <div *ngSwitchDefault>
            <h3>Select Filter Type</h3>
            <button (click)="setFilterType('category')">Category</button>
            <button (click)="setFilterType('price')">Price</button>
          </div>
        </div>
      </div>

      <!-- Cart Status Section -->
      <div class="cart-status">
        <!-- TODO: Convert ngIf to @if -->
        <!--
        Educational Note: The new @if syntax:
        @if (condition) - shows content when true
        @else - shows alternative content
        -->
        <div *ngIf="cartService.cartItems().length > 0; else emptyCart">
          <h2>Shopping Cart ({{ cartService.totalItems() }} items)</h2>
          <p class="cart-total">Total: {{ cartService.totalPrice() | currency }}</p>

          <!-- Cart Items List -->
          <div class="cart-items">
            <!-- TODO: Convert ngFor to @for with track -->
            <div *ngFor="let item of cartService.cartItems(); trackBy: trackByItemId"
                 class="cart-item">
              <h4>{{ item.name }}</h4>
              <span>{{ item.price | currency }}</span>

              <!-- Conditional Discount Badge -->
              <!-- TODO: Convert ngIf to @if -->
              <div *ngIf="item.discount && item.discount > 0" class="discount-badge">
                {{ item.discount }}% OFF
              </div>

              <div class="quantity-controls">
                <!-- TODO: Convert ngIf/else to @if/@else -->
                <button *ngIf="item.quantity > 1; else removeButton"
                        (click)="decreaseQuantity(item.id)">-</button>

                <ng-template #removeButton>
                  <button (click)="removeItem(item.id)" class="remove">Remove</button>
                </ng-template>

                <span>{{ item.quantity }}</span>
                <button (click)="increaseQuantity(item.id)">+</button>
              </div>
            </div>
          </div>
        </div>

        <ng-template #emptyCart>
          <div class="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add some products to get started!</p>
          </div>
        </ng-template>
      </div>

      <!-- Product List Section -->
      <div class="product-section">
        <h2>Available Products</h2>

        <!-- TODO: Implement @defer for heavy product list -->
        <!--
        Educational Note: @defer can lazy load heavy content:
        @defer (on viewport) - loads content when in viewport
        @placeholder - shows light placeholder initially
        @loading (minimum 100ms) - shows loading state
        @error - shows error state if loading fails

        Exercise: Convert this to use @defer with viewport trigger
        -->
        <div class="product-grid" *ngIf="!isLoading(); else loadingTemplate">
          <!-- TODO: Convert ngFor to @for -->
          <div *ngFor="let product of filteredProducts(); trackBy: trackByProductId"
               class="product-item">
            <!-- Placeholder product card until component is created -->
            <div class="placeholder-product-card">
              <h4>{{ product.name }}</h4>
              <p>{{ product.price | currency }}</p>
              <p>{{ product.description }}</p>
              <div class="actions">
                <!-- TODO: Convert ngIf/else to @if/@else -->
                <button
                  *ngIf="!isProductInCart(product.id); else removeBtn"
                  (click)="addToCart(product)"
                  class="add-btn">
                  Add to Cart
                </button>
                <ng-template #removeBtn>
                  <button
                    (click)="removeFromCart(product.id)"
                    class="remove-btn">
                    Remove from Cart
                  </button>
                </ng-template>
              </div>
            </div>
          </div>
        </div>

        <ng-template #loadingTemplate>
          <div class="placeholder-loading">
            <p>Loading products...</p>
          </div>
        </ng-template>
      </div>

      <!-- Performance Analytics Section -->
      <div class="analytics-section">
        <h2>Performance Analytics</h2>
        <!-- TODO: Implement @defer with condition trigger -->
        <!--
        Educational Note: @defer can use conditions:
        @defer (when showPerformanceMetrics()) - loads when condition is true

        Exercise: Defer this section until showPerformanceMetrics() is true
        -->
        <div class="analytics-placeholder">
          <h3>Detailed Performance Metrics</h3>
          <div class="metric-item">
            <span>Components Rendered:</span>
            <strong>{{ renderCount() }}</strong>
          </div>
          <div class="metric-item">
            <span>Average Render Time:</span>
            <strong>{{ lastRenderTime() }}ms</strong>
          </div>
          <div class="metric-item">
            <span>Cart Operations:</span>
            <strong>{{ cartService.operationCount() }}</strong>
          </div>
          <div class="metric-item">
            <span>Memory Usage:</span>
            <strong>~{{ estimatedMemoryUsage() }}KB</strong>
          </div>
        </div>
      </div>

      <!-- Recommendations Section -->
      <div class="recommendations-section">
        <h2>Product Recommendations</h2>
        <!-- TODO: Implement @defer with interaction and timer triggers -->
        <!--
        Educational Note: @defer supports multiple triggers:
        @defer (on interaction; on timer(5s)) - loads on user interaction OR after 5 seconds

        Exercise: Defer recommendations with both interaction and timer triggers
        -->
        <div class="recommendations-placeholder">
          <h3>Based on your cart</h3>
          <div class="recommendation-list">
            <!-- TODO: Convert ngFor to @for when implementing defer -->
            <div *ngFor="let product of getRecommendations(); trackBy: trackByProductId"
                 class="recommendation-item">
              <h4>{{ product.name }}</h4>
              <p>{{ product.price | currency }}</p>
              <button (click)="addToCart(product)">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart History Section -->
      <div class="history-section">
        <h2>Recent Cart Activity</h2>
        <!-- TODO: Implement @defer with timer trigger -->
        <!--
        Educational Note: Timer-based defer:
        @defer (on timer(10s)) - loads after 10 seconds

        Exercise: Defer cart history to load after 10 seconds
        -->
        <div class="history-placeholder">
          <h3>Your Recent Items</h3>
          <ul class="history-list">
            <li>Added "Gaming Laptop" - 2 minutes ago</li>
            <li>Removed "Wireless Mouse" - 5 minutes ago</li>
            <li>Updated quantity for "USB-C Hub" - 10 minutes ago</li>
          </ul>
        </div>
      </div>

      <!-- Optimization Suggestions Section -->
      <div class="optimization-section">
        <h2>Cart Optimization</h2>
        <!-- TODO: Implement @defer with idle trigger -->
        <!--
        Educational Note: Idle-based defer:
        @defer (on idle) - loads when browser is idle

        Exercise: Defer optimization suggestions until browser is idle
        -->
        <div class="optimization-placeholder">
          <h3>Save Money on Your Cart</h3>
          <ul class="optimization-list">
            <li>Bundle "Gaming Laptop" with "Laptop Stand" for 10% off</li>
            <li>Free shipping on orders over $100 (add {{ getFreeShippingAmount() | currency }} more)</li>
            <li>Use code "SAVE20" for 20% off accessories</li>
          </ul>
        </div>
      </div>

      <!-- Development Tools -->
      <div class="dev-tools">
        <h3>Development Tools</h3>
        <button (click)="togglePerformanceMetrics()">
          {{ showPerformanceMetrics() ? 'Hide' : 'Show' }} Performance Metrics
        </button>

        <!-- TODO: Convert ngIf to @if -->
        <div *ngIf="showPerformanceMetrics()" class="performance-metrics">
          <h4>Template Performance</h4>
          <p>Render Count: {{ renderCount() }}</p>
          <p>Last Render: {{ lastRenderTime() }}ms</p>
          <p>Cart Items: {{ cartService.totalItems() }}</p>
          <p>Products Loaded: {{ products().length }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cart-control-flow.component.css']
})
export class CartControlFlowComponent {
  // Inject services
  constructor(
    public cartService: ControlFlowCartService,
    private productService: ProductService
  ) {
    this.loadProducts();
    this.updateRenderMetrics();
  }

  // State management with signals
  activeFilterType = signal<'category' | 'price' | null>(null);
  selectedCategory = signal<string>('all');
  priceRange = signal({ min: 0, max: 1000 });
  isLoading = signal(false);
  showPerformanceMetrics = signal(false);

  // Performance monitoring
  renderCount = signal(0);
  lastRenderTime = signal(0);

  // Products data
  products = signal<Product[]>([]);

  // Computed values
  availableCategories = computed(() => {
    const categories = this.products().map(p => p.category);
    return [...new Set(categories)];
  });

  filteredProducts = computed(() => {
    let filtered = this.products();

    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }

    filtered = filtered.filter(p => p.price <= this.priceRange().max);

    return filtered;
  });

  // Event handlers
  setFilterType(type: 'category' | 'price') {
    this.activeFilterType.set(type);
  }

  setCategory(category: string) {
    this.selectedCategory.set(category);
  }

  updatePriceRange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    this.priceRange.update(range => ({ ...range, max: value }));
  }

  addToCart(product: Product) {
    this.cartService.addItem(product);
  }

  removeFromCart(productId: string) {
    const item = this.cartService.cartItems().find(item => item.productId === productId);
    if (item) {
      this.cartService.removeItem(item.id);
    }
  }

  increaseQuantity(itemId: string) {
    const item = this.cartService.cartItems().find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: string) {
    const item = this.cartService.cartItems().find(i => i.id === itemId);
    if (item) {
      this.cartService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  removeItem(itemId: string) {
    this.cartService.removeItem(itemId);
  }

  isProductInCart(productId: string): boolean {
    return this.cartService.cartItems().some(item => item.productId === productId);
  }

  togglePerformanceMetrics() {
    this.showPerformanceMetrics.update(show => !show);
  }

  // Track by functions (needed for old ngFor - will be simplified with @for)
  trackByCategory(index: number, category: string): string {
    return category;
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  // Helper methods for new sections
  getRecommendations(): Product[] {
    // Return recommendations based on cart items
    const cartCategories = this.cartService.cartItems().map(item => item.category);
    return this.products().filter(product =>
      cartCategories.includes(product.category) &&
      !this.isProductInCart(product.id)
    ).slice(0, 3);
  }

  estimatedMemoryUsage(): number {
    // Estimate memory usage based on data
    const itemCount = this.cartService.cartItems().length;
    const productCount = this.products().length;
    return Math.round((itemCount * 2 + productCount * 1.5) * 10) / 10;
  }

  getFreeShippingAmount(): number {
    const total = this.cartService.cartSummary().totalPrice;
    const freeShippingThreshold = 100;
    return Math.max(0, freeShippingThreshold - total);
  }

  // Private methods
  private loadProducts() {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.isLoading.set(false);
      }
    });
  }

  private updateRenderMetrics() {
    const start = performance.now();

    // Use setTimeout to capture render completion
    setTimeout(() => {
      const end = performance.now();
      this.renderCount.update(count => count + 1);
      this.lastRenderTime.set(Math.round(end - start));
    }, 0);
  }
}
