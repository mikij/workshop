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

export interface CartMetrics {
  sessionDuration: number;
  itemsAdded: number;
  itemsRemoved: number;
  totalInteractions: number;
  averageItemPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ControlFlowCartService {
  // Core state
  private items = signal<CartItem[]>([]);
  private sessionStartTime = signal<Date>(new Date());
  private interactionCount = signal<number>(0);
  
  // Readonly accessors
  public readonly cartItems = this.items.asReadonly();
  public readonly sessionStart = this.sessionStartTime.asReadonly();
  
  // Computed values
  public readonly totalItems = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.items();
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = items.reduce((sum, item) => {
      const discount = item.discount || 0;
      return sum + (item.price * item.quantity * discount / 100);
    }, 0);
    
    const subtotal = totalPrice - totalDiscount;
    const tax = subtotal * 0.08; // 8% tax rate
    const finalPrice = subtotal + tax;
    
    return {
      totalItems: this.totalItems(),
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });
  
  public readonly cartMetrics = computed<CartMetrics>(() => {
    const items = this.items();
    const sessionDuration = Date.now() - this.sessionStart().getTime();
    
    return {
      sessionDuration: Math.floor(sessionDuration / 1000 / 60), // minutes
      itemsAdded: items.length,
      itemsRemoved: 0, // TODO: Track this separately
      totalInteractions: this.interactionCount(),
      averageItemPrice: items.length > 0 
        ? items.reduce((sum, item) => sum + item.price, 0) / items.length 
        : 0
    };
  });
  
  // Performance tracking
  public readonly performanceStats = computed(() => {
    const items = this.items();
    return {
      itemCount: items.length,
      lastUpdate: new Date().toISOString(),
      computationTime: this.measureComputationTime(),
      memoryUsage: this.estimateMemoryUsage(items)
    };
  });

  constructor() {
    this.loadCartFromStorage();
    this.setupEffects();
  }

  // Cart operations
  addItem(product: Product): void {
    const currentItems = this.items();
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
      
      this.items.update(items => [...items, newItem]);
    }
    
    this.incrementInteraction();
  }

  removeItem(itemId: string): void {
    this.items.update(items => items.filter(item => item.id !== itemId));
    this.incrementInteraction();
  }

  updateQuantity(itemId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
    this.incrementInteraction();
  }

  clearCart(): void {
    this.items.set([]);
    this.incrementInteraction();
  }

  // Analytics and performance methods
  getFilteredItems(category?: string, maxPrice?: number): CartItem[] {
    let filtered = this.items();
    
    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (maxPrice !== undefined) {
      filtered = filtered.filter(item => item.price <= maxPrice);
    }
    
    return filtered;
  }

  getTopCategories(): Array<{ category: string; count: number; total: number }> {
    const items = this.items();
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

  // Private methods
  private setupEffects(): void {
    // Auto-save cart to localStorage
    effect(() => {
      const items = this.items();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('control-flow-cart', JSON.stringify(items));
      }
    });

    // Performance logging
    effect(() => {
      const stats = this.performanceStats();
      console.log('Cart Performance Stats:', stats);
    });
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('control-flow-cart');
        if (stored) {
          const items = JSON.parse(stored);
          this.items.set(items);
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      }
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private incrementInteraction(): void {
    this.interactionCount.update(count => count + 1);
  }

  private measureComputationTime(): number {
    const start = performance.now();
    // Simulate computation
    this.cartSummary();
    return performance.now() - start;
  }

  private estimateMemoryUsage(items: CartItem[]): number {
    // Rough estimation of memory usage in bytes
    const itemSize = 200; // Estimated bytes per item
    return items.length * itemSize;
  }
}