import { Injectable, computed, effect, signal } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { CartItem } from '../../shared/models/cart-item.model';

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalDiscount: number;
  tax: number;
  finalPrice: number;
}

export interface CartMetadata {
  sessionId: string;
  created: Date;
  lastUpdated: Date;
  version: number;
}

/**
 * STANDALONE MODULE - Module-Free Angular Architecture
 * 
 * This service demonstrates cart functionality in a standalone component architecture
 * without any NgModule dependencies. It showcases modern Angular patterns.
 * 
 * KEY CONCEPTS TO LEARN:
 * - Service design for standalone components
 * - Signal-based state management
 * - Computed values for derived state
 * - Effects for side effects
 * - Progressive tax calculation
 * - Advanced cart operations
 * - Import/export functionality
 * - Analytics and validation
 * 
 * STANDALONE ARCHITECTURE BENEFITS:
 * - No NgModule boilerplate
 * - Direct service injection
 * - Better tree-shaking
 * - Simpler component composition
 * - Cleaner dependency management
 */
@Injectable({
  providedIn: 'root'
})
export class StandaloneCartService {
  
  // STANDALONE ARCHITECTURE: Signal-based state management
  //
  // LEARNING: Signals work perfectly with standalone components
  // - No subscription management needed
  // - Automatic change detection
  // - Direct template integration
  // - Computed values for derived state
  
