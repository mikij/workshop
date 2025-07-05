import { Injectable, signal, computed, effect, resource, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CartItem, CartSummary, Product } from '../../shared/models';

interface CartState {
  items: CartItem[];
  lastUpdated: Date;
  version: number;
}

interface CartAnalytics {
  totalSessions: number;
  averageSessionValue: number;
  topCategories: { category: string; count: number }[];
  abandonmentRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedCartService {
  
  private cartState = signal<CartState>({
    items: [],
    lastUpdated: new Date(),
    version: 1
  });

  private sessionStartTime = signal<Date>(new Date());
  private cartHistory = signal<CartState[]>([]);
  private maxHistorySize = 50;

  // Advanced computed properties
  public readonly cartItems = computed(() => this.cartState().items);
  
  public readonly cartSummary = computed<CartSummary>(() => {
    const items = this.cartItems();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Advanced discount calculation with bulk discounts
    const totalDiscount = items.reduce((sum, item) => {
      let itemDiscount = item.discount || 0;
      
      // Apply bulk discount for quantities > 3
      if (item.quantity > 3) {
        itemDiscount = Math.max(itemDiscount, 15); // At least 15% for bulk
      }
      
      return sum + (item.price * item.quantity * itemDiscount / 100);
    }, 0);
    
    // Dynamic tax calculation based on location and item types
    const subtotal = totalPrice - totalDiscount;
    const baseTaxRate = 0.08;
    const luxuryTaxRate = 0.15; // For items over $1000
    
    const tax = items.reduce((sum, item) => {
      const itemTotal = (item.price * item.quantity) - (item.price * item.quantity * (item.discount || 0) / 100);
      const taxRate = item.price > 1000 ? luxuryTaxRate : baseTaxRate;
      return sum + (itemTotal * taxRate);
    }, 0);
    
    const finalPrice = subtotal + tax;

    return {
      totalItems,
      totalPrice,
      totalDiscount,
      tax,
      finalPrice
    };
  });

  // Advanced analytics
  public readonly cartAnalytics = computed<CartAnalytics>(() => {
    const history = this.cartHistory();
    const currentSummary = this.cartSummary();
    
    const totalSessions = history.length;
    const averageSessionValue = totalSessions > 0 
      ? history.reduce((sum, state) => {
          const sessionValue = state.items.reduce((itemSum, item) => 
            itemSum + (item.price * item.quantity), 0);
          return sum + sessionValue;
        }, 0) / totalSessions
      : 0;

    // Category analysis
    const categoryCount = new Map<string, number>();
    this.cartItems().forEach(item => {
      categoryCount.set(item.category, (categoryCount.get(item.category) || 0) + item.quantity);
    });
    
    const topCategories = Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Simple abandonment rate calculation
    const abandonmentRate = totalSessions > 0 
      ? (totalSessions - 1) / totalSessions * 100
      : 0;

    return {
      totalSessions,
      averageSessionValue,
      topCategories,
      abandonmentRate
    };
  });

  // Performance metrics
  public readonly cartMetrics = computed(() => {
    const items = this.cartItems();
    const summary = this.cartSummary();
    const sessionDuration = Date.now() - this.sessionStartTime().getTime();
    
    return {
      itemCount: items.length,
      uniqueCategories: new Set(items.map(item => item.category)).size,
      averageItemPrice: items.length > 0 ? summary.totalPrice / items.length : 0,
      sessionDurationMinutes: Math.floor(sessionDuration / (1000 * 60)),
      cartValuePerMinute: sessionDuration > 0 ? summary.finalPrice / (sessionDuration / (1000 * 60)) : 0,
      lastModified: this.cartState().lastUpdated,
      cartVersion: this.cartState().version
    };
  });

  // Resource for cart synchronization with server
  private syncTrigger = signal<number>(0);
  
  public readonly cartSyncResource = resource({
    loader: async () => {
      try {
        // TODO: Simulate API call to sync cart with server
        const cartData = this.cartState();
        console.log('Syncing cart with server...', cartData);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate occasional sync failures
        if (Math.random() < 0.1) {
          throw new Error('Sync failed');
        }
        
        return {
          success: true,
          message: 'Cart synchronized successfully'
        };
      } catch (error) {
        console.error('Cart sync failed:', error);
        return {
          success: false,
          message: 'Failed to sync cart'
        };
      }
    }
  });

  private http = inject(HttpClient);
  
  constructor() {
    this.loadCartFromStorage();
    this.setupEffects();
  }

  private setupEffects(): void {
    // Effect for auto-saving cart state
    effect(() => {
      const state = this.cartState();
      this.saveCartToStorage(state);
    });

    // Effect for maintaining cart history
    effect(() => {
      const state = this.cartState();
      if (state.items.length > 0 || this.cartHistory().length === 0) {
        this.cartHistory.update(history => {
          const newHistory = [...history, { ...state }];
          return newHistory.slice(-this.maxHistorySize);
        });
      }
    });

    // Effect for automatic cart sync (every 30 seconds)
    effect(() => {
      const state = this.cartState();
      if (state.items.length > 0) {
        const syncInterval = setInterval(() => {
          this.syncTrigger.update(n => n + 1);
        }, 30000);

        return () => clearInterval(syncInterval);
      }
      return undefined;
    });

    // Effect for cart analytics logging
    effect(() => {
      const analytics = this.cartAnalytics();
      const metrics = this.cartMetrics();
      
      console.log('Cart Analytics Update:', {
        analytics,
        metrics,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Enhanced cart operations
  addItem(product: Product, quantity: number = 1): void {
    const currentState = this.cartState();
    const existingItemIndex = currentState.items.findIndex(item => item.productId === product.id);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      newItems = currentState.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
        category: product.category,
        discount: product.discount
      };
      newItems = [...currentState.items, newItem];
    }

    this.updateCartState(newItems);
  }

  removeItem(productId: string): void {
    const currentState = this.cartState();
    const newItems = currentState.items.filter(item => item.productId !== productId);
    this.updateCartState(newItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentState = this.cartState();
    const newItems = currentState.items.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    );
    
    this.updateCartState(newItems);
  }

  clearCart(): void {
    this.updateCartState([]);
  }

  // Advanced operations
  duplicateItem(productId: string): void {
    const currentState = this.cartState();
    const item = currentState.items.find(item => item.productId === productId);
    
    if (item) {
      const duplicatedItem: CartItem = {
        ...item,
        id: this.generateId(),
        quantity: 1
      };
      
      const newItems = [...currentState.items, duplicatedItem];
      this.updateCartState(newItems);
    }
  }

  moveToWishlist(productId: string): void {
    // This would typically interact with a wishlist service
    this.removeItem(productId);
    console.log(`Item ${productId} moved to wishlist`);
  }

  applyBulkDiscount(categoryOrAll: string, discountPercent: number): void {
    const currentState = this.cartState();
    const newItems = currentState.items.map(item => {
      if (categoryOrAll === 'all' || item.category === categoryOrAll) {
        return {
          ...item,
          discount: Math.max(item.discount || 0, discountPercent)
        };
      }
      return item;
    });
    
    this.updateCartState(newItems);
  }

  // History and undo operations
  undoLastChange(): void {
    const history = this.cartHistory();
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      this.cartState.set({ ...previousState });
    }
  }

  restoreCartFromHistory(historyIndex: number): void {
    const history = this.cartHistory();
    if (historyIndex >= 0 && historyIndex < history.length) {
      const stateToRestore = history[historyIndex];
      this.cartState.set({ ...stateToRestore });
    }
  }

  // Cart optimization
  optimizeCart(): void {
    const currentState = this.cartState();
    
    // Remove duplicate items (merge quantities)
    const itemMap = new Map<string, CartItem>();
    
    currentState.items.forEach(item => {
      const existing = itemMap.get(item.productId);
      if (existing) {
        itemMap.set(item.productId, {
          ...existing,
          quantity: existing.quantity + item.quantity
        });
      } else {
        itemMap.set(item.productId, { ...item });
      }
    });
    
    const optimizedItems = Array.from(itemMap.values());
    this.updateCartState(optimizedItems);
  }

  // Bulk operations
  updateMultipleQuantities(updates: { productId: string; quantity: number }[]): void {
    const currentState = this.cartState();
    const newItems = currentState.items.map(item => {
      const update = updates.find(u => u.productId === item.productId);
      return update ? { ...item, quantity: update.quantity } : item;
    }).filter(item => item.quantity > 0);
    
    this.updateCartState(newItems);
  }

  // Export and import
  exportCart(): string {
    return JSON.stringify({
      state: this.cartState(),
      analytics: this.cartAnalytics(),
      metrics: this.cartMetrics(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  importCart(cartData: string): boolean {
    try {
      const data = JSON.parse(cartData);
      if (data.state && data.state.items) {
        this.cartState.set(data.state);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import cart:', error);
      return false;
    }
  }

  // Helper methods
  private updateCartState(newItems: CartItem[]): void {
    const currentState = this.cartState();
    this.cartState.set({
      items: newItems,
      lastUpdated: new Date(),
      version: currentState.version + 1
    });
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private saveCartToStorage(state: CartState): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('advanced-cart-state', JSON.stringify(state));
    }
  }

  private loadCartFromStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const savedState = localStorage.getItem('advanced-cart-state');
      if (savedState) {
        try {
          const state = JSON.parse(savedState) as CartState;
          this.cartState.set(state);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  // Public getters
  getCartHistory() {
    return this.cartHistory();
  }

  triggerSync(): void {
    this.syncTrigger.update(n => n + 1);
  }

  getSessionStartTime(): Date {
    return this.sessionStartTime();
  }

  resetSession(): void {
    this.sessionStartTime.set(new Date());
    this.cartHistory.set([]);
  }
}