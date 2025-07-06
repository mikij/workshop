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
        <p>Learn &#64;if, &#64;for, &#64;switch, and &#64;defer patterns</p>
      </header>

      <!-- TODO: Convert these structural directives to new control flow -->
      <!-- 
      Current implementation uses old syntax - convert to:
      &#64;if, &#64;for, &#64;switch, &#64;defer 
      -->

      <!-- Filter Controls using @switch -->
      <div class="filter-section">
        <h2>Filter Controls</h2>
        
        <!-- TODO: Convert ngSwitch to &#64;switch -->
        <div [ngSwitch]="activeFilterType()">
          <div *ngSwitchCase="'category'">
            <h3>Filter by Category</h3>
            <!-- TODO: Convert ngFor to &#64;for -->
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

      <!-- Cart Status using &#64;if -->
      <div class="cart-status">
        <!-- TODO: Convert ngIf to &#64;if -->
        <div *ngIf="cartService.cartItems().length > 0; else emptyCart">
          <h2>Shopping Cart ({{ cartService.totalItems() }} items)</h2>
          
          <!-- Cart Items using &#64;for -->
          <div class="cart-items">
            <!-- TODO: Convert ngFor to &#64;for with proper tracking -->
            <div *ngFor="let item of cartService.cartItems(); trackBy: trackByItemId" 
                 class="cart-item">
              <h4>{{ item.name }}</h4>
              <span>{{ item.price | currency }}</span>
              
              <!-- Conditional content using &#64;if -->
              <!-- TODO: Convert ngIf to &#64;if -->
              <div *ngIf="item.discount && item.discount > 0" class="discount-badge">
                {{ item.discount }}% OFF
              </div>
              
              <div class="quantity-controls">
                <!-- TODO: Convert ngIf to &#64;if -->
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

      <!-- Product List with &#64;defer -->
      <div class="product-section">
        <h2>Available Products</h2>
        
        <!-- TODO: Implement &#64;defer for heavy product list -->
        <!-- Current: Loads immediately -->
        <div class="product-grid" *ngIf="!isLoading(); else loadingTemplate">
          <div *ngFor="let product of filteredProducts(); trackBy: trackByProductId" 
               class="product-item">
            <!-- TODO: Replace with product-card component when created -->
            <div class="placeholder-product-card">
              <h4>{{ product.name }}</h4>
              <p>{{ product.price | currency }}</p>
              <p>{{ product.description }}</p>
              <div class="actions">
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
          <!-- TODO: Replace with loading-skeleton component when created -->
          <div class="placeholder-loading">
            <p>Loading products...</p>
          </div>
        </ng-template>
      </div>

      <!-- TODO: Add &#64;defer examples for heavy components -->
      <!-- Performance Analytics (should be deferred) -->
      <div class="analytics-section">
        <h2>Performance Analytics</h2>
        <!-- TODO: Implement &#64;defer with viewport trigger -->
        <div>
          <p>Analytics will load when in viewport</p>
          <!-- Heavy analytics component should go here -->
        </div>
      </div>

      <!-- TODO: Add &#64;defer examples with different triggers -->
      <!-- Recommendations (should be deferred with interaction trigger) -->
      <div class="recommendations-section">
        <h2>Product Recommendations</h2>
        <!-- TODO: Implement &#64;defer with interaction trigger -->
        <div>
          <p>Recommendations will load on interaction</p>
          <!-- Heavy recommendations component should go here -->
        </div>
      </div>

      <!-- Development Tools -->
      <div class="dev-tools">
        <h3>Development Tools</h3>
        <button (click)="togglePerformanceMetrics()">
          {{ showPerformanceMetrics() ? 'Hide' : 'Show' }} Performance Metrics
        </button>
        
        <!-- TODO: Convert ngIf to &#64;if -->
        <div *ngIf="showPerformanceMetrics()" class="performance-metrics">
          <h4>Template Performance</h4>
          <p>Render Count: {{ renderCount() }}</p>
          <p>Last Render: {{ lastRenderTime() }}ms</p>
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
    this.cartService.removeItem(productId);
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