  // Core state signals for standalone architecture
  private cartItems = signal<CartItem[]>([]);
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  // READONLY ACCESSORS: For standalone component integration
  //
  // LEARNING: Readonly signals prevent external modification
  // Standalone components can inject and use these directly
  // Template usage: {{ cartService.items().length }}
  //
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // COMPUTED SUMMARY: Progressive tax calculation for standalone components
  // LEARNING: Computed signals automatically recalculate
  // Perfect for standalone components - no manual subscriptions
  public readonly summary = computed<CartSummary>(() => {
    const items = this.cartItems();
    
    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => 
      sum + ((item.price * item.quantity) * ((item.discount || 0) / 100)), 0
    );
    
    // Calculate price after discount
    const priceAfterDiscount = totalPrice - totalDiscount;
    
    // Progressive tax calculation
    let taxRate = 0.08; // 8% for orders under $500
    if (priceAfterDiscount > 1000) {
      taxRate = 0.12; // 12% for orders over $1000
    } else if (priceAfterDiscount > 500) {
      taxRate = 0.10; // 10% for orders over $500
    }
    
    const tax = priceAfterDiscount * taxRate;
    const finalPrice = priceAfterDiscount + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // COMPUTED ANALYTICS: For standalone dashboard components
  // LEARNING: Analytics computed values are perfect for dashboards
  // Standalone components can use these directly without subscriptions
  public readonly analytics = computed(() => {
    const items = this.cartItems();
    const meta = this.cartMeta();
    
    // Count unique categories
    const categories = new Set(items.map(item => item.category));
    const uniqueCategories = categories.size;
    
    // Calculate average item price
    const averageItemPrice = items.length > 0 
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length
      : 0;
    
    // Calculate session duration in minutes
    const sessionDurationMinutes = Math.floor(
      (new Date().getTime() - meta.created.getTime()) / (1000 * 60)
    );
    
    return {
      uniqueCategories,
      averageItemPrice,
      sessionDurationMinutes,
      cartVersion: meta.version,
      lastActivity: meta.lastUpdated
    };
  });
  
  // COMPUTED VALIDATION: For standalone form components
  // LEARNING: Validation computed signals enable reactive forms
  // Standalone checkout components can use this directly
  public readonly validation = computed(() => {
    const items = this.cartItems();
    const errors: string[] = [];
    
    // Check if cart has items
    if (items.length === 0) {
      errors.push('Cart is empty');
    }
    
    // Validate item quantities and prices
    items.forEach(item => {
      if (item.quantity <= 0) {
        errors.push(`Item ${item.name} has invalid quantity`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${item.name} has invalid price`);
      }
    });
    
    // Check total items under limit (max 100)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 100) {
      errors.push('Cart exceeds maximum item limit of 100');
    }
    
    const isValid = errors.length === 0;
    const canCheckout = isValid && items.length > 0;
    
    return {
      isValid,
      errors,
      canCheckout
    };
  });

  constructor() {
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // CART OPERATIONS: Seamless integration with standalone components
  // LEARNING: These methods work directly with standalone components
  // No NgModule configuration needed - just inject the service
  
  addItem(product: Product): void {
    this.cartItems.update(items => {
      const existingItem = items.find(item => item.id === product.id);
      
      if (existingItem) {
        return items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      const newItem: CartItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category,
        image: product.image,
        discount: product.discount || 0
      };
      
      return [...items, newItem];
    });
    
    this.updateMetadata();
  }

  removeItem(itemId: string): void {
    this.cartItems.update(items => items.filter(item => item.id !== itemId));
    this.updateMetadata();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }
    
    this.cartItems.update(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity }
          : item
      )
    );
    
    this.updateMetadata();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.updateMetadata();
  }

  duplicateItem(itemId: string): void {
    this.cartItems.update(items => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        const duplicatedItem: CartItem = {
          ...item,
          id: this.generateUniqueId(),
          quantity: 1
        };
        return [...items, duplicatedItem];
      }
      return items;
    });
    
    this.updateMetadata();
  }

  applyBulkDiscount(categoryOrIds: string | string[], discountPercent: number): void {
    this.cartItems.update(items =>
      items.map(item => {
        const shouldApplyDiscount = typeof categoryOrIds === 'string'
          ? item.category === categoryOrIds
          : categoryOrIds.includes(item.id);
        
        return shouldApplyDiscount
          ? { ...item, discount: discountPercent }
          : item;
      })
    );
    
    this.updateMetadata();
  }

  optimizeCart(): void {
    this.cartItems.update(items => {
      // Sort by price descending for better UX
      const sortedItems = [...items].sort((a, b) => b.price - a.price);
      
      // Apply automatic bulk discount for high-value items
      const optimizedItems = sortedItems.map(item => {
        if (item.price > 100 && item.quantity >= 3) {
          return { ...item, discount: Math.max(item.discount || 0, 10) };
        }
        return item;
      });
      
      return optimizedItems;
    });
    
    this.updateMetadata();
  }

  exportCart(): string {
    const cartData = {
      items: this.cartItems(),
      metadata: this.cartMeta(),
      summary: this.summary(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(cartData, null, 2);
  }

  importCart(cartDataJson: string): boolean {
    try {
      const cartData = JSON.parse(cartDataJson);
      
      if (cartData.items && Array.isArray(cartData.items)) {
        this.cartItems.set(cartData.items);
        this.updateMetadata();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import cart:', error);
      return false;
    }
  }

  // HELPER METHODS: Supporting standalone architecture
  // LEARNING: Helper methods that work with signal-based state
  
  getCategoryBreakdown(): { [category: string]: number } {
    const items = this.cartItems();
    const breakdown: { [category: string]: number } = {};
    
    items.forEach(item => {
      const category = item.category;
      breakdown[category] = (breakdown[category] || 0) + (item.price * item.quantity);
    });
    
    return breakdown;
  }

  getTopItems(limit: number = 5): CartItem[] {
    const items = this.cartItems();
    return [...items]
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, limit);
  }

  private updateMetadata(): void {
    this.cartMeta.update(meta => ({
      ...meta,
      lastUpdated: new Date(),
      version: meta.version + 1
    }));
  }

  private loadCartFromStorage(): void {
    try {
      const stored = localStorage.getItem('standalone-cart');
      if (stored) {
        const cartData = JSON.parse(stored);
        if (cartData.items && Array.isArray(cartData.items)) {
          this.cartItems.set(cartData.items);
        }
      }
    } catch (error) {
      console.warn('Failed to load cart from storage:', error);
    }
  }

  private setupEffects(): void {
    // STANDALONE ARCHITECTURE: Effects for side effects
    // LEARNING: Effects work perfectly with standalone components
    // Automatic persistence without manual subscription management
    
    effect(() => {
      const items = this.cartItems();
      const meta = this.cartMeta();
      
      // Persist cart to localStorage
      const cartData = {
        items,
        metadata: meta
      };
      
      localStorage.setItem('standalone-cart', JSON.stringify(cartData));
    });
  }

  private generateUniqueId(): string {
    return `standalone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}