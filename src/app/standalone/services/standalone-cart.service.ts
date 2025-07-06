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

@Injectable({
  providedIn: 'root'
})
export class StandaloneCartService {
  // TODO: Students will learn about modern DI patterns
  // This service demonstrates:
  // 1. Field-based injection with inject()
  // 2. Signal-based state management
  // 3. Computed values for derived state
  // 4. Effects for side effects
  
  // Core state using signals
  private cartItems = signal<CartItem[]>([]);
  private cartMeta = signal<CartMetadata>({
    sessionId: crypto.randomUUID(),
    created: new Date(),
    lastUpdated: new Date(),
    version: 1
  });
  
  // Readonly accessors
  public readonly items = this.cartItems.asReadonly();
  public readonly metadata = this.cartMeta.asReadonly();
  
  // Computed values - automatically recalculate when dependencies change
  public readonly summary = computed<CartSummary>(() => {
    const items = this.cartItems();
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discounts
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    
    // Progressive tax calculation
    const subtotal = totalPrice - totalDiscount;
    let tax = 0;
    if (subtotal > 1000) {
      tax = subtotal * 0.12; // 12% for orders over $1000
    } else if (subtotal > 500) {
      tax = subtotal * 0.10; // 10% for orders over $500
    } else {
      tax = subtotal * 0.08; // 8% for orders under $500
    }
    
    const finalPrice = subtotal + tax;
    
    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  // Computed analytics
  public readonly analytics = computed(() => {
    const items = this.cartItems();
    const metadata = this.cartMeta();
    
    const categories = new Set(items.map(item => item.category));
    const averageItemPrice = items.length > 0 
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
      : 0;
    
    const sessionDuration = Date.now() - metadata.created.getTime();
    
    return {
      uniqueCategories: categories.size,
      averageItemPrice,
      sessionDurationMinutes: Math.floor(sessionDuration / (1000 * 60)),
      cartVersion: metadata.version,
      lastActivity: metadata.lastUpdated
    };
  });
  
  // Computed cart validation
  public readonly validation = computed(() => {
    const items = this.cartItems();
    const summary = this.summary();
    
    const hasItems = items.length > 0;
    const hasValidQuantities = items.every(item => item.quantity > 0);
    const hasValidPrices = items.every(item => item.price > 0);
    const totalUnderLimit = summary.totalItems <= 100; // Max 100 items
    
    const isValid = hasItems && hasValidQuantities && hasValidPrices && totalUnderLimit;
    const errors: string[] = [];
    
    if (!hasItems) errors.push('Cart is empty');
    if (!hasValidQuantities) errors.push('Invalid quantities detected');
    if (!hasValidPrices) errors.push('Invalid prices detected');
    if (!totalUnderLimit) errors.push('Too many items in cart');
    
    return {
      isValid,
      errors,
      canCheckout: isValid && summary.finalPrice > 0
    };
  });

  constructor() {
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // Cart operations
  addItem(product: Product): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      this.updateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image || '',
        category: product.category,
        discount: product.discount || 0
      };
      
      this.cartItems.update(items => [...items, newItem]);
      this.updateMetadata();
    }
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
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    this.updateMetadata();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.updateMetadata();
  }

  // Advanced operations
  duplicateItem(itemId: string): void {
    const item = this.cartItems().find(i => i.id === itemId);
    if (item) {
      const duplicatedItem: CartItem = {
        ...item,
        id: this.generateId(),
        quantity: 1
      };
      
      this.cartItems.update(items => [...items, duplicatedItem]);
      this.updateMetadata();
    }
  }

  applyBulkDiscount(categoryOrAll: string, discountPercent: number): void {
    this.cartItems.update(items =>
      items.map(item => {
        if (categoryOrAll === 'all' || item.category === categoryOrAll) {
          return { ...item, discount: Math.max(item.discount ?? 0, discountPercent) };
        }
        return item;
      })
    );
    this.updateMetadata();
  }

  optimizeCart(): void {
    // Remove duplicates by merging quantities
    const optimizedItems = new Map<string, CartItem>();
    
    this.cartItems().forEach(item => {
      const existing = optimizedItems.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        optimizedItems.set(item.productId, { ...item });
      }
    });
    
    this.cartItems.set(Array.from(optimizedItems.values()));
    this.updateMetadata();
  }

  // Import/Export functionality
  exportCart(): string {
    return JSON.stringify({
      items: this.cartItems(),
      metadata: this.cartMeta(),
      summary: this.summary(),
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }, null, 2);
  }

  importCart(cartData: string): boolean {
    try {
      const data = JSON.parse(cartData);
      
      // Validate import data structure
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid cart data structure');
      }

      // Validate item structure
      const isValidItem = (item: any): item is CartItem => {
        return typeof item.id === 'string' &&
               typeof item.productId === 'string' &&
               typeof item.name === 'string' &&
               typeof item.price === 'number' &&
               typeof item.quantity === 'number';
      };

      if (!data.items.every(isValidItem)) {
        throw new Error('Invalid cart item structure');
      }

      // Import the cart state
      this.cartItems.set(data.items);
      this.updateMetadata();

      console.log('Cart imported successfully:', {
        itemCount: data.items.length,
        importDate: data.exportDate,
        version: data.version
      });

      return true;
    } catch (error) {
      console.error('Failed to import cart:', error);
      return false;
    }
  }

  // Analytics and insights
  getCategoryBreakdown(): Array<{ category: string; count: number; total: number }> {
    const items = this.cartItems();
    const categoryMap = new Map<string, { count: number; total: number }>();
    
    items.forEach(item => {
      const existing = categoryMap.get(item.category) || { count: 0, total: 0 };
      categoryMap.set(item.category, {
        count: existing.count + item.quantity,
        total: existing.total + (item.price * item.quantity)
      });
    });
    
    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.total - a.total);
  }

  getTopItems(limit: number = 5): CartItem[] {
    return this.cartItems()
      .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
      .slice(0, limit);
  }

  // Private methods
  private setupEffects(): void {
    // Auto-save cart to localStorage
    effect(() => {
      const items = this.cartItems();
      const metadata = this.cartMeta();
      
      if (typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem('standalone-cart', JSON.stringify({
            items,
            metadata
          }));
        } catch (error) {
          console.error('Failed to save cart to storage:', error);
        }
      }
    });

    // Performance logging effect
    effect(() => {
      const analytics = this.analytics();
      console.log('Standalone Cart Analytics:', analytics);
    });

    // Validation monitoring
    effect(() => {
      const validation = this.validation();
      if (!validation.isValid) {
        console.warn('Cart validation issues:', validation.errors);
      }
    });
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('standalone-cart');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.items && Array.isArray(data.items)) {
            this.cartItems.set(data.items);
          }
          if (data.metadata) {
            this.cartMeta.set({
              ...data.metadata,
              created: new Date(data.metadata.created),
              lastUpdated: new Date(data.metadata.lastUpdated)
            });
          }
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }

  private updateMetadata(): void {
    this.cartMeta.update(meta => ({
      ...meta,
      lastUpdated: new Date(),
      version: meta.version + 1
    }));
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